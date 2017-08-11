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
var compiler_1 = require("@angular/compiler");
var ng_module_resolver_1 = require("@angular/compiler/src/ng_module_resolver");
var core_1 = require("@angular/core");
var metadata_1 = require("@angular/core/src/metadata");
var SomeClass1 = (function () {
    function SomeClass1() {
    }
    return SomeClass1;
}());
var SomeClass2 = (function () {
    function SomeClass2() {
    }
    return SomeClass2;
}());
var SomeClass3 = (function () {
    function SomeClass3() {
    }
    return SomeClass3;
}());
var SomeClass4 = (function () {
    function SomeClass4() {
    }
    return SomeClass4;
}());
var SomeClass5 = (function () {
    function SomeClass5() {
    }
    return SomeClass5;
}());
var SomeModule = (function () {
    function SomeModule() {
    }
    return SomeModule;
}());
SomeModule = __decorate([
    metadata_1.NgModule({
        declarations: [SomeClass1],
        imports: [SomeClass2],
        exports: [SomeClass3],
        providers: [SomeClass4],
        entryComponents: [SomeClass5]
    })
], SomeModule);
var SimpleClass = (function () {
    function SimpleClass() {
    }
    return SimpleClass;
}());
function main() {
    describe('NgModuleResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new ng_module_resolver_1.NgModuleResolver(new compiler_1.JitReflector()); });
        it('should read out the metadata from the class', function () {
            var moduleMetadata = resolver.resolve(SomeModule);
            expect(moduleMetadata).toEqual(new metadata_1.NgModule({
                declarations: [SomeClass1],
                imports: [SomeClass2],
                exports: [SomeClass3],
                providers: [SomeClass4],
                entryComponents: [SomeClass5]
            }));
        });
        it('should throw when simple class has no NgModule decorator', function () {
            expect(function () { return resolver.resolve(SimpleClass); })
                .toThrowError("No NgModule metadata found for '" + core_1.ɵstringify(SimpleClass) + "'.");
        });
        it('should support inheriting the metadata', function () {
            var Parent = (function () {
                function Parent() {
                }
                return Parent;
            }());
            Parent = __decorate([
                metadata_1.NgModule({ id: 'p' })
            ], Parent);
            var ChildNoDecorator = (function (_super) {
                __extends(ChildNoDecorator, _super);
                function ChildNoDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildNoDecorator;
            }(Parent));
            var ChildWithDecorator = (function (_super) {
                __extends(ChildWithDecorator, _super);
                function ChildWithDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildWithDecorator;
            }(Parent));
            ChildWithDecorator = __decorate([
                metadata_1.NgModule({ id: 'c' })
            ], ChildWithDecorator);
            expect(resolver.resolve(ChildNoDecorator)).toEqual(new metadata_1.NgModule({ id: 'p' }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(new metadata_1.NgModule({ id: 'c' }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L25nX21vZHVsZV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDhDQUErQztBQUMvQywrRUFBMEU7QUFDMUUsc0NBQXNEO0FBQ3RELHVEQUFvRDtBQUVwRDtJQUFBO0lBQWtCLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQTtJQUFrQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQW5CLElBQW1CO0FBQ25CO0lBQUE7SUFBa0IsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUFuQixJQUFtQjtBQUNuQjtJQUFBO0lBQWtCLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQTtJQUFrQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQW5CLElBQW1CO0FBU25CLElBQU0sVUFBVTtJQUFoQjtJQUNBLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssVUFBVTtJQVBmLG1CQUFRLENBQUM7UUFDUixZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUM7UUFDMUIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztRQUNyQixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7UUFDdkIsZUFBZSxFQUFFLENBQUMsVUFBVSxDQUFDO0tBQzlCLENBQUM7R0FDSSxVQUFVLENBQ2Y7QUFFRDtJQUFBO0lBQW1CLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBcEIsSUFBb0I7QUFFcEI7SUFDRSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsSUFBSSxRQUEwQixDQUFDO1FBRS9CLFVBQVUsQ0FBQyxjQUFRLFFBQVEsR0FBRyxJQUFJLHFDQUFnQixDQUFDLElBQUksdUJBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRSxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksbUJBQVEsQ0FBQztnQkFDMUMsWUFBWSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDckIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUN2QixlQUFlLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM3RCxNQUFNLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQTdCLENBQTZCLENBQUM7aUJBQ3RDLFlBQVksQ0FBQyxxQ0FBbUMsaUJBQVMsQ0FBQyxXQUFXLENBQUMsT0FBSSxDQUFDLENBQUM7UUFDbkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFFM0MsSUFBTSxNQUFNO2dCQUFaO2dCQUNBLENBQUM7Z0JBQUQsYUFBQztZQUFELENBQUMsQUFERCxJQUNDO1lBREssTUFBTTtnQkFEWCxtQkFBUSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDO2VBQ2QsTUFBTSxDQUNYO1lBRUQ7Z0JBQStCLG9DQUFNO2dCQUFyQzs7Z0JBQXVDLENBQUM7Z0JBQUQsdUJBQUM7WUFBRCxDQUFDLEFBQXhDLENBQStCLE1BQU0sR0FBRztZQUd4QyxJQUFNLGtCQUFrQjtnQkFBUyxzQ0FBTTtnQkFBdkM7O2dCQUNBLENBQUM7Z0JBQUQseUJBQUM7WUFBRCxDQUFDLEFBREQsQ0FBaUMsTUFBTSxHQUN0QztZQURLLGtCQUFrQjtnQkFEdkIsbUJBQVEsQ0FBQyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsQ0FBQztlQUNkLGtCQUFrQixDQUN2QjtZQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxtQkFBUSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUU1RSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksbUJBQVEsQ0FBQyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF2Q0Qsb0JBdUNDIn0=