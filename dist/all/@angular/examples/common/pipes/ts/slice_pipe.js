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
// #docregion SlicePipe_string
var SlicePipeStringComponent = (function () {
    function SlicePipeStringComponent() {
        this.str = 'abcdefghij';
    }
    return SlicePipeStringComponent;
}());
SlicePipeStringComponent = __decorate([
    core_1.Component({
        selector: 'slice-string-pipe',
        template: "<div>\n    <p>{{str}}[0:4]: '{{str | slice:0:4}}' - output is expected to be 'abcd'</p>\n    <p>{{str}}[4:0]: '{{str | slice:4:0}}' - output is expected to be ''</p>\n    <p>{{str}}[-4]: '{{str | slice:-4}}' - output is expected to be 'ghij'</p>\n    <p>{{str}}[-4:-2]: '{{str | slice:-4:-2}}' - output is expected to be 'gh'</p>\n    <p>{{str}}[-100]: '{{str | slice:-100}}' - output is expected to be 'abcdefghij'</p>\n    <p>{{str}}[100]: '{{str | slice:100}}' - output is expected to be ''</p>\n  </div>"
    })
], SlicePipeStringComponent);
exports.SlicePipeStringComponent = SlicePipeStringComponent;
// #enddocregion
// #docregion SlicePipe_list
var SlicePipeListComponent = (function () {
    function SlicePipeListComponent() {
        this.collection = ['a', 'b', 'c', 'd'];
    }
    return SlicePipeListComponent;
}());
SlicePipeListComponent = __decorate([
    core_1.Component({
        selector: 'slice-list-pipe',
        template: "<ul>\n    <li *ngFor=\"let i of collection | slice:1:3\">{{i}}</li>\n  </ul>"
    })
], SlicePipeListComponent);
exports.SlicePipeListComponent = SlicePipeListComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9waXBlcy90cy9zbGljZV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBRXhDLDhCQUE4QjtBQVk5QixJQUFhLHdCQUF3QjtJQVhyQztRQVlFLFFBQUcsR0FBVyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSx3QkFBd0I7SUFYcEMsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsUUFBUSxFQUFFLDZmQU9IO0tBQ1IsQ0FBQztHQUNXLHdCQUF3QixDQUVwQztBQUZZLDREQUF3QjtBQUdyQyxnQkFBZ0I7QUFFaEIsNEJBQTRCO0FBTzVCLElBQWEsc0JBQXNCO0lBTm5DO1FBT0UsZUFBVSxHQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFELDZCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxzQkFBc0I7SUFObEMsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsUUFBUSxFQUFFLDhFQUVKO0tBQ1AsQ0FBQztHQUNXLHNCQUFzQixDQUVsQztBQUZZLHdEQUFzQjtBQUduQyxnQkFBZ0IifQ==