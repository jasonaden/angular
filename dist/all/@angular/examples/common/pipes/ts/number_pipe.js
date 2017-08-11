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
var core_1 = require("@angular/core");
// #docregion NumberPipe
var NumberPipeComponent = (function () {
    function NumberPipeComponent() {
        this.pi = 3.141592;
        this.e = 2.718281828459045;
    }
    return NumberPipeComponent;
}());
NumberPipeComponent = __decorate([
    core_1.Component({
        selector: 'number-pipe',
        template: "<div>\n    <p>e (no formatting): {{e}}</p>\n    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>\n    <p>pi (no formatting): {{pi}}</p>\n    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>\n  </div>"
    })
], NumberPipeComponent);
exports.NumberPipeComponent = NumberPipeComponent;
// #enddocregion
// #docregion PercentPipe
var PercentPipeComponent = (function () {
    function PercentPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    return PercentPipeComponent;
}());
PercentPipeComponent = __decorate([
    core_1.Component({
        selector: 'percent-pipe',
        template: "<div>\n    <p>A: {{a | percent}}</p>\n    <p>B: {{b | percent:'4.3-5'}}</p>\n  </div>"
    })
], PercentPipeComponent);
exports.PercentPipeComponent = PercentPipeComponent;
// #enddocregion
// #docregion CurrencyPipe
var CurrencyPipeComponent = (function () {
    function CurrencyPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    return CurrencyPipeComponent;
}());
CurrencyPipeComponent = __decorate([
    core_1.Component({
        selector: 'currency-pipe',
        template: "<div>\n    <p>A: {{a | currency:'USD':false}}</p>\n    <p>B: {{b | currency:'USD':true:'4.2-2'}}</p>\n  </div>"
    })
], CurrencyPipeComponent);
exports.CurrencyPipeComponent = CurrencyPipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb21tb24vcGlwZXMvdHMvbnVtYmVyX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFFeEMsd0JBQXdCO0FBVXhCLElBQWEsbUJBQW1CO0lBVGhDO1FBVUUsT0FBRSxHQUFXLFFBQVEsQ0FBQztRQUN0QixNQUFDLEdBQVcsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUFELDBCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxtQkFBbUI7SUFUL0IsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRSwyTEFLSDtLQUNSLENBQUM7R0FDVyxtQkFBbUIsQ0FHL0I7QUFIWSxrREFBbUI7QUFJaEMsZ0JBQWdCO0FBRWhCLHlCQUF5QjtBQVF6QixJQUFhLG9CQUFvQjtJQVBqQztRQVFFLE1BQUMsR0FBVyxLQUFLLENBQUM7UUFDbEIsTUFBQyxHQUFXLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLG9CQUFvQjtJQVBoQyxnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLHVGQUdIO0tBQ1IsQ0FBQztHQUNXLG9CQUFvQixDQUdoQztBQUhZLG9EQUFvQjtBQUlqQyxnQkFBZ0I7QUFFaEIsMEJBQTBCO0FBUTFCLElBQWEscUJBQXFCO0lBUGxDO1FBUUUsTUFBQyxHQUFXLEtBQUssQ0FBQztRQUNsQixNQUFDLEdBQVcsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFBRCw0QkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFkscUJBQXFCO0lBUGpDLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZUFBZTtRQUN6QixRQUFRLEVBQUUsZ0hBR0g7S0FDUixDQUFDO0dBQ1cscUJBQXFCLENBR2pDO0FBSFksc0RBQXFCO0FBSWxDLGdCQUFnQiJ9