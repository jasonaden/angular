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
// #docregion DatePipe
var DatePipeComponent = (function () {
    function DatePipeComponent() {
        this.today = Date.now();
    }
    return DatePipeComponent;
}());
DatePipeComponent = __decorate([
    core_1.Component({
        selector: 'date-pipe',
        template: "<div>\n    <p>Today is {{today | date}}</p>\n    <p>Or if you prefer, {{today | date:'fullDate'}}</p>\n    <p>The time is {{today | date:'jmZ'}}</p>\n  </div>"
    })
], DatePipeComponent);
exports.DatePipeComponent = DatePipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL2RhdGVfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF3QztBQUV4QyxzQkFBc0I7QUFTdEIsSUFBYSxpQkFBaUI7SUFSOUI7UUFTRSxVQUFLLEdBQVcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksaUJBQWlCO0lBUjdCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsV0FBVztRQUNyQixRQUFRLEVBQUUsZ0tBSUg7S0FDUixDQUFDO0dBQ1csaUJBQWlCLENBRTdCO0FBRlksOENBQWlCO0FBRzlCLGdCQUFnQiJ9