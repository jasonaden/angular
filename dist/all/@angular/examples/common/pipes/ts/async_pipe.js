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
var Observable_1 = require("rxjs/Observable");
// #docregion AsyncPipePromise
var AsyncPromisePipeComponent = (function () {
    function AsyncPromisePipeComponent() {
        this.greeting = null;
        this.arrived = false;
        this.resolve = null;
        this.reset();
    }
    AsyncPromisePipeComponent.prototype.reset = function () {
        var _this = this;
        this.arrived = false;
        this.greeting = new Promise(function (resolve, reject) { _this.resolve = resolve; });
    };
    AsyncPromisePipeComponent.prototype.clicked = function () {
        if (this.arrived) {
            this.reset();
        }
        else {
            this.resolve('hi there!');
            this.arrived = true;
        }
    };
    return AsyncPromisePipeComponent;
}());
AsyncPromisePipeComponent = __decorate([
    core_1.Component({
        selector: 'async-promise-pipe',
        template: "<div>\n    <code>promise|async</code>: \n    <button (click)=\"clicked()\">{{ arrived ? 'Reset' : 'Resolve' }}</button>\n    <span>Wait for it... {{ greeting | async }}</span>\n  </div>"
    }),
    __metadata("design:paramtypes", [])
], AsyncPromisePipeComponent);
exports.AsyncPromisePipeComponent = AsyncPromisePipeComponent;
// #enddocregion
// #docregion AsyncPipeObservable
var AsyncObservablePipeComponent = (function () {
    function AsyncObservablePipeComponent() {
        this.time = new Observable_1.Observable(function (observer) {
            setInterval(function () { return observer.next(new Date().toString()); }, 1000);
        });
    }
    return AsyncObservablePipeComponent;
}());
AsyncObservablePipeComponent = __decorate([
    core_1.Component({
        selector: 'async-observable-pipe',
        template: '<div><code>observable|async</code>: Time: {{ time | async }}</div>'
    })
], AsyncObservablePipeComponent);
exports.AsyncObservablePipeComponent = AsyncObservablePipeComponent;
// #enddocregion
// For some reason protractor hangs on setInterval. So we will run outside of angular zone so that
// protractor will not see us. Also we want to have this outside the docregion so as not to confuse
// the reader.
function setInterval(fn, delay) {
    var zone = Zone.current;
    var rootZone = zone;
    while (rootZone.parent) {
        rootZone = rootZone.parent;
    }
    rootZone.run(function () { window.setInterval(function () { zone.run(fn, this, arguments); }, delay); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9waXBlcy90cy9hc3luY19waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBQ3hDLDhDQUEyQztBQUczQyw4QkFBOEI7QUFTOUIsSUFBYSx5QkFBeUI7SUFNcEM7UUFMQSxhQUFRLEdBQXlCLElBQUksQ0FBQztRQUN0QyxZQUFPLEdBQVksS0FBSyxDQUFDO1FBRWpCLFlBQU8sR0FBa0IsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFL0IseUNBQUssR0FBTDtRQUFBLGlCQUdDO1FBRkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBUyxVQUFDLE9BQU8sRUFBRSxNQUFNLElBQU8sS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQsMkNBQU8sR0FBUDtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxPQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFDSCxnQ0FBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQlkseUJBQXlCO0lBUnJDLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsb0JBQW9CO1FBQzlCLFFBQVEsRUFBRSwyTEFJSDtLQUNSLENBQUM7O0dBQ1cseUJBQXlCLENBcUJyQztBQXJCWSw4REFBeUI7QUFzQnRDLGdCQUFnQjtBQUVoQixpQ0FBaUM7QUFLakMsSUFBYSw0QkFBNEI7SUFKekM7UUFLRSxTQUFJLEdBQUcsSUFBSSx1QkFBVSxDQUFTLFVBQUMsUUFBNEI7WUFDekQsV0FBVyxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBcEMsQ0FBb0MsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBRCxtQ0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksNEJBQTRCO0lBSnhDLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsdUJBQXVCO1FBQ2pDLFFBQVEsRUFBRSxvRUFBb0U7S0FDL0UsQ0FBQztHQUNXLDRCQUE0QixDQUl4QztBQUpZLG9FQUE0QjtBQUt6QyxnQkFBZ0I7QUFFaEIsa0dBQWtHO0FBQ2xHLG1HQUFtRztBQUNuRyxjQUFjO0FBQ2QscUJBQXFCLEVBQVksRUFBRSxLQUFhO0lBQzlDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDMUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFDRCxRQUFRLENBQUMsR0FBRyxDQUNSLGNBQVEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRyxDQUFDIn0=