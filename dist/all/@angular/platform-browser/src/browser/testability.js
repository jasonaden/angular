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
var dom_adapter_1 = require("../dom/dom_adapter");
var BrowserGetTestability = (function () {
    function BrowserGetTestability() {
    }
    BrowserGetTestability.init = function () { core_1.setTestabilityGetter(new BrowserGetTestability()); };
    BrowserGetTestability.prototype.addToWindow = function (registry) {
        core_1.ɵglobal['getAngularTestability'] = function (elem, findInAncestors) {
            if (findInAncestors === void 0) { findInAncestors = true; }
            var testability = registry.findTestabilityInTree(elem, findInAncestors);
            if (testability == null) {
                throw new Error('Could not find testability for element.');
            }
            return testability;
        };
        core_1.ɵglobal['getAllAngularTestabilities'] = function () { return registry.getAllTestabilities(); };
        core_1.ɵglobal['getAllAngularRootElements'] = function () { return registry.getAllRootElements(); };
        var whenAllStable = function (callback /** TODO #9100 */) {
            var testabilities = core_1.ɵglobal['getAllAngularTestabilities']();
            var count = testabilities.length;
            var didWork = false;
            var decrement = function (didWork_ /** TODO #9100 */) {
                didWork = didWork || didWork_;
                count--;
                if (count == 0) {
                    callback(didWork);
                }
            };
            testabilities.forEach(function (testability /** TODO #9100 */) {
                testability.whenStable(decrement);
            });
        };
        if (!core_1.ɵglobal['frameworkStabilizers']) {
            core_1.ɵglobal['frameworkStabilizers'] = [];
        }
        core_1.ɵglobal['frameworkStabilizers'].push(whenAllStable);
    };
    BrowserGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
        if (elem == null) {
            return null;
        }
        var t = registry.getTestability(elem);
        if (t != null) {
            return t;
        }
        else if (!findInAncestors) {
            return null;
        }
        if (dom_adapter_1.getDOM().isShadowRoot(elem)) {
            return this.findTestabilityInTree(registry, dom_adapter_1.getDOM().getHost(elem), true);
        }
        return this.findTestabilityInTree(registry, dom_adapter_1.getDOM().parentElement(elem), true);
    };
    return BrowserGetTestability;
}());
exports.BrowserGetTestability = BrowserGetTestability;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rlc3RhYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXdIO0FBRXhILGtEQUEwQztBQUUxQztJQUFBO0lBc0RBLENBQUM7SUFyRFEsMEJBQUksR0FBWCxjQUFnQiwyQkFBb0IsQ0FBQyxJQUFJLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEUsMkNBQVcsR0FBWCxVQUFZLFFBQTZCO1FBQ3ZDLGNBQU0sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLFVBQUMsSUFBUyxFQUFFLGVBQStCO1lBQS9CLGdDQUFBLEVBQUEsc0JBQStCO1lBQzNFLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDMUUsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUM3RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixjQUFNLENBQUMsNEJBQTRCLENBQUMsR0FBRyxjQUFNLE9BQUEsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEVBQTlCLENBQThCLENBQUM7UUFFNUUsY0FBTSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsY0FBTSxPQUFBLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUE3QixDQUE2QixDQUFDO1FBRTFFLElBQU0sYUFBYSxHQUFHLFVBQUMsUUFBYSxDQUFDLGlCQUFpQjtZQUNwRCxJQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDO1lBQzdELElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7WUFDakMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQU0sU0FBUyxHQUFHLFVBQVMsUUFBYSxDQUFDLGlCQUFpQjtnQkFDeEQsT0FBTyxHQUFHLE9BQU8sSUFBSSxRQUFRLENBQUM7Z0JBQzlCLEtBQUssRUFBRSxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztZQUNILENBQUMsQ0FBQztZQUNGLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBUyxXQUFnQixDQUFDLGlCQUFpQjtnQkFDL0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsY0FBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxxREFBcUIsR0FBckIsVUFBc0IsUUFBNkIsRUFBRSxJQUFTLEVBQUUsZUFBd0I7UUFFdEYsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsb0JBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsb0JBQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsb0JBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBdERELElBc0RDO0FBdERZLHNEQUFxQiJ9