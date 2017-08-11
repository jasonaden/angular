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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var SimpleDirective = (function () {
    function SimpleDirective() {
        this.value = null;
    }
    return SimpleDirective;
}());
__decorate([
    core_1.Input('simpleDirective'),
    __metadata("design:type", Object)
], SimpleDirective.prototype, "value", void 0);
SimpleDirective = __decorate([
    core_1.Directive({ selector: '[simpleDirective]' })
], SimpleDirective);
var SimpleComponent = (function () {
    function SimpleComponent() {
    }
    return SimpleComponent;
}());
SimpleComponent = __decorate([
    core_1.Component({ selector: '[simpleComponent]', template: '' })
], SimpleComponent);
var SomeOtherDirective = (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
}());
SomeOtherDirective = __decorate([
    core_1.Directive({ selector: '[someOtherDirective]' })
], SomeOtherDirective);
var CycleDirective = (function () {
    function CycleDirective(self) {
    }
    return CycleDirective;
}());
CycleDirective = __decorate([
    core_1.Directive({ selector: '[cycleDirective]' }),
    __metadata("design:paramtypes", [CycleDirective])
], CycleDirective);
var NeedsDirectiveFromSelf = (function () {
    function NeedsDirectiveFromSelf(dependency) {
        this.dependency = dependency;
    }
    return NeedsDirectiveFromSelf;
}());
NeedsDirectiveFromSelf = __decorate([
    core_1.Directive({ selector: '[needsDirectiveFromSelf]' }),
    __param(0, core_1.Self()),
    __metadata("design:paramtypes", [SimpleDirective])
], NeedsDirectiveFromSelf);
var OptionallyNeedsDirective = (function () {
    function OptionallyNeedsDirective(dependency) {
        this.dependency = dependency;
    }
    return OptionallyNeedsDirective;
}());
OptionallyNeedsDirective = __decorate([
    core_1.Directive({ selector: '[optionallyNeedsDirective]' }),
    __param(0, core_1.Self()), __param(0, core_1.Optional()),
    __metadata("design:paramtypes", [SimpleDirective])
], OptionallyNeedsDirective);
var NeedsComponentFromHost = (function () {
    function NeedsComponentFromHost(dependency) {
        this.dependency = dependency;
    }
    return NeedsComponentFromHost;
}());
NeedsComponentFromHost = __decorate([
    core_1.Directive({ selector: '[needsComponentFromHost]' }),
    __param(0, core_1.Host()),
    __metadata("design:paramtypes", [SimpleComponent])
], NeedsComponentFromHost);
var NeedsDirectiveFromHost = (function () {
    function NeedsDirectiveFromHost(dependency) {
        this.dependency = dependency;
    }
    return NeedsDirectiveFromHost;
}());
NeedsDirectiveFromHost = __decorate([
    core_1.Directive({ selector: '[needsDirectiveFromHost]' }),
    __param(0, core_1.Host()),
    __metadata("design:paramtypes", [SimpleDirective])
], NeedsDirectiveFromHost);
var NeedsDirective = (function () {
    function NeedsDirective(dependency) {
        this.dependency = dependency;
    }
    return NeedsDirective;
}());
NeedsDirective = __decorate([
    core_1.Directive({ selector: '[needsDirective]' }),
    __metadata("design:paramtypes", [SimpleDirective])
], NeedsDirective);
var NeedsService = (function () {
    function NeedsService(service) {
        this.service = service;
    }
    return NeedsService;
}());
NeedsService = __decorate([
    core_1.Directive({ selector: '[needsService]' }),
    __param(0, core_1.Inject('service')),
    __metadata("design:paramtypes", [Object])
], NeedsService);
var NeedsAppService = (function () {
    function NeedsAppService(service) {
        this.service = service;
    }
    return NeedsAppService;
}());
NeedsAppService = __decorate([
    core_1.Directive({ selector: '[needsAppService]' }),
    __param(0, core_1.Inject('appService')),
    __metadata("design:paramtypes", [Object])
], NeedsAppService);
var NeedsHostAppService = (function () {
    function NeedsHostAppService(service) {
        this.service = service;
    }
    return NeedsHostAppService;
}());
NeedsHostAppService = __decorate([
    core_1.Component({ selector: '[needsHostAppService]', template: '' }),
    __param(0, core_1.Host()), __param(0, core_1.Inject('appService')),
    __metadata("design:paramtypes", [Object])
], NeedsHostAppService);
var NeedsServiceComponent = (function () {
    function NeedsServiceComponent(service) {
        this.service = service;
    }
    return NeedsServiceComponent;
}());
NeedsServiceComponent = __decorate([
    core_1.Component({ selector: '[needsServiceComponent]', template: '' }),
    __param(0, core_1.Inject('service')),
    __metadata("design:paramtypes", [Object])
], NeedsServiceComponent);
var NeedsServiceFromHost = (function () {
    function NeedsServiceFromHost(service) {
        this.service = service;
    }
    return NeedsServiceFromHost;
}());
NeedsServiceFromHost = __decorate([
    core_1.Directive({ selector: '[needsServiceFromHost]' }),
    __param(0, core_1.Host()), __param(0, core_1.Inject('service')),
    __metadata("design:paramtypes", [Object])
], NeedsServiceFromHost);
var NeedsAttribute = (function () {
    function NeedsAttribute(typeAttribute, titleAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.titleAttribute = titleAttribute;
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttribute;
}());
NeedsAttribute = __decorate([
    core_1.Directive({ selector: '[needsAttribute]' }),
    __param(0, core_1.Attribute('type')), __param(1, core_1.Attribute('title')),
    __param(2, core_1.Attribute('foo')),
    __metadata("design:paramtypes", [String, String,
        String])
], NeedsAttribute);
var NeedsAttributeNoType = (function () {
    function NeedsAttributeNoType(fooAttribute) {
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttributeNoType;
}());
NeedsAttributeNoType = __decorate([
    core_1.Directive({ selector: '[needsAttributeNoType]' }),
    __param(0, core_1.Attribute('foo')),
    __metadata("design:paramtypes", [Object])
], NeedsAttributeNoType);
var NeedsElementRef = (function () {
    function NeedsElementRef(elementRef) {
        this.elementRef = elementRef;
    }
    return NeedsElementRef;
}());
NeedsElementRef = __decorate([
    core_1.Directive({ selector: '[needsElementRef]' }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], NeedsElementRef);
var NeedsViewContainerRef = (function () {
    function NeedsViewContainerRef(viewContainer) {
        this.viewContainer = viewContainer;
    }
    return NeedsViewContainerRef;
}());
NeedsViewContainerRef = __decorate([
    core_1.Directive({ selector: '[needsViewContainerRef]' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef])
], NeedsViewContainerRef);
var NeedsTemplateRef = (function () {
    function NeedsTemplateRef(templateRef) {
        this.templateRef = templateRef;
    }
    return NeedsTemplateRef;
}());
NeedsTemplateRef = __decorate([
    core_1.Directive({ selector: '[needsTemplateRef]' }),
    __metadata("design:paramtypes", [core_1.TemplateRef])
], NeedsTemplateRef);
var OptionallyNeedsTemplateRef = (function () {
    function OptionallyNeedsTemplateRef(templateRef) {
        this.templateRef = templateRef;
    }
    return OptionallyNeedsTemplateRef;
}());
OptionallyNeedsTemplateRef = __decorate([
    core_1.Directive({ selector: '[optionallyNeedsTemplateRef]' }),
    __param(0, core_1.Optional()),
    __metadata("design:paramtypes", [core_1.TemplateRef])
], OptionallyNeedsTemplateRef);
var DirectiveNeedsChangeDetectorRef = (function () {
    function DirectiveNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    return DirectiveNeedsChangeDetectorRef;
}());
DirectiveNeedsChangeDetectorRef = __decorate([
    core_1.Directive({ selector: '[directiveNeedsChangeDetectorRef]' }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], DirectiveNeedsChangeDetectorRef);
var PushComponentNeedsChangeDetectorRef = (function () {
    function PushComponentNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.counter = 0;
    }
    return PushComponentNeedsChangeDetectorRef;
}());
PushComponentNeedsChangeDetectorRef = __decorate([
    core_1.Component({
        selector: '[componentNeedsChangeDetectorRef]',
        template: '{{counter}}',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], PushComponentNeedsChangeDetectorRef);
var PurePipe = (function () {
    function PurePipe() {
    }
    PurePipe.prototype.transform = function (value) { return this; };
    return PurePipe;
}());
PurePipe = __decorate([
    core_1.Pipe({ name: 'purePipe', pure: true }),
    __metadata("design:paramtypes", [])
], PurePipe);
var ImpurePipe = (function () {
    function ImpurePipe() {
    }
    ImpurePipe.prototype.transform = function (value) { return this; };
    return ImpurePipe;
}());
ImpurePipe = __decorate([
    core_1.Pipe({ name: 'impurePipe', pure: false }),
    __metadata("design:paramtypes", [])
], ImpurePipe);
var PipeNeedsChangeDetectorRef = (function () {
    function PipeNeedsChangeDetectorRef(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    PipeNeedsChangeDetectorRef.prototype.transform = function (value) { return this; };
    return PipeNeedsChangeDetectorRef;
}());
PipeNeedsChangeDetectorRef = __decorate([
    core_1.Pipe({ name: 'pipeNeedsChangeDetectorRef' }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], PipeNeedsChangeDetectorRef);
var PipeNeedsService = (function () {
    function PipeNeedsService(service) {
        this.service = service;
    }
    PipeNeedsService.prototype.transform = function (value) { return this; };
    return PipeNeedsService;
}());
PipeNeedsService = __decorate([
    core_1.Pipe({ name: 'pipeNeedsService' }),
    __param(0, core_1.Inject('service')),
    __metadata("design:paramtypes", [Object])
], PipeNeedsService);
exports.PipeNeedsService = PipeNeedsService;
var DuplicatePipe1 = (function () {
    function DuplicatePipe1() {
    }
    DuplicatePipe1.prototype.transform = function (value) { return this; };
    return DuplicatePipe1;
}());
DuplicatePipe1 = __decorate([
    core_1.Pipe({ name: 'duplicatePipe' })
], DuplicatePipe1);
exports.DuplicatePipe1 = DuplicatePipe1;
var DuplicatePipe2 = (function () {
    function DuplicatePipe2() {
    }
    DuplicatePipe2.prototype.transform = function (value) { return this; };
    return DuplicatePipe2;
}());
DuplicatePipe2 = __decorate([
    core_1.Pipe({ name: 'duplicatePipe' })
], DuplicatePipe2);
exports.DuplicatePipe2 = DuplicatePipe2;
var TestComp = (function () {
    function TestComp() {
    }
    return TestComp;
}());
TestComp = __decorate([
    core_1.Component({ selector: 'root', template: '' })
], TestComp);
function main() {
    function createComponentFixture(template, providers, comp) {
        if (!comp) {
            comp = TestComp;
        }
        testing_1.TestBed.overrideComponent(comp, { set: { template: template } });
        if (providers && providers.length) {
            testing_1.TestBed.overrideComponent(comp, { add: { providers: providers } });
        }
        return testing_1.TestBed.createComponent(comp);
    }
    function createComponent(template, providers, comp) {
        var fixture = createComponentFixture(template, providers, comp);
        fixture.detectChanges();
        return fixture.debugElement;
    }
    describe('View injector', function () {
        // On CJS fakeAsync is not supported...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        var TOKEN = new core_1.InjectionToken('token');
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComp],
                providers: [
                    { provide: TOKEN, useValue: 'appService' },
                    { provide: 'appService', useFactory: function (v) { return v; }, deps: [TOKEN] },
                ],
            });
        });
        describe('injection', function () {
            it('should instantiate directives that have no dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var el = createComponent('<div simpleDirective>');
                matchers_1.expect(el.children[0].injector.get(SimpleDirective)).toBeAnInstanceOf(SimpleDirective);
            });
            it('should instantiate directives that depend on another directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirective] });
                var el = createComponent('<div simpleDirective needsDirective>');
                var d = el.children[0].injector.get(NeedsDirective);
                matchers_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            });
            it('should support useValue with different values', function () {
                var el = createComponent('', [
                    { provide: 'numLiteral', useValue: 0 },
                    { provide: 'boolLiteral', useValue: true },
                    { provide: 'strLiteral', useValue: 'a' },
                    { provide: 'null', useValue: null },
                    { provide: 'array', useValue: [1] },
                    { provide: 'map', useValue: { 'a': 1 } },
                    { provide: 'instance', useValue: new TestValue('a') },
                    { provide: 'nested', useValue: [{ 'a': [1] }, new TestValue('b')] },
                ]);
                matchers_1.expect(el.injector.get('numLiteral')).toBe(0);
                matchers_1.expect(el.injector.get('boolLiteral')).toBe(true);
                matchers_1.expect(el.injector.get('strLiteral')).toBe('a');
                matchers_1.expect(el.injector.get('null')).toBe(null);
                matchers_1.expect(el.injector.get('array')).toEqual([1]);
                matchers_1.expect(el.injector.get('map')).toEqual({ 'a': 1 });
                matchers_1.expect(el.injector.get('instance')).toEqual(new TestValue('a'));
                matchers_1.expect(el.injector.get('nested')).toEqual([{ 'a': [1] }, new TestValue('b')]);
            });
            it('should instantiate providers that have dependencies with SkipSelf', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, SomeOtherDirective] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { add: { providers: [{ provide: 'injectable1', useValue: 'injectable1' }] } });
                testing_1.TestBed.overrideDirective(SomeOtherDirective, {
                    add: {
                        providers: [
                            { provide: 'injectable1', useValue: 'new-injectable1' }, {
                                provide: 'injectable2',
                                useFactory: function (val) { return val + "-injectable2"; },
                                deps: [[new core_1.Inject('injectable1'), new core_1.SkipSelf()]]
                            }
                        ]
                    }
                });
                var el = createComponent('<div simpleDirective><span someOtherDirective></span></div>');
                matchers_1.expect(el.children[0].children[0].injector.get('injectable2'))
                    .toEqual('injectable1-injectable2');
            });
            it('should instantiate providers that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var providers = [
                    { provide: 'injectable1', useValue: 'injectable1' }, {
                        provide: 'injectable2',
                        useFactory: function (val) { return val + "-injectable2"; },
                        deps: ['injectable1']
                    }
                ];
                testing_1.TestBed.overrideDirective(SimpleDirective, { add: { providers: providers } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(el.children[0].injector.get('injectable2')).toEqual('injectable1-injectable2');
            });
            it('should instantiate viewProviders that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent] });
                var viewProviders = [
                    { provide: 'injectable1', useValue: 'injectable1' }, {
                        provide: 'injectable2',
                        useFactory: function (val) { return val + "-injectable2"; },
                        deps: ['injectable1']
                    }
                ];
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: viewProviders } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].injector.get('injectable2')).toEqual('injectable1-injectable2');
            });
            it('should instantiate components that depend on viewProviders providers', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsServiceComponent] });
                testing_1.TestBed.overrideComponent(NeedsServiceComponent, { set: { providers: [{ provide: 'service', useValue: 'service' }] } });
                var el = createComponent('<div needsServiceComponent></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsServiceComponent).service).toEqual('service');
            });
            it('should instantiate multi providers', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var providers = [
                    { provide: 'injectable1', useValue: 'injectable11', multi: true },
                    { provide: 'injectable1', useValue: 'injectable12', multi: true }
                ];
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: providers } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(el.children[0].injector.get('injectable1')).toEqual([
                    'injectable11', 'injectable12'
                ]);
            });
            it('should instantiate providers lazily', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective] });
                var created = false;
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useFactory: function () { return created = true; } }] } });
                var el = createComponent('<div simpleDirective></div>');
                matchers_1.expect(created).toBe(false);
                el.children[0].injector.get('service');
                matchers_1.expect(created).toBe(true);
            });
            describe('injecting lazy providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyComp = (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager) {
                        }
                        return MyComp;
                    }());
                    MyComp = __decorate([
                        core_1.Component({
                            template: '',
                            providers: [
                                { provide: 'lazy', useFactory: function () { return 'lazyValue'; } },
                                {
                                    provide: 'eager',
                                    useFactory: function (i) { return "eagerValue: " + i.get('lazy'); },
                                    deps: [core_1.Injector]
                                },
                            ]
                        }),
                        __param(0, core_1.Inject('eager')),
                        __metadata("design:paramtypes", [Object])
                    ], MyComp);
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager')).toBe('eagerValue: lazyValue');
                });
                it('should inject providers that were declared after it', function () {
                    var MyComp = (function () {
                        // Component is eager, which makes all of its deps eager
                        function MyComp(eager) {
                        }
                        return MyComp;
                    }());
                    MyComp = __decorate([
                        core_1.Component({
                            template: '',
                            providers: [
                                {
                                    provide: 'eager',
                                    useFactory: function (i) { return "eagerValue: " + i.get('lazy'); },
                                    deps: [core_1.Injector]
                                },
                                { provide: 'lazy', useFactory: function () { return 'lazyValue'; } },
                            ]
                        }),
                        __param(0, core_1.Inject('eager')),
                        __metadata("design:paramtypes", [Object])
                    ], MyComp);
                    var ctx = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] }).createComponent(MyComp);
                    matchers_1.expect(ctx.debugElement.injector.get('eager')).toBe('eagerValue: lazyValue');
                });
            });
            it('should allow injecting lazy providers via Injector.get from an eager provider that is declared earlier', function () {
                var SomeComponent = (function () {
                    function SomeComponent(injector) {
                        this.a = injector.get('a');
                    }
                    return SomeComponent;
                }());
                SomeComponent = __decorate([
                    core_1.Component({ providers: [{ provide: 'a', useFactory: function () { return 'aValue'; } }], template: '' }),
                    __metadata("design:paramtypes", [core_1.Injector])
                ], SomeComponent);
                var comp = testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent] })
                    .createComponent(SomeComponent);
                matchers_1.expect(comp.componentInstance.a).toBe('aValue');
            });
            it('should support ngOnDestroy for lazy providers', function () {
                var created = false;
                var destroyed = false;
                var SomeInjectable = (function () {
                    function SomeInjectable() {
                        created = true;
                    }
                    SomeInjectable.prototype.ngOnDestroy = function () { destroyed = true; };
                    return SomeInjectable;
                }());
                var SomeComp = (function () {
                    function SomeComp() {
                    }
                    return SomeComp;
                }());
                SomeComp = __decorate([
                    core_1.Component({ providers: [SomeInjectable], template: '' })
                ], SomeComp);
                testing_1.TestBed.configureTestingModule({ declarations: [SomeComp] });
                var compRef = testing_1.TestBed.createComponent(SomeComp).componentRef;
                matchers_1.expect(created).toBe(false);
                matchers_1.expect(destroyed).toBe(false);
                // no error if the provider was not yet created
                compRef.destroy();
                matchers_1.expect(created).toBe(false);
                matchers_1.expect(destroyed).toBe(false);
                compRef = testing_1.TestBed.createComponent(SomeComp).componentRef;
                compRef.injector.get(SomeInjectable);
                matchers_1.expect(created).toBe(true);
                compRef.destroy();
                matchers_1.expect(destroyed).toBe(true);
            });
            it('should instantiate view providers lazily', function () {
                var created = false;
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useFactory: function () { return created = true; } }] } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(created).toBe(false);
                el.children[0].injector.get('service');
                matchers_1.expect(created).toBe(true);
            });
            it('should not instantiate other directives that depend on viewProviders providers (same element)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useValue: 'service' }] } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent needsService></div>'); })
                    .toThrowError(/No provider for service!/);
            });
            it('should not instantiate other directives that depend on viewProviders providers (child element)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { viewProviders: [{ provide: 'service', useValue: 'service' }] } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent><div needsService></div></div>'); })
                    .toThrowError(/No provider for service!/);
            });
            it('should instantiate directives that depend on providers of other directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsService] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useValue: 'parentService' }] } });
                var el = createComponent('<div simpleDirective><div needsService></div></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('parentService');
            });
            it('should instantiate directives that depend on providers in a parent view', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsService] });
                testing_1.TestBed.overrideDirective(SimpleDirective, { set: { providers: [{ provide: 'service', useValue: 'parentService' }] } });
                var el = createComponent('<div simpleDirective><ng-container *ngIf="true"><div *ngIf="true" needsService></div></ng-container></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('parentService');
            });
            it('should instantiate directives that depend on providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives that depend on view providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives in a root embedded view that depend on view providers of a component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsService] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div *ngIf="true" needsService></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                matchers_1.expect(el.children[0].children[0].injector.get(NeedsService).service)
                    .toEqual('hostService');
            });
            it('should instantiate directives that depend on instances in the app injector', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAppService] });
                var el = createComponent('<div needsAppService></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsAppService).service).toEqual('appService');
            });
            it('should not instantiate a directive with cyclic dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [CycleDirective] });
                matchers_1.expect(function () { return createComponent('<div cycleDirective></div>'); })
                    .toThrowError(/Template parse errors:\nCannot instantiate cyclic dependency! CycleDirective \("\[ERROR ->\]<div cycleDirective><\/div>"\): .*TestComp.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a host dependency on providers' +
                ' of the component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsServiceFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsServiceFromHost><div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for service \("\[ERROR ->\]<div needsServiceFromHost><div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a host dependency on providers' +
                ' of a decorator directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, SomeOtherDirective, NeedsServiceFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { providers: [{ provide: 'service', useValue: 'hostService' }] } });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsServiceFromHost><div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent someOtherDirective></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for service \("\[ERROR ->\]<div needsServiceFromHost><div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should not instantiate a directive in a view that has a self dependency on a parent directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirectiveFromSelf] });
                matchers_1.expect(function () {
                    return createComponent('<div simpleDirective><div needsDirectiveFromSelf></div></div>');
                })
                    .toThrowError(/Template parse errors:\nNo provider for SimpleDirective \("<div simpleDirective>\[ERROR ->\]<div needsDirectiveFromSelf><\/div><\/div>"\): .*TestComp.html@0:21/);
            });
            it('should instantiate directives that depend on other directives', testing_1.fakeAsync(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, NeedsDirective] });
                var el = createComponent('<div simpleDirective><div needsDirective></div></div>');
                var d = el.children[0].children[0].injector.get(NeedsDirective);
                matchers_1.expect(d).toBeAnInstanceOf(NeedsDirective);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleDirective);
            }));
            it('should throw when a dependency cannot be resolved', testing_1.fakeAsync(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsService] });
                matchers_1.expect(function () { return createComponent('<div needsService></div>'); })
                    .toThrowError(/No provider for service!/);
            }));
            it('should inject null when an optional dependency cannot be resolved', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OptionallyNeedsDirective] });
                var el = createComponent('<div optionallyNeedsDirective></div>');
                var d = el.children[0].injector.get(OptionallyNeedsDirective);
                matchers_1.expect(d.dependency).toEqual(null);
            });
            it('should instantiate directives that depends on the host component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, NeedsComponentFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsComponentFromHost></div>' } });
                var el = createComponent('<div simpleComponent></div>');
                var d = el.children[0].children[0].injector.get(NeedsComponentFromHost);
                matchers_1.expect(d.dependency).toBeAnInstanceOf(SimpleComponent);
            });
            it('should instantiate host views for components that have a @Host dependency ', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsHostAppService] });
                var el = createComponent('', [], NeedsHostAppService);
                matchers_1.expect(el.componentInstance.service).toEqual('appService');
            });
            it('should not instantiate directives that depend on other directives on the host element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleComponent, SimpleDirective, NeedsDirectiveFromHost] });
                testing_1.TestBed.overrideComponent(SimpleComponent, { set: { template: '<div needsDirectiveFromHost></div>' } });
                matchers_1.expect(function () { return createComponent('<div simpleComponent simpleDirective></div>'); })
                    .toThrowError(/Template parse errors:\nNo provider for SimpleDirective \("\[ERROR ->\]<div needsDirectiveFromHost><\/div>"\): .*SimpleComponent.html@0:0/);
            });
            it('should allow to use the NgModule injector from a root ViewContainerRef.parentInjector', function () {
                var MyComp = (function () {
                    function MyComp(vc) {
                        this.vc = vc;
                    }
                    return MyComp;
                }());
                MyComp = __decorate([
                    core_1.Component({ template: '' }),
                    __metadata("design:paramtypes", [core_1.ViewContainerRef])
                ], MyComp);
                var compFixture = testing_1.TestBed
                    .configureTestingModule({
                    declarations: [MyComp],
                    providers: [{ provide: 'someToken', useValue: 'someValue' }]
                })
                    .createComponent(MyComp);
                matchers_1.expect(compFixture.componentInstance.vc.parentInjector.get('someToken'))
                    .toBe('someValue');
            });
        });
        describe('static attributes', function () {
            it('should be injectable', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAttribute] });
                var el = createComponent('<div needsAttribute type="text" title></div>');
                var needsAttribute = el.children[0].injector.get(NeedsAttribute);
                matchers_1.expect(needsAttribute.typeAttribute).toEqual('text');
                matchers_1.expect(needsAttribute.titleAttribute).toEqual('');
                matchers_1.expect(needsAttribute.fooAttribute).toEqual(null);
            });
            it('should be injectable without type annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsAttributeNoType] });
                var el = createComponent('<div needsAttributeNoType foo="bar"></div>');
                var needsAttribute = el.children[0].injector.get(NeedsAttributeNoType);
                matchers_1.expect(needsAttribute.fooAttribute).toEqual('bar');
            });
        });
        describe('refs', function () {
            it('should inject ElementRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsElementRef] });
                var el = createComponent('<div needsElementRef></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsElementRef).elementRef.nativeElement)
                    .toBe(el.children[0].nativeElement);
            });
            it('should inject ChangeDetectorRef of the component\'s view into the component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef] });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                comp.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it('should inject ChangeDetectorRef of the containing component into directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef] });
                testing_1.TestBed.overrideComponent(PushComponentNeedsChangeDetectorRef, {
                    set: {
                        template: '{{counter}}<div directiveNeedsChangeDetectorRef></div><div *ngIf="true" directiveNeedsChangeDetectorRef></div>'
                    }
                });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                matchers_1.expect(compEl.children[0].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef)
                    .toEqual(comp.changeDetectorRef);
                matchers_1.expect(compEl.children[1].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef)
                    .toEqual(comp.changeDetectorRef);
                comp.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it('should inject ChangeDetectorRef of a same element component into a directive', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef] });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef directiveNeedsChangeDetectorRef></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                var dir = compEl.injector.get(DirectiveNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                dir.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('1');
            });
            it("should not inject ChangeDetectorRef of a parent element's component into a directive", function () {
                testing_1.TestBed
                    .configureTestingModule({
                    declarations: [PushComponentNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef]
                })
                    .overrideComponent(PushComponentNeedsChangeDetectorRef, { set: { template: '<ng-content></ng-content>{{counter}}' } });
                var cf = createComponentFixture('<div componentNeedsChangeDetectorRef><div directiveNeedsChangeDetectorRef></div></div>');
                cf.detectChanges();
                var compEl = cf.debugElement.children[0];
                var comp = compEl.injector.get(PushComponentNeedsChangeDetectorRef);
                var dirEl = compEl.children[0];
                var dir = dirEl.injector.get(DirectiveNeedsChangeDetectorRef);
                comp.counter = 1;
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
                dir.changeDetectorRef.markForCheck();
                cf.detectChanges();
                matchers_1.expect(compEl.nativeElement).toHaveText('0');
            });
            it('should inject ViewContainerRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsViewContainerRef] });
                var el = createComponent('<div needsViewContainerRef></div>');
                matchers_1.expect(el.children[0].injector.get(NeedsViewContainerRef).viewContainer.element.nativeElement)
                    .toBe(el.children[0].nativeElement);
            });
            it('should inject ViewContainerRef', function () {
                var TestComp = (function () {
                    function TestComp(vcr) {
                        this.vcr = vcr;
                    }
                    return TestComp;
                }());
                TestComp = __decorate([
                    core_1.Component({ template: '' }),
                    __metadata("design:paramtypes", [core_1.ViewContainerRef])
                ], TestComp);
                var TestModule = (function () {
                    function TestModule() {
                    }
                    return TestModule;
                }());
                TestModule = __decorate([
                    core_1.NgModule({
                        declarations: [TestComp],
                        entryComponents: [TestComp],
                    })
                ], TestModule);
                var testInjector = {
                    get: function (token, notFoundValue) {
                        return token === 'someToken' ? 'someNewValue' : notFoundValue;
                    }
                };
                var compFactory = testing_1.TestBed.configureTestingModule({ imports: [TestModule] })
                    .get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(TestComp);
                var component = compFactory.create(testInjector);
                matchers_1.expect(component.instance.vcr.parentInjector.get('someToken')).toBe('someNewValue');
            });
            it('should inject TemplateRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsViewContainerRef, NeedsTemplateRef] });
                var el = createComponent('<ng-template needsViewContainerRef needsTemplateRef></ng-template>');
                matchers_1.expect(el.childNodes[0].injector.get(NeedsTemplateRef).templateRef.elementRef)
                    .toEqual(el.childNodes[0].injector.get(NeedsViewContainerRef).viewContainer.element);
            });
            it('should throw if there is no TemplateRef', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [NeedsTemplateRef] });
                matchers_1.expect(function () { return createComponent('<div needsTemplateRef></div>'); })
                    .toThrowError(/No provider for TemplateRef!/);
            });
            it('should inject null if there is no TemplateRef when the dependency is optional', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OptionallyNeedsTemplateRef] });
                var el = createComponent('<div optionallyNeedsTemplateRef></div>');
                var instance = el.children[0].injector.get(OptionallyNeedsTemplateRef);
                matchers_1.expect(instance.templateRef).toBeNull();
            });
        });
        describe('pipes', function () {
            it('should instantiate pipes that have dependencies', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, PipeNeedsService] });
                var el = createComponent('<div [simpleDirective]="true | pipeNeedsService"></div>', [{ provide: 'service', useValue: 'pipeService' }]);
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value.service).toEqual('pipeService');
            });
            it('should overwrite pipes with later entry in the pipes array', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, DuplicatePipe1, DuplicatePipe2] });
                var el = createComponent('<div [simpleDirective]="true | duplicatePipe"></div>');
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value).toBeAnInstanceOf(DuplicatePipe2);
            });
            it('should inject ChangeDetectorRef into pipes', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [SimpleDirective, PipeNeedsChangeDetectorRef, DirectiveNeedsChangeDetectorRef]
                });
                var el = createComponent('<div [simpleDirective]="true | pipeNeedsChangeDetectorRef" directiveNeedsChangeDetectorRef></div>');
                var cdRef = el.children[0].injector.get(DirectiveNeedsChangeDetectorRef).changeDetectorRef;
                matchers_1.expect(el.children[0].injector.get(SimpleDirective).value.changeDetectorRef).toEqual(cdRef);
            });
            it('should cache pure pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, PurePipe] });
                var el = createComponent('<div [simpleDirective]="true | purePipe"></div><div [simpleDirective]="true | purePipe"></div>' +
                    '<div *ngFor="let x of [1,2]" [simpleDirective]="true | purePipe"></div>');
                var purePipe1 = el.children[0].injector.get(SimpleDirective).value;
                var purePipe2 = el.children[1].injector.get(SimpleDirective).value;
                var purePipe3 = el.children[2].injector.get(SimpleDirective).value;
                var purePipe4 = el.children[3].injector.get(SimpleDirective).value;
                matchers_1.expect(purePipe1).toBeAnInstanceOf(PurePipe);
                matchers_1.expect(purePipe2).toBe(purePipe1);
                matchers_1.expect(purePipe3).toBe(purePipe1);
                matchers_1.expect(purePipe4).toBe(purePipe1);
            });
            it('should not cache impure pipes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleDirective, ImpurePipe] });
                var el = createComponent('<div [simpleDirective]="true | impurePipe"></div><div [simpleDirective]="true | impurePipe"></div>' +
                    '<div *ngFor="let x of [1,2]" [simpleDirective]="true | impurePipe"></div>');
                var impurePipe1 = el.children[0].injector.get(SimpleDirective).value;
                var impurePipe2 = el.children[1].injector.get(SimpleDirective).value;
                var impurePipe3 = el.children[2].injector.get(SimpleDirective).value;
                var impurePipe4 = el.children[3].injector.get(SimpleDirective).value;
                matchers_1.expect(impurePipe1).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe2).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe2).not.toBe(impurePipe1);
                matchers_1.expect(impurePipe3).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe3).not.toBe(impurePipe1);
                matchers_1.expect(impurePipe4).toBeAnInstanceOf(ImpurePipe);
                matchers_1.expect(impurePipe4).not.toBe(impurePipe1);
            });
        });
    });
}
exports.main = main;
var TestValue = (function () {
    function TestValue(value) {
        this.value = value;
    }
    return TestValue;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19pbmplY3Rvcl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci92aWV3X2luamVjdG9yX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBcVQ7QUFDclQsaURBQTJFO0FBQzNFLDZFQUFxRTtBQUNyRSwyRUFBc0U7QUFHdEUsSUFBTSxlQUFlO0lBRHJCO1FBRTRCLFVBQUssR0FBUSxJQUFJLENBQUM7SUFDOUMsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFEMkI7SUFBekIsWUFBSyxDQUFDLGlCQUFpQixDQUFDOzs4Q0FBbUI7QUFEeEMsZUFBZTtJQURwQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUM7R0FDckMsZUFBZSxDQUVwQjtBQUdELElBQU0sZUFBZTtJQUFyQjtJQUNBLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssZUFBZTtJQURwQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztHQUNuRCxlQUFlLENBQ3BCO0FBR0QsSUFBTSxrQkFBa0I7SUFBeEI7SUFDQSxDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGtCQUFrQjtJQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFDLENBQUM7R0FDeEMsa0JBQWtCLENBQ3ZCO0FBR0QsSUFBTSxjQUFjO0lBQ2xCLHdCQUFZLElBQW9CO0lBQUcsQ0FBQztJQUN0QyxxQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssY0FBYztJQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGtCQUFr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