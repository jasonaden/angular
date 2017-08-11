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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var util_1 = require("../util");
var TableComponent = (function () {
    function TableComponent() {
        this.data = util_1.emptyTable;
    }
    TableComponent.prototype.trackByIndex = function (index, item) { return index; };
    return TableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableComponent.prototype, "data", void 0);
TableComponent = __decorate([
    core_1.Component({
        selector: 'largetable',
        template: "<table><tbody>\n    <tr *ngFor=\"let row of data; trackBy: trackByIndex\">\n    <ng-template ngFor [ngForOf]=\"row\" [ngForTrackBy]=\"trackByIndex\" let-cell><ng-container [ngSwitch]=\"cell.row % 2\">\n        <td *ngSwitchCase=\"0\" style=\"background-color: grey\">{{cell.value}}</td><td *ngSwitchDefault>{{cell.value}}</td>\n    </ng-container></ng-template>\n    </tr>\n  </tbody></table>"
    })
], TableComponent);
exports.TableComponent = TableComponent;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [TableComponent], declarations: [TableComponent] })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvbmcyX3N3aXRjaC90YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5RDtBQUN6RCw4REFBd0Q7QUFFeEQsZ0NBQThDO0FBWTlDLElBQWEsY0FBYztJQVYzQjtRQVlFLFNBQUksR0FBa0IsaUJBQVUsQ0FBQztJQUduQyxDQUFDO0lBREMscUNBQVksR0FBWixVQUFhLEtBQWEsRUFBRSxJQUFTLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUQscUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUhDO0lBREMsWUFBSyxFQUFFOzs0Q0FDeUI7QUFGdEIsY0FBYztJQVYxQixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFlBQVk7UUFDdEIsUUFBUSxFQUFFLDBZQU1PO0tBQ2xCLENBQUM7R0FDVyxjQUFjLENBSzFCO0FBTFksd0NBQWM7QUFRM0IsSUFBYSxTQUFTO0lBQXRCO0lBQ0EsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxTQUFTO0lBRHJCLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxDQUFDO0dBQ3JGLFNBQVMsQ0FDckI7QUFEWSw4QkFBUyJ9