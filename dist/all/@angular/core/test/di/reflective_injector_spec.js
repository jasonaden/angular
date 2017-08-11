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
var reflective_injector_1 = require("@angular/core/src/di/reflective_injector");
var reflective_provider_1 = require("@angular/core/src/di/reflective_provider");
var errors_1 = require("@angular/core/src/errors");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
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
    function SportsCar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SportsCar;
}(Car));
SportsCar = __decorate([
    core_1.Injectable()
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
function main() {
    var dynamicProviders = [
        { provide: 'provider0', useValue: 1 }, { provide: 'provider1', useValue: 1 },
        { provide: 'provider2', useValue: 1 }, { provide: 'provider3', useValue: 1 },
        { provide: 'provider4', useValue: 1 }, { provide: 'provider5', useValue: 1 },
        { provide: 'provider6', useValue: 1 }, { provide: 'provider7', useValue: 1 },
        { provide: 'provider8', useValue: 1 }, { provide: 'provider9', useValue: 1 },
        { provide: 'provider10', useValue: 1 }
    ];
    function createInjector(providers, parent) {
        var resolvedProviders = core_1.ReflectiveInjector.resolve(providers.concat(dynamicProviders));
        if (parent != null) {
            return parent.createChildFromResolved(resolvedProviders);
        }
        else {
            return core_1.ReflectiveInjector.fromResolvedProviders(resolvedProviders);
        }
    }
    describe("injector", function () {
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
                .toThrowError('Cannot resolve all parameters for \'NoAnnotations\'(?). ' +
                'Make sure that all the parameters are decorated with Inject or have valid type annotations ' +
                'and that \'NoAnnotations\' is decorated with Injectable.');
        });
        it('should throw when no type and not @Inject (factory case)', function () {
            matchers_1.expect(function () { return createInjector([{ provide: 'someToken', useFactory: factoryFn }]); })
                .toThrowError('Cannot resolve all parameters for \'factoryFn\'(?). ' +
                'Make sure that all the parameters are decorated with Inject or have valid type annotations ' +
                'and that \'factoryFn\' is decorated with Injectable.');
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
        it('should inject dependencies instance of InjectionToken', function () {
            var TOKEN = new core_1.InjectionToken('token');
            var injector = createInjector([
                { provide: TOKEN, useValue: 'by token' },
                { provide: Engine, useFactory: function (v) { return v; }, deps: [[TOKEN]] },
            ]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toEqual('by token');
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
                Engine, { provide: SportsCar, useClass: SportsCar }, { provide: Car, useExisting: SportsCar }
            ]);
            var car = injector.get(Car);
            var sportsCar = injector.get(SportsCar);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car).toBe(sportsCar);
        });
        it('should support multiProviders', function () {
            var injector = createInjector([
                Engine, { provide: Car, useClass: SportsCar, multi: true },
                { provide: Car, useClass: CarWithOptionalEngine, multi: true }
            ]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(2);
            matchers_1.expect(cars[0]).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
        });
        it('should support multiProviders that are created using useExisting', function () {
            var injector = createInjector([Engine, SportsCar, { provide: Car, useExisting: SportsCar, multi: true }]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(1);
            matchers_1.expect(cars[0]).toBe(injector.get(SportsCar));
        });
        it('should throw when the aliased provider does not exist', function () {
            var injector = createInjector([{ provide: 'car', useExisting: SportsCar }]);
            var e = "No provider for " + util_1.stringify(SportsCar) + "! (car -> " + util_1.stringify(SportsCar) + ")";
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
                .toThrowError('Invalid provider - only instances of Provider and Type are allowed, got: blah');
        });
        it('should provide itself', function () {
            var parent = createInjector([]);
            var child = parent.resolveAndCreateChild([]);
            matchers_1.expect(child.get(core_1.Injector)).toBe(child);
        });
        it('should throw when no provider defined', function () {
            var injector = createInjector([]);
            matchers_1.expect(function () { return injector.get('NonExisting'); }).toThrowError('No provider for NonExisting!');
        });
        it('should show the full path when no provider', function () {
            var injector = createInjector([CarWithDashboard, Engine, Dashboard]);
            matchers_1.expect(function () { return injector.get(CarWithDashboard); })
                .toThrowError("No provider for DashboardSoftware! (" + util_1.stringify(CarWithDashboard) + " -> " + util_1.stringify(Dashboard) + " -> DashboardSoftware)");
        });
        it('should throw when trying to instantiate a cyclic dependency', function () {
            var injector = createInjector([Car, { provide: Engine, useClass: CyclicEngine }]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError("Cannot instantiate cyclic dependency! (" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + " -> " + util_1.stringify(Car) + ")");
        });
        it('should show the full path when error happens in a constructor', function () {
            var providers = core_1.ReflectiveInjector.resolve([Car, { provide: Engine, useClass: BrokenEngine }]);
            var injector = new reflective_injector_1.ReflectiveInjector_(providers);
            try {
                injector.get(Car);
                throw 'Must throw';
            }
            catch (e) {
                matchers_1.expect(e.message).toContain("Error during instantiation of Engine! (" + util_1.stringify(Car) + " -> Engine)");
                matchers_1.expect(errors_1.getOriginalError(e) instanceof Error).toBeTruthy();
                matchers_1.expect(e.keys[0].token).toEqual(Engine);
            }
        });
        it('should instantiate an object after a failed attempt', function () {
            var isBroken = true;
            var injector = createInjector([
                Car, { provide: Engine, useFactory: (function () { return isBroken ? new BrokenEngine() : new Engine(); }) }
            ]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError('Broken Engine: Error during instantiation of Engine! (Car -> Engine).');
            isBroken = false;
            matchers_1.expect(injector.get(Car)).toBeAnInstanceOf(Car);
        });
        it('should support null values', function () {
            var injector = createInjector([{ provide: 'null', useValue: null }]);
            matchers_1.expect(injector.get('null')).toBe(null);
        });
    });
    describe('child', function () {
        it('should load instances from parent injector', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var child = parent.resolveAndCreateChild([]);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromChild).toBe(engineFromParent);
        });
        it('should not use the child providers when resolving the dependencies of a parent provider', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Car, Engine]);
            var child = parent.resolveAndCreateChild([{ provide: Engine, useClass: TurboEngine }]);
            var carFromChild = child.get(Car);
            matchers_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
        });
        it('should create new instance in a child injector', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var child = parent.resolveAndCreateChild([{ provide: Engine, useClass: TurboEngine }]);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromParent).not.toBe(engineFromChild);
            matchers_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
        });
        it('should give access to parent', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([]);
            var child = parent.resolveAndCreateChild([]);
            matchers_1.expect(child.parent).toBe(parent);
        });
    });
    describe('resolveAndInstantiate', function () {
        it('should instantiate an object in the context of the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var car = inj.resolveAndInstantiate(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBe(inj.get(Engine));
        });
        it('should not store the instantiated object in the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            inj.resolveAndInstantiate(Car);
            matchers_1.expect(function () { return inj.get(Car); }).toThrowError();
        });
    });
    describe('instantiate', function () {
        it('should instantiate an object in the context of the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var car = inj.instantiateResolved(core_1.ReflectiveInjector.resolve([Car])[0]);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBe(inj.get(Engine));
        });
    });
    describe('depedency resolution', function () {
        describe('@Self()', function () {
            it('should return a dependency from self', function () {
                var inj = core_1.ReflectiveInjector.resolveAndCreate([
                    Engine,
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }
                ]);
                matchers_1.expect(inj.get(Car)).toBeAnInstanceOf(Car);
            });
            it('should throw when not requested provider on self', function () {
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
                var child = parent.resolveAndCreateChild([{ provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }]);
                matchers_1.expect(function () { return child.get(Car); })
                    .toThrowError("No provider for Engine! (" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + ")");
            });
        });
        describe('default', function () {
            it('should not skip self', function () {
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
                var child = parent.resolveAndCreateChild([
                    { provide: Engine, useClass: TurboEngine },
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [Engine] }
                ]);
                matchers_1.expect(child.get(Car).engine).toBeAnInstanceOf(TurboEngine);
            });
        });
    });
    describe('resolve', function () {
        it('should resolve and flatten', function () {
            var providers = core_1.ReflectiveInjector.resolve([Engine, [BrokenEngine]]);
            providers.forEach(function (b) {
                if (!b)
                    return; // the result is a sparse array
                matchers_1.expect(b instanceof reflective_provider_1.ResolvedReflectiveProvider_).toBe(true);
            });
        });
        it('should support multi providers', function () {
            var provider = core_1.ReflectiveInjector.resolve([
                { provide: Engine, useClass: BrokenEngine, multi: true },
                { provide: Engine, useClass: TurboEngine, multi: true }
            ])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(2);
        });
        it('should support providers as hash', function () {
            var provider = core_1.ReflectiveInjector.resolve([
                { provide: Engine, useClass: BrokenEngine, multi: true },
                { provide: Engine, useClass: TurboEngine, multi: true }
            ])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(2);
        });
        it('should support multi providers with only one provider', function () {
            var provider = core_1.ReflectiveInjector.resolve([{ provide: Engine, useClass: BrokenEngine, multi: true }])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(1);
        });
        it('should throw when mixing multi providers with regular providers', function () {
            matchers_1.expect(function () {
                core_1.ReflectiveInjector.resolve([{ provide: Engine, useClass: BrokenEngine, multi: true }, Engine]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
            matchers_1.expect(function () {
                core_1.ReflectiveInjector.resolve([Engine, { provide: Engine, useClass: BrokenEngine, multi: true }]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
        });
        it('should resolve forward references', function () {
            var providers = core_1.ReflectiveInjector.resolve([
                core_1.forwardRef(function () { return Engine; }),
                [{ provide: core_1.forwardRef(function () { return BrokenEngine; }), useClass: core_1.forwardRef(function () { return Engine; }) }], {
                    provide: core_1.forwardRef(function () { return String; }),
                    useFactory: function () { return 'OK'; },
                    deps: [core_1.forwardRef(function () { return Engine; })]
                }
            ]);
            var engineProvider = providers[0];
            var brokenEngineProvider = providers[1];
            var stringProvider = providers[2];
            matchers_1.expect(engineProvider.resolvedFactories[0].factory() instanceof Engine).toBe(true);
            matchers_1.expect(brokenEngineProvider.resolvedFactories[0].factory() instanceof Engine).toBe(true);
            matchers_1.expect(stringProvider.resolvedFactories[0].dependencies[0].key)
                .toEqual(core_1.ReflectiveKey.get(Engine));
        });
        it('should support overriding factory dependencies with dependency annotations', function () {
            var providers = core_1.ReflectiveInjector.resolve([{
                    provide: 'token',
                    useFactory: function (e /** TODO #9100 */) { return 'result'; },
                    deps: [[new core_1.Inject('dep')]]
                }]);
            var provider = providers[0];
            matchers_1.expect(provider.resolvedFactories[0].dependencies[0].key.token).toEqual('dep');
        });
        it('should allow declaring dependencies with flat arrays', function () {
            var resolved = core_1.ReflectiveInjector.resolve([{ provide: 'token', useFactory: function (e) { return e; }, deps: [new core_1.Inject('dep')] }]);
            var nestedResolved = core_1.ReflectiveInjector.resolve([{ provide: 'token', useFactory: function (e) { return e; }, deps: [[new core_1.Inject('dep')]] }]);
            matchers_1.expect(resolved[0].resolvedFactories[0].dependencies[0].key.token)
                .toEqual(nestedResolved[0].resolvedFactories[0].dependencies[0].key.token);
        });
    });
    describe('displayName', function () {
        it('should work', function () {
            matchers_1.expect(core_1.ReflectiveInjector.resolveAndCreate([Engine, BrokenEngine])
                .displayName)
                .toEqual('ReflectiveInjector(providers: [ "Engine" ,  "BrokenEngine" ])');
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2RpL3JlZmxlY3RpdmVfaW5qZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBb0o7QUFDcEosZ0ZBQTZFO0FBQzdFLGdGQUFxRjtBQUNyRixtREFBMEQ7QUFDMUQsMkVBQXNFO0FBQ3RFLHVDQUF5QztBQUV6QztJQUFBO0lBQWMsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBQWYsSUFBZTtBQUVmO0lBQ0U7UUFBZ0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDckQsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVEO0lBQUE7SUFBeUIsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQUExQixJQUEwQjtBQUcxQixJQUFNLFNBQVM7SUFDYixtQkFBWSxRQUEyQjtJQUFHLENBQUM7SUFDN0MsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLFNBQVM7SUFEZCxpQkFBVSxFQUFFO3FDQUVXLGlCQUFpQjtHQURuQyxTQUFTLENBRWQ7QUFFRDtJQUEwQiwrQkFBTTtJQUFoQzs7SUFBa0MsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFuQyxDQUEwQixNQUFNLEdBQUc7QUFHbkMsSUFBTSxHQUFHO0lBQ1AsYUFBbUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDO0lBQ3ZDLFVBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZLLEdBQUc7SUFEUixpQkFBVSxFQUFFO3FDQUVnQixNQUFNO0dBRDdCLEdBQUcsQ0FFUjtBQUdELElBQU0scUJBQXFCO0lBQ3pCLCtCQUErQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0s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