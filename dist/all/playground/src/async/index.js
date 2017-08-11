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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var AsyncApplication = (function () {
    function AsyncApplication() {
        this.val1 = 0;
        this.val2 = 0;
        this.val3 = 0;
        this.val4 = 0;
        this.timeoutId = null;
        this.multiTimeoutId = null;
        this.intervalId = null;
    }
    AsyncApplication.prototype.increment = function () { this.val1++; };
    ;
    AsyncApplication.prototype.delayedIncrement = function () {
        var _this = this;
        this.cancelDelayedIncrement();
        this.timeoutId = setTimeout(function () {
            _this.val2++;
            _this.timeoutId = null;
        }, 2000);
    };
    ;
    AsyncApplication.prototype.multiDelayedIncrements = function (i) {
        this.cancelMultiDelayedIncrements();
        var self = this;
        function helper(_i) {
            if (_i <= 0) {
                self.multiTimeoutId = null;
                return;
            }
            self.multiTimeoutId = setTimeout(function () {
                self.val3++;
                helper(_i - 1);
            }, 500);
        }
        helper(i);
    };
    ;
    AsyncApplication.prototype.periodicIncrement = function () {
        var _this = this;
        this.cancelPeriodicIncrement();
        this.intervalId = setInterval(function () { return _this.val4++; }, 2000);
    };
    ;
    AsyncApplication.prototype.cancelDelayedIncrement = function () {
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    };
    ;
    AsyncApplication.prototype.cancelMultiDelayedIncrements = function () {
        if (this.multiTimeoutId != null) {
            clearTimeout(this.multiTimeoutId);
            this.multiTimeoutId = null;
        }
    };
    ;
    AsyncApplication.prototype.cancelPeriodicIncrement = function () {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };
    ;
    return AsyncApplication;
}());
AsyncApplication = __decorate([
    core_1.Component({
        selector: 'async-app',
        template: "\n    <div id='increment'>\n      <span class='val'>{{val1}}</span>\n      <button class='action' (click)=\"increment()\">Increment</button>\n    </div>\n    <div id='delayedIncrement'>\n      <span class='val'>{{val2}}</span>\n      <button class='action' (click)=\"delayedIncrement()\">Delayed Increment</button>\n      <button class='cancel' *ngIf=\"timeoutId != null\" (click)=\"cancelDelayedIncrement()\">Cancel</button>\n    </div>\n    <div id='multiDelayedIncrements'>\n      <span class='val'>{{val3}}</span>\n      <button class='action' (click)=\"multiDelayedIncrements(10)\">10 Delayed Increments</button>\n      <button class='cancel' *ngIf=\"multiTimeoutId != null\" (click)=\"cancelMultiDelayedIncrements()\">Cancel</button>\n    </div>\n    <div id='periodicIncrement'>\n      <span class='val'>{{val4}}</span>\n      <button class='action' (click)=\"periodicIncrement()\">Periodic Increment</button>\n      <button class='cancel' *ngIf=\"intervalId != null\" (click)=\"cancelPeriodicIncrement()\">Cancel</button>\n    </div>\n  "
    })
], AsyncApplication);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [AsyncApplication], bootstrap: [AsyncApplication], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2FzeW5jL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUEwQnpFLElBQU0sZ0JBQWdCO0lBeEJ0QjtRQXlCRSxTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFDdEIsbUJBQWMsR0FBUSxJQUFJLENBQUM7UUFDM0IsZUFBVSxHQUFRLElBQUksQ0FBQztJQXVEekIsQ0FBQztJQXJEQyxvQ0FBUyxHQUFULGNBQW9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFBQSxDQUFDO0lBRW5DLDJDQUFnQixHQUFoQjtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7WUFDMUIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUFBLENBQUM7SUFFRixpREFBc0IsR0FBdEIsVUFBdUIsQ0FBUztRQUM5QixJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUVwQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsZ0JBQWdCLEVBQVU7WUFDeEIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFBQSxDQUFDO0lBRUYsNENBQWlCLEdBQWpCO1FBQUEsaUJBR0M7UUFGQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQUEsQ0FBQztJQUVGLGlEQUFzQixHQUF0QjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzQixZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBQUEsQ0FBQztJQUVGLHVEQUE0QixHQUE1QjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDO0lBQUEsQ0FBQztJQUVGLGtEQUF1QixHQUF2QjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1QixhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDO0lBQUEsQ0FBQztJQUNKLHVCQUFDO0FBQUQsQ0FBQyxBQTlERCxJQThEQztBQTlESyxnQkFBZ0I7SUF4QnJCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsV0FBVztRQUNyQixRQUFRLEVBQUUsdWhDQW9CVDtLQUNGLENBQUM7R0FDSSxnQkFBZ0IsQ0E4RHJCO0FBSUQsSUFBTSxhQUFhO0lBQW5CO0lBQ0EsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFESyxhQUFhO0lBRmxCLGVBQVEsQ0FDTCxFQUFDLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUMsQ0FBQztHQUMxRixhQUFhLENBQ2xCO0FBRUQ7SUFDRSxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsb0JBRUMifQ==