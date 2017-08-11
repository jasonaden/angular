"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var Observable_1 = require("rxjs/Observable");
var of_1 = require("rxjs/observable/of");
var apply_redirects_1 = require("../src/apply_redirects");
var config_1 = require("../src/config");
var url_tree_1 = require("../src/url_tree");
describe('applyRedirects', function () {
    var serializer = new url_tree_1.DefaultUrlSerializer();
    var testModule;
    beforeEach(function () { testModule = testing_1.TestBed.get(core_1.NgModuleRef); });
    it('should return the same url tree when no redirects', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [
                    { path: 'b', component: ComponentB },
                ],
            },
        ], '/a/b', function (t) { expectTreeToBe(t, '/a/b'); });
    });
    it('should add new segments when needed', function () {
        checkRedirect([{ path: 'a/b', redirectTo: 'a/b/c' }, { path: '**', component: ComponentC }], '/a/b', function (t) { expectTreeToBe(t, '/a/b/c'); });
    });
    it('should support redirecting with to an URL with query parameters', function () {
        var config = [
            { path: 'single_value', redirectTo: '/dst?k=v1' },
            { path: 'multiple_values', redirectTo: '/dst?k=v1&k=v2' },
            { path: '**', component: ComponentA },
        ];
        checkRedirect(config, 'single_value', function (t) { return expectTreeToBe(t, '/dst?k=v1'); });
        checkRedirect(config, 'multiple_values', function (t) { return expectTreeToBe(t, '/dst?k=v1&k=v2'); });
    });
    it('should handle positional parameters', function () {
        checkRedirect([
            { path: 'a/:aid/b/:bid', redirectTo: 'newa/:aid/newb/:bid' },
            { path: '**', component: ComponentC }
        ], '/a/1/b/2', function (t) { expectTreeToBe(t, '/newa/1/newb/2'); });
    });
    it('should throw when cannot handle a positional parameter', function () {
        apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('/a/1'), [
            { path: 'a/:id', redirectTo: 'a/:other' }
        ]).subscribe(function () { }, function (e) {
            expect(e.message).toEqual('Cannot redirect to \'a/:other\'. Cannot find \':other\'.');
        });
    });
    it('should pass matrix parameters', function () {
        checkRedirect([{ path: 'a/:id', redirectTo: 'd/a/:id/e' }, { path: '**', component: ComponentC }], '/a;p1=1/1;p2=2', function (t) { expectTreeToBe(t, '/d/a;p1=1/1;p2=2/e'); });
    });
    it('should handle preserve secondary routes', function () {
        checkRedirect([
            { path: 'a/:id', redirectTo: 'd/a/:id/e' },
            { path: 'c/d', component: ComponentA, outlet: 'aux' }, { path: '**', component: ComponentC }
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/d/a/1/e(aux:c/d)'); });
    });
    it('should redirect secondary routes', function () {
        checkRedirect([
            { path: 'a/:id', component: ComponentA },
            { path: 'c/d', redirectTo: 'f/c/d/e', outlet: 'aux' },
            { path: '**', component: ComponentC, outlet: 'aux' }
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/a/1(aux:f/c/d/e)'); });
    });
    it('should use the configuration of the route redirected to', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [
                    { path: 'b', component: ComponentB },
                ]
            },
            { path: 'c', redirectTo: 'a' }
        ], 'c/b', function (t) { expectTreeToBe(t, 'a/b'); });
    });
    it('should support redirects with both main and aux', function () {
        checkRedirect([{
                path: 'a',
                children: [
                    { path: 'bb', component: ComponentB }, { path: 'b', redirectTo: 'bb' },
                    { path: 'cc', component: ComponentC, outlet: 'aux' },
                    { path: 'b', redirectTo: 'cc', outlet: 'aux' }
                ]
            }], 'a/(b//aux:b)', function (t) { expectTreeToBe(t, 'a/(bb//aux:cc)'); });
    });
    it('should support redirects with both main and aux (with a nested redirect)', function () {
        checkRedirect([{
                path: 'a',
                children: [
                    { path: 'bb', component: ComponentB }, { path: 'b', redirectTo: 'bb' },
                    {
                        path: 'cc',
                        component: ComponentC,
                        outlet: 'aux',
                        children: [{ path: 'dd', component: ComponentC }, { path: 'd', redirectTo: 'dd' }]
                    },
                    { path: 'b', redirectTo: 'cc/d', outlet: 'aux' }
                ]
            }], 'a/(b//aux:b)', function (t) { expectTreeToBe(t, 'a/(bb//aux:cc/dd)'); });
    });
    it('should redirect wild cards', function () {
        checkRedirect([
            { path: '404', component: ComponentA },
            { path: '**', redirectTo: '/404' },
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/404'); });
    });
    it('should support absolute redirects', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [{ path: 'b/:id', redirectTo: '/absolute/:id?a=1&b=:b#f1' }]
            },
            { path: '**', component: ComponentC }
        ], '/a/b/1?b=2', function (t) { expectTreeToBe(t, '/absolute/1?a=1&b=2#f1'); });
    });
    describe('lazy loading', function () {
        it('should load config on demand', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = {
                load: function (injector, p) {
                    if (injector !== testModule.injector)
                        throw 'Invalid Injector';
                    return of_1.of(loadedConfig);
                }
            };
            var config = [{ path: 'a', component: ComponentA, loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a/b'), config)
                .forEach(function (r) {
                expectTreeToBe(r, '/a/b');
                expect(config[0]._loadedConfig).toBe(loadedConfig);
            });
        });
        it('should handle the case when the loader errors', function () {
            var loader = {
                load: function (p) { return new Observable_1.Observable(function (obs) { return obs.error(new Error('Loading Error')); }); }
            };
            var config = [{ path: 'a', component: ComponentA, loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { }, function (e) { expect(e.message).toEqual('Loading Error'); });
        });
        it('should load when all canLoad guards return true', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var guard = function () { return true; };
            var injector = {
                get: function (token) { return token === 'guard1' || token === 'guard2' ? guard : { injector: injector }; }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config).forEach(function (r) {
                expectTreeToBe(r, '/a/b');
            });
        });
        it('should not load when any canLoad guards return false', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var trueGuard = function () { return true; };
            var falseGuard = function () { return false; };
            var injector = {
                get: function (token) {
                    switch (token) {
                        case 'guard1':
                            return trueGuard;
                        case 'guard2':
                            return falseGuard;
                        case core_1.NgModuleRef:
                            return { injector: injector };
                    }
                }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { throw 'Should not reach'; }, function (e) {
                expect(e.message).toEqual("NavigationCancelingError: Cannot load children because the guard of the route \"path: 'a'\" returned false");
            });
        });
        it('should not load when any canLoad guards is rejected (promises)', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var trueGuard = function () { return Promise.resolve(true); };
            var falseGuard = function () { return Promise.reject('someError'); };
            var injector = {
                get: function (token) {
                    switch (token) {
                        case 'guard1':
                            return trueGuard;
                        case 'guard2':
                            return falseGuard;
                        case core_1.NgModuleRef:
                            return { injector: injector };
                    }
                }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { throw 'Should not reach'; }, function (e) { expect(e).toEqual('someError'); });
        });
        it('should work with objects implementing the CanLoad interface', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var guard = { canLoad: function () { return Promise.resolve(true); } };
            var injector = { get: function (token) { return token === 'guard' ? guard : { injector: injector }; } };
            var config = [{ path: 'a', component: ComponentA, canLoad: ['guard'], loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function (r) { expectTreeToBe(r, '/a/b'); }, function (e) { throw 'Should not reach'; });
        });
        it('should work with absolute redirects', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var config = [{ path: '', pathMatch: 'full', redirectTo: '/a' }, { path: 'a', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree(''), config).forEach(function (r) {
                expectTreeToBe(r, 'a');
                expect(config[1]._loadedConfig).toBe(loadedConfig);
            });
        });
        it('should load the configuration only once', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var called = false;
            var loader = {
                load: function (injector, p) {
                    if (called)
                        throw new Error('Should not be called twice');
                    called = true;
                    return of_1.of(loadedConfig);
                }
            };
            var config = [{ path: 'a', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a?k1'), config)
                .subscribe(function (r) { });
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a?k2'), config)
                .subscribe(function (r) {
                expectTreeToBe(r, 'a?k2');
                expect(config[0]._loadedConfig).toBe(loadedConfig);
            }, function (e) { throw 'Should not reach'; });
        });
        it('should load the configuration of a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var config = [{ path: '**', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
        it('should load the configuration after a local redirect from a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var config = [{ path: 'not-found', loadChildren: 'children' }, { path: '**', redirectTo: 'not-found' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
        it('should load the configuration after an absolute redirect from a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return of_1.of(loadedConfig); } };
            var config = [{ path: 'not-found', loadChildren: 'children' }, { path: '**', redirectTo: '/not-found' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
    });
    describe('empty paths', function () {
        it('redirect from an empty path should work (local redirect)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: 'a' }
            ], 'b', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('redirect from an empty path should work (absolute redirect)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: '/a/b' }
            ], '', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('should redirect empty path route only when terminal', function () {
            var config = [
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: 'a', pathMatch: 'full' }
            ];
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('b'), config)
                .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'b\''); });
        });
        it('redirect from an empty path should work (nested case)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [{ path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' }]
                },
                { path: '', redirectTo: 'a' }
            ], '', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('redirect to an empty path should work', function () {
            checkRedirect([
                { path: '', component: ComponentA, children: [{ path: 'b', component: ComponentB }] },
                { path: 'a', redirectTo: '' }
            ], 'a/b', function (t) { expectTreeToBe(t, 'b'); });
        });
        describe('aux split is in the middle', function () {
            it('should create a new url segment (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/b', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should create a new url segment (terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/b', function (t) { expectTreeToBe(t, 'a/b'); });
            });
        });
        describe('split at the end (no right child)', function () {
            it('should create a new child (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should create a new child (terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should work only only primary outlet', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' }
                        ]
                    }], 'a/(aux:c)', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
        });
        describe('split at the end (right child)', function () {
            it('should create a new child (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB, children: [{ path: 'd', component: ComponentB }] },
                            { path: '', redirectTo: 'b' }, {
                                path: 'c',
                                component: ComponentC,
                                outlet: 'aux',
                                children: [{ path: 'e', component: ComponentC }]
                            },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/(d//aux:e)', function (t) { expectTreeToBe(t, 'a/(b/d//aux:c/e)'); });
            });
            it('should not create a new child (terminal)', function () {
                var config = [{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB, children: [{ path: 'd', component: ComponentB }] },
                            { path: '', redirectTo: 'b' }, {
                                path: 'c',
                                component: ComponentC,
                                outlet: 'aux',
                                children: [{ path: 'e', component: ComponentC }]
                            },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }];
                apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('a/(d//aux:e)'), config)
                    .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a\''); });
            });
        });
    });
    describe('empty URL leftovers', function () {
        it('should not error when no children matching and no url is left', function () {
            checkRedirect([{ path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }], '/a', function (t) { expectTreeToBe(t, 'a'); });
        });
        it('should not error when no children matching and no url is left (aux routes)', function () {
            checkRedirect([{
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                        { path: '', redirectTo: 'c', outlet: 'aux' },
                        { path: 'c', component: ComponentC, outlet: 'aux' },
                    ]
                }], '/a', function (t) { expectTreeToBe(t, 'a/(aux:c)'); });
        });
        it('should error when no children matching and some url is left', function () {
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('/a/c'), [{ path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }])
                .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a/c\''); });
        });
    });
    describe('custom path matchers', function () {
        it('should use custom path matcher', function () {
            var matcher = function (s, g, r) {
                if (s[0].path === 'a') {
                    return { consumed: s.slice(0, 2), posParams: { id: s[1] } };
                }
                else {
                    return null;
                }
            };
            checkRedirect([{
                    matcher: matcher,
                    component: ComponentA,
                    children: [{ path: 'b', component: ComponentB }]
                }], '/a/1/b', function (t) { expectTreeToBe(t, 'a/1/b'); });
        });
    });
    describe('redirecting to named outlets', function () {
        it('should work when using absolute redirects', function () {
            checkRedirect([
                { path: 'a/:id', redirectTo: '/b/:id(aux:c/:id)' },
                { path: 'b/:id', component: ComponentB },
                { path: 'c/:id', component: ComponentC, outlet: 'aux' }
            ], 'a/1;p=99', function (t) { expectTreeToBe(t, '/b/1;p=99(aux:c/1;p=99)'); });
        });
        it('should work when using absolute redirects (wildcard)', function () {
            checkRedirect([
                { path: '**', redirectTo: '/b(aux:c)' }, { path: 'b', component: ComponentB },
                { path: 'c', component: ComponentC, outlet: 'aux' }
            ], 'a/1', function (t) { expectTreeToBe(t, '/b(aux:c)'); });
        });
        it('should throw when using non-absolute redirects', function () {
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('a'), [
                { path: 'a', redirectTo: 'b(aux:c)' },
            ])
                .subscribe(function () { throw new Error('should not be reached'); }, function (e) {
                expect(e.message).toEqual('Only absolute redirects can have named outlets. redirectTo: \'b(aux:c)\'');
            });
        });
    });
});
function checkRedirect(config, url, callback) {
    apply_redirects_1.applyRedirects(testing_1.TestBed, null, new url_tree_1.DefaultUrlSerializer(), tree(url), config)
        .subscribe(callback, function (e) { throw e; });
}
function tree(url) {
    return new url_tree_1.DefaultUrlSerializer().parse(url);
}
function expectTreeToBe(actual, expectedUrl) {
    var expected = tree(expectedUrl);
    var serializer = new url_tree_1.DefaultUrlSerializer();
    var error = "\"" + serializer.serialize(actual) + "\" is not equal to \"" + serializer.serialize(expected) + "\"";
    compareSegments(actual.root, expected.root, error);
    expect(actual.queryParams).toEqual(expected.queryParams);
    expect(actual.fragment).toEqual(expected.fragment);
}
function compareSegments(actual, expected, error) {
    expect(actual).toBeDefined(error);
    expect(url_tree_1.equalSegments(actual.segments, expected.segments)).toEqual(true, error);
    expect(Object.keys(actual.children).length).toEqual(Object.keys(expected.children).length, error);
    Object.keys(expected.children).forEach(function (key) {
        compareSegments(actual.children[key], expected.children[key], error);
    });
}
var ComponentA = (function () {
    function ComponentA() {
    }
    return ComponentA;
}());
var ComponentB = (function () {
    function ComponentB() {
    }
    return ComponentB;
}());
var ComponentC = (function () {
    function ComponentC() {
    }
    return ComponentC;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9hcHBseV9yZWRpcmVjdHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEwQztBQUMxQyxpREFBOEM7QUFDOUMsOENBQTJDO0FBQzNDLHlDQUF1QztBQUV2QywwREFBc0Q7QUFDdEQsd0NBQXlEO0FBQ3pELDRDQUE4RjtBQUU5RixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsSUFBTSxVQUFVLEdBQUcsSUFBSSwrQkFBb0IsRUFBRSxDQUFDO0lBQzlDLElBQUksVUFBNEIsQ0FBQztJQUVqQyxVQUFVLENBQUMsY0FBUSxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0QsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1FBQ3RELGFBQWEsQ0FDVDtZQUNFO2dCQUNFLElBQUksRUFBRSxHQUFHO2dCQUNULFNBQVMsRUFBRSxVQUFVO2dCQUNyQixRQUFRLEVBQUU7b0JBQ1IsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUM7aUJBQ25DO2FBQ0Y7U0FDRixFQUNELE1BQU0sRUFBRSxVQUFDLENBQVUsSUFBTyxjQUFjLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsYUFBYSxDQUNULENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUUsTUFBTSxFQUNqRixVQUFDLENB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