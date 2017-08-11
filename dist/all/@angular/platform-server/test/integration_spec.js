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
var animations_1 = require("@angular/animations");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var testing_1 = require("@angular/common/http/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var http_2 = require("@angular/http");
var testing_3 = require("@angular/http/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var platform_server_1 = require("@angular/platform-server");
var filter_1 = require("rxjs/operator/filter");
var first_1 = require("rxjs/operator/first");
var toPromise_1 = require("rxjs/operator/toPromise");
var MyServerApp = (function () {
    function MyServerApp() {
    }
    return MyServerApp;
}());
MyServerApp = __decorate([
    core_1.Component({ selector: 'app', template: "Works!" })
], MyServerApp);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [MyServerApp],
        declarations: [MyServerApp],
        imports: [platform_server_1.ServerModule],
        providers: [
            testing_3.MockBackend,
            { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
        ]
    })
], ExampleModule);
var MyServerApp2 = (function () {
    function MyServerApp2() {
    }
    return MyServerApp2;
}());
MyServerApp2 = __decorate([
    core_1.Component({ selector: 'app', template: "Works too!" })
], MyServerApp2);
var ExampleModule2 = (function () {
    function ExampleModule2() {
    }
    return ExampleModule2;
}());
ExampleModule2 = __decorate([
    core_1.NgModule({ declarations: [MyServerApp2], imports: [platform_server_1.ServerModule], bootstrap: [MyServerApp2] })
], ExampleModule2);
var TitleApp = (function () {
    function TitleApp(title) {
        this.title = title;
    }
    TitleApp.prototype.ngOnInit = function () { this.title.setTitle('Test App Title'); };
    return TitleApp;
}());
TitleApp = __decorate([
    core_1.Component({ selector: 'app', template: "" }),
    __metadata("design:paramtypes", [platform_browser_1.Title])
], TitleApp);
var TitleAppModule = (function () {
    function TitleAppModule() {
    }
    return TitleAppModule;
}());
TitleAppModule = __decorate([
    core_1.NgModule({ declarations: [TitleApp], imports: [platform_server_1.ServerModule], bootstrap: [TitleApp] })
], TitleAppModule);
var MyAsyncServerApp = (function () {
    function MyAsyncServerApp() {
        this.text = '';
        this.h1 = '';
    }
    MyAsyncServerApp.prototype.track = function () { console.error('scroll'); };
    MyAsyncServerApp.prototype.ngOnInit = function () {
        var _this = this;
        Promise.resolve(null).then(function () { return setTimeout(function () {
            _this.text = 'Works!';
            _this.h1 = 'fine';
        }, 10); });
    };
    return MyAsyncServerApp;
}());
__decorate([
    core_1.HostListener('window:scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyAsyncServerApp.prototype, "track", null);
MyAsyncServerApp = __decorate([
    core_1.Component({ selector: 'app', template: '{{text}}<h1 [innerText]="h1"></h1>' })
], MyAsyncServerApp);
var AsyncServerModule = (function () {
    function AsyncServerModule() {
    }
    return AsyncServerModule;
}());
AsyncServerModule = __decorate([
    core_1.NgModule({
        declarations: [MyAsyncServerApp],
        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'async-server' }), platform_server_1.ServerModule],
        bootstrap: [MyAsyncServerApp]
    })
], AsyncServerModule);
var SVGComponent = (function () {
    function SVGComponent() {
    }
    return SVGComponent;
}());
SVGComponent = __decorate([
    core_1.Component({ selector: 'app', template: '<svg><use xlink:href="#clear"></use></svg>' })
], SVGComponent);
var SVGServerModule = (function () {
    function SVGServerModule() {
    }
    return SVGServerModule;
}());
SVGServerModule = __decorate([
    core_1.NgModule({
        declarations: [SVGComponent],
        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'svg-server' }), platform_server_1.ServerModule],
        bootstrap: [SVGComponent]
    })
], SVGServerModule);
var MyAnimationApp = (function () {
    function MyAnimationApp() {
        this.text = 'Works!';
    }
    return MyAnimationApp;
}());
MyAnimationApp = __decorate([
    core_1.Component({
        selector: 'app',
        template: '<div @myAnimation>{{text}}</div>',
        animations: [animations_1.trigger('myAnimation', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
    })
], MyAnimationApp);
var AnimationServerModule = (function () {
    function AnimationServerModule() {
    }
    return AnimationServerModule;
}());
AnimationServerModule = __decorate([
    core_1.NgModule({
        declarations: [MyAnimationApp],
        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'anim-server' }), platform_server_1.ServerModule],
        bootstrap: [MyAnimationApp]
    })
], AnimationServerModule);
var MyStylesApp = (function () {
    function MyStylesApp() {
    }
    return MyStylesApp;
}());
MyStylesApp = __decorate([
    core_1.Component({ selector: 'app', template: "Works!", styles: [':host { color: red; }'] })
], MyStylesApp);
var ExampleStylesModule = (function () {
    function ExampleStylesModule() {
    }
    return ExampleStylesModule;
}());
ExampleStylesModule = __decorate([
    core_1.NgModule({
        declarations: [MyStylesApp],
        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'example-styles' }), platform_server_1.ServerModule],
        bootstrap: [MyStylesApp]
    })
], ExampleStylesModule);
var HttpBeforeExampleModule = (function () {
    function HttpBeforeExampleModule() {
    }
    return HttpBeforeExampleModule;
}());
HttpBeforeExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [MyServerApp],
        declarations: [MyServerApp],
        imports: [http_2.HttpModule, platform_server_1.ServerModule],
        providers: [
            testing_3.MockBackend,
            { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
        ]
    })
], HttpBeforeExampleModule);
exports.HttpBeforeExampleModule = HttpBeforeExampleModule;
var HttpAfterExampleModule = (function () {
    function HttpAfterExampleModule() {
    }
    return HttpAfterExampleModule;
}());
HttpAfterExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [MyServerApp],
        declarations: [MyServerApp],
        imports: [platform_server_1.ServerModule, http_2.HttpModule],
        providers: [
            testing_3.MockBackend,
            { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
        ]
    })
], HttpAfterExampleModule);
exports.HttpAfterExampleModule = HttpAfterExampleModule;
var HttpClientExmapleModule = (function () {
    function HttpClientExmapleModule() {
    }
    return HttpClientExmapleModule;
}());
HttpClientExmapleModule = __decorate([
    core_1.NgModule({
        bootstrap: [MyServerApp],
        declarations: [MyServerApp],
        imports: [platform_server_1.ServerModule, http_1.HttpClientModule, testing_1.HttpClientTestingModule],
    })
], HttpClientExmapleModule);
exports.HttpClientExmapleModule = HttpClientExmapleModule;
var ImageApp = (function () {
    function ImageApp() {
    }
    return ImageApp;
}());
ImageApp = __decorate([
    core_1.Component({ selector: 'app', template: "<img [src]=\"'link'\">" })
], ImageApp);
var ImageExampleModule = (function () {
    function ImageExampleModule() {
    }
    return ImageExampleModule;
}());
ImageExampleModule = __decorate([
    core_1.NgModule({ declarations: [ImageApp], imports: [platform_server_1.ServerModule], bootstrap: [ImageApp] })
], ImageExampleModule);
var NativeEncapsulationApp = (function () {
    function NativeEncapsulationApp() {
    }
    return NativeEncapsulationApp;
}());
NativeEncapsulationApp = __decorate([
    core_1.Component({
        selector: 'app',
        template: 'Native works',
        encapsulation: core_1.ViewEncapsulation.Native,
        styles: [':host { color: red; }']
    })
], NativeEncapsulationApp);
var NativeExampleModule = (function () {
    function NativeExampleModule() {
    }
    return NativeExampleModule;
}());
NativeExampleModule = __decorate([
    core_1.NgModule({
        declarations: [NativeEncapsulationApp],
        imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'test' }), platform_server_1.ServerModule],
        bootstrap: [NativeEncapsulationApp]
    })
], NativeExampleModule);
var MyChildComponent = (function () {
    function MyChildComponent() {
    }
    return MyChildComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MyChildComponent.prototype, "attr", void 0);
MyChildComponent = __decorate([
    core_1.Component({ selector: 'my-child', template: 'Works!' })
], MyChildComponent);
var MyHostComponent = (function () {
    function MyHostComponent() {
    }
    return MyHostComponent;
}());
MyHostComponent = __decorate([
    core_1.Component({ selector: 'app', template: '<my-child [attr]="false"></my-child>' })
], MyHostComponent);
var FalseAttributesModule = (function () {
    function FalseAttributesModule() {
    }
    return FalseAttributesModule;
}());
FalseAttributesModule = __decorate([
    core_1.NgModule({
        declarations: [MyHostComponent, MyChildComponent],
        bootstrap: [MyHostComponent],
        imports: [platform_server_1.ServerModule, platform_browser_1.BrowserModule.withServerTransition({ appId: 'false-attributes' })]
    })
], FalseAttributesModule);
var MyInputComponent = (function () {
    function MyInputComponent() {
        this.name = '';
    }
    return MyInputComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MyInputComponent.prototype, "name", void 0);
MyInputComponent = __decorate([
    core_1.Component({ selector: 'app', template: '<input [name]="name">' })
], MyInputComponent);
var NameModule = (function () {
    function NameModule() {
    }
    return NameModule;
}());
NameModule = __decorate([
    core_1.NgModule({
        declarations: [MyInputComponent],
        bootstrap: [MyInputComponent],
        imports: [platform_server_1.ServerModule, platform_browser_1.BrowserModule.withServerTransition({ appId: 'name-attributes' })]
    })
], NameModule);
function main() {
    if (dom_adapter_1.getDOM().supportsDOMEvents())
        return; // NODE only
    describe('platform-server integration', function () {
        beforeEach(function () {
            if (core_1.getPlatform())
                core_1.destroyPlatform();
        });
        it('should bootstrap', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                expect(common_1.isPlatformServer(moduleRef.injector.get(core_1.PLATFORM_ID))).toBe(true);
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(doc.head).toBe(dom_adapter_1.getDOM().querySelector(doc, 'head'));
                expect(doc.body).toBe(dom_adapter_1.getDOM().querySelector(doc, 'body'));
                expect(doc._window).toEqual({});
                expect(dom_adapter_1.getDOM().getText(doc)).toEqual('Works!');
                platform.destroy();
            });
        }));
        it('should allow multiple platform instances', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            var platform2 = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(dom_adapter_1.getDOM().getText(doc)).toEqual('Works!');
                platform.destroy();
            });
            platform2.bootstrapModule(ExampleModule2).then(function (moduleRef) {
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(dom_adapter_1.getDOM().getText(doc)).toEqual('Works too!');
                platform2.destroy();
            });
        }));
        it('adds title to the document using Title service', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head><title></title></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(TitleAppModule).then(function (ref) {
                var state = ref.injector.get(platform_server_1.PlatformState);
                var doc = ref.injector.get(platform_browser_1.DOCUMENT);
                var title = dom_adapter_1.getDOM().querySelector(doc, 'title');
                expect(dom_adapter_1.getDOM().getText(title)).toBe('Test App Title');
                expect(state.renderToString()).toContain('<title>Test App Title</title>');
            });
        }));
        it('should get base href from document', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head><base href="/"></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                var location = moduleRef.injector.get(common_1.PlatformLocation);
                expect(location.getBaseHrefFromDOM()).toEqual('/');
                platform.destroy();
            });
        }));
        it('adds styles with ng-transition attribute', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(ExampleStylesModule).then(function (ref) {
                var doc = ref.injector.get(platform_browser_1.DOCUMENT);
                var head = dom_adapter_1.getDOM().getElementsByTagName(doc, 'head')[0];
                var styles = head.children;
                expect(styles.length).toBe(1);
                expect(dom_adapter_1.getDOM().getText(styles[0])).toContain('color: red');
                expect(dom_adapter_1.getDOM().getAttribute(styles[0], 'ng-transition')).toBe('example-styles');
            });
        }));
        it('copies known properties to attributes', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ImageExampleModule).then(function (ref) {
                var appRef = ref.injector.get(core_1.ApplicationRef);
                var app = appRef.components[0].location.nativeElement;
                var img = dom_adapter_1.getDOM().getElementsByTagName(app, 'img')[0];
                expect(img.attribs['src']).toEqual('link');
            });
        }));
        describe('PlatformLocation', function () {
            it('is injectable', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/');
                    platform.destroy();
                });
            }));
            it('is configurable via INITIAL_CONFIG', function () {
                platform_server_1.platformDynamicServer([{
                        provide: platform_server_1.INITIAL_CONFIG,
                        useValue: { document: '<app></app>', url: 'http://test.com/deep/path?query#hash' }
                    }])
                    .bootstrapModule(ExampleModule)
                    .then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/deep/path');
                    expect(location.search).toBe('?query');
                    expect(location.hash).toBe('#hash');
                });
            });
            it('handles empty search and hash portions of the url', function () {
                platform_server_1.platformDynamicServer([{
                        provide: platform_server_1.INITIAL_CONFIG,
                        useValue: { document: '<app></app>', url: 'http://test.com/deep/path' }
                    }])
                    .bootstrapModule(ExampleModule)
                    .then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/deep/path');
                    expect(location.search).toBe('');
                    expect(location.hash).toBe('');
                });
            });
            it('pushState causes the URL to update', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    location.pushState(null, 'Test', '/foo#bar');
                    expect(location.pathname).toBe('/foo');
                    expect(location.hash).toBe('#bar');
                    platform.destroy();
                });
            }));
            it('allows subscription to the hash state', function (done) {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/');
                    location.onHashChange(function (e) {
                        expect(e.type).toBe('hashchange');
                        expect(e.oldUrl).toBe('/');
                        expect(e.newUrl).toBe('/foo#bar');
                        platform.destroy();
                        done();
                    });
                    location.pushState(null, 'Test', '/foo#bar');
                });
            });
        });
        describe('render', function () {
            var doc;
            var called;
            var expectedOutput = '<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">Works!<h1 innerText="fine">fine</h1></app></body></html>';
            beforeEach(function () {
                // PlatformConfig takes in a parsed document so that it can be cached across requests.
                doc = '<html><head></head><body><app></app></body></html>';
                called = false;
            });
            afterEach(function () { expect(called).toBe(true); });
            it('using long from should work', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: doc } }]);
                platform.bootstrapModule(AsyncServerModule)
                    .then(function (moduleRef) {
                    var applicationRef = moduleRef.injector.get(core_1.ApplicationRef);
                    return toPromise_1.toPromise.call(first_1.first.call(filter_1.filter.call(applicationRef.isStable, function (isStable) { return isStable; })));
                })
                    .then(function (b) {
                    expect(platform.injector.get(platform_server_1.PlatformState).renderToString()).toBe(expectedOutput);
                    platform.destroy();
                    called = true;
                });
            }));
            it('using renderModule should work', testing_2.async(function () {
                platform_server_1.renderModule(AsyncServerModule, { document: doc }).then(function (output) {
                    expect(output).toBe(expectedOutput);
                    called = true;
                });
            }));
            it('using renderModuleFactory should work', testing_2.async(testing_2.inject([core_1.PlatformRef], function (defaultPlatform) {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(AsyncServerModule);
                platform_server_1.renderModuleFactory(moduleFactory, { document: doc }).then(function (output) {
                    expect(output).toBe(expectedOutput);
                    called = true;
                });
            })));
            it('works with SVG elements', testing_2.async(function () {
                platform_server_1.renderModule(SVGServerModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<svg><use xlink:href="#clear"></use></svg></app></body></html>');
                    called = true;
                });
            }));
            it('works with animation', testing_2.async(function () {
                platform_server_1.renderModule(AnimationServerModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<div>Works!</div></app></body></html>');
                    called = true;
                });
            }));
            it('should handle ViewEncapsulation.Native', testing_2.async(function () {
                platform_server_1.renderModule(NativeExampleModule, { document: doc }).then(function (output) {
                    expect(output).not.toBe('');
                    expect(output).toContain('color: red');
                    called = true;
                });
            }));
            it('should handle false values on attributes', testing_2.async(function () {
                platform_server_1.renderModule(FalseAttributesModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<my-child ng-reflect-attr="false">Works!</my-child></app></body></html>');
                    called = true;
                });
            }));
            it('should handle element property "name"', testing_2.async(function () {
                platform_server_1.renderModule(NameModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<input name=""></app></body></html>');
                    called = true;
                });
            }));
        });
        describe('http', function () {
            it('can inject Http', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    expect(ref.injector.get(http_2.Http) instanceof http_2.Http).toBeTruthy();
                });
            }));
            it('can make Http requests', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            core_1.NgZone.assertInAngularZone();
                            expect(mc.request.url).toBe('http://localhost/testing');
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            core_1.NgZone.assertInAngularZone();
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('requests are macrotasks', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('works when HttpModule is included before ServerModule', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpBeforeExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('works when HttpModule is included after ServerModule', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpAfterExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('throws when given a relative URL', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var http = ref.injector.get(http_2.Http);
                    expect(function () { return http.get('/testing'); })
                        .toThrowError('URLs requested via Http on the server must be absolute. URL: /testing');
                });
            }));
        });
        describe('HttpClient', function () {
            it('can inject HttpClient', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExmapleModule).then(function (ref) {
                    expect(ref.injector.get(http_1.HttpClient) instanceof http_1.HttpClient).toBeTruthy();
                });
            }));
            it('can make HttpClient requests', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExmapleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_1.HttpTestingController);
                    var http = ref.injector.get(http_1.HttpClient);
                    ref.injector.get(core_1.NgZone).run(function () {
                        http.get('http://localhost/testing').subscribe(function (body) {
                            core_1.NgZone.assertInAngularZone();
                            expect(body).toEqual('success!');
                        });
                        mock.expectOne('http://localhost/testing').flush('success!');
                    });
                });
            }));
            it('requests are macrotasks', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExmapleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_1.HttpTestingController);
                    var http = ref.injector.get(http_1.HttpClient);
                    ref.injector.get(core_1.NgZone).run(function () {
                        http.get('http://localhost/testing').subscribe(function (body) {
                            expect(body).toEqual('success!');
                        });
                        expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                        mock.expectOne('http://localhost/testing').flush('success!');
                        expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    });
                });
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci90ZXN0L2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxrREFBd0U7QUFDeEUsMENBQWtGO0FBQ2xGLDZDQUFrRTtBQUNsRSx3REFBNEY7QUFDNUYsc0NBQXdNO0FBQ3hNLGlEQUE2RDtBQUM3RCxzQ0FBc0Y7QUFDdEYsaURBQWtFO0FBQ2xFLDhEQUF5RTtBQUN6RSw2RUFBcUU7QUFDckUsNERBQStJO0FBRS9JLCtDQUE0QztBQUM1Qyw2Q0FBMEM7QUFDMUMscURBQWtEO0FBR2xELElBQU0sV0FBVztJQUFqQjtJQUNBLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssV0FBVztJQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7R0FDM0MsV0FBVyxDQUNoQjtBQVdELElBQU0sYUFBYTtJQUFuQjtJQUNBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssYUFBYTtJQVRsQixlQUFRLENBQUM7UUFDUixTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDeEIsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO1FBQzNCLE9BQU8sRUFBRSxDQUFDLDhCQUFZLENBQUM7UUFDdkIsU0FBUyxFQUFFO1lBQ1QscUJBQVc7WUFDWCxFQUFDLE9BQU8sRUFBRSxpQkFBVSxFQUFFLFdBQVcsRUFBRSxxQkFBVyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQztHQUNJLGFBQWEsQ0FDbEI7QUFHRCxJQUFNLFlBQVk7SUFBbEI7SUFDQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLFlBQVk7SUFEakIsZ0JBQVMs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