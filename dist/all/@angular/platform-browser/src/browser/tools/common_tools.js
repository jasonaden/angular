"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../../dom/dom_adapter");
var browser_1 = require("./browser");
var ChangeDetectionPerfRecord = (function () {
    function ChangeDetectionPerfRecord(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
    }
    return ChangeDetectionPerfRecord;
}());
exports.ChangeDetectionPerfRecord = ChangeDetectionPerfRecord;
/**
 * Entry point for all Angular profiling-related debug tools. This object
 * corresponds to the `ng.profiler` in the dev console.
 */
var AngularProfiler = (function () {
    function AngularProfiler(ref) {
        this.appRef = ref.injector.get(core_1.ApplicationRef);
    }
    // tslint:disable:no-console
    /**
     * Exercises change detection in a loop and then prints the average amount of
     * time in milliseconds how long a single round of change detection takes for
     * the current state of the UI. It runs a minimum of 5 rounds for a minimum
     * of 500 milliseconds.
     *
     * Optionally, a user may pass a `config` parameter containing a map of
     * options. Supported options are:
     *
     * `record` (boolean) - causes the profiler to record a CPU profile while
     * it exercises the change detector. Example:
     *
     * ```
     * ng.profiler.timeChangeDetection({record: true})
     * ```
     */
    AngularProfiler.prototype.timeChangeDetection = function (config) {
        var record = config && config['record'];
        var profileName = 'Change Detection';
        // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
        var isProfilerAvailable = browser_1.window.console.profile != null;
        if (record && isProfilerAvailable) {
            browser_1.window.console.profile(profileName);
        }
        var start = dom_adapter_1.getDOM().performanceNow();
        var numTicks = 0;
        while (numTicks < 5 || (dom_adapter_1.getDOM().performanceNow() - start) < 500) {
            this.appRef.tick();
            numTicks++;
        }
        var end = dom_adapter_1.getDOM().performanceNow();
        if (record && isProfilerAvailable) {
            // need to cast to <any> because type checker thinks there's no argument
            // while in fact there is:
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
            browser_1.window.console.profileEnd(profileName);
        }
        var msPerTick = (end - start) / numTicks;
        browser_1.window.console.log("ran " + numTicks + " change detection cycles");
        browser_1.window.console.log(msPerTick.toFixed(2) + " ms per check");
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
    };
    return AngularProfiler;
}());
exports.AngularProfiler = AngularProfiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX3Rvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvYnJvd3Nlci90b29scy9jb21tb25fdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBMkQ7QUFDM0QscURBQTZDO0FBQzdDLHFDQUFpQztBQUVqQztJQUNFLG1DQUFtQixTQUFpQixFQUFTLFFBQWdCO1FBQTFDLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUNuRSxnQ0FBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksOERBQXlCO0FBSXRDOzs7R0FHRztBQUNIO0lBR0UseUJBQVksR0FBc0I7UUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFjLENBQUMsQ0FBQztJQUFDLENBQUM7SUFFdkYsNEJBQTRCO0lBQzVCOzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILDZDQUFtQixHQUFuQixVQUFvQixNQUFXO1FBQzdCLElBQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsSUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7UUFDdkMsc0ZBQXNGO1FBQ3RGLElBQU0sbUJBQW1CLEdBQUcsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGdCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsSUFBTSxLQUFLLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixPQUFPLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixRQUFRLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFDRCxJQUFNLEdBQUcsR0FBRyxvQkFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUNsQyx3RUFBd0U7WUFDeEUsMEJBQTBCO1lBQzFCLEVBQUU7WUFDRixzRUFBc0U7WUFDaEUsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFDRCxJQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDM0MsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQU8sUUFBUSw2QkFBMEIsQ0FBQyxDQUFDO1FBQzlELGdCQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxrQkFBZSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLElBQUkseUJBQXlCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFsREQsSUFrREM7QUFsRFksMENBQWUifQ==