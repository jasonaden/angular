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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lang_1 = require("../src/util/lang");
var di_1 = require("./di");
/**
 * A function that will be executed when an application is initialized.
 * @experimental
 */
exports.APP_INITIALIZER = new di_1.InjectionToken('Application Initializer');
/**
 * A class that reflects the state of running {@link APP_INITIALIZER}s.
 *
 * @experimental
 */
var ApplicationInitStatus = (function () {
    function ApplicationInitStatus(appInits) {
        var _this = this;
        this.appInits = appInits;
        this.initialized = false;
        this._done = false;
        this._donePromise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    /** @internal */
    ApplicationInitStatus.prototype.runInitializers = function () {
        var _this = this;
        if (this.initialized) {
            return;
        }
        var asyncInitPromises = [];
        var complete = function () {
            _this._done = true;
            _this.resolve();
        };
        if (this.appInits) {
            for (var i = 0; i < this.appInits.length; i++) {
                var initResult = this.appInits[i]();
                if (lang_1.isPromise(initResult)) {
                    asyncInitPromises.push(initResult);
                }
            }
        }
        Promise.all(asyncInitPromises).then(function () { complete(); }).catch(function (e) { _this.reject(e); });
        if (asyncInitPromises.length === 0) {
            complete();
        }
        this.initialized = true;
    };
    Object.defineProperty(ApplicationInitStatus.prototype, "done", {
        get: function () { return this._done; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationInitStatus.prototype, "donePromise", {
        get: function () { return this._donePromise; },
        enumerable: true,
        configurable: true
    });
    return ApplicationInitStatus;
}());
ApplicationInitStatus = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(exports.APP_INITIALIZER)), __param(0, di_1.Optional()),
    __metadata("design:paramtypes", [Array])
], ApplicationInitStatus);
exports.ApplicationInitStatus = ApplicationInitStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25faW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2FwcGxpY2F0aW9uX2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCx5Q0FBMkM7QUFFM0MsMkJBQWtFO0FBR2xFOzs7R0FHRztBQUNVLFFBQUEsZUFBZSxHQUFHLElBQUksbUJBQWMsQ0FBb0IseUJBQXlCLENBQUMsQ0FBQztBQUVoRzs7OztHQUlHO0FBRUgsSUFBYSxxQkFBcUI7SUFPaEMsK0JBQXlELFFBQXVCO1FBQWhGLGlCQUtDO1FBTHdELGFBQVEsR0FBUixRQUFRLENBQWU7UUFKeEUsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFcEIsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUdwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDdkMsS0FBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDbkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLCtDQUFlLEdBQWY7UUFBQSxpQkEyQkM7UUExQkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQU0saUJBQWlCLEdBQW1CLEVBQUUsQ0FBQztRQUU3QyxJQUFNLFFBQVEsR0FBRztZQUNmLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckMsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFRLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFNLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxRQUFRLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQUksdUNBQUk7YUFBUixjQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTFDLHNCQUFJLDhDQUFXO2FBQWYsY0FBa0MsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRCw0QkFBQztBQUFELENBQUMsQUEvQ0QsSUErQ0M7QUEvQ1kscUJBQXFCO0lBRGpDLGVBQVUsRUFBRTtJQVFFLFdBQUEsV0FBTSxDQUFDLHVCQUFlLENBQUMsQ0FBQSxFQUFFLFdBQUEsYUFBUSxFQUFFLENBQUE7O0dBUHJDLHFCQUFxQixDQStDakM7QUEvQ1ksc0RBQXFCIn0=