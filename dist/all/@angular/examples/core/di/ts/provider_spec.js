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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
function main() {
    describe('Provider examples', function () {
        describe('TypeProvider', function () {
            it('works', function () {
                // #docregion TypeProvider
                var Greeting = (function () {
                    function Greeting() {
                        this.salutation = 'Hello';
                    }
                    return Greeting;
                }());
                Greeting = __decorate([
                    core_1.Injectable()
                ], Greeting);
                var injector = core_1.ReflectiveInjector.resolveAndCreate([
                    Greeting,
                ]);
                expect(injector.get(Greeting).salutation).toBe('Hello');
                // #enddocregion
            });
        });
        describe('ValueProvider', function () {
            it('works', function () {
                // #docregion ValueProvider
                var injector = core_1.Injector.create([{ provide: String, useValue: 'Hello' }]);
                expect(injector.get(String)).toEqual('Hello');
                // #enddocregion
            });
        });
        describe('MultiProviderAspect', function () {
            it('works', function () {
                // #docregion MultiProviderAspect
                var locale = new core_1.InjectionToken('locale');
                var injector = core_1.Injector.create([
                    { provide: locale, multi: true, useValue: 'en' },
                    { provide: locale, multi: true, useValue: 'sk' },
                ]);
                var locales = injector.get(locale);
                expect(locales).toEqual(['en', 'sk']);
                // #enddocregion
            });
        });
        describe('ClassProvider', function () {
            it('works', function () {
                // #docregion ClassProvider
                var Shape = (function () {
                    function Shape() {
                    }
                    return Shape;
                }());
                var Square = (function (_super) {
                    __extends(Square, _super);
                    function Square() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.name = 'square';
                        return _this;
                    }
                    return Square;
                }(Shape));
                var injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: Shape, useClass: Square }]);
                var shape = injector.get(Shape);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
            it('is different then useExisting', function () {
                // #docregion ClassProviderDifference
                var Greeting = (function () {
                    function Greeting() {
                        this.salutation = 'Hello';
                    }
                    return Greeting;
                }());
                var FormalGreeting = (function (_super) {
                    __extends(FormalGreeting, _super);
                    function FormalGreeting() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.salutation = 'Greetings';
                        return _this;
                    }
                    return FormalGreeting;
                }(Greeting));
                var injector = core_1.ReflectiveInjector.resolveAndCreate([FormalGreeting, { provide: Greeting, useClass: FormalGreeting }]);
                // The injector returns different instances.
                // See: {provide: ?, useExisting: ?} if you want the same instance.
                expect(injector.get(FormalGreeting)).not.toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('StaticClassProvider', function () {
            it('works', function () {
                // #docregion StaticClassProvider
                var Shape = (function () {
                    function Shape() {
                    }
                    return Shape;
                }());
                var Square = (function (_super) {
                    __extends(Square, _super);
                    function Square() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.name = 'square';
                        return _this;
                    }
                    return Square;
                }(Shape));
                var injector = core_1.Injector.create([{ provide: Shape, useClass: Square, deps: [] }]);
                var shape = injector.get(Shape);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
            it('is different then useExisting', function () {
                // #docregion StaticClassProviderDifference
                var Greeting = (function () {
                    function Greeting() {
                        this.salutation = 'Hello';
                    }
                    return Greeting;
                }());
                var FormalGreeting = (function (_super) {
                    __extends(FormalGreeting, _super);
                    function FormalGreeting() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.salutation = 'Greetings';
                        return _this;
                    }
                    return FormalGreeting;
                }(Greeting));
                var injector = core_1.Injector.create([
                    { provide: FormalGreeting, useClass: FormalGreeting, deps: [] },
                    { provide: Greeting, useClass: FormalGreeting, deps: [] }
                ]);
                // The injector returns different instances.
                // See: {provide: ?, useExisting: ?} if you want the same instance.
                expect(injector.get(FormalGreeting)).not.toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('ConstructorProvider', function () {
            it('works', function () {
                // #docregion ConstructorProvider
                var Square = (function () {
                    function Square() {
                        this.name = 'square';
                    }
                    return Square;
                }());
                var injector = core_1.Injector.create([{ provide: Square, deps: [] }]);
                var shape = injector.get(Square);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
        });
        describe('ExistingProvider', function () {
            it('works', function () {
                // #docregion ExistingProvider
                var Greeting = (function () {
                    function Greeting() {
                        this.salutation = 'Hello';
                    }
                    return Greeting;
                }());
                var FormalGreeting = (function (_super) {
                    __extends(FormalGreeting, _super);
                    function FormalGreeting() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.salutation = 'Greetings';
                        return _this;
                    }
                    return FormalGreeting;
                }(Greeting));
                var injector = core_1.Injector.create([
                    { provide: FormalGreeting, deps: [] }, { provide: Greeting, useExisting: FormalGreeting }
                ]);
                expect(injector.get(Greeting).salutation).toEqual('Greetings');
                expect(injector.get(FormalGreeting).salutation).toEqual('Greetings');
                expect(injector.get(FormalGreeting)).toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('FactoryProvider', function () {
            it('works', function () {
                // #docregion FactoryProvider
                var Location = new core_1.InjectionToken('location');
                var Hash = new core_1.InjectionToken('hash');
                var injector = core_1.Injector.create([
                    { provide: Location, useValue: 'http://angular.io/#someLocation' }, {
                        provide: Hash,
                        useFactory: function (location) { return location.split('#')[1]; },
                        deps: [Location]
                    }
                ]);
                expect(injector.get(Hash)).toEqual('someLocation');
                // #enddocregion
            });
            it('supports optional dependencies', function () {
                // #docregion FactoryProviderOptionalDeps
                var Location = new core_1.InjectionToken('location');
                var Hash = new core_1.InjectionToken('hash');
                var injector = core_1.Injector.create([{
                        provide: Hash,
                        useFactory: function (location) { return "Hash for: " + location; },
                        // use a nested array to define metadata for dependencies.
                        deps: [[new core_1.Optional(), Location]]
                    }]);
                expect(injector.get(Hash)).toEqual('Hash for: null');
                // #enddocregion
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvcHJvdmlkZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUc7QUFFakc7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLDBCQUEwQjtnQkFFMUIsSUFBTSxRQUFRO29CQURkO3dCQUVFLGVBQVUsR0FBRyxPQUFPLENBQUM7b0JBQ3ZCLENBQUM7b0JBQUQsZUFBQztnQkFBRCxDQUFDLEFBRkQsSUFFQztnQkFGSyxRQUFRO29CQURiLGlCQUFVLEVBQUU7bUJBQ1AsUUFBUSxDQUViO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDO29CQUNuRCxRQUFRO2lCQUNULENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hELGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUN4QixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLDJCQUEyQjtnQkFDM0IsSUFBTSxRQUFRLEdBQUcsZUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6RSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFP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