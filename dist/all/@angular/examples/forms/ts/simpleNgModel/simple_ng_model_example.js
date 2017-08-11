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
// #docregion Component
var core_1 = require("@angular/core");
var SimpleNgModelComp = (function () {
    function SimpleNgModelComp() {
        this.name = '';
    }
    SimpleNgModelComp.prototype.setValue = function () { this.name = 'Nancy'; };
    return SimpleNgModelComp;
}());
SimpleNgModelComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: "\n    <input [(ngModel)]=\"name\" #ctrl=\"ngModel\" required>\n\n    <p>Value: {{ name }}</p>\n    <p>Valid: {{ ctrl.valid }}</p>\n    \n    <button (click)=\"setValue()\">Set value</button>\n  ",
    })
], SimpleNgModelComp);
exports.SimpleNgModelComp = SimpleNgModelComp;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlX25nX21vZGVsX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9mb3Jtcy90cy9zaW1wbGVOZ01vZGVsL3NpbXBsZV9uZ19tb2RlbF9leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsdUJBQXVCO0FBQ3ZCLHNDQUF3QztBQWF4QyxJQUFhLGlCQUFpQjtJQVg5QjtRQVlFLFNBQUksR0FBVyxFQUFFLENBQUM7SUFHcEIsQ0FBQztJQURDLG9DQUFRLEdBQVIsY0FBYSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckMsd0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLGlCQUFpQjtJQVg3QixnQkFBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsUUFBUSxFQUFFLG9NQU9UO0tBQ0YsQ0FBQztHQUNXLGlCQUFpQixDQUk3QjtBQUpZLDhDQUFpQjtBQUs5QixnQkFBZ0IifQ==