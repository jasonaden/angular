"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var di_1 = require("@angular/core/src/di");
var testability_1 = require("@angular/core/src/testability/testability");
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var util_1 = require("../../src/util");
// Schedules a microtasks (using a resolved promise .then())
function microTask(fn) {
    util_1.scheduleMicroTask(function () {
        // We do double dispatch so that we  can wait for scheduleMicrotask in the Testability when
        // NgZone becomes stable.
        util_1.scheduleMicroTask(fn);
    });
}
var MockNgZone = (function (_super) {
    __extends(MockNgZone, _super);
    function MockNgZone() {
        var _this = _super.call(this, { enableLongStackTrace: false }) || this;
        _this.onUnstable = new core_1.EventEmitter(false);
        _this.onStable = new core_1.EventEmitter(false);
        return _this;
    }
    MockNgZone.prototype.unstable = function () { this.onUnstable.emit(null); };
    MockNgZone.prototype.stable = function () { this.onStable.emit(null); };
    return MockNgZone;
}(ng_zone_1.NgZone));
MockNgZone = __decorate([
    di_1.Injectable(),
    __metadata("design:paramtypes", [])
], MockNgZone);
function main() {
    testing_internal_1.describe('Testability', function () {
        var testability;
        var execute;
        var execute2;
        var ngZone;
        testing_internal_1.beforeEach(function () {
            ngZone = new MockNgZone();
            testability = new testability_1.Testability(ngZone);
            execute = new testing_internal_1.SpyObject().spy('execute');
            execute2 = new testing_internal_1.SpyObject().spy('execute');
        });
        testing_internal_1.describe('Pending count logic', function () {
            testing_internal_1.it('should start with a pending count of 0', function () { testing_internal_1.expect(testability.getPendingRequestCount()).toEqual(0); });
            testing_internal_1.it('should fire whenstable callbacks if pending count is 0', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                    async.done();
                });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously if pending count is 0', function () {
                testability.whenStable(execute);
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should not call whenstable callbacks when there are pending counts', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                testability.increasePendingRequestCount();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testability.decreasePendingRequestCount();
                    microTask(function () {
                        testing_internal_1.expect(execute).not.toHaveBeenCalled();
                        async.done();
                    });
                });
            }));
            testing_internal_1.it('should fire whenstable callbacks when pending drops to 0', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testability.decreasePendingRequestCount();
                    microTask(function () {
                        testing_internal_1.expect(execute).toHaveBeenCalled();
                        async.done();
                    });
                });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously when pending drops to 0', function () {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                testability.decreasePendingRequestCount();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should fire whenstable callbacks with didWork if pending count is 0', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).toHaveBeenCalledWith(false);
                    async.done();
                });
            }));
            testing_internal_1.it('should fire whenstable callbacks with didWork when pending drops to 0', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testability.decreasePendingRequestCount();
                    microTask(function () {
                        testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                        testability.whenStable(execute2);
                        microTask(function () {
                            testing_internal_1.expect(execute2).toHaveBeenCalledWith(false);
                            async.done();
                        });
                    });
                });
            }));
        });
        testing_internal_1.describe('NgZone callback logic', function () {
            testing_internal_1.it('should fire whenstable callback if event is already finished', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                    async.done();
                });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously if event is already finished', function () {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should fire whenstable callback when event finishes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    ngZone.stable();
                    microTask(function () {
                        testing_internal_1.expect(execute).toHaveBeenCalled();
                        async.done();
                    });
                });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously when event finishes', function () {
                ngZone.unstable();
                testability.whenStable(execute);
                ngZone.stable();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should not fire whenstable callback when event did not finish', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testability.decreasePendingRequestCount();
                    microTask(function () {
                        testing_internal_1.expect(execute).not.toHaveBeenCalled();
                        ngZone.stable();
                        microTask(function () {
                            testing_internal_1.expect(execute).toHaveBeenCalled();
                            async.done();
                        });
                    });
                });
            }));
            testing_internal_1.it('should not fire whenstable callback when there are pending counts', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                testability.increasePendingRequestCount();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    ngZone.stable();
                    microTask(function () {
                        testing_internal_1.expect(execute).not.toHaveBeenCalled();
                        testability.decreasePendingRequestCount();
                        microTask(function () {
                            testing_internal_1.expect(execute).not.toHaveBeenCalled();
                            testability.decreasePendingRequestCount();
                            microTask(function () {
                                testing_internal_1.expect(execute).toHaveBeenCalled();
                                async.done();
                            });
                        });
                    });
                });
            }));
            testing_internal_1.it('should fire whenstable callback with didWork if event is already finished', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                    testability.whenStable(execute2);
                    microTask(function () {
                        testing_internal_1.expect(execute2).toHaveBeenCalledWith(false);
                        async.done();
                    });
                });
            }));
            testing_internal_1.it('should fire whenstable callback with didwork when event finishes', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                ngZone.unstable();
                testability.whenStable(execute);
                microTask(function () {
                    ngZone.stable();
                    microTask(function () {
                        testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                        testability.whenStable(execute2);
                        microTask(function () {
                            testing_internal_1.expect(execute2).toHaveBeenCalledWith(false);
                            async.done();
                        });
                    });
                });
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEyQztBQUMzQywyQ0FBZ0Q7QUFDaEQseUVBQXNFO0FBQ3RFLDBEQUFzRDtBQUN0RCwrRUFBbUk7QUFFbkksdUNBQWlEO0FBSWpELDREQUE0RDtBQUM1RCxtQkFBbUIsRUFBWTtJQUM3Qix3QkFBaUIsQ0FBQztRQUNoQiwyRkFBMkY7UUFDM0YseUJBQXlCO1FBQ3pCLHdCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUdELElBQU0sVUFBVTtJQUFTLDhCQUFNO0lBTzdCO1FBQUEsWUFDRSxrQkFBTSxFQUFDLG9CQUFvQixFQUFFLEtBQUssRUFBQyxDQUFDLFNBR3JDO1FBRkMsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLG1CQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBQzFDLENBQUM7SUFFRCw2QkFBUSxHQUFSLGNBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRCwyQkFBTSxHQUFOLGNBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxpQkFBQztBQUFELENBQUMsQUFoQkQsQ0FBeUIsZ0JBQU0sR0FnQjlCO0FBaEJLLFVBQVU7SUFEZixlQUFVLEVBQUU7O0dBQ1AsVUFBVSxDQWdCZjtBQUVEO0lBQ0UsMkJBQVEsQ0FBQyxhQUFhLEVB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