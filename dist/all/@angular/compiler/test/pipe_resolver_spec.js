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
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var core_1 = require("@angular/core");
var metadata_1 = require("@angular/core/src/metadata");
var SomePipe = (function () {
    function SomePipe() {
    }
    return SomePipe;
}());
SomePipe = __decorate([
    metadata_1.Pipe({ name: 'somePipe', pure: true })
], SomePipe);
var SimpleClass = (function () {
    function SimpleClass() {
    }
    return SimpleClass;
}());
function main() {
    describe('PipeResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new pipe_resolver_1.PipeResolver(new compiler_1.JitReflector()); });
        it('should read out the metadata from the class', function () {
            var moduleMetadata = resolver.resolve(SomePipe);
            expect(moduleMetadata).toEqual(new metadata_1.Pipe({ name: 'somePipe', pure: true }));
        });
        it('should throw when simple class has no pipe decorator', function () {
            expect(function () { return resolver.resolve(SimpleClass); })
                .toThrowError("No Pipe decorator found on " + core_1.ɵstringify(SimpleClass));
        });
        it('should support inheriting the metadata', function () {
            var Parent = (function () {
                function Parent() {
                }
                return Parent;
            }());
            Parent = __decorate([
                metadata_1.Pipe({ name: 'p' })
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
                metadata_1.Pipe({ name: 'c' })
            ], ChildWithDecorator);
            expect(resolver.resolve(ChildNoDecorator)).toEqual(new metadata_1.Pipe({ name: 'p' }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(new metadata_1.Pipe({ name: 'c' }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9waXBlX3Jlc29sdmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQStDO0FBQy9DLHFFQUFpRTtBQUNqRSxzQ0FBc0Q7QUFDdEQsdURBQWdEO0FBR2hELElBQU0sUUFBUTtJQUFkO0lBQ0EsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLFFBQVE7SUFEYixlQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztHQUMvQixRQUFRLENBQ2I7QUFFRDtJQUFBO0lBQW1CLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBcEIsSUFBb0I7QUFFcEI7SUFDRSxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksUUFBc0IsQ0FBQztRQUUzQixVQUFVLENBQUMsY0FBUSxRQUFRLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksdUJBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RSxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQztpQkFDdEMsWUFBWSxDQUFDLGdDQUE4QixpQkFBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFFM0MsSUFBTSxNQUFNO2dCQUFaO2dCQUNBLENBQUM7Z0JBQUQsYUFBQztZQUFELENBQUMsQUFERCxJQUNDO1lBREssTUFBTTtnQkFEWCxlQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUM7ZUFDWixNQUFNLENBQ1g7WUFFRDtnQkFBK0Isb0NBQU07Z0JBQXJDOztnQkFBdUMsQ0FBQztnQkFBRCx1QkFBQztZQUFELENBQUMsQUFBeEMsQ0FBK0IsTUFBTSxHQUFHO1lBR3hDLElBQU0sa0JBQWtCO2dCQUFTLHNDQUFNO2dCQUF2Qzs7Z0JBQ0EsQ0FBQztnQkFBRCx5QkFBQztZQUFELENBQUMsQUFERCxDQUFpQyxNQUFNLEdBQ3RDO1lBREssa0JBQWtCO2dCQUR2QixlQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUM7ZUFDWixrQkFBa0IsQ0FDdkI7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWpDRCxvQkFpQ0MifQ==