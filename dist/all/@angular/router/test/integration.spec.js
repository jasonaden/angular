"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var router_1 = require("@angular/router");
var Observable_1 = require("rxjs/Observable");
var of_1 = require("rxjs/observable/of");
var map_1 = require("rxjs/operator/map");
var collection_1 = require("../src/utils/collection");
var testing_2 = require("../testing");
describe('Integration', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'simple', component: SimpleCmp }]), TestModule]
        });
    });
    it('should navigate with a provided config', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/simple');
    })));
    it('should navigate from ngOnInit hook', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        router.resetConfig([
            { path: '', component: SimpleCmp },
            { path: 'one', component: RouteCmp },
        ]);
        var fixture = createRoot(router, RootCmpWithOnInit);
        matchers_1.expect(location.path()).toEqual('/one');
        matchers_1.expect(fixture.nativeElement).toHaveText('route');
    })));
    describe('should execute navigations serially', function () {
        var log = [];
        beforeEach(function () {
            log = [];
            testing_1.TestBed.configureTestingModule({
                providers: [
                    {
                        provide: 'trueRightAway',
                        useValue: function () {
                            log.push('trueRightAway');
                            return true;
                        }
                    },
                    {
                        provide: 'trueIn2Seconds',
                        useValue: function () {
                            log.push('trueIn2Seconds-start');
                            var res = null;
                            var p = new Promise(function (r) { return res = r; });
                            setTimeout(function () {
                                log.push('trueIn2Seconds-end');
                                res(true);
                            }, 2000);
                            return p;
                        }
                    }
                ]
            });
        });
        describe('should advance the parent route after deactivating its children', function () {
            var log = [];
            var Parent = (function () {
                function Parent(route) {
                    route.params.subscribe(function (s) { log.push(s); });
                }
                return Parent;
            }());
            Parent = __decorate([
                core_1.Component({ template: '<router-outlet></router-outlet>' }),
                __metadata("design:paramtypes", [router_1.ActivatedRoute])
            ], Parent);
            var Child1 = (function () {
                function Child1() {
                }
                Child1.prototype.ngOnDestroy = function () { log.push('child1 destroy'); };
                return Child1;
            }());
            Child1 = __decorate([
                core_1.Component({ template: 'child1' })
            ], Child1);
            var Child2 = (function () {
                function Child2() {
                    log.push('child2 constructor');
                }
                return Child2;
            }());
            Child2 = __decorate([
                core_1.Component({ template: 'child2' }),
                __metadata("design:paramtypes", [])
            ], Child2);
            var TestModule = (function () {
                function TestModule() {
                }
                return TestModule;
            }());
            TestModule = __decorate([
                core_1.NgModule({
                    declarations: [Parent, Child1, Child2],
                    entryComponents: [Parent, Child1, Child2],
                    imports: [router_1.RouterModule]
                })
            ], TestModule);
            beforeEach(function () {
                log = [];
                testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
            });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'parent/:id',
                        component: Parent,
                        children: [
                            { path: 'child1', component: Child1 },
                            { path: 'child2', component: Child2 },
                        ]
                    }]);
                router.navigateByUrl('/parent/1/child1');
                advance(fixture);
                router.navigateByUrl('/parent/2/child2');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/parent/2/child2');
                matchers_1.expect(log).toEqual([
                    { id: '1' },
                    'child1 destroy',
                    { id: '2' },
                    'child2 constructor',
                ]);
            })));
        });
        it('should execute navigations serialy', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'a', component: SimpleCmp, canActivate: ['trueRightAway', 'trueIn2Seconds'] },
                { path: 'b', component: SimpleCmp, canActivate: ['trueRightAway', 'trueIn2Seconds'] }
            ]);
            router.navigateByUrl('/a');
            testing_1.tick(100);
            fixture.detectChanges();
            router.navigateByUrl('/b');
            testing_1.tick(100); // 200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual(['trueRightAway', 'trueIn2Seconds-start']);
            testing_1.tick(2000); // 2200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual([
                'trueRightAway', 'trueIn2Seconds-start', 'trueIn2Seconds-end', 'trueRightAway',
                'trueIn2Seconds-start'
            ]);
            testing_1.tick(2000); // 4200
            fixture.detectChanges();
            matchers_1.expect(log).toEqual([
                'trueRightAway', 'trueIn2Seconds-start', 'trueIn2Seconds-end', 'trueRightAway',
                'trueIn2Seconds-start', 'trueIn2Seconds-end'
            ]);
        })));
    });
    it('Should work inside ChangeDetectionStrategy.OnPush components', testing_1.fakeAsync(function () {
        var OnPushOutlet = (function () {
            function OnPushOutlet() {
            }
            return OnPushOutlet;
        }());
        OnPushOutlet = __decorate([
            core_1.Component({
                selector: 'root-cmp',
                template: "<router-outlet></router-outlet>",
                changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            })
        ], OnPushOutlet);
        var NeedCdCmp = (function () {
            function NeedCdCmp() {
            }
            return NeedCdCmp;
        }());
        NeedCdCmp = __decorate([
            core_1.Component({ selector: 'need-cd', template: "{{'it works!'}}" })
        ], NeedCdCmp);
        var TestModule = (function () {
            function TestModule() {
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({
                declarations: [OnPushOutlet, NeedCdCmp],
                entryComponents: [OnPushOutlet, NeedCdCmp],
                imports: [router_1.RouterModule],
            })
        ], TestModule);
        testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'on',
                component: OnPushOutlet,
                children: [{
                        path: 'push',
                        component: NeedCdCmp,
                    }],
            }]);
        advance(fixture);
        router.navigateByUrl('on');
        advance(fixture);
        router.navigateByUrl('on/push');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('it works!');
    }));
    it('should not error when no url left and no children are matching', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }]
            }]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        router.navigateByUrl('/team/33');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should work when an outlet is in an ngIf', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'child',
                component: OutletInNgIf,
                children: [{ path: 'simple', component: SimpleCmp }]
            }]);
        router.navigateByUrl('/child/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/child/simple');
    })));
    it('should work when an outlet is added/removed', testing_1.fakeAsync(function () {
        var RootCmpWithLink = (function () {
            function RootCmpWithLink() {
                this.cond = true;
            }
            return RootCmpWithLink;
        }());
        RootCmpWithLink = __decorate([
            core_1.Component({
                selector: 'someRoot',
                template: "[<div *ngIf=\"cond\"><router-outlet></router-outlet></div>]"
            })
        ], RootCmpWithLink);
        testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, RootCmpWithLink);
        router.resetConfig([
            { path: 'simple', component: SimpleCmp },
            { path: 'blank', component: BlankCmp },
        ]);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[simple]');
        fixture.componentInstance.cond = false;
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[]');
        fixture.componentInstance.cond = true;
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('[simple]');
    }));
    it('should update location when navigating', testing_1.fakeAsync(function () {
        var RecordLocationCmp = (function () {
            function RecordLocationCmp(loc) {
                this.storedPath = loc.path();
            }
            return RecordLocationCmp;
        }());
        RecordLocationCmp = __decorate([
            core_1.Component({ template: "record" }),
            __metadata("design:paramtypes", [common_1.Location])
        ], RecordLocationCmp);
        var TestModule = (function () {
            function TestModule() {
            }
            return TestModule;
        }());
        TestModule = __decorate([
            core_1.NgModule({ declarations: [RecordLocationCmp], entryComponents: [RecordLocationCmp] })
        ], TestModule);
        testing_1.TestBed.configureTestingModule({ imports: [TestModule] });
        var router = testing_1.TestBed.get(router_1.Router);
        var location = testing_1.TestBed.get(common_1.Location);
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'record/:id', component: RecordLocationCmp }]);
        router.navigateByUrl('/record/22');
        advance(fixture);
        var c = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(location.path()).toEqual('/record/22');
        matchers_1.expect(c.storedPath).toEqual('/record/22');
        router.navigateByUrl('/record/33');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/record/33');
    }));
    it('should skip location update when using NavigationExtras.skipLocationChange with navigateByUrl', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = testing_1.TestBed.createComponent(RootCmp);
        advance(fixture);
        router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
        router.navigateByUrl('/team/22');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
        router.navigateByUrl('/team/33', { skipLocationChange: true });
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should skip location update when using NavigationExtras.skipLocationChange with navigate', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = testing_1.TestBed.createComponent(RootCmp);
        advance(fixture);
        router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
        router.navigate(['/team/22']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
        router.navigate(['/team/33'], { skipLocationChange: true });
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22');
        matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ , right:  ]');
    })));
    it('should navigate back and forward', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }, { path: 'user/:name', component: UserCmp }]
            }]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.back();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
        location.forward();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/22/user/victor');
    })));
    it('should navigate to the same url when config changes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'a', component: SimpleCmp }]);
        router.navigate(['/a']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/a');
        matchers_1.expect(fixture.nativeElement).toHaveText('simple');
        router.resetConfig([{ path: 'a', component: RouteCmp }]);
        router.navigate(['/a']);
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/a');
        matchers_1.expect(fixture.nativeElement).toHaveText('route');
    })));
    it('should navigate when locations changes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'user/:name', component: UserCmp }]
            }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return e instanceof router_1.RouteEvent || recordedEvents.push(e); });
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.simulateHashChange('/team/22/user/fedor');
        advance(fixture);
        location.simulateUrlPop('/team/22/user/fedor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user fedor, right:  ]');
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/team/22/user/victor'], [router_1.RoutesRecognized, '/team/22/user/victor'],
            [router_1.GuardsCheckStart, '/team/22/user/victor'], [router_1.GuardsCheckEnd, '/team/22/user/victor'],
            [router_1.ResolveStart, '/team/22/user/victor'], [router_1.ResolveEnd, '/team/22/user/victor'],
            [router_1.NavigationEnd, '/team/22/user/victor'],
            [router_1.NavigationStart, '/team/22/user/fedor'], [router_1.RoutesRecognized, '/team/22/user/fedor'],
            [router_1.GuardsCheckStart, '/team/22/user/fedor'], [router_1.GuardsCheckEnd, '/team/22/user/fedor'],
            [router_1.ResolveStart, '/team/22/user/fedor'], [router_1.ResolveEnd, '/team/22/user/fedor'],
            [router_1.NavigationEnd, '/team/22/user/fedor']
        ]);
    })));
    it('should update the location when the matched route does not change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: '**', component: CollectParamsCmp }]);
        router.navigateByUrl('/one/two');
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(location.path()).toEqual('/one/two');
        matchers_1.expect(fixture.nativeElement).toHaveText('collect-params');
        matchers_1.expect(cmp.recordedUrls()).toEqual(['one/two']);
        router.navigateByUrl('/three/four');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/three/four');
        matchers_1.expect(fixture.nativeElement).toHaveText('collect-params');
        matchers_1.expect(cmp.recordedUrls()).toEqual(['one/two', 'three/four']);
    })));
    describe('should reset location if a navigation by location is successful', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [{
                        provide: 'in1Second',
                        useValue: function (c, a, b) {
                            var res = null;
                            var p = new Promise(function (_) { return res = _; });
                            setTimeout(function () { return res(true); }, 1000);
                            return p;
                        }
                    }]
            });
        });
        it('work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp, canActivate: ['in1Second'] }]);
            // Trigger two location changes to the same URL.
            // Because of the guard the order will look as follows:
            // - location change 'simple'
            // - start processing the change, start a guard
            // - location change 'simple'
            // - the first location change gets canceled, the URL gets reset to '/'
            // - the second location change gets finished, the URL should be reset to '/simple'
            location.simulateUrlPop('/simple');
            location.simulateUrlPop('/simple');
            testing_1.tick(2000);
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/simple');
        })));
    });
    it('should support secondary routes', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right: simple ]');
    })));
    it('should support secondary routes in separate commands', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        router.navigate(['team/22', { outlets: { right: 'simple' } }]);
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right: simple ]');
    })));
    it('should deactivate outlets', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            }]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ user victor, right:  ]');
    })));
    it('should deactivate nested outlets', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([
            {
                path: 'team/:id',
                component: TeamCmp,
                children: [
                    { path: 'user/:name', component: UserCmp },
                    { path: 'simple', component: SimpleCmp, outlet: 'right' }
                ]
            },
            { path: '', component: BlankCmp }
        ]);
        router.navigateByUrl('/team/22/(user/victor//right:simple)');
        advance(fixture);
        router.navigateByUrl('/');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('');
    })));
    it('should set query params and fragment', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: QueryParamsAndFragmentCmp }]);
        router.navigateByUrl('/query?name=1#fragment1');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('query: 1 fragment: fragment1');
        router.navigateByUrl('/query?name=2#fragment2');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('query: 2 fragment: fragment2');
    })));
    it('should ignore null and undefined query params', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: EmptyQueryParamsCmp }]);
        router.navigate(['query'], { queryParams: { name: 1, age: null, page: undefined } });
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(cmp.recordedParams).toEqual([{ name: '1' }]);
    })));
    it('should throw an error when one of the commands is null/undefined', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        createRoot(router, RootCmp);
        router.resetConfig([{ path: 'query', component: EmptyQueryParamsCmp }]);
        matchers_1.expect(function () { return router.navigate([
            undefined, 'query'
        ]); }).toThrowError("The requested path contains undefined segment at index 0");
    })));
    it('should push params only when they change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'user/:name', component: UserCmp }]
            }]);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        var team = fixture.debugElement.children[1].componentInstance;
        var user = fixture.debugElement.children[1].children[1].componentInstance;
        matchers_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        matchers_1.expect(team.snapshotParams).toEqual([{ id: '22' }]);
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'victor' }]);
        matchers_1.expect(user.snapshotParams).toEqual([{ name: 'victor' }]);
        router.navigateByUrl('/team/22/user/fedor');
        advance(fixture);
        matchers_1.expect(team.recordedParams).toEqual([{ id: '22' }]);
        matchers_1.expect(team.snapshotParams).toEqual([{ id: '22' }]);
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'victor' }, { name: 'fedor' }]);
        matchers_1.expect(user.snapshotParams).toEqual([{ name: 'victor' }, { name: 'fedor' }]);
    })));
    it('should work when navigating to /', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([
            { path: '', pathMatch: 'full', component: SimpleCmp },
            { path: 'user/:name', component: UserCmp }
        ]);
        router.navigateByUrl('/user/victor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('user victor');
        router.navigateByUrl('/');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('simple');
    })));
    it('should cancel in-flight navigations', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        router.navigateByUrl('/user/init');
        advance(fixture);
        var user = fixture.debugElement.children[1].componentInstance;
        var r1, r2;
        router.navigateByUrl('/user/victor').then(function (_) { return r1 = _; });
        router.navigateByUrl('/user/fedor').then(function (_) { return r2 = _; });
        advance(fixture);
        matchers_1.expect(r1).toEqual(false); // returns false because it was canceled
        matchers_1.expect(r2).toEqual(true); // returns true because it was successful
        matchers_1.expect(fixture.nativeElement).toHaveText('user fedor');
        matchers_1.expect(user.recordedParams).toEqual([{ name: 'init' }, { name: 'fedor' }]);
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/user/init'], [router_1.RoutesRecognized, '/user/init'],
            [router_1.GuardsCheckStart, '/user/init'], [router_1.GuardsCheckEnd, '/user/init'],
            [router_1.ResolveStart, '/user/init'], [router_1.ResolveEnd, '/user/init'], [router_1.NavigationEnd, '/user/init'],
            [router_1.NavigationStart, '/user/victor'], [router_1.NavigationCancel, '/user/victor'],
            [router_1.NavigationStart, '/user/fedor'], [router_1.RoutesRecognized, '/user/fedor'],
            [router_1.GuardsCheckStart, '/user/fedor'], [router_1.GuardsCheckEnd, '/user/fedor'],
            [router_1.ResolveStart, '/user/fedor'], [router_1.ResolveEnd, '/user/fedor'],
            [router_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    it('should handle failed navigations gracefully', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        var e;
        router.navigateByUrl('/invalid').catch(function (_) { return e = _; });
        advance(fixture);
        matchers_1.expect(e.message).toContain('Cannot match any routes');
        router.navigateByUrl('/user/fedor');
        advance(fixture);
        matchers_1.expect(fixture.nativeElement).toHaveText('user fedor');
        expectEvents(recordedEvents, [
            [router_1.NavigationStart, '/invalid'], [router_1.NavigationError, '/invalid'],
            [router_1.NavigationStart, '/user/fedor'], [router_1.RoutesRecognized, '/user/fedor'],
            [router_1.GuardsCheckStart, '/user/fedor'], [router_1.GuardsCheckEnd, '/user/fedor'],
            [router_1.ResolveStart, '/user/fedor'], [router_1.ResolveEnd, '/user/fedor'],
            [router_1.NavigationEnd, '/user/fedor']
        ]);
    })));
    it('should support custom error handlers', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        router.errorHandler = function (error) { return 'resolvedValue'; };
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'user/:name', component: UserCmp }]);
        var recordedEvents = [];
        router.events.forEach(function (e) { return recordedEvents.push(e); });
        var e;
        router.navigateByUrl('/invalid').then(function (_) { return e = _; });
        advance(fixture);
        matchers_1.expect(e).toEqual('resolvedValue');
        expectEvents(recordedEvents, [[router_1.NavigationStart, '/invalid'], [router_1.NavigationError, '/invalid']]);
    })));
    it('should not swallow errors', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
        router.navigateByUrl('/invalid');
        matchers_1.expect(function () { return advance(fixture); }).toThrow();
        router.navigateByUrl('/invalid2');
        matchers_1.expect(function () { return advance(fixture); }).toThrow();
    })));
    it('should replace state when path is equal to current path', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{
                path: 'team/:id',
                component: TeamCmp,
                children: [{ path: 'simple', component: SimpleCmp }, { path: 'user/:name', component: UserCmp }]
            }]);
        router.navigateByUrl('/team/33/simple');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        router.navigateByUrl('/team/22/user/victor');
        advance(fixture);
        location.back();
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/team/33/simple');
    })));
    it('should handle componentless paths', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, RootCmpWithTwoOutlets);
        router.resetConfig([
            {
                path: 'parent/:id',
                children: [
                    { path: 'simple', component: SimpleCmp },
                    { path: 'user/:name', component: UserCmp, outlet: 'right' }
                ]
            },
            { path: 'user/:name', component: UserCmp }
        ]);
        // navigate to a componentless route
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user victor]');
        // navigate to the same route with different params (reuse)
        router.navigateByUrl('/parent/22/(simple//right:user/fedor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/22/(simple//right:user/fedor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user fedor]');
        // navigate to a normal route (check deactivation)
        router.navigateByUrl('/user/victor');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/user/victor');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [user victor] right []');
        // navigate back to a componentless route
        router.navigateByUrl('/parent/11/(simple//right:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/parent/11/(simple//right:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('primary [simple] right [user victor]');
    })));
    it('should not deactivate aux routes when navigating from a componentless routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
        var fixture = createRoot(router, TwoOutletsCmp);
        router.resetConfig([
            { path: 'simple', component: SimpleCmp },
            { path: 'componentless', children: [{ path: 'simple', component: SimpleCmp }] },
            { path: 'user/:name', outlet: 'aux', component: UserCmp }
        ]);
        router.navigateByUrl('/componentless/simple(aux:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/componentless/simple(aux:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('[ simple, aux: user victor ]');
        router.navigateByUrl('/simple(aux:user/victor)');
        advance(fixture);
        matchers_1.expect(location.path()).toEqual('/simple(aux:user/victor)');
        matchers_1.expect(fixture.nativeElement).toHaveText('[ simple, aux: user victor ]');
    })));
    it('should emit an event when an outlet gets activated', testing_1.fakeAsync(function () {
        var Container = (function () {
            function Container() {
                this.activations = [];
                this.deactivations = [];
            }
            Container.prototype.recordActivate = function (component) { this.activations.push(component); };
            Container.prototype.recordDeactivate = function (component) { this.deactivations.push(component); };
            return Container;
        }());
        Container = __decorate([
            core_1.Component({
                selector: 'container',
                template: "<router-outlet (activate)=\"recordActivate($event)\" (deactivate)=\"recordDeactivate($event)\"></router-outlet>"
            })
        ], Container);
        testing_1.TestBed.configureTestingModule({ declarations: [Container] });
        var router = testing_1.TestBed.get(router_1.Router);
        var fixture = createRoot(router, Container);
        var cmp = fixture.componentInstance;
        router.resetConfig([{ path: 'blank', component: BlankCmp }, { path: 'simple', component: SimpleCmp }]);
        cmp.activations = [];
        cmp.deactivations = [];
        router.navigateByUrl('/blank');
        advance(fixture);
        matchers_1.expect(cmp.activations.length).toEqual(1);
        matchers_1.expect(cmp.activations[0] instanceof BlankCmp).toBe(true);
        router.navigateByUrl('/simple');
        advance(fixture);
        matchers_1.expect(cmp.activations.length).toEqual(2);
        matchers_1.expect(cmp.activations[1] instanceof SimpleCmp).toBe(true);
        matchers_1.expect(cmp.deactivations.length).toEqual(1);
        matchers_1.expect(cmp.deactivations[0] instanceof BlankCmp).toBe(true);
    }));
    it('should update url and router state before activating components', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
        var fixture = createRoot(router, RootCmp);
        router.resetConfig([{ path: 'cmp', component: ComponentRecordingRoutePathAndUrl }]);
        router.navigateByUrl('/cmp');
        advance(fixture);
        var cmp = fixture.debugElement.children[1].componentInstance;
        matchers_1.expect(cmp.url).toBe('/cmp');
        matchers_1.expect(cmp.path.length).toEqual(2);
    })));
    describe('data', function () {
        var ResolveSix = (function () {
            function ResolveSix() {
            }
            ResolveSix.prototype.resolve = function (route, state) { return 6; };
            return ResolveSix;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                providers: [
                    { provide: 'resolveTwo', useValue: function (a, b) { return 2; } },
                    { provide: 'resolveFour', useValue: function (a, b) { return 4; } },
                    { provide: 'resolveSix', useClass: ResolveSix },
                    { provide: 'resolveError', useValue: function (a, b) { return Promise.reject('error'); } },
                    { provide: 'numberOfUrlSegments', useValue: function (a, b) { return a.url.length; } },
                ]
            });
        });
        it('should provide resolved data', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmpWithTwoOutlets);
            router.resetConfig([{
                    path: 'parent/:id',
                    data: { one: 1 },
                    resolve: { two: 'resolveTwo' },
                    children: [
                        { path: '', data: { three: 3 }, resolve: { four: 'resolveFour' }, component: RouteCmp }, {
                            path: '',
                            data: { five: 5 },
                            resolve: { six: 'resolveSix' },
                            component: RouteCmp,
                            outlet: 'right'
                        }
                    ]
                }]);
            router.navigateByUrl('/parent/1');
            advance(fixture);
            var primaryCmp = fixture.debugElement.children[1].componentInstance;
            var rightCmp = fixture.debugElement.children[3].componentInstance;
            matchers_1.expect(primaryCmp.route.snapshot.data).toEqual({ one: 1, two: 2, three: 3, four: 4 });
            matchers_1.expect(rightCmp.route.snapshot.data).toEqual({ one: 1, two: 2, five: 5, six: 6 });
            var primaryRecorded = [];
            primaryCmp.route.data.forEach(function (rec) { return primaryRecorded.push(rec); });
            var rightRecorded = [];
            rightCmp.route.data.forEach(function (rec) { return rightRecorded.push(rec); });
            router.navigateByUrl('/parent/2');
            advance(fixture);
            matchers_1.expect(primaryRecorded).toEqual([{ one: 1, three: 3, two: 2, four: 4 }]);
            matchers_1.expect(rightRecorded).toEqual([{ one: 1, five: 5, two: 2, six: 6 }]);
        })));
        it('should handle errors', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp, resolve: { error: 'resolveError' } }]);
            var recordedEvents = [];
            router.events.subscribe(function (e) { return e instanceof router_1.RouteEvent || recordedEvents.push(e); });
            var e = null;
            router.navigateByUrl('/simple').catch(function (error) { return e = error; });
            advance(fixture);
            expectEvents(recordedEvents, [
                [router_1.NavigationStart, '/simple'], [router_1.RoutesRecognized, '/simple'],
                [router_1.GuardsCheckStart, '/simple'], [router_1.GuardsCheckEnd, '/simple'], [router_1.ResolveStart, '/simple'],
                [router_1.NavigationError, '/simple']
            ]);
            matchers_1.expect(e).toEqual('error');
        })));
        it('should preserve resolved data', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'parent',
                    resolve: { two: 'resolveTwo' },
                    children: [
                        { path: 'child1', component: CollectParamsCmp },
                        { path: 'child2', component: CollectParamsCmp }
                    ]
                }]);
            var e = null;
            router.navigateByUrl('/parent/child1');
            advance(fixture);
            router.navigateByUrl('/parent/child2');
            advance(fixture);
            var cmp = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ two: 2 });
        })));
        it('should rerun resolvers when the urls segments of a wildcard route change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: '**',
                    component: CollectParamsCmp,
                    resolve: { numberOfUrlSegments: 'numberOfUrlSegments' }
                }]);
            router.navigateByUrl('/one/two');
            advance(fixture);
            var cmp = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ numberOfUrlSegments: 2 });
            router.navigateByUrl('/one/two/three');
            advance(fixture);
            matchers_1.expect(cmp.route.snapshot.data).toEqual({ numberOfUrlSegments: 3 });
        })));
        describe('should run resolvers for the same route concurrently', function () {
            var log;
            var observer;
            beforeEach(function () {
                log = [];
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: 'resolver1',
                            useValue: function () {
                                var obs$ = new Observable_1.Observable(function (obs) {
                                    observer = obs;
                                    return function () { };
                                });
                                return map_1.map.call(obs$, function () { return log.push('resolver1'); });
                            }
                        },
                        {
                            provide: 'resolver2',
                            useValue: function () {
                                return map_1.map.call(of_1.of(null), function () {
                                    log.push('resolver2');
                                    observer.next(null);
                                    observer.complete();
                                });
                            }
                        },
                    ]
                });
            });
            it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'a',
                        resolve: {
                            one: 'resolver1',
                            two: 'resolver2',
                        },
                        component: SimpleCmp
                    }]);
                router.navigateByUrl('/a');
                advance(fixture);
                matchers_1.expect(log).toEqual(['resolver2', 'resolver1']);
            })));
        });
    });
    describe('router links', function () {
        it('should support skipping location update for anchor router links', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = testing_1.TestBed.createComponent(RootCmp);
            advance(fixture);
            router.resetConfig([{ path: 'team/:id', component: TeamCmp }]);
            router.navigateByUrl('/team/22');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ , right:  ]');
            var teamCmp = fixture.debugElement.childNodes[1].componentInstance;
            teamCmp.routerLink = ['/team/0'];
            advance(fixture);
            var anchor = fixture.debugElement.query(by_1.By.css('a')).nativeElement;
            anchor.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 0 [ , right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22');
            teamCmp.routerLink = ['/team/1'];
            advance(fixture);
            var button = fixture.debugElement.query(by_1.By.css('button')).nativeElement;
            button.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 1 [ , right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22');
        })));
        it('should support string router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: StringLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/33/simple');
            matchers_1.expect(native.getAttribute('target')).toEqual('_self');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should not preserve query params and fragment by default', testing_1.fakeAsync(function () {
            var RootCmpWithLink = (function () {
                function RootCmpWithLink() {
                }
                return RootCmpWithLink;
            }());
            RootCmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someRoot',
                    template: "<router-outlet></router-outlet><a routerLink=\"/home\">Link</a>"
                })
            ], RootCmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?q=123#fragment');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home');
        }));
        it('should not throw when commands is null', testing_1.fakeAsync(function () {
            var CmpWithLink = (function () {
                function CmpWithLink() {
                }
                return CmpWithLink;
            }());
            CmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someCmp',
                    template: "<router-outlet></router-outlet><a [routerLink]=\"null\">Link</a><button [routerLink]=\"null\">Button</button>"
                })
            ], CmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [CmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, CmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var anchor = fixture.nativeElement.querySelector('a');
            var button = fixture.nativeElement.querySelector('button');
            matchers_1.expect(function () { return anchor.click(); }).not.toThrow();
            matchers_1.expect(function () { return button.click(); }).not.toThrow();
        }));
        it('should update hrefs when query params or fragment change', testing_1.fakeAsync(function () {
            var RootCmpWithLink = (function () {
                function RootCmpWithLink() {
                }
                return RootCmpWithLink;
            }());
            RootCmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someRoot',
                    template: "<router-outlet></router-outlet><a routerLink=\"/home\" preserveQueryParams preserveFragment>Link</a>"
                })
            ], RootCmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?q=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=123');
            router.navigateByUrl('/home?q=456');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=456');
            router.navigateByUrl('/home?q=456#1');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?q=456#1');
        }));
        it('should correctly use the preserve strategy', testing_1.fakeAsync(function () {
            var RootCmpWithLink = (function () {
                function RootCmpWithLink() {
                }
                return RootCmpWithLink;
            }());
            RootCmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someRoot',
                    template: "<router-outlet></router-outlet><a routerLink=\"/home\" [queryParams]=\"{q: 456}\" queryParamsHandling=\"preserve\">Link</a>"
                })
            ], RootCmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?a=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?a=123');
        }));
        it('should correctly use the merge strategy', testing_1.fakeAsync(function () {
            var RootCmpWithLink = (function () {
                function RootCmpWithLink() {
                }
                return RootCmpWithLink;
            }());
            RootCmpWithLink = __decorate([
                core_1.Component({
                    selector: 'someRoot',
                    template: "<router-outlet></router-outlet><a routerLink=\"/home\" [queryParams]=\"{q: 456}\" queryParamsHandling=\"merge\">Link</a>"
                })
            ], RootCmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, RootCmpWithLink);
            router.resetConfig([{ path: 'home', component: SimpleCmp }]);
            var native = fixture.nativeElement.querySelector('a');
            router.navigateByUrl('/home?a=123');
            advance(fixture);
            matchers_1.expect(native.getAttribute('href')).toEqual('/home?a=123&q=456');
        }));
        it('should support using links on non-a tags', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: StringLinkButtonCmp },
                        { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var button = fixture.nativeElement.querySelector('button');
            matchers_1.expect(button.getAttribute('tabindex')).toEqual('0');
            button.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should support absolute router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: AbsoluteLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/33/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 33 [ simple, right:  ]');
        })));
        it('should support relative router links', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: RelativeLinkCmp }, { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ link, right:  ]');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/22/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ simple, right:  ]');
        })));
        it('should support top-level link', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
            var fixture = createRoot(router, RelativeLinkInIfCmp);
            advance(fixture);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]);
            router.navigateByUrl('/');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText(' ');
            var cmp = fixture.componentInstance;
            cmp.show = true;
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('link ');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/simple');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('link simple');
        })));
        it('should support query params and fragments', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [
                        { path: 'link', component: LinkWithQueryParamsAndFragment },
                        { path: 'simple', component: SimpleCmp }
                    ]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.getAttribute('href')).toEqual('/team/22/simple?q=1#f');
            native.click();
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('team 22 [ simple, right:  ]');
            matchers_1.expect(location.path()).toEqual('/team/22/simple?q=1#f');
        })));
    });
    describe('redirects', function () {
        it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'old/team/:id', redirectTo: 'team/:id' }, { path: 'team/:id', component: TeamCmp }
            ]);
            router.navigateByUrl('old/team/22');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
        })));
        it('should not break the back button when trigger by location change', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = testing_1.TestBed.createComponent(RootCmp);
            advance(fixture);
            router.resetConfig([
                { path: 'initial', component: BlankCmp }, { path: 'old/team/:id', redirectTo: 'team/:id' },
                { path: 'team/:id', component: TeamCmp }
            ]);
            location.go('initial');
            location.go('old/team/22');
            // initial navigation
            router.initialNavigation();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22');
            location.back();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/initial');
            // location change
            location.go('/old/team/33');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/33');
            location.back();
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/initial');
        })));
    });
    describe('guards', function () {
        describe('CanActivate', function () {
            describe('should not activate a route when CanActivate returns false', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'alwaysFalse', useValue: function (a, b) { return false; } }] });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    var recordedEvents = [];
                    router.events.forEach(function (e) { return recordedEvents.push(e); });
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['alwaysFalse'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                    expectEvents(recordedEvents, [
                        [router_1.NavigationStart, '/team/22'], [router_1.RoutesRecognized, '/team/22'],
                        [router_1.GuardsCheckStart, '/team/22'], [router_1.GuardsCheckEnd, '/team/22'],
                        [router_1.NavigationCancel, '/team/22']
                    ]);
                    matchers_1.expect(recordedEvents[3].shouldActivate).toBe(false);
                })));
            });
            describe('should not activate a route when CanActivate returns false (componentless route)', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: 'alwaysFalse', useValue: function (a, b) { return false; } }] });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'parent',
                            canActivate: ['alwaysFalse'],
                            children: [{ path: 'team/:id', component: TeamCmp }]
                        }]);
                    router.navigateByUrl('parent/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                })));
            });
            describe('should activate a route when CanActivate returns true', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysTrue',
                                useValue: function (a, s) { return true; }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['alwaysTrue'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should work when given a class', function () {
                var AlwaysTrue = (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canActivate = function (route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                }());
                beforeEach(function () { testing_1.TestBed.configureTestingModule({ providers: [AlwaysTrue] }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: [AlwaysTrue] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should work when returns an observable', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanActivate',
                                useValue: function (a, b) {
                                    return Observable_1.Observable.create(function (observer) { observer.next(false); });
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['CanActivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                })));
            });
            describe('should work when returns a promise', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanActivate',
                                useValue: function (a, b) {
                                    if (a.params['id'] === '22') {
                                        return Promise.resolve(true);
                                    }
                                    else {
                                        return Promise.resolve(false);
                                    }
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canActivate: ['CanActivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            describe('should reset the location when cancleling a navigation', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysFalse',
                                useValue: function (a, b) { return false; }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        { path: 'one', component: SimpleCmp },
                        { path: 'two', component: SimpleCmp, canActivate: ['alwaysFalse'] }
                    ]);
                    router.navigateByUrl('/one');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/one');
                    location.go('/two');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/one');
                })));
            });
            describe('should redirect to / when guard returns false', function () {
                beforeEach(function () { return testing_1.TestBed.configureTestingModule({
                    providers: [{
                            provide: 'returnFalseAndNavigate',
                            useFactory: function (router) { return function () {
                                router.navigate(['/']);
                                return false;
                            }; },
                            deps: [router_1.Router]
                        }]
                }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    router.resetConfig([
                        {
                            path: '',
                            component: SimpleCmp,
                        },
                        { path: 'one', component: RouteCmp, canActivate: ['returnFalseAndNavigate'] }
                    ]);
                    var fixture = testing_1.TestBed.createComponent(RootCmp);
                    router.navigateByUrl('/one');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/');
                    matchers_1.expect(fixture.nativeElement).toHaveText('simple');
                })));
            });
            describe('runGuardsAndResolvers', function () {
                var guardRunCount = 0;
                var resolverRunCount = 0;
                beforeEach(function () {
                    guardRunCount = 0;
                    resolverRunCount = 0;
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            {
                                provide: 'guard',
                                useValue: function () {
                                    guardRunCount++;
                                    return true;
                                }
                            },
                            { provide: 'resolver', useValue: function () { return resolverRunCount++; } }
                        ]
                    });
                });
                function configureRouter(router, runGuardsAndResolvers) {
                    var fixture = createRoot(router, RootCmpWithTwoOutlets);
                    router.resetConfig([
                        {
                            path: 'a',
                            runGuardsAndResolvers: runGuardsAndResolvers,
                            component: RouteCmp,
                            canActivate: ['guard'],
                            resolve: { data: 'resolver' }
                        },
                        { path: 'b', component: SimpleCmp, outlet: 'right' }
                    ]);
                    router.navigateByUrl('/a');
                    advance(fixture);
                    return fixture;
                }
                it('should rerun guards and resolvers when params change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'paramsChange');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                })));
                it('should rerun guards and resolvers when query params change', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'paramsOrQueryParamsChange');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                    router.navigateByUrl('/a;p=2(right:b)?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                })));
                it('should always rerun guards and resolvers', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = configureRouter(router, 'always');
                    var cmp = fixture.debugElement.children[1].componentInstance;
                    var recordedData = [];
                    cmp.route.data.subscribe(function (data) { return recordedData.push(data); });
                    matchers_1.expect(guardRunCount).toEqual(1);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }]);
                    router.navigateByUrl('/a;p=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(2);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }]);
                    router.navigateByUrl('/a;p=2');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(3);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }]);
                    router.navigateByUrl('/a;p=2?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(4);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }]);
                    router.navigateByUrl('/a;p=2(right:b)?q=1');
                    advance(fixture);
                    matchers_1.expect(guardRunCount).toEqual(5);
                    matchers_1.expect(recordedData).toEqual([{ data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }]);
                })));
            });
            describe('should wait for parent to complete', function () {
                var log;
                beforeEach(function () {
                    log = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            {
                                provide: 'parentGuard',
                                useValue: function () {
                                    return delayPromise(10).then(function () {
                                        log.push('parent');
                                        return true;
                                    });
                                }
                            },
                            {
                                provide: 'childGuard',
                                useValue: function () {
                                    return delayPromise(5).then(function () {
                                        log.push('child');
                                        return true;
                                    });
                                }
                            }
                        ]
                    });
                });
                function delayPromise(delay) {
                    var resolve;
                    var promise = new Promise(function (res) { return resolve = res; });
                    setTimeout(function () { return resolve(true); }, delay);
                    return promise;
                }
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router], function (router) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'parent',
                            canActivate: ['parentGuard'],
                            children: [
                                { path: 'child', component: SimpleCmp, canActivate: ['childGuard'] },
                            ]
                        }]);
                    router.navigateByUrl('/parent/child');
                    advance(fixture);
                    testing_1.tick(15);
                    matchers_1.expect(log).toEqual(['parent', 'child']);
                })));
            });
        });
        describe('CanDeactivate', function () {
            var log;
            beforeEach(function () {
                log = [];
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        {
                            provide: 'CanDeactivateParent',
                            useValue: function (c, a, b) {
                                return a.params['id'] === '22';
                            }
                        },
                        {
                            provide: 'CanDeactivateTeam',
                            useValue: function (c, a, b) {
                                return c.route.snapshot.params['id'] === '22';
                            }
                        },
                        {
                            provide: 'CanDeactivateUser',
                            useValue: function (c, a, b) {
                                return a.params['name'] === 'victor';
                            }
                        },
                        {
                            provide: 'RecordingDeactivate',
                            useValue: function (c, a, b) {
                                log.push({ path: a.routeConfig.path, component: c });
                                return true;
                            }
                        },
                        {
                            provide: 'alwaysFalse',
                            useValue: function (c, a, b) { return false; }
                        },
                        {
                            provide: 'alwaysFalseAndLogging',
                            useValue: function (c, a, b) {
                                log.push('called');
                                return false;
                            }
                        },
                        {
                            provide: 'alwaysFalseWithDelayAndLogging',
                            useValue: function () {
                                log.push('called');
                                var resolve;
                                var promise = new Promise(function (res) { return resolve = res; });
                                setTimeout(function () { return resolve(false); }, 0);
                                return promise;
                            }
                        },
                        {
                            provide: 'canActivate_alwaysTrueAndLogging',
                            useValue: function () {
                                log.push('canActivate called');
                                return true;
                            }
                        },
                    ]
                });
            });
            describe('should not deactivate a route when CanDeactivate returns false', function () {
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: ['CanDeactivateTeam'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    var successStatus = false;
                    router.navigateByUrl('/team/33').then(function (res) { return successStatus = res; });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(successStatus).toEqual(true);
                    var canceledStatus = false;
                    router.navigateByUrl('/team/44').then(function (res) { return canceledStatus = res; });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(canceledStatus).toEqual(false);
                })));
                it('works with componentless routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        {
                            path: 'grandparent',
                            canDeactivate: ['RecordingDeactivate'],
                            children: [{
                                    path: 'parent',
                                    canDeactivate: ['RecordingDeactivate'],
                                    children: [{
                                            path: 'child',
                                            canDeactivate: ['RecordingDeactivate'],
                                            children: [{
                                                    path: 'simple',
                                                    component: SimpleCmp,
                                                    canDeactivate: ['RecordingDeactivate']
                                                }]
                                        }]
                                }]
                        },
                        { path: 'simple', component: SimpleCmp }
                    ]);
                    router.navigateByUrl('/grandparent/parent/child/simple');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/grandparent/parent/child/simple');
                    router.navigateByUrl('/simple');
                    advance(fixture);
                    var child = fixture.debugElement.children[1].componentInstance;
                    matchers_1.expect(log.map(function (a) { return a.path; })).toEqual([
                        'simple', 'child', 'parent', 'grandparent'
                    ]);
                    matchers_1.expect(log.map(function (a) { return a.component; })).toEqual([child, null, null, null]);
                })));
                it('works with aux routes', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'two-outlets',
                            component: TwoOutletsCmp,
                            children: [
                                { path: 'a', component: BlankCmp }, {
                                    path: 'b',
                                    canDeactivate: ['RecordingDeactivate'],
                                    component: SimpleCmp,
                                    outlet: 'aux'
                                }
                            ]
                        }]);
                    router.navigateByUrl('/two-outlets/(a//aux:b)');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/two-outlets/(a//aux:b)');
                    router.navigate(['two-outlets', { outlets: { aux: null } }]);
                    advance(fixture);
                    matchers_1.expect(log.map(function (a) { return a.path; })).toEqual(['b']);
                    matchers_1.expect(location.path()).toEqual('/two-outlets/(a)');
                })));
                it('works with a nested route', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: 'team/:id',
                            component: TeamCmp,
                            children: [
                                { path: '', pathMatch: 'full', component: SimpleCmp },
                                { path: 'user/:name', component: UserCmp, canDeactivate: ['CanDeactivateUser'] }
                            ]
                        }]);
                    router.navigateByUrl('/team/22/user/victor');
                    advance(fixture);
                    // this works because we can deactivate victor
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    router.navigateByUrl('/team/33/user/fedor');
                    advance(fixture);
                    // this doesn't work cause we cannot deactivate fedor
                    router.navigateByUrl('/team/44');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33/user/fedor');
                })));
            });
            it('should not create a route state if navigation is canceled', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'main',
                        component: TeamCmp,
                        children: [
                            { path: 'component1', component: SimpleCmp, canDeactivate: ['alwaysFalse'] },
                            { path: 'component2', component: SimpleCmp }
                        ]
                    }]);
                router.navigateByUrl('/main/component1');
                advance(fixture);
                router.navigateByUrl('/main/component2');
                advance(fixture);
                var teamCmp = fixture.debugElement.children[1].componentInstance;
                matchers_1.expect(teamCmp.route.firstChild.url.value[0].path).toEqual('component1');
                matchers_1.expect(location.path()).toEqual('/main/component1');
            })));
            it('should not run CanActivate when CanDeactivate returns false', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'main',
                        component: TeamCmp,
                        children: [
                            {
                                path: 'component1',
                                component: SimpleCmp,
                                canDeactivate: ['alwaysFalseWithDelayAndLogging']
                            },
                            {
                                path: 'component2',
                                component: SimpleCmp,
                                canActivate: ['canActivate_alwaysTrueAndLogging']
                            },
                        ]
                    }]);
                router.navigateByUrl('/main/component1');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/main/component1');
                router.navigateByUrl('/main/component2');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/main/component1');
                matchers_1.expect(log).toEqual(['called']);
            })));
            it('should call guards every time when navigating to the same url over and over again', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'simple', component: SimpleCmp, canDeactivate: ['alwaysFalseAndLogging'] },
                    { path: 'blank', component: BlankCmp }
                ]);
                router.navigateByUrl('/simple');
                advance(fixture);
                router.navigateByUrl('/blank');
                advance(fixture);
                matchers_1.expect(log).toEqual(['called']);
                matchers_1.expect(location.path()).toEqual('/simple');
                router.navigateByUrl('/blank');
                advance(fixture);
                matchers_1.expect(log).toEqual(['called', 'called']);
                matchers_1.expect(location.path()).toEqual('/simple');
            })));
            describe('next state', function () {
                var log;
                var ClassWithNextState = (function () {
                    function ClassWithNextState() {
                    }
                    ClassWithNextState.prototype.canDeactivate = function (component, currentRoute, currentState, nextState) {
                        log.push(currentState.url, nextState.url);
                        return true;
                    };
                    return ClassWithNextState;
                }());
                beforeEach(function () {
                    log = [];
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            ClassWithNextState, {
                                provide: 'FunctionWithNextState',
                                useValue: function (cmp, currentRoute, currentState, nextState) {
                                    log.push(currentState.url, nextState.url);
                                    return true;
                                }
                            }
                        ]
                    });
                });
                it('should pass next state as the 4 argument when guard is a class', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: [ClassWithNextState] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(log).toEqual(['/team/22', '/team/33']);
                })));
                it('should pass next state as the 4 argument when guard is a function', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([
                        { path: 'team/:id', component: TeamCmp, canDeactivate: ['FunctionWithNextState'] }
                    ]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                    matchers_1.expect(log).toEqual(['/team/22', '/team/33']);
                })));
            });
            describe('should work when given a class', function () {
                var AlwaysTrue = (function () {
                    function AlwaysTrue() {
                    }
                    AlwaysTrue.prototype.canDeactivate = function (component, route, state) {
                        return true;
                    };
                    return AlwaysTrue;
                }());
                beforeEach(function () { testing_1.TestBed.configureTestingModule({ providers: [AlwaysTrue] }); });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: [AlwaysTrue] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/33');
                })));
            });
            describe('should work when returns an observable', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'CanDeactivate',
                                useValue: function (c, a, b) {
                                    return Observable_1.Observable.create(function (observer) { observer.next(false); });
                                }
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{ path: 'team/:id', component: TeamCmp, canDeactivate: ['CanDeactivate'] }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
        });
        describe('CanActivateChild', function () {
            describe('should be invoked when activating a child', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{
                                provide: 'alwaysFalse',
                                useValue: function (a, b) { return a.paramMap.get('id') === '22'; },
                            }]
                    });
                });
                it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                    var fixture = createRoot(router, RootCmp);
                    router.resetConfig([{
                            path: '',
                            canActivateChild: ['alwaysFalse'],
                            children: [{ path: 'team/:id', component: TeamCmp }]
                        }]);
                    router.navigateByUrl('/team/22');
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                    router.navigateByUrl('/team/33').catch(function () { });
                    advance(fixture);
                    matchers_1.expect(location.path()).toEqual('/team/22');
                })));
            });
            it('should find the guard provided in lazy loaded module', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var AdminComponent = (function () {
                    function AdminComponent() {
                    }
                    return AdminComponent;
                }());
                AdminComponent = __decorate([
                    core_1.Component({ selector: 'admin', template: '<router-outlet></router-outlet>' })
                ], AdminComponent);
                var LazyLoadedComponent = (function () {
                    function LazyLoadedComponent() {
                    }
                    return LazyLoadedComponent;
                }());
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                var LazyLoadedModule = (function () {
                    function LazyLoadedModule() {
                    }
                    return LazyLoadedModule;
                }());
                LazyLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [AdminComponent, LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{
                                    path: '',
                                    component: AdminComponent,
                                    children: [{
                                            path: '',
                                            canActivateChild: ['alwaysTrue'],
                                            children: [{ path: '', component: LazyLoadedComponent }]
                                        }]
                                }])],
                        providers: [{ provide: 'alwaysTrue', useValue: function () { return true; } }],
                    })
                ], LazyLoadedModule);
                loader.stubbedModules = { lazy: LazyLoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{ path: 'admin', loadChildren: 'lazy' }]);
                router.navigateByUrl('/admin');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/admin');
                matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded');
            })));
        });
        describe('CanLoad', function () {
            var canLoadRunCount = 0;
            beforeEach(function () {
                canLoadRunCount = 0;
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: 'alwaysFalse', useValue: function (a) { return false; } },
                        {
                            provide: 'returnFalseAndNavigate',
                            useFactory: function (router) { return function (a) {
                                router.navigate(['blank']);
                                return false;
                            }; },
                            deps: [router_1.Router],
                        },
                        {
                            provide: 'alwaysTrue',
                            useValue: function () {
                                canLoadRunCount++;
                                return true;
                            }
                        },
                    ]
                });
            });
            it('should not load children when CanLoad returns false', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = (function () {
                    function LazyLoadedComponent() {
                    }
                    return LazyLoadedComponent;
                }());
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                var LoadedModule = (function () {
                    function LoadedModule() {
                    }
                    return LoadedModule;
                }());
                LoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])]
                    })
                ], LoadedModule);
                loader.stubbedModules = { lazyFalse: LoadedModule, lazyTrue: LoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'lazyFalse', canLoad: ['alwaysFalse'], loadChildren: 'lazyFalse' },
                    { path: 'lazyTrue', canLoad: ['alwaysTrue'], loadChildren: 'lazyTrue' }
                ]);
                var recordedEvents = [];
                router.events.forEach(function (e) { return recordedEvents.push(e); });
                // failed navigation
                router.navigateByUrl('/lazyFalse/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyFalse/loaded'],
                    //  [GuardsCheckStart, '/lazyFalse/loaded'],
                    [router_1.NavigationCancel, '/lazyFalse/loaded'],
                ]);
                recordedEvents.splice(0);
                // successful navigation
                router.navigateByUrl('/lazyTrue/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazyTrue/loaded');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyTrue/loaded'],
                    [router_1.RouteConfigLoadStart],
                    [router_1.RouteConfigLoadEnd],
                    [router_1.RoutesRecognized, '/lazyTrue/loaded'],
                    [router_1.GuardsCheckStart, '/lazyTrue/loaded'],
                    [router_1.ChildActivationStart],
                    [router_1.GuardsCheckEnd, '/lazyTrue/loaded'],
                    [router_1.ResolveStart, '/lazyTrue/loaded'],
                    [router_1.ResolveEnd, '/lazyTrue/loaded'],
                    [router_1.ChildActivationEnd],
                    [router_1.NavigationEnd, '/lazyTrue/loaded'],
                ]);
            })));
            it('should support navigating from within the guard', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'lazyFalse', canLoad: ['returnFalseAndNavigate'], loadChildren: 'lazyFalse' },
                    { path: 'blank', component: BlankCmp }
                ]);
                var recordedEvents = [];
                router.events.forEach(function (e) { return recordedEvents.push(e); });
                router.navigateByUrl('/lazyFalse/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/blank');
                expectEvents(recordedEvents, [
                    [router_1.NavigationStart, '/lazyFalse/loaded'],
                    // No GuardCheck events as `canLoad` is a special guard that's not actually part of the
                    // guard lifecycle.
                    [router_1.NavigationCancel, '/lazyFalse/loaded'],
                    [router_1.NavigationStart, '/blank'], [router_1.RoutesRecognized, '/blank'],
                    [router_1.GuardsCheckStart, '/blank'], [router_1.GuardsCheckEnd, '/blank'], [router_1.ResolveStart, '/blank'],
                    [router_1.ResolveEnd, '/blank'], [router_1.NavigationEnd, '/blank']
                ]);
            })));
            it('should execute CanLoad only once', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = (function () {
                    function LazyLoadedComponent() {
                    }
                    return LazyLoadedComponent;
                }());
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
                ], LazyLoadedComponent);
                var LazyLoadedModule = (function () {
                    function LazyLoadedModule() {
                    }
                    return LazyLoadedModule;
                }());
                LazyLoadedModule = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])]
                    })
                ], LazyLoadedModule);
                loader.stubbedModules = { lazy: LazyLoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{ path: 'lazy', canLoad: ['alwaysTrue'], loadChildren: 'lazy' }]);
                router.navigateByUrl('/lazy/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazy/loaded');
                matchers_1.expect(canLoadRunCount).toEqual(1);
                router.navigateByUrl('/');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/');
                router.navigateByUrl('/lazy/loaded');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/lazy/loaded');
                matchers_1.expect(canLoadRunCount).toEqual(1);
            })));
        });
        describe('order', function () {
            var Logger = (function () {
                function Logger() {
                    this.logs = [];
                }
                Logger.prototype.add = function (thing) { this.logs.push(thing); };
                return Logger;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        Logger, {
                            provide: 'canActivateChild_parent',
                            useFactory: function (logger) { return function () { return (logger.add('canActivateChild_parent'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canActivate_team',
                            useFactory: function (logger) { return function () { return (logger.add('canActivate_team'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canDeactivate_team',
                            useFactory: function (logger) { return function () { return (logger.add('canDeactivate_team'), true); }; },
                            deps: [Logger]
                        },
                        {
                            provide: 'canDeactivate_simple',
                            useFactory: function (logger) { return function () { return (logger.add('canDeactivate_simple'), true); }; },
                            deps: [Logger]
                        }
                    ]
                });
            });
            it('should call guards in the right order', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, Logger], function (router, location, logger) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: '',
                        canActivateChild: ['canActivateChild_parent'],
                        children: [{
                                path: 'team/:id',
                                canActivate: ['canActivate_team'],
                                canDeactivate: ['canDeactivate_team'],
                                component: TeamCmp
                            }]
                    }]);
                router.navigateByUrl('/team/22');
                advance(fixture);
                router.navigateByUrl('/team/33');
                advance(fixture);
                matchers_1.expect(logger.logs).toEqual([
                    'canActivateChild_parent', 'canActivate_team',
                    'canDeactivate_team', 'canActivateChild_parent', 'canActivate_team'
                ]);
            })));
            it('should call deactivate guards from bottom to top', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, Logger], function (router, location, logger) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: '',
                        children: [{
                                path: 'team/:id',
                                canDeactivate: ['canDeactivate_team'],
                                children: [{ path: '', component: SimpleCmp, canDeactivate: ['canDeactivate_simple'] }],
                                component: TeamCmp
                            }]
                    }]);
                router.navigateByUrl('/team/22');
                advance(fixture);
                router.navigateByUrl('/team/33');
                advance(fixture);
                matchers_1.expect(logger.logs).toEqual(['canDeactivate_simple', 'canDeactivate_team']);
            })));
        });
    });
    describe('routerActiveLink', function () {
        it('should set the class when the link is active (a tag)', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link;exact=true');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link;exact=true');
            var nativeLink = fixture.nativeElement.querySelector('a');
            var nativeButton = fixture.nativeElement.querySelector('button');
            matchers_1.expect(nativeLink.className).toEqual('active');
            matchers_1.expect(nativeButton.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(nativeLink.className).toEqual('');
            matchers_1.expect(nativeButton.className).toEqual('');
        })));
        it('should not set the class until the first navigation succeeds', testing_1.fakeAsync(function () {
            var RootCmpWithLink = (function () {
                function RootCmpWithLink() {
                }
                return RootCmpWithLink;
            }());
            RootCmpWithLink = __decorate([
                core_1.Component({
                    template: '<router-outlet></router-outlet><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" ></a>'
                })
            ], RootCmpWithLink);
            testing_1.TestBed.configureTestingModule({ declarations: [RootCmpWithLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            var loc = testing_1.TestBed.get(common_1.Location);
            var f = testing_1.TestBed.createComponent(RootCmpWithLink);
            advance(f);
            var link = f.nativeElement.querySelector('a');
            matchers_1.expect(link.className).toEqual('');
            router.initialNavigation();
            advance(f);
            matchers_1.expect(link.className).toEqual('active');
        }));
        it('should set the class on a parent element when the link is active', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkWithParentCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link;exact=true');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link;exact=true');
            var native = fixture.nativeElement.querySelector('#link-parent');
            matchers_1.expect(native.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(native.className).toEqual('');
        })));
        it('should set the class when the link is active', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{
                    path: 'team/:id',
                    component: TeamCmp,
                    children: [{
                            path: 'link',
                            component: DummyLinkCmp,
                            children: [{ path: 'simple', component: SimpleCmp }, { path: '', component: BlankCmp }]
                        }]
                }]);
            router.navigateByUrl('/team/22/link');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link');
            var native = fixture.nativeElement.querySelector('a');
            matchers_1.expect(native.className).toEqual('active');
            router.navigateByUrl('/team/22/link/simple');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/team/22/link/simple');
            matchers_1.expect(native.className).toEqual('active');
        })));
        it('should expose an isActive property', testing_1.fakeAsync(function () {
            var ComponentWithRouterLink = (function () {
                function ComponentWithRouterLink() {
                }
                return ComponentWithRouterLink;
            }());
            ComponentWithRouterLink = __decorate([
                core_1.Component({
                    template: "<a routerLink=\"/team\" routerLinkActive #rla=\"routerLinkActive\"></a>\n              <p>{{rla.isActive}}</p>\n              <span *ngIf=\"rla.isActive\"></span>\n              <span [ngClass]=\"{'highlight': rla.isActive}\"></span>\n              <router-outlet></router-outlet>"
                })
            ], ComponentWithRouterLink);
            testing_1.TestBed.configureTestingModule({ declarations: [ComponentWithRouterLink] });
            var router = testing_1.TestBed.get(router_1.Router);
            router.resetConfig([
                {
                    path: 'team',
                    component: TeamCmp,
                },
                {
                    path: 'otherteam',
                    component: TeamCmp,
                }
            ]);
            var fixture = testing_1.TestBed.createComponent(ComponentWithRouterLink);
            router.navigateByUrl('/team');
            matchers_1.expect(function () { return advance(fixture); }).not.toThrow();
            advance(fixture);
            var paragraph = fixture.nativeElement.querySelector('p');
            matchers_1.expect(paragraph.textContent).toEqual('true');
            router.navigateByUrl('/otherteam');
            advance(fixture);
            advance(fixture);
            matchers_1.expect(paragraph.textContent).toEqual('false');
        }));
    });
    describe('lazy loading', function () {
        it('works', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = (function () {
                function ParentLazyLoadedComponent() {
                }
                return ParentLazyLoadedComponent;
            }());
            ParentLazyLoadedComponent = __decorate([
                core_1.Component({
                    selector: 'lazy',
                    template: 'lazy-loaded-parent [<router-outlet></router-outlet>]'
                })
            ], ParentLazyLoadedComponent);
            var ChildLazyLoadedComponent = (function () {
                function ChildLazyLoadedComponent() {
                }
                return ChildLazyLoadedComponent;
            }());
            ChildLazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
            ], ChildLazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{
                                path: 'loaded',
                                component: ParentLazyLoadedComponent,
                                children: [{ path: 'child', component: ChildLazyLoadedComponent }]
                            }])]
                })
            ], LoadedModule);
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded/child');
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded-parent [lazy-loaded-child]');
        })));
        it('should have 2 injector trees: module and element', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var Parent = (function () {
                function Parent() {
                }
                return Parent;
            }());
            Parent = __decorate([
                core_1.Component({
                    selector: 'lazy',
                    template: 'parent[<router-outlet></router-outlet>]',
                    viewProviders: [
                        { provide: 'shadow', useValue: 'from parent component' },
                    ],
                })
            ], Parent);
            var Child = (function () {
                function Child() {
                }
                return Child;
            }());
            Child = __decorate([
                core_1.Component({ selector: 'lazy', template: 'child' })
            ], Child);
            var ParentModule = (function () {
                function ParentModule() {
                }
                return ParentModule;
            }());
            ParentModule = __decorate([
                core_1.NgModule({
                    declarations: [Parent],
                    imports: [router_1.RouterModule.forChild([{
                                path: 'parent',
                                component: Parent,
                                children: [
                                    { path: 'child', loadChildren: 'child' },
                                ]
                            }])],
                    providers: [
                        { provide: 'moduleName', useValue: 'parent' },
                        { provide: 'fromParent', useValue: 'from parent' },
                    ],
                })
            ], ParentModule);
            var ChildModule = (function () {
                function ChildModule() {
                }
                return ChildModule;
            }());
            ChildModule = __decorate([
                core_1.NgModule({
                    declarations: [Child],
                    imports: [router_1.RouterModule.forChild([{ path: '', component: Child }])],
                    providers: [
                        { provide: 'moduleName', useValue: 'child' },
                        { provide: 'fromChild', useValue: 'from child' },
                        { provide: 'shadow', useValue: 'from child module' },
                    ],
                })
            ], ChildModule);
            loader.stubbedModules = {
                parent: ParentModule,
                child: ChildModule,
            };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'parent' }]);
            router.navigateByUrl('/lazy/parent/child');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/parent/child');
            matchers_1.expect(fixture.nativeElement).toHaveText('parent[child]');
            var pInj = fixture.debugElement.query(by_1.By.directive(Parent)).injector;
            var cInj = fixture.debugElement.query(by_1.By.directive(Child)).injector;
            matchers_1.expect(pInj.get('moduleName')).toEqual('parent');
            matchers_1.expect(pInj.get('fromParent')).toEqual('from parent');
            matchers_1.expect(pInj.get(Parent)).toBeAnInstanceOf(Parent);
            matchers_1.expect(pInj.get('fromChild', null)).toEqual(null);
            matchers_1.expect(pInj.get(Child, null)).toEqual(null);
            matchers_1.expect(cInj.get('moduleName')).toEqual('child');
            matchers_1.expect(cInj.get('fromParent')).toEqual('from parent');
            matchers_1.expect(cInj.get('fromChild')).toEqual('from child');
            matchers_1.expect(cInj.get(Parent)).toBeAnInstanceOf(Parent);
            matchers_1.expect(cInj.get(Child)).toBeAnInstanceOf(Child);
            // The child module can not shadow the parent component
            matchers_1.expect(cInj.get('shadow')).toEqual('from parent component');
            var pmInj = pInj.get(core_1.NgModuleRef).injector;
            var cmInj = cInj.get(core_1.NgModuleRef).injector;
            matchers_1.expect(pmInj.get('moduleName')).toEqual('parent');
            matchers_1.expect(cmInj.get('moduleName')).toEqual('child');
            matchers_1.expect(pmInj.get(Parent, '-')).toEqual('-');
            matchers_1.expect(cmInj.get(Parent, '-')).toEqual('-');
            matchers_1.expect(pmInj.get(Child, '-')).toEqual('-');
            matchers_1.expect(cmInj.get(Child, '-')).toEqual('-');
        })));
        // https://github.com/angular/angular/issues/12889
        it('should create a single instance of lazy-loaded modules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = (function () {
                function ParentLazyLoadedComponent() {
                }
                return ParentLazyLoadedComponent;
            }());
            ParentLazyLoadedComponent = __decorate([
                core_1.Component({
                    selector: 'lazy',
                    template: 'lazy-loaded-parent [<router-outlet></router-outlet>]'
                })
            ], ParentLazyLoadedComponent);
            var ChildLazyLoadedComponent = (function () {
                function ChildLazyLoadedComponent() {
                }
                return ChildLazyLoadedComponent;
            }());
            ChildLazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
            ], ChildLazyLoadedComponent);
            var LoadedModule = LoadedModule_1 = (function () {
                function LoadedModule() {
                    LoadedModule_1.instances++;
                }
                return LoadedModule;
            }());
            LoadedModule.instances = 0;
            LoadedModule = LoadedModule_1 = __decorate([
                core_1.NgModule({
                    declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{
                                path: 'loaded',
                                component: ParentLazyLoadedComponent,
                                children: [{ path: 'child', component: ChildLazyLoadedComponent }]
                            }])]
                }),
                __metadata("design:paramtypes", [])
            ], LoadedModule);
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded-parent [lazy-loaded-child]');
            matchers_1.expect(LoadedModule.instances).toEqual(1);
            var LoadedModule_1;
        })));
        // https://github.com/angular/angular/issues/13870
        it('should create a single instance of guards for lazy-loaded modules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var Service = (function () {
                function Service() {
                }
                return Service;
            }());
            Service = __decorate([
                core_1.Injectable()
            ], Service);
            var Resolver = (function () {
                function Resolver(service) {
                    this.service = service;
                }
                Resolver.prototype.resolve = function (route, state) {
                    return this.service;
                };
                return Resolver;
            }());
            Resolver = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [Service])
            ], Resolver);
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent(injectedService, route) {
                    this.injectedService = injectedService;
                    this.resolvedService = route.snapshot.data['service'];
                }
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy' }),
                __metadata("design:paramtypes", [Service, router_1.ActivatedRoute])
            ], LazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    providers: [Service, Resolver],
                    imports: [
                        router_1.RouterModule.forChild([{
                                path: 'loaded',
                                component: LazyLoadedComponent,
                                resolve: { 'service': Resolver },
                            }]),
                    ]
                })
            ], LoadedModule);
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy');
            var lzc = fixture.debugElement.query(by_1.By.directive(LazyLoadedComponent)).componentInstance;
            matchers_1.expect(lzc.injectedService).toBe(lzc.resolvedService);
        })));
        it('should emit RouteConfigLoadStart and RouteConfigLoadEnd event when route is lazy loaded', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var ParentLazyLoadedComponent = (function () {
                function ParentLazyLoadedComponent() {
                }
                return ParentLazyLoadedComponent;
            }());
            ParentLazyLoadedComponent = __decorate([
                core_1.Component({
                    selector: 'lazy',
                    template: 'lazy-loaded-parent [<router-outlet></router-outlet>]',
                })
            ], ParentLazyLoadedComponent);
            var ChildLazyLoadedComponent = (function () {
                function ChildLazyLoadedComponent() {
                }
                return ChildLazyLoadedComponent;
            }());
            ChildLazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded-child' })
            ], ChildLazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{
                                path: 'loaded',
                                component: ParentLazyLoadedComponent,
                                children: [{ path: 'child', component: ChildLazyLoadedComponent }],
                            }])]
                })
            ], LoadedModule);
            var events = [];
            router.events.subscribe(function (e) {
                if (e instanceof router_1.RouteConfigLoadStart || e instanceof router_1.RouteConfigLoadEnd) {
                    events.push(e);
                }
            });
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            router.navigateByUrl('/lazy/loaded/child');
            advance(fixture);
            matchers_1.expect(events.length).toEqual(2);
            matchers_1.expect(events[0].toString()).toEqual('RouteConfigLoadStart(path: lazy)');
            matchers_1.expect(events[1].toString()).toEqual('RouteConfigLoadEnd(path: lazy)');
        })));
        it('throws an error when forRoot() is used in a lazy context', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent() {
                }
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'should not show' })
            ], LazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    imports: [router_1.RouterModule.forRoot([{ path: 'loaded', component: LazyLoadedComponent }])]
                })
            ], LoadedModule);
            loader.stubbedModules = { expected: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'expected' }]);
            var recordedError = null;
            router.navigateByUrl('/lazy/loaded').catch(function (err) { return recordedError = err; });
            advance(fixture);
            matchers_1.expect(recordedError.message)
                .toEqual("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
        })));
        it('should combine routes from multiple modules into a single configuration', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyComponent2 = (function () {
                function LazyComponent2() {
                }
                return LazyComponent2;
            }());
            LazyComponent2 = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded-2' })
            ], LazyComponent2);
            var SiblingOfLoadedModule = (function () {
                function SiblingOfLoadedModule() {
                }
                return SiblingOfLoadedModule;
            }());
            SiblingOfLoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyComponent2],
                    imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyComponent2 }])]
                })
            ], SiblingOfLoadedModule);
            var LazyComponent1 = (function () {
                function LazyComponent1() {
                }
                return LazyComponent1;
            }());
            LazyComponent1 = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded-1' })
            ], LazyComponent1);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyComponent1],
                    imports: [
                        router_1.RouterModule.forChild([{ path: 'loaded', component: LazyComponent1 }]),
                        SiblingOfLoadedModule
                    ]
                })
            ], LoadedModule);
            loader.stubbedModules = { expected1: LoadedModule, expected2: SiblingOfLoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([
                { path: 'lazy1', loadChildren: 'expected1' },
                { path: 'lazy2', loadChildren: 'expected2' }
            ]);
            router.navigateByUrl('/lazy1/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy1/loaded');
            router.navigateByUrl('/lazy2/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy2/loaded');
        })));
        describe('should use the injector of the lazily-loaded configuration', function () {
            var LazyLoadedServiceDefinedInModule = (function () {
                function LazyLoadedServiceDefinedInModule() {
                }
                return LazyLoadedServiceDefinedInModule;
            }());
            var EagerParentComponent = (function () {
                function EagerParentComponent() {
                }
                return EagerParentComponent;
            }());
            EagerParentComponent = __decorate([
                core_1.Component({
                    selector: 'eager-parent',
                    template: 'eager-parent <router-outlet></router-outlet>',
                })
            ], EagerParentComponent);
            var LazyParentComponent = (function () {
                function LazyParentComponent() {
                }
                return LazyParentComponent;
            }());
            LazyParentComponent = __decorate([
                core_1.Component({
                    selector: 'lazy-parent',
                    template: 'lazy-parent <router-outlet></router-outlet>',
                })
            ], LazyParentComponent);
            var LazyChildComponent = (function () {
                function LazyChildComponent(lazy, // should be able to inject lazy/direct parent
                    lazyService, // should be able to inject lazy service
                    eager // should use the injector of the location to create a parent
                ) {
                }
                return LazyChildComponent;
            }());
            LazyChildComponent = __decorate([
                core_1.Component({
                    selector: 'lazy-child',
                    template: 'lazy-child',
                }),
                __metadata("design:paramtypes", [LazyParentComponent,
                    LazyLoadedServiceDefinedInModule,
                    EagerParentComponent // should use the injector of the location to create a parent
                ])
            ], LazyChildComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyParentComponent, LazyChildComponent],
                    imports: [router_1.RouterModule.forChild([{
                                path: '',
                                children: [{
                                        path: 'lazy-parent',
                                        component: LazyParentComponent,
                                        children: [{ path: 'lazy-child', component: LazyChildComponent }]
                                    }]
                            }])],
                    providers: [LazyLoadedServiceDefinedInModule]
                })
            ], LoadedModule);
            var TestModule = (function () {
                function TestModule() {
                }
                return TestModule;
            }());
            TestModule = __decorate([
                core_1.NgModule({
                    declarations: [EagerParentComponent],
                    entryComponents: [EagerParentComponent],
                    imports: [router_1.RouterModule]
                })
            ], TestModule);
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({
                    imports: [TestModule],
                });
            });
            it('should use the injector of the lazily-loaded configuration', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                loader.stubbedModules = { expected: LoadedModule };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'eager-parent',
                        component: EagerParentComponent,
                        children: [{ path: 'lazy', loadChildren: 'expected' }]
                    }]);
                router.navigateByUrl('/eager-parent/lazy/lazy-parent/lazy-child');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/eager-parent/lazy/lazy-parent/lazy-child');
                matchers_1.expect(fixture.nativeElement).toHaveText('eager-parent lazy-parent lazy-child');
            })));
        });
        it('works when given a callback', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location) {
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent() {
                }
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
            ], LazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])],
                })
            ], LoadedModule);
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: function () { return LoadedModule; } }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded');
            matchers_1.expect(fixture.nativeElement).toHaveText('lazy-loaded');
        })));
        it('error emit an error when cannot load a config', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            loader.stubbedModules = {};
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'invalid' }]);
            var recordedEvents = [];
            router.events.forEach(function (e) { return recordedEvents.push(e); });
            router.navigateByUrl('/lazy/loaded').catch(function (s) { });
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/');
            expectEvents(recordedEvents, [
                [router_1.NavigationStart, '/lazy/loaded'],
                [router_1.RouteConfigLoadStart],
                [router_1.NavigationError, '/lazy/loaded'],
            ]);
        })));
        it('should work with complex redirect rules', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent() {
                }
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
            ], LazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{ path: 'loaded', component: LazyLoadedComponent }])],
                })
            ], LoadedModule);
            loader.stubbedModules = { lazy: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: 'lazy', loadChildren: 'lazy' }, { path: '**', redirectTo: 'lazy' }]);
            router.navigateByUrl('/lazy/loaded');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy/loaded');
        })));
        it('should work with wildcard route', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
            var LazyLoadedComponent = (function () {
                function LazyLoadedComponent() {
                }
                return LazyLoadedComponent;
            }());
            LazyLoadedComponent = __decorate([
                core_1.Component({ selector: 'lazy', template: 'lazy-loaded' })
            ], LazyLoadedComponent);
            var LoadedModule = (function () {
                function LoadedModule() {
                }
                return LoadedModule;
            }());
            LoadedModule = __decorate([
                core_1.NgModule({
                    declarations: [LazyLoadedComponent],
                    imports: [router_1.RouterModule.forChild([{ path: '', component: LazyLoadedComponent }])],
                })
            ], LoadedModule);
            loader.stubbedModules = { lazy: LoadedModule };
            var fixture = createRoot(router, RootCmp);
            router.resetConfig([{ path: '**', loadChildren: 'lazy' }]);
            router.navigateByUrl('/lazy');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/lazy');
        })));
        describe('preloading', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ providers: [{ provide: router_1.PreloadingStrategy, useExisting: router_1.PreloadAllModules }] });
                var preloader = testing_1.TestBed.get(router_1.RouterPreloader);
                preloader.setUpPreloading();
            });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location, core_1.NgModuleFactoryLoader], function (router, location, loader) {
                var LazyLoadedComponent = (function () {
                    function LazyLoadedComponent() {
                    }
                    return LazyLoadedComponent;
                }());
                LazyLoadedComponent = __decorate([
                    core_1.Component({ selector: 'lazy', template: 'should not show' })
                ], LazyLoadedComponent);
                var LoadedModule2 = (function () {
                    function LoadedModule2() {
                    }
                    return LoadedModule2;
                }());
                LoadedModule2 = __decorate([
                    core_1.NgModule({
                        declarations: [LazyLoadedComponent],
                        imports: [router_1.RouterModule.forChild([{ path: 'LoadedModule2', component: LazyLoadedComponent }])]
                    })
                ], LoadedModule2);
                var LoadedModule1 = (function () {
                    function LoadedModule1() {
                    }
                    return LoadedModule1;
                }());
                LoadedModule1 = __decorate([
                    core_1.NgModule({
                        imports: [router_1.RouterModule.forChild([{ path: 'LoadedModule1', loadChildren: 'expected2' }])]
                    })
                ], LoadedModule1);
                loader.stubbedModules = { expected: LoadedModule1, expected2: LoadedModule2 };
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([
                    { path: 'blank', component: BlankCmp }, { path: 'lazy', loadChildren: 'expected' }
                ]);
                router.navigateByUrl('/blank');
                advance(fixture);
                var config = router.config;
                var firstConfig = config[1]._loadedConfig;
                matchers_1.expect(firstConfig).toBeDefined();
                matchers_1.expect(firstConfig.routes[0].path).toEqual('LoadedModule1');
                var secondConfig = firstConfig.routes[0]._loadedConfig;
                matchers_1.expect(secondConfig).toBeDefined();
                matchers_1.expect(secondConfig.routes[0].path).toEqual('LoadedModule2');
            })));
        });
        describe('custom url handling strategies', function () {
            var CustomUrlHandlingStrategy = (function () {
                function CustomUrlHandlingStrategy() {
                }
                CustomUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) {
                    return url.toString().startsWith('/include') || url.toString() === '/';
                };
                CustomUrlHandlingStrategy.prototype.extract = function (url) {
                    var oldRoot = url.root;
                    var children = {};
                    if (oldRoot.children[router_1.PRIMARY_OUTLET]) {
                        children[router_1.PRIMARY_OUTLET] = oldRoot.children[router_1.PRIMARY_OUTLET];
                    }
                    var root = new router_1.UrlSegmentGroup(oldRoot.segments, children);
                    return new router_1.UrlTree(root, url.queryParams, url.fragment);
                };
                CustomUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) {
                    var _this = this;
                    var oldRoot = newUrlPart.root;
                    var children = {};
                    if (oldRoot.children[router_1.PRIMARY_OUTLET]) {
                        children[router_1.PRIMARY_OUTLET] = oldRoot.children[router_1.PRIMARY_OUTLET];
                    }
                    collection_1.forEach(wholeUrl.root.children, function (v, k) {
                        if (k !== router_1.PRIMARY_OUTLET) {
                            children[k] = v;
                        }
                        v.parent = _this;
                    });
                    var root = new router_1.UrlSegmentGroup(oldRoot.segments, children);
                    return new router_1.UrlTree(root, newUrlPart.queryParams, newUrlPart.fragment);
                };
                return CustomUrlHandlingStrategy;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ providers: [{ provide: router_1.UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }] });
            });
            it('should work', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'include',
                        component: TeamCmp,
                        children: [
                            { path: 'user/:name', component: UserCmp }, { path: 'simple', component: SimpleCmp }
                        ]
                    }]);
                var events = [];
                router.events.subscribe(function (e) { return e instanceof router_1.RouteEvent || events.push(e); });
                // supported URL
                router.navigateByUrl('/include/user/kate');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/user/kate');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/user/kate'], [router_1.RoutesRecognized, '/include/user/kate'],
                    [router_1.GuardsCheckStart, '/include/user/kate'], [router_1.GuardsCheckEnd, '/include/user/kate'],
                    [router_1.ResolveStart, '/include/user/kate'], [router_1.ResolveEnd, '/include/user/kate'],
                    [router_1.NavigationEnd, '/include/user/kate']
                ]);
                matchers_1.expect(fixture.nativeElement).toHaveText('team  [ user kate, right:  ]');
                events.splice(0);
                // unsupported URL
                router.navigateByUrl('/exclude/one');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/exclude/one');
                matchers_1.expect(Object.keys(router.routerState.root.children).length).toEqual(0);
                matchers_1.expect(fixture.nativeElement).toHaveText('');
                expectEvents(events, [
                    [router_1.NavigationStart, '/exclude/one'], [router_1.GuardsCheckStart, '/exclude/one'],
                    [router_1.GuardsCheckEnd, '/exclude/one'], [router_1.NavigationEnd, '/exclude/one']
                ]);
                events.splice(0);
                // another unsupported URL
                location.go('/exclude/two');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/exclude/two');
                expectEvents(events, []);
                // back to a supported URL
                location.go('/include/simple');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/simple');
                matchers_1.expect(fixture.nativeElement).toHaveText('team  [ simple, right:  ]');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/simple'], [router_1.RoutesRecognized, '/include/simple'],
                    [router_1.GuardsCheckStart, '/include/simple'], [router_1.GuardsCheckEnd, '/include/simple'],
                    [router_1.ResolveStart, '/include/simple'], [router_1.ResolveEnd, '/include/simple'],
                    [router_1.NavigationEnd, '/include/simple']
                ]);
            })));
            it('should handle the case when the router takes only the primary url', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
                var fixture = createRoot(router, RootCmp);
                router.resetConfig([{
                        path: 'include',
                        component: TeamCmp,
                        children: [
                            { path: 'user/:name', component: UserCmp }, { path: 'simple', component: SimpleCmp }
                        ]
                    }]);
                var events = [];
                router.events.subscribe(function (e) { return e instanceof router_1.RouteEvent || events.push(e); });
                location.go('/include/user/kate(aux:excluded)');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/user/kate(aux:excluded)');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/user/kate'], [router_1.RoutesRecognized, '/include/user/kate'],
                    [router_1.GuardsCheckStart, '/include/user/kate'], [router_1.GuardsCheckEnd, '/include/user/kate'],
                    [router_1.ResolveStart, '/include/user/kate'], [router_1.ResolveEnd, '/include/user/kate'],
                    [router_1.NavigationEnd, '/include/user/kate']
                ]);
                events.splice(0);
                location.go('/include/user/kate(aux:excluded2)');
                advance(fixture);
                expectEvents(events, []);
                router.navigateByUrl('/include/simple');
                advance(fixture);
                matchers_1.expect(location.path()).toEqual('/include/simple(aux:excluded2)');
                expectEvents(events, [
                    [router_1.NavigationStart, '/include/simple'], [router_1.RoutesRecognized, '/include/simple'],
                    [router_1.GuardsCheckStart, '/include/simple'], [router_1.GuardsCheckEnd, '/include/simple'],
                    [router_1.ResolveStart, '/include/simple'], [router_1.ResolveEnd, '/include/simple'],
                    [router_1.NavigationEnd, '/include/simple']
                ]);
            })));
        });
    });
    describe('Custom Route Reuse Strategy', function () {
        var AttachDetachReuseStrategy = (function () {
            function AttachDetachReuseStrategy() {
                this.stored = {};
            }
            AttachDetachReuseStrategy.prototype.shouldDetach = function (route) {
                return route.routeConfig.path === 'a';
            };
            AttachDetachReuseStrategy.prototype.store = function (route, detachedTree) {
                this.stored[route.routeConfig.path] = detachedTree;
            };
            AttachDetachReuseStrategy.prototype.shouldAttach = function (route) {
                return !!this.stored[route.routeConfig.path];
            };
            AttachDetachReuseStrategy.prototype.retrieve = function (route) {
                return this.stored[route.routeConfig.path];
            };
            AttachDetachReuseStrategy.prototype.shouldReuseRoute = function (future, curr) {
                return future.routeConfig === curr.routeConfig;
            };
            return AttachDetachReuseStrategy;
        }());
        var ShortLifecycle = (function () {
            function ShortLifecycle() {
            }
            ShortLifecycle.prototype.shouldDetach = function (route) { return false; };
            ShortLifecycle.prototype.store = function (route, detachedTree) { };
            ShortLifecycle.prototype.shouldAttach = function (route) { return false; };
            ShortLifecycle.prototype.retrieve = function (route) { return null; };
            ShortLifecycle.prototype.shouldReuseRoute = function (future, curr) {
                if (future.routeConfig !== curr.routeConfig) {
                    return false;
                }
                if (Object.keys(future.params).length !== Object.keys(curr.params).length) {
                    return false;
                }
                return Object.keys(future.params).every(function (k) { return future.params[k] === curr.params[k]; });
            };
            return ShortLifecycle;
        }());
        it('should support attaching & detaching fragments', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.routeReuseStrategy = new AttachDetachReuseStrategy();
            router.resetConfig([
                {
                    path: 'a',
                    component: TeamCmp,
                    children: [{ path: 'b', component: SimpleCmp }],
                },
                { path: 'c', component: UserCmp },
            ]);
            router.navigateByUrl('/a/b');
            advance(fixture);
            var teamCmp = fixture.debugElement.children[1].componentInstance;
            var simpleCmp = fixture.debugElement.children[1].children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a/b');
            matchers_1.expect(teamCmp).toBeDefined();
            matchers_1.expect(simpleCmp).toBeDefined();
            router.navigateByUrl('/c');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/c');
            matchers_1.expect(fixture.debugElement.children[1].componentInstance).toBeAnInstanceOf(UserCmp);
            router.navigateByUrl('/a;p=1/b;p=2');
            advance(fixture);
            var teamCmp2 = fixture.debugElement.children[1].componentInstance;
            var simpleCmp2 = fixture.debugElement.children[1].children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a;p=1/b;p=2');
            matchers_1.expect(teamCmp2).toBe(teamCmp);
            matchers_1.expect(simpleCmp2).toBe(simpleCmp);
            matchers_1.expect(teamCmp.route).toBe(router.routerState.root.firstChild);
            matchers_1.expect(teamCmp.route.snapshot).toBe(router.routerState.snapshot.root.firstChild);
            matchers_1.expect(teamCmp.route.snapshot.params).toEqual({ p: '1' });
            matchers_1.expect(teamCmp.route.firstChild.snapshot.params).toEqual({ p: '2' });
        })));
        it('should support shorter lifecycles', testing_1.fakeAsync(testing_1.inject([router_1.Router, common_1.Location], function (router, location) {
            var fixture = createRoot(router, RootCmp);
            router.routeReuseStrategy = new ShortLifecycle();
            router.resetConfig([{ path: 'a', component: SimpleCmp }]);
            router.navigateByUrl('/a');
            advance(fixture);
            var simpleCmp1 = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(location.path()).toEqual('/a');
            router.navigateByUrl('/a;p=1');
            advance(fixture);
            matchers_1.expect(location.path()).toEqual('/a;p=1');
            var simpleCmp2 = fixture.debugElement.children[1].componentInstance;
            matchers_1.expect(simpleCmp1).not.toBe(simpleCmp2);
        })));
    });
});
function expectEvents(events, pairs) {
    matchers_1.expect(events.length).toEqual(pairs.length);
    for (var i = 0; i < events.length; ++i) {
        matchers_1.expect(events[i].constructor.name).toBe(pairs[i][0].name);
        matchers_1.expect(events[i].url).toBe(pairs[i][1]);
    }
}
var StringLinkCmp = (function () {
    function StringLinkCmp() {
    }
    return StringLinkCmp;
}());
StringLinkCmp = __decorate([
    core_1.Component({ selector: 'link-cmp', template: "<a routerLink=\"/team/33/simple\" [target]=\"'_self'\">link</a>" })
], StringLinkCmp);
var StringLinkButtonCmp = (function () {
    function StringLinkButtonCmp() {
    }
    return StringLinkButtonCmp;
}());
StringLinkButtonCmp = __decorate([
    core_1.Component({ selector: 'link-cmp', template: "<button routerLink=\"/team/33/simple\">link</button>" })
], StringLinkButtonCmp);
var AbsoluteLinkCmp = (function () {
    function AbsoluteLinkCmp() {
    }
    return AbsoluteLinkCmp;
}());
AbsoluteLinkCmp = __decorate([
    core_1.Component({
        selector: 'link-cmp',
        template: "<router-outlet></router-outlet><a [routerLink]=\"['/team/33/simple']\">link</a>"
    })
], AbsoluteLinkCmp);
var DummyLinkCmp = (function () {
    function DummyLinkCmp(route) {
        this.exact = route.snapshot.paramMap.get('exact') === 'true';
    }
    return DummyLinkCmp;
}());
DummyLinkCmp = __decorate([
    core_1.Component({
        selector: 'link-cmp',
        template: "<router-outlet></router-outlet><a routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\" [routerLink]=\"['./']\">link</a>\n<button routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\" [routerLink]=\"['./']\">button</button>\n"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], DummyLinkCmp);
var RelativeLinkCmp = (function () {
    function RelativeLinkCmp() {
    }
    return RelativeLinkCmp;
}());
RelativeLinkCmp = __decorate([
    core_1.Component({ selector: 'link-cmp', template: "<a [routerLink]=\"['../simple']\">link</a>" })
], RelativeLinkCmp);
var LinkWithQueryParamsAndFragment = (function () {
    function LinkWithQueryParamsAndFragment() {
    }
    return LinkWithQueryParamsAndFragment;
}());
LinkWithQueryParamsAndFragment = __decorate([
    core_1.Component({
        selector: 'link-cmp',
        template: "<a [routerLink]=\"['../simple']\" [queryParams]=\"{q: '1'}\" fragment=\"f\">link</a>"
    })
], LinkWithQueryParamsAndFragment);
var SimpleCmp = (function () {
    function SimpleCmp() {
    }
    return SimpleCmp;
}());
SimpleCmp = __decorate([
    core_1.Component({ selector: 'simple-cmp', template: "simple" })
], SimpleCmp);
var CollectParamsCmp = (function () {
    function CollectParamsCmp(route) {
        var _this = this;
        this.route = route;
        this.params = [];
        this.urls = [];
        route.params.forEach(function (p) { return _this.params.push(p); });
        route.url.forEach(function (u) { return _this.urls.push(u); });
    }
    CollectParamsCmp.prototype.recordedUrls = function () {
        return this.urls.map(function (a) { return a.map(function (p) { return p.path; }).join('/'); });
    };
    return CollectParamsCmp;
}());
CollectParamsCmp = __decorate([
    core_1.Component({ selector: 'collect-params-cmp', template: "collect-params" }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], CollectParamsCmp);
var BlankCmp = (function () {
    function BlankCmp() {
    }
    return BlankCmp;
}());
BlankCmp = __decorate([
    core_1.Component({ selector: 'blank-cmp', template: "" })
], BlankCmp);
var TeamCmp = (function () {
    function TeamCmp(route) {
        var _this = this;
        this.route = route;
        this.recordedParams = [];
        this.snapshotParams = [];
        this.routerLink = ['.'];
        this.id = map_1.map.call(route.params, function (p) { return p['id']; });
        route.params.forEach(function (p) {
            _this.recordedParams.push(p);
            _this.snapshotParams.push(route.snapshot.params);
        });
    }
    return TeamCmp;
}());
TeamCmp = __decorate([
    core_1.Component({
        selector: 'team-cmp',
        template: "team {{id | async}} " +
            "[ <router-outlet></router-outlet>, right: <router-outlet name=\"right\"></router-outlet> ]" +
            "<a [routerLink]=\"routerLink\" skipLocationChange></a>" +
            "<button [routerLink]=\"routerLink\" skipLocationChange></button>"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], TeamCmp);
var TwoOutletsCmp = (function () {
    function TwoOutletsCmp() {
    }
    return TwoOutletsCmp;
}());
TwoOutletsCmp = __decorate([
    core_1.Component({
        selector: 'two-outlets-cmp',
        template: "[ <router-outlet></router-outlet>, aux: <router-outlet name=\"aux\"></router-outlet> ]"
    })
], TwoOutletsCmp);
var UserCmp = (function () {
    function UserCmp(route) {
        var _this = this;
        this.recordedParams = [];
        this.snapshotParams = [];
        this.name = map_1.map.call(route.params, function (p) { return p['name']; });
        route.params.forEach(function (p) {
            _this.recordedParams.push(p);
            _this.snapshotParams.push(route.snapshot.params);
        });
    }
    return UserCmp;
}());
UserCmp = __decorate([
    core_1.Component({ selector: 'user-cmp', template: "user {{name | async}}" }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], UserCmp);
var WrapperCmp = (function () {
    function WrapperCmp() {
    }
    return WrapperCmp;
}());
WrapperCmp = __decorate([
    core_1.Component({ selector: 'wrapper', template: "<router-outlet></router-outlet>" })
], WrapperCmp);
var QueryParamsAndFragmentCmp = (function () {
    function QueryParamsAndFragmentCmp(route) {
        this.name = map_1.map.call(route.queryParamMap, function (p) { return p.get('name'); });
        this.fragment = route.fragment;
    }
    return QueryParamsAndFragmentCmp;
}());
QueryParamsAndFragmentCmp = __decorate([
    core_1.Component({ selector: 'query-cmp', template: "query: {{name | async}} fragment: {{fragment | async}}" }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], QueryParamsAndFragmentCmp);
var EmptyQueryParamsCmp = (function () {
    function EmptyQueryParamsCmp(route) {
        var _this = this;
        this.recordedParams = [];
        route.queryParams.forEach(function (_) { return _this.recordedParams.push(_); });
    }
    return EmptyQueryParamsCmp;
}());
EmptyQueryParamsCmp = __decorate([
    core_1.Component({ selector: 'empty-query-cmp', template: "" }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], EmptyQueryParamsCmp);
var RouteCmp = (function () {
    function RouteCmp(route) {
        this.route = route;
    }
    return RouteCmp;
}());
RouteCmp = __decorate([
    core_1.Component({ selector: 'route-cmp', template: "route" }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], RouteCmp);
var RelativeLinkInIfCmp = (function () {
    function RelativeLinkInIfCmp() {
        this.show = false;
    }
    return RelativeLinkInIfCmp;
}());
RelativeLinkInIfCmp = __decorate([
    core_1.Component({
        selector: 'link-cmp',
        template: "<div *ngIf=\"show\"><a [routerLink]=\"['./simple']\">link</a></div> <router-outlet></router-outlet>"
    })
], RelativeLinkInIfCmp);
var OutletInNgIf = (function () {
    function OutletInNgIf() {
        this.alwaysTrue = true;
    }
    return OutletInNgIf;
}());
OutletInNgIf = __decorate([
    core_1.Component({ selector: 'child', template: '<div *ngIf="alwaysTrue"><router-outlet></router-outlet></div>' })
], OutletInNgIf);
var DummyLinkWithParentCmp = (function () {
    function DummyLinkWithParentCmp(route) {
        this.exact = route.snapshot.params.exact === 'true';
    }
    return DummyLinkWithParentCmp;
}());
DummyLinkWithParentCmp = __decorate([
    core_1.Component({
        selector: 'link-cmp',
        template: "<router-outlet></router-outlet>\n             <div id=\"link-parent\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: exact}\">\n               <div ngClass=\"{one: 'true'}\"><a [routerLink]=\"['./']\">link</a></div>\n             </div>"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], DummyLinkWithParentCmp);
var ComponentRecordingRoutePathAndUrl = (function () {
    function ComponentRecordingRoutePathAndUrl(router, route) {
        this.path = router.routerState.pathFromRoot(route);
        this.url = router.url.toString();
    }
    return ComponentRecordingRoutePathAndUrl;
}());
ComponentRecordingRoutePathAndUrl = __decorate([
    core_1.Component({ selector: 'cmp', template: '' }),
    __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute])
], ComponentRecordingRoutePathAndUrl);
var RootCmp = (function () {
    function RootCmp() {
    }
    return RootCmp;
}());
RootCmp = __decorate([
    core_1.Component({ selector: 'root-cmp', template: "<router-outlet></router-outlet>" })
], RootCmp);
var RootCmpWithOnInit = (function () {
    function RootCmpWithOnInit(router) {
        this.router = router;
    }
    RootCmpWithOnInit.prototype.ngOnInit = function () { this.router.navigate(['one']); };
    return RootCmpWithOnInit;
}());
RootCmpWithOnInit = __decorate([
    core_1.Component({ selector: 'root-cmp-on-init', template: "<router-outlet></router-outlet>" }),
    __metadata("design:paramtypes", [router_1.Router])
], RootCmpWithOnInit);
var RootCmpWithTwoOutlets = (function () {
    function RootCmpWithTwoOutlets() {
    }
    return RootCmpWithTwoOutlets;
}());
RootCmpWithTwoOutlets = __decorate([
    core_1.Component({
        selector: 'root-cmp',
        template: "primary [<router-outlet></router-outlet>] right [<router-outlet name=\"right\"></router-outlet>]"
    })
], RootCmpWithTwoOutlets);
function advance(fixture) {
    testing_1.tick();
    fixture.detectChanges();
}
function createRoot(router, type) {
    var f = testing_1.TestBed.createComponent(type);
    advance(f);
    router.initialNavigation();
    advance(f);
    return f;
}
var TestModule = (function () {
    function TestModule() {
    }
    return TestModule;
}());
TestModule = __decorate([
    core_1.NgModule({
        imports: [testing_2.RouterTestingModule, common_1.CommonModule],
        entryComponents: [
            BlankCmp,
            SimpleCmp,
            TwoOutletsCmp,
            TeamCmp,
            UserCmp,
            StringLinkCmp,
            DummyLinkCmp,
            AbsoluteLinkCmp,
            RelativeLinkCmp,
            DummyLinkWithParentCmp,
            LinkWithQueryParamsAndFragment,
            CollectParamsCmp,
            QueryParamsAndFragmentCmp,
            StringLinkButtonCmp,
            WrapperCmp,
            OutletInNgIf,
            ComponentRecordingRoutePathAndUrl,
            RouteCmp,
            RootCmp,
            RelativeLinkInIfCmp,
            RootCmpWithTwoOutlets,
            EmptyQueryParamsCmp,
        ],
        exports: [
            BlankCmp,
            SimpleCmp,
            TwoOutletsCmp,
            TeamCmp,
            UserCmp,
            StringLinkCmp,
            DummyLinkCmp,
            AbsoluteLinkCmp,
            RelativeLinkCmp,
            DummyLinkWithParentCmp,
            LinkWithQueryParamsAndFragment,
            CollectParamsCmp,
            QueryParamsAndFragmentCmp,
            StringLinkButtonCmp,
            WrapperCmp,
            OutletInNgIf,
            ComponentRecordingRoutePathAndUrl,
            RouteCmp,
            RootCmp,
            RootCmpWithOnInit,
            RelativeLinkInIfCmp,
            RootCmpWithTwoOutlets,
            EmptyQueryParamsCmp,
        ],
        declarations: [
            BlankCmp,
            SimpleCmp,
            TeamCmp,
            TwoOutletsCmp,
            UserCmp,
            StringLinkCmp,
            DummyLinkCmp,
            AbsoluteLinkCmp,
            RelativeLinkCmp,
            DummyLinkWithParentCmp,
            LinkWithQueryParamsAndFragment,
            CollectParamsCmp,
            QueryParamsAndFragmentCmp,
            StringLinkButtonCmp,
            WrapperCmp,
            OutletInNgIf,
            ComponentRecordingRoutePathAndUrl,
            RouteCmp,
            RootCmp,
            RootCmpWithOnInit,
            RelativeLinkInIfCmp,
            RootCmpWithTwoOutlets,
            EmptyQueryParamsCmp,
        ]
    })
], TestModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L2ludGVncmF0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBdUQ7QUFDdkQsc0NBQTJIO0FBQzNILGlEQUF5RjtBQUN6RixpRUFBOEQ7QUFDOUQsMkVBQXNFO0FBQ3RFLDBDQUF3bEI7QUFDeGxCLDhDQUEyQztBQUUzQyx5Q0FBdUM7QUFDdkMseUNBQXNDO0FBRXRDLHNEQUFnRDtBQUNoRCxzQ0FBeUU7QUFFekUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixVQUFVLENBQUM7UUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzdCLE9BQU8sRUFDSCxDQUFDLDZCQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztTQUMzRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFDeEMsbUJBQVMsQ0FBQyxnQkFBTSxDQUFDLENBQUMsZUFBTSxFQUFFLGlCQUFRLENBQUMsRUFBRSxVQUFDLE1BQWMsRUFBRSxRQUFrQjtRQUN0RSxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWpCLGlCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVSLEVBQUUsQ0FBQyxvQ0FBb0Ms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