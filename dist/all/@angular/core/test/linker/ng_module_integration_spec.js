"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var console_1 = require("@angular/core/src/console");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var ng_module_factory_loader_1 = require("../../src/linker/ng_module_factory_loader");
var util_1 = require("../../src/util");
var Engine = (function () {
    function Engine() {
    }
    return Engine;
}());
var BrokenEngine = (function () {
    function BrokenEngine() {
        throw new Error('Broken Engine');
    }
    return BrokenEngine;
}());
var DashboardSoftware = (function () {
    function DashboardSoftware() {
    }
    return DashboardSoftware;
}());
var Dashboard = (function () {
    function Dashboard(software) {
    }
    return Dashboard;
}());
Dashboard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [DashboardSoftware])
], Dashboard);
var TurboEngine = (function (_super) {
    __extends(TurboEngine, _super);
    function TurboEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TurboEngine;
}(Engine));
var CARS = new core_1.InjectionToken('Cars');
var Car = (function () {
    function Car(engine) {
        this.engine = engine;
    }
    return Car;
}());
Car = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [Engine])
], Car);
var CarWithOptionalEngine = (function () {
    function CarWithOptionalEngine(engine) {
        this.engine = engine;
    }
    return CarWithOptionalEngine;
}());
CarWithOptionalEngine = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Optional()),
    __metadata("design:paramtypes", [Engine])
], CarWithOptionalEngine);
var CarWithDashboard = (function () {
    function CarWithDashboard(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    return CarWithDashboard;
}());
CarWithDashboard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [Engine, Dashboard])
], CarWithDashboard);
var SportsCar = (function (_super) {
    __extends(SportsCar, _super);
    function SportsCar(engine) {
        return _super.call(this, engine) || this;
    }
    return SportsCar;
}(Car));
SportsCar = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [Engine])
], SportsCar);
var CarWithInject = (function () {
    function CarWithInject(engine) {
        this.engine = engine;
    }
    return CarWithInject;
}());
CarWithInject = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(TurboEngine)),
    __metadata("design:paramtypes", [Engine])
], CarWithInject);
var CyclicEngine = (function () {
    function CyclicEngine(car) {
    }
    return CyclicEngine;
}());
CyclicEngine = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [Car])
], CyclicEngine);
var NoAnnotations = (function () {
    function NoAnnotations(secretDependency) {
    }
    return NoAnnotations;
}());
function factoryFn(a) { }
var SomeComp = (function () {
    function SomeComp() {
    }
    return SomeComp;
}());
SomeComp = __decorate([
    core_1.Component({ selector: 'comp', template: '' })
], SomeComp);
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
__decorate([
    core_1.HostBinding('title'), core_1.Input(),
    __metadata("design:type", String)
], SomeDirective.prototype, "someDir", void 0);
SomeDirective = __decorate([
    core_1.Directive({ selector: '[someDir]' })
], SomeDirective);
var SomePipe = (function () {
    function SomePipe() {
    }
    SomePipe.prototype.transform = function (value) { return "transformed " + value; };
    return SomePipe;
}());
SomePipe = __decorate([
    core_1.Pipe({ name: 'somePipe' })
], SomePipe);
var CompUsingModuleDirectiveAndPipe = (function () {
    function CompUsingModuleDirectiveAndPipe() {
    }
    return CompUsingModuleDirectiveAndPipe;
}());
CompUsingModuleDirectiveAndPipe = __decorate([
    core_1.Component({ selector: 'comp', template: "<div  [someDir]=\"'someValue' | somePipe\"></div>" })
], CompUsingModuleDirectiveAndPipe);
var DummyConsole = (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
exports.main = main;
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('NgModule', function () {
        var compiler;
        var injector;
        var console;
        beforeEach(function () {
            console = new DummyConsole();
            testing_1.TestBed.configureCompiler({ useJit: useJit, providers: [{ provide: console_1.Console, useValue: console }] });
        });
        beforeEach(testing_1.inject([core_1.Compiler, core_1.Injector], function (_compiler, _injector) {
            compiler = _compiler;
            injector = _injector;
        }));
        function createModule(moduleType, parentInjector) {
            return compiler.compileModuleSync(moduleType).create(parentInjector || null);
        }
        function createComp(compType, moduleType) {
            var ngModule = createModule(moduleType, injector);
            var cf = ngModule.componentFactoryResolver.resolveComponentFactory(compType);
            var comp = cf.create(core_1.Injector.NULL);
            return new testing_1.ComponentFixture(comp, null, false);
        }
        describe('errors', function () {
            it('should error when exporting a directive that was neither declared nor imported', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ exports: [SomeDirective] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError("Can't export directive " + util_1.stringify(SomeDirective) + " from " + util_1.stringify(SomeModule) + " as it was neither declared nor imported!");
            });
            it('should error when exporting a pipe that was neither declared nor imported', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ exports: [SomePipe] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError("Can't export pipe " + util_1.stringify(SomePipe) + " from " + util_1.stringify(SomeModule) + " as it was neither declared nor imported!");
            });
            it('should error if a directive is declared in more than 1 module', function () {
                var Module1 = (function () {
                    function Module1() {
                    }
                    return Module1;
                }());
                Module1 = __decorate([
                    core_1.NgModule({ declarations: [SomeDirective] })
                ], Module1);
                var Module2 = (function () {
                    function Module2() {
                    }
                    return Module2;
                }());
                Module2 = __decorate([
                    core_1.NgModule({ declarations: [SomeDirective] })
                ], Module2);
                createModule(Module1);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_1.stringify(SomeDirective) + " is part of the declarations of 2 modules: " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "! " +
                    ("Please consider moving " + util_1.stringify(SomeDirective) + " to a higher module that imports " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_1.stringify(SomeDirective) + " then import that NgModule in " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "."));
            });
            it('should error if a directive is declared in more than 1 module also if the module declaring it is imported', function () {
                var Module1 = (function () {
                    function Module1() {
                    }
                    return Module1;
                }());
                Module1 = __decorate([
                    core_1.NgModule({ declarations: [SomeDirective], exports: [SomeDirective] })
                ], Module1);
                var Module2 = (function () {
                    function Module2() {
                    }
                    return Module2;
                }());
                Module2 = __decorate([
                    core_1.NgModule({ declarations: [SomeDirective], imports: [Module1] })
                ], Module2);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_1.stringify(SomeDirective) + " is part of the declarations of 2 modules: " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "! " +
                    ("Please consider moving " + util_1.stringify(SomeDirective) + " to a higher module that imports " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_1.stringify(SomeDirective) + " then import that NgModule in " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "."));
            });
            it('should error if a pipe is declared in more than 1 module', function () {
                var Module1 = (function () {
                    function Module1() {
                    }
                    return Module1;
                }());
                Module1 = __decorate([
                    core_1.NgModule({ declarations: [SomePipe] })
                ], Module1);
                var Module2 = (function () {
                    function Module2() {
                    }
                    return Module2;
                }());
                Module2 = __decorate([
                    core_1.NgModule({ declarations: [SomePipe] })
                ], Module2);
                createModule(Module1);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_1.stringify(SomePipe) + " is part of the declarations of 2 modules: " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "! " +
                    ("Please consider moving " + util_1.stringify(SomePipe) + " to a higher module that imports " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_1.stringify(SomePipe) + " then import that NgModule in " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "."));
            });
            it('should error if a pipe is declared in more than 1 module also if the module declaring it is imported', function () {
                var Module1 = (function () {
                    function Module1() {
                    }
                    return Module1;
                }());
                Module1 = __decorate([
                    core_1.NgModule({ declarations: [SomePipe], exports: [SomePipe] })
                ], Module1);
                var Module2 = (function () {
                    function Module2() {
                    }
                    return Module2;
                }());
                Module2 = __decorate([
                    core_1.NgModule({ declarations: [SomePipe], imports: [Module1] })
                ], Module2);
                matchers_1.expect(function () { return createModule(Module2); })
                    .toThrowError("Type " + util_1.stringify(SomePipe) + " is part of the declarations of 2 modules: " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "! " +
                    ("Please consider moving " + util_1.stringify(SomePipe) + " to a higher module that imports " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + ". ") +
                    ("You can also create a new NgModule that exports and includes " + util_1.stringify(SomePipe) + " then import that NgModule in " + util_1.stringify(Module1) + " and " + util_1.stringify(Module2) + "."));
            });
        });
        describe('schemas', function () {
            it('should error on unknown bound properties on custom elements by default', function () {
                var ComponentUsingInvalidProperty = (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    return ComponentUsingInvalidProperty;
                }());
                ComponentUsingInvalidProperty = __decorate([
                    core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                ], ComponentUsingInvalidProperty);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [ComponentUsingInvalidProperty] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); }).toThrowError(/Can't bind to 'someUnknownProp'/);
            });
            it('should not error on unknown bound properties on custom elements when using the CUSTOM_ELEMENTS_SCHEMA', function () {
                var ComponentUsingInvalidProperty = (function () {
                    function ComponentUsingInvalidProperty() {
                    }
                    return ComponentUsingInvalidProperty;
                }());
                ComponentUsingInvalidProperty = __decorate([
                    core_1.Component({ template: '<some-element [someUnknownProp]="true"></some-element>' })
                ], ComponentUsingInvalidProperty);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA], declarations: [ComponentUsingInvalidProperty] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); }).not.toThrow();
            });
        });
        describe('id', function () {
            var token = 'myid';
            var SomeModule = (function () {
                function SomeModule() {
                }
                return SomeModule;
            }());
            SomeModule = __decorate([
                core_1.NgModule({ id: token })
            ], SomeModule);
            var SomeOtherModule = (function () {
                function SomeOtherModule() {
                }
                return SomeOtherModule;
            }());
            SomeOtherModule = __decorate([
                core_1.NgModule({ id: token })
            ], SomeOtherModule);
            afterEach(function () { return ng_module_factory_loader_1.clearModulesForTest(); });
            it('should register loaded modules', function () {
                createModule(SomeModule);
                var factory = core_1.getModuleFactory(token);
                matchers_1.expect(factory).toBeTruthy();
                matchers_1.expect(factory.moduleType).toBe(SomeModule);
            });
            it('should throw when registering a duplicate module', function () {
                createModule(SomeModule);
                matchers_1.expect(function () { return createModule(SomeOtherModule); }).toThrowError(/Duplicate module registered/);
            });
        });
        describe('entryComponents', function () {
            it('should create ComponentFactories in root modules', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp], entryComponents: [SomeComp] })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should throw if we cannot find a module associated with a module-level entryComponent', function () {
                var SomeCompWithEntryComponents = (function () {
                    function SomeCompWithEntryComponents() {
                    }
                    return SomeCompWithEntryComponents;
                }());
                SomeCompWithEntryComponents = __decorate([
                    core_1.Component({ template: '' })
                ], SomeCompWithEntryComponents);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [], entryComponents: [SomeCompWithEntryComponents] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError('Component SomeCompWithEntryComponents is not part of any NgModule or the module has not been imported into your module.');
            });
            it('should throw if we cannot find a module associated with a component-level entryComponent', function () {
                var SomeCompWithEntryComponents = (function () {
                    function SomeCompWithEntryComponents() {
                    }
                    return SomeCompWithEntryComponents;
                }());
                SomeCompWithEntryComponents = __decorate([
                    core_1.Component({ template: '', entryComponents: [SomeComp] })
                ], SomeCompWithEntryComponents);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeCompWithEntryComponents] })
                ], SomeModule);
                matchers_1.expect(function () { return createModule(SomeModule); })
                    .toThrowError('Component SomeComp is not part of any NgModule or the module has not been imported into your module.');
            });
            it('should create ComponentFactories via ANALYZE_FOR_ENTRY_COMPONENTS', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({
                        declarations: [SomeComp],
                        providers: [{
                                provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS,
                                multi: true,
                                useValue: [{ a: 'b', component: SomeComp }]
                            }]
                    })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should create ComponentFactories in imported modules', function () {
                var SomeImportedModule = (function () {
                    function SomeImportedModule() {
                    }
                    return SomeImportedModule;
                }());
                SomeImportedModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp], entryComponents: [SomeComp] })
                ], SomeImportedModule);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ imports: [SomeImportedModule] })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
            it('should create ComponentFactories if the component was imported', function () {
                var SomeImportedModule = (function () {
                    function SomeImportedModule() {
                    }
                    return SomeImportedModule;
                }());
                SomeImportedModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp], exports: [SomeComp] })
                ], SomeImportedModule);
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ imports: [SomeImportedModule], entryComponents: [SomeComp] })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
                matchers_1.expect(ngModule.injector.get(core_1.ComponentFactoryResolver)
                    .resolveComponentFactory(SomeComp)
                    .componentType)
                    .toBe(SomeComp);
            });
        });
        describe('bootstrap components', function () {
            it('should create ComponentFactories', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp], bootstrap: [SomeComp] })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule.componentFactoryResolver.resolveComponentFactory(SomeComp).componentType)
                    .toBe(SomeComp);
            });
            it('should store the ComponentFactories in the NgModuleInjector', function () {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ declarations: [SomeComp], bootstrap: [SomeComp] })
                ], SomeModule);
                var ngModule = createModule(SomeModule);
                matchers_1.expect(ngModule._bootstrapComponents.length).toBe(1);
                matchers_1.expect(ngModule._bootstrapComponents[0]).toBe(SomeComp);
            });
        });
        describe('directives and pipes', function () {
            describe('declarations', function () {
                it('should be supported in root modules', function () {
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe, SomeDirective, SomePipe],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should be supported in imported modules', function () {
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe, SomeDirective, SomePipe],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [SomeImportedModule] })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should be supported in nested components', function () {
                    var ParentCompUsingModuleDirectiveAndPipe = (function () {
                        function ParentCompUsingModuleDirectiveAndPipe() {
                        }
                        return ParentCompUsingModuleDirectiveAndPipe;
                    }());
                    ParentCompUsingModuleDirectiveAndPipe = __decorate([
                        core_1.Component({
                            selector: 'parent',
                            template: '<comp></comp>',
                        })
                    ], ParentCompUsingModuleDirectiveAndPipe);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [
                                ParentCompUsingModuleDirectiveAndPipe, CompUsingModuleDirectiveAndPipe, SomeDirective,
                                SomePipe
                            ],
                            entryComponents: [ParentCompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(ParentCompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].children[0].properties['title'])
                        .toBe('transformed someValue');
                });
            });
            describe('import/export', function () {
                it('should support exported directives and pipes', function () {
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe],
                            imports: [SomeImportedModule],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support exported directives and pipes if the module is wrapped into an `ModuleWithProviders`', function () {
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe],
                            imports: [{ ngModule: SomeImportedModule }],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support reexported modules', function () {
                    var SomeReexportedModule = (function () {
                        function SomeReexportedModule() {
                        }
                        return SomeReexportedModule;
                    }());
                    SomeReexportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                    ], SomeReexportedModule);
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ exports: [SomeReexportedModule] })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe],
                            imports: [SomeImportedModule],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should support exporting individual directives of an imported module', function () {
                    var SomeReexportedModule = (function () {
                        function SomeReexportedModule() {
                        }
                        return SomeReexportedModule;
                    }());
                    SomeReexportedModule = __decorate([
                        core_1.NgModule({ declarations: [SomeDirective, SomePipe], exports: [SomeDirective, SomePipe] })
                    ], SomeReexportedModule);
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({ imports: [SomeReexportedModule], exports: [SomeDirective, SomePipe] })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe],
                            imports: [SomeImportedModule],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    var compFixture = createComp(CompUsingModuleDirectiveAndPipe, SomeModule);
                    compFixture.detectChanges();
                    matchers_1.expect(compFixture.debugElement.children[0].properties['title'])
                        .toBe('transformed someValue');
                });
                it('should not use non exported pipes of an imported module', function () {
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({
                            declarations: [SomePipe],
                        })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe],
                            imports: [SomeImportedModule],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    matchers_1.expect(function () { return createComp(SomeComp, SomeModule); })
                        .toThrowError(/The pipe 'somePipe' could not be found/);
                });
                it('should not use non exported directives of an imported module', function () {
                    var SomeImportedModule = (function () {
                        function SomeImportedModule() {
                        }
                        return SomeImportedModule;
                    }());
                    SomeImportedModule = __decorate([
                        core_1.NgModule({
                            declarations: [SomeDirective],
                        })
                    ], SomeImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            declarations: [CompUsingModuleDirectiveAndPipe, SomePipe],
                            imports: [SomeImportedModule],
                            entryComponents: [CompUsingModuleDirectiveAndPipe]
                        })
                    ], SomeModule);
                    matchers_1.expect(function () { return createComp(SomeComp, SomeModule); }).toThrowError(/Can't bind to 'someDir'/);
                });
            });
        });
        describe('providers', function () {
            var moduleType = null;
            function createInjector(providers, parent) {
                var SomeModule = (function () {
                    function SomeModule() {
                    }
                    return SomeModule;
                }());
                SomeModule = __decorate([
                    core_1.NgModule({ providers: providers })
                ], SomeModule);
                moduleType = SomeModule;
                return createModule(SomeModule, parent).injector;
            }
            it('should provide the module', function () { matchers_1.expect(createInjector([]).get(moduleType)).toBeAnInstanceOf(moduleType); });
            it('should instantiate a class without dependencies', function () {
                var injector = createInjector([Engine]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toBeAnInstanceOf(Engine);
            });
            it('should resolve dependencies based on type information', function () {
                var injector = createInjector([Engine, Car]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(Car);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should resolve dependencies based on @Inject annotation', function () {
                var injector = createInjector([TurboEngine, Engine, CarWithInject]);
                var car = injector.get(CarWithInject);
                matchers_1.expect(car).toBeAnInstanceOf(CarWithInject);
                matchers_1.expect(car.engine).toBeAnInstanceOf(TurboEngine);
            });
            it('should throw when no type and not @Inject (class case)', function () {
                matchers_1.expect(function () { return createInjector([NoAnnotations]); })
                    .toThrowError('Can\'t resolve all parameters for NoAnnotations: (?).');
            });
            it('should throw when no type and not @Inject (factory case)', function () {
                matchers_1.expect(function () { return createInjector([{ provide: 'someToken', useFactory: factoryFn }]); })
                    .toThrowError('Can\'t resolve all parameters for factoryFn: (?).');
            });
            it('should cache instances', function () {
                var injector = createInjector([Engine]);
                var e1 = injector.get(Engine);
                var e2 = injector.get(Engine);
                matchers_1.expect(e1).toBe(e2);
            });
            it('should provide to a value', function () {
                var injector = createInjector([{ provide: Engine, useValue: 'fake engine' }]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toEqual('fake engine');
            });
            it('should provide to a factory', function () {
                function sportsCarFactory(e) { return new SportsCar(e); }
                var injector = createInjector([Engine, { provide: Car, useFactory: sportsCarFactory, deps: [Engine] }]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should supporting provider to null', function () {
                var injector = createInjector([{ provide: Engine, useValue: null }]);
                var engine = injector.get(Engine);
                matchers_1.expect(engine).toBeNull();
            });
            it('should provide to an alias', function () {
                var injector = createInjector([
                    Engine, { provide: SportsCar, useClass: SportsCar },
                    { provide: Car, useExisting: SportsCar }
                ]);
                var car = injector.get(Car);
                var sportsCar = injector.get(SportsCar);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car).toBe(sportsCar);
            });
            it('should support multiProviders', function () {
                var injector = createInjector([
                    Engine, { provide: CARS, useClass: SportsCar, multi: true },
                    { provide: CARS, useClass: CarWithOptionalEngine, multi: true }
                ]);
                var cars = injector.get(CARS);
                matchers_1.expect(cars.length).toEqual(2);
                matchers_1.expect(cars[0]).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
            });
            it('should support multiProviders that are created using useExisting', function () {
                var injector = createInjector([Engine, SportsCar, { provide: CARS, useExisting: SportsCar, multi: true }]);
                var cars = injector.get(CARS);
                matchers_1.expect(cars.length).toEqual(1);
                matchers_1.expect(cars[0]).toBe(injector.get(SportsCar));
            });
            it('should throw when the aliased provider does not exist', function () {
                var injector = createInjector([{ provide: 'car', useExisting: SportsCar }]);
                var e = "NullInjectorError: No provider for " + util_1.stringify(SportsCar) + "!";
                matchers_1.expect(function () { return injector.get('car'); }).toThrowError(e);
            });
            it('should handle forwardRef in useExisting', function () {
                var injector = createInjector([
                    { provide: 'originalEngine', useClass: core_1.forwardRef(function () { return Engine; }) },
                    { provide: 'aliasedEngine', useExisting: core_1.forwardRef(function () { return 'originalEngine'; }) }
                ]);
                matchers_1.expect(injector.get('aliasedEngine')).toBeAnInstanceOf(Engine);
            });
            it('should support overriding factory dependencies', function () {
                var injector = createInjector([Engine, { provide: Car, useFactory: function (e) { return new SportsCar(e); }, deps: [Engine] }]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
                matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
            });
            it('should support optional dependencies', function () {
                var injector = createInjector([CarWithOptionalEngine]);
                var car = injector.get(CarWithOptionalEngine);
                matchers_1.expect(car.engine).toEqual(null);
            });
            it('should flatten passed-in providers', function () {
                var injector = createInjector([[[Engine, Car]]]);
                var car = injector.get(Car);
                matchers_1.expect(car).toBeAnInstanceOf(Car);
            });
            it('should use the last provider when there are multiple providers for same token', function () {
                var injector = createInjector([{ provide: Engine, useClass: Engine }, { provide: Engine, useClass: TurboEngine }]);
                matchers_1.expect(injector.get(Engine)).toBeAnInstanceOf(TurboEngine);
            });
            it('should use non-type tokens', function () {
                var injector = createInjector([{ provide: 'token', useValue: 'value' }]);
                matchers_1.expect(injector.get('token')).toEqual('value');
            });
            it('should throw when given invalid providers', function () {
                matchers_1.expect(function () { return createInjector(['blah']); })
                    .toThrowError("Invalid provider for the NgModule 'SomeModule' - only instances of Provider and Type are allowed, got: [?blah?]");
            });
            it('should throw when given blank providers', function () {
                matchers_1.expect(function () { return createInjector([null, { provide: 'token', useValue: 'value' }]); })
                    .toThrowError("Invalid provider for the NgModule 'SomeModule' - only instances of Provider and Type are allowed, got: [?null?, ...]");
            });
            it('should provide itself', function () {
                var parent = createInjector([]);
                var child = createInjector([], parent);
                matchers_1.expect(child.get(core_1.Injector)).toBe(child);
            });
            describe('injecting lazy providers into an eager provider via Injector.get', function () {
                it('should inject providers that were declared before it', function () {
                    var MyModule = (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager) {
                        }
                        return MyModule;
                    }());
                    MyModule = __decorate([
                        core_1.NgModule({
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
                    ], MyModule);
                    matchers_1.expect(createModule(MyModule).injector.get('eager')).toBe('eagerValue: lazyValue');
                });
                it('should inject providers that were declared after it', function () {
                    var MyModule = (function () {
                        // NgModule is eager, which makes all of its deps eager
                        function MyModule(eager) {
                        }
                        return MyModule;
                    }());
                    MyModule = __decorate([
                        core_1.NgModule({
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
                    ], MyModule);
                    matchers_1.expect(createModule(MyModule).injector.get('eager')).toBe('eagerValue: lazyValue');
                });
            });
            it('should throw when no provider defined', function () {
                var injector = createInjector([]);
                matchers_1.expect(function () { return injector.get('NonExisting'); })
                    .toThrowError('NullInjectorError: No provider for NonExisting!');
            });
            it('should throw when trying to instantiate a cyclic dependency', function () {
                matchers_1.expect(function () { return createInjector([Car, { provide: Engine, useClass: CyclicEngine }]); })
                    .toThrowError(/Cannot instantiate cyclic dependency! Car/g);
            });
            it('should support null values', function () {
                var injector = createInjector([{ provide: 'null', useValue: null }]);
                matchers_1.expect(injector.get('null')).toBe(null);
            });
            describe('child', function () {
                it('should load instances from parent injector', function () {
                    var parent = createInjector([Engine]);
                    var child = createInjector([], parent);
                    var engineFromParent = parent.get(Engine);
                    var engineFromChild = child.get(Engine);
                    matchers_1.expect(engineFromChild).toBe(engineFromParent);
                });
                it('should not use the child providers when resolving the dependencies of a parent provider', function () {
                    var parent = createInjector([Car, Engine]);
                    var child = createInjector([{ provide: Engine, useClass: TurboEngine }], parent);
                    var carFromChild = child.get(Car);
                    matchers_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
                });
                it('should create new instance in a child injector', function () {
                    var parent = createInjector([Engine]);
                    var child = createInjector([{ provide: Engine, useClass: TurboEngine }], parent);
                    var engineFromParent = parent.get(Engine);
                    var engineFromChild = child.get(Engine);
                    matchers_1.expect(engineFromParent).not.toBe(engineFromChild);
                    matchers_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
                });
            });
            describe('depedency resolution', function () {
                describe('@Self()', function () {
                    it('should return a dependency from self', function () {
                        var inj = createInjector([
                            Engine,
                            { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }
                        ]);
                        matchers_1.expect(inj.get(Car)).toBeAnInstanceOf(Car);
                    });
                    it('should throw when not requested provider on self', function () {
                        matchers_1.expect(function () { return createInjector([{
                                provide: Car,
                                useFactory: function (e) { return new Car(e); },
                                deps: [[Engine, new core_1.Self()]]
                            }]); })
                            .toThrowError(/No provider for Engine/g);
                    });
                });
                describe('default', function () {
                    it('should not skip self', function () {
                        var parent = createInjector([Engine]);
                        var child = createInjector([
                            { provide: Engine, useClass: TurboEngine },
                            { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [Engine] }
                        ], parent);
                        matchers_1.expect(child.get(Car).engine).toBeAnInstanceOf(TurboEngine);
                    });
                });
            });
            describe('lifecycle', function () {
                it('should instantiate modules eagerly', function () {
                    var created = false;
                    var ImportedModule = (function () {
                        function ImportedModule() {
                            created = true;
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule(),
                        __metadata("design:paramtypes", [])
                    ], ImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule] })
                    ], SomeModule);
                    createModule(SomeModule);
                    matchers_1.expect(created).toBe(true);
                });
                it('should instantiate providers that are not used by a module lazily', function () {
                    var created = false;
                    createInjector([{
                            provide: 'someToken',
                            useFactory: function () {
                                created = true;
                                return true;
                            }
                        }]);
                    matchers_1.expect(created).toBe(false);
                });
                it('should support ngOnDestroy on any provider', function () {
                    var destroyed = false;
                    var SomeInjectable = (function () {
                        function SomeInjectable() {
                        }
                        SomeInjectable.prototype.ngOnDestroy = function () { destroyed = true; };
                        return SomeInjectable;
                    }());
                    var SomeModule = (function () {
                        // Inject SomeInjectable to make it eager...
                        function SomeModule(i) {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ providers: [SomeInjectable] }),
                        __metadata("design:paramtypes", [SomeInjectable])
                    ], SomeModule);
                    var moduleRef = createModule(SomeModule);
                    matchers_1.expect(destroyed).toBe(false);
                    moduleRef.destroy();
                    matchers_1.expect(destroyed).toBe(true);
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
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ providers: [SomeInjectable] })
                    ], SomeModule);
                    var moduleRef = createModule(SomeModule);
                    matchers_1.expect(created).toBe(false);
                    matchers_1.expect(destroyed).toBe(false);
                    // no error if the provider was not yet created
                    moduleRef.destroy();
                    matchers_1.expect(created).toBe(false);
                    matchers_1.expect(destroyed).toBe(false);
                    moduleRef = createModule(SomeModule);
                    moduleRef.injector.get(SomeInjectable);
                    matchers_1.expect(created).toBe(true);
                    moduleRef.destroy();
                    matchers_1.expect(destroyed).toBe(true);
                });
            });
            describe('imported and exported modules', function () {
                it('should add the providers of imported modules', function () {
                    var ImportedModule = (function () {
                        function ImportedModule() {
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                    ], ImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ImportedModule)).toBeAnInstanceOf(ImportedModule);
                    matchers_1.expect(injector.get('token1')).toBe('imported');
                });
                it('should add the providers of imported ModuleWithProviders', function () {
                    var ImportedModule = (function () {
                        function ImportedModule() {
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule()
                    ], ImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            imports: [
                                { ngModule: ImportedModule, providers: [{ provide: 'token1', useValue: 'imported' }] }
                            ]
                        })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ImportedModule)).toBeAnInstanceOf(ImportedModule);
                    matchers_1.expect(injector.get('token1')).toBe('imported');
                });
                it('should overwrite the providers of imported modules', function () {
                    var ImportedModule = (function () {
                        function ImportedModule() {
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                    ], ImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'direct' }], imports: [ImportedModule] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported ModuleWithProviders', function () {
                    var ImportedModule = (function () {
                        function ImportedModule() {
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule()
                    ], ImportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({
                            providers: [{ provide: 'token1', useValue: 'direct' }],
                            imports: [
                                { ngModule: ImportedModule, providers: [{ provide: 'token1', useValue: 'imported' }] }
                            ]
                        })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported modules on the second import level', function () {
                    var ImportedModuleLevel2 = (function () {
                        function ImportedModuleLevel2() {
                        }
                        return ImportedModuleLevel2;
                    }());
                    ImportedModuleLevel2 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                    ], ImportedModuleLevel2);
                    var ImportedModuleLevel1 = (function () {
                        function ImportedModuleLevel1() {
                        }
                        return ImportedModuleLevel1;
                    }());
                    ImportedModuleLevel1 = __decorate([
                        core_1.NgModule({
                            providers: [{ provide: 'token1', useValue: 'direct' }],
                            imports: [ImportedModuleLevel2]
                        })
                    ], ImportedModuleLevel1);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModuleLevel1] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should add the providers of exported modules', function () {
                    var ExportedValue = (function () {
                        function ExportedValue() {
                        }
                        return ExportedValue;
                    }());
                    ExportedValue = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                    ], ExportedValue);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ exports: [ExportedValue] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get(SomeModule)).toBeAnInstanceOf(SomeModule);
                    matchers_1.expect(injector.get(ExportedValue)).toBeAnInstanceOf(ExportedValue);
                    matchers_1.expect(injector.get('token1')).toBe('exported');
                });
                it('should overwrite the providers of exported modules', function () {
                    var ExportedModule = (function () {
                        function ExportedModule() {
                        }
                        return ExportedModule;
                    }());
                    ExportedModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                    ], ExportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'direct' }], exports: [ExportedModule] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('direct');
                });
                it('should overwrite the providers of imported modules by following imported modules', function () {
                    var ImportedModule1 = (function () {
                        function ImportedModule1() {
                        }
                        return ImportedModule1;
                    }());
                    ImportedModule1 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                    ], ImportedModule1);
                    var ImportedModule2 = (function () {
                        function ImportedModule2() {
                        }
                        return ImportedModule2;
                    }());
                    ImportedModule2 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                    ], ImportedModule2);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule1, ImportedModule2] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should overwrite the providers of exported modules by following exported modules', function () {
                    var ExportedModule1 = (function () {
                        function ExportedModule1() {
                        }
                        return ExportedModule1;
                    }());
                    ExportedModule1 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported1' }] })
                    ], ExportedModule1);
                    var ExportedModule2 = (function () {
                        function ExportedModule2() {
                        }
                        return ExportedModule2;
                    }());
                    ExportedModule2 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported2' }] })
                    ], ExportedModule2);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ exports: [ExportedModule1, ExportedModule2] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('exported2');
                });
                it('should overwrite the providers of imported modules by exported modules', function () {
                    var ImportedModule = (function () {
                        function ImportedModule() {
                        }
                        return ImportedModule;
                    }());
                    ImportedModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported' }] })
                    ], ImportedModule);
                    var ExportedModule = (function () {
                        function ExportedModule() {
                        }
                        return ExportedModule;
                    }());
                    ExportedModule = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'exported' }] })
                    ], ExportedModule);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule], exports: [ExportedModule] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('exported');
                });
                it('should not overwrite the providers if a module was already used on the same level', function () {
                    var ImportedModule1 = (function () {
                        function ImportedModule1() {
                        }
                        return ImportedModule1;
                    }());
                    ImportedModule1 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                    ], ImportedModule1);
                    var ImportedModule2 = (function () {
                        function ImportedModule2() {
                        }
                        return ImportedModule2;
                    }());
                    ImportedModule2 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                    ], ImportedModule2);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule1, ImportedModule2, ImportedModule1] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should not overwrite the providers if a module was already used on a child level', function () {
                    var ImportedModule1 = (function () {
                        function ImportedModule1() {
                        }
                        return ImportedModule1;
                    }());
                    ImportedModule1 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported1' }] })
                    ], ImportedModule1);
                    var ImportedModule3 = (function () {
                        function ImportedModule3() {
                        }
                        return ImportedModule3;
                    }());
                    ImportedModule3 = __decorate([
                        core_1.NgModule({ imports: [ImportedModule1] })
                    ], ImportedModule3);
                    var ImportedModule2 = (function () {
                        function ImportedModule2() {
                        }
                        return ImportedModule2;
                    }());
                    ImportedModule2 = __decorate([
                        core_1.NgModule({ providers: [{ provide: 'token1', useValue: 'imported2' }] })
                    ], ImportedModule2);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [ImportedModule3, ImportedModule2, ImportedModule1] })
                    ], SomeModule);
                    var injector = createModule(SomeModule).injector;
                    matchers_1.expect(injector.get('token1')).toBe('imported2');
                });
                it('should throw when given invalid providers in an imported ModuleWithProviders', function () {
                    var ImportedModule1 = (function () {
                        function ImportedModule1() {
                        }
                        return ImportedModule1;
                    }());
                    ImportedModule1 = __decorate([
                        core_1.NgModule()
                    ], ImportedModule1);
                    var SomeModule = (function () {
                        function SomeModule() {
                        }
                        return SomeModule;
                    }());
                    SomeModule = __decorate([
                        core_1.NgModule({ imports: [{ ngModule: ImportedModule1, providers: ['broken'] }] })
                    ], SomeModule);
                    matchers_1.expect(function () { return createModule(SomeModule).injector; })
                        .toThrowError("Invalid provider for the NgModule 'ImportedModule1' - only instances of Provider and Type are allowed, got: [?broken?]");
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvbGlua2VyL25nX21vZHVsZV9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEwUztBQUMxUyxxREFBa0Q7QUFDbEQsaURBQXdFO0FBQ3hFLDJFQUFzRTtBQUd0RSxzRkFBOEU7QUFDOUUsdUNBQXlDO0FBRXpDO0lBQUE7SUFBYyxDQUFDO0lBQUQsYUFBQztBQUFELENBQUMsQUFBZixJQUFlO0FBRWY7SUFDRTtRQUFnQixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUNyRCxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQ7SUFBQTtJQUF5QixDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUFDLEFBQTFCLElBQTBCO0FBRzFCLElBQU0sU0FBUztJQUNiLG1CQUFZLFFBQTJCO0lBQUcsQ0FBQztJQUM3QyxnQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRkssU0FBUztJQURkLGlCQUFVLEVBQUU7cUNBRVcsaUJBQWlCO0dBRG5DLFNBQVMsQ0FFZDtBQUVEO0lBQTBCLCtCQUFNO0lBQWhDOztJQUFrQyxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBQW5DLENBQTBCLE1BQU0sR0FBRztBQUVuQyxJQUFNLElBQUksR0FBRyxJQUFJLHFCQUFjLENBQVEsTUFBTSxDQUFDLENBQUM7QUFFL0MsSUFBTSxHQUFHO0lBRVAsYUFBWSxNQUFjO1FBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFBQyxDQUFDO0lBQ3ZELFVBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhLLEdBQUc7SUFEUixpQkFBVSxFQUFFO3FDQUdTLE1BQU07R0FG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