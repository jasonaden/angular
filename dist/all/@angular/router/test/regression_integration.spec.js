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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var testing_2 = require("@angular/router/testing");
describe('Integration', function () {
    describe('routerLinkActive', function () {
        it('should not cause infinite loops in the change detection - #15825', testing_1.fakeAsync(function () {
            var SimpleCmp = (function () {
                function SimpleCmp() {
                }
                return SimpleCmp;
            }());
            SimpleCmp = __decorate([
                core_1.Component({ selector: 'simple', template: 'simple' })
            ], SimpleCmp);
            var MyCmp = (function () {
                function MyCmp() {
                    this.show = false;
                }
                return MyCmp;
            }());
            MyCmp = __decorate([
                core_1.Component({
                    selector: 'some-root',
                    template: "\n        <div *ngIf=\"show\">\n          <ng-container *ngTemplateOutlet=\"tpl\"></ng-container>\n        </div>\n        <router-outlet></router-outlet>\n        <ng-template #tpl>\n          <a routerLink=\"/simple\" routerLinkActive=\"active\"></a>\n        </ng-template>"
                })
            ], MyCmp);
            var MyModule = (function () {
                function MyModule() {
                }
                return MyModule;
            }());
            MyModule = __decorate([
                core_1.NgModule({
                    imports: [common_1.CommonModule, testing_2.RouterTestingModule],
                    declarations: [MyCmp, SimpleCmp],
                    entryComponents: [SimpleCmp],
                })
            ], MyModule);
            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, MyCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
            router.navigateByUrl('/simple');
            advance(fixture);
            var instance = fixture.componentInstance;
            instance.show = true;
            expect(function () { return advance(fixture); }).not.toThrow();
        }));
    });
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9pbnRlZ3JhdGlvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3QvcmVncmVzc2lvbl9pbnRlZ3JhdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUF3RDtBQUN4RCxpREFBaUY7QUFDakYsMENBQXVDO0FBQ3ZDLG1EQUE0RDtBQUU1RCxRQUFRLENBQUMsYUFBYSxFQUFFO0lBRXRCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixFQUFFLENBQUMsa0VBQWtFLEVBQUUsbUJBQVMsQ0FBQztZQUU1RSxJQUFNLFNBQVM7Z0JBQWY7Z0JBQ0EsQ0FBQztnQkFBRCxnQkFBQztZQUFELENBQUMsQUFERCxJQUNDO1lBREssU0FBUztnQkFEZCxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7ZUFDOUMsU0FBUyxDQUNkO1lBYUQsSUFBTSxLQUFLO2dCQVhYO29CQVlFLFNBQUksR0FBWSxLQUFLLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUQsWUFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRkssS0FBSztnQkFYVixnQkFBUyxDQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO29CQUNyQixRQUFRLEVBQUUsc1JBT0U7aUJBQ2IsQ0FBQztlQUNJLEtBQUssQ0FFVjtZQU9ELElBQU0sUUFBUTtnQkFBZDtnQkFDQSxDQUFDO2dCQUFELGVBQUM7WUFBRCxDQUFDLEFBREQsSUFDQztZQURLLFFBQVE7Z0JBTGIsZUFBUSxDQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLHFCQUFZLEVBQUUsNkJBQW1CLENBQUM7b0JBQzVDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7b0JBQ2hDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDN0IsQ0FBQztlQUNJLFFBQVEsQ0FDYjtZQUVELGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFdEQsSUFBTSxNQUFNLEdBQVcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLENBQUM7WUFDM0MsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakIsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1lBQzNDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsaUJBQW9CLE9BQTRCO0lBQzlDLGNBQUksRUFBRSxDQUFDO0lBQ1AsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFFRCxvQkFBdUIsTUFBYyxFQUFFLElBQWE7SUFDbEQsSUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUMifQ==