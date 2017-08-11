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
var Zippy = (function () {
    function Zippy() {
        this.visible = true;
        this.title = '';
        this.open = new core_1.EventEmitter();
        this.close = new core_1.EventEmitter();
    }
    Zippy.prototype.toggle = function () {
        this.visible = !this.visible;
        if (this.visible) {
            this.open.emit(null);
        }
        else {
            this.close.emit(null);
        }
    };
    return Zippy;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Zippy.prototype, "title", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Zippy.prototype, "open", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Zippy.prototype, "close", void 0);
Zippy = __decorate([
    core_1.Component({ selector: 'zippy', templateUrl: 'app/zippy.html' })
], Zippy);
exports.Zippy = Zippy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3ppcHB5X2NvbXBvbmVudC9hcHAvemlwcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBcUU7QUFHckUsSUFBYSxLQUFLO0lBRGxCO1FBRUUsWUFBTyxHQUFZLElBQUksQ0FBQztRQUNmLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbEIsU0FBSSxHQUFzQixJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUM3QyxVQUFLLEdBQXNCLElBQUksbUJBQVksRUFBRSxDQUFDO0lBVTFELENBQUM7SUFSQyxzQkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFaVTtJQUFSLFlBQUssRUFBRTs7b0NBQW9CO0FBQ2xCO0lBQVQsYUFBTSxFQUFFOzhCQUFPLG1CQUFZO21DQUEyQjtBQUM3QztJQUFULGFBQU0sRUFBRTs4QkFBUSxtQkFBWTtvQ0FBMkI7QUFKN0MsS0FBSztJQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztHQUNqRCxLQUFLLENBY2pCO0FBZFksc0JBQUsifQ==