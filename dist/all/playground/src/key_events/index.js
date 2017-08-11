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
var KeyEventsApp = KeyEventsApp_1 = (function () {
    function KeyEventsApp() {
        this.lastKey = '(none)';
        this.shiftEnter = false;
    }
    KeyEventsApp.prototype.onKeyDown = function (event) {
        this.lastKey = KeyEventsApp_1._getEventFullKey(event);
        event.preventDefault();
    };
    KeyEventsApp.prototype.onShiftEnter = function (event) {
        this.shiftEnter = true;
        event.preventDefault();
    };
    KeyEventsApp.prototype.resetShiftEnter = function () { this.shiftEnter = false; };
    /**
     * Get a more readable version of current pressed keys.
     * @see KeyEventsPlugin.getEventFullKey
     */
    KeyEventsApp._getEventFullKey = function (event) {
        var modifierKeys = ['alt', 'control', 'meta', 'shift'];
        var modifierKeyGetters = {
            'alt': function (event) { return event.altKey; },
            'control': function (event) { return event.ctrlKey; },
            'meta': function (event) { return event.metaKey; },
            'shift': function (event) { return event.shiftKey; }
        };
        var fullKey = '';
        var key = event.key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        modifierKeys.forEach(function (modifierName) {
            if (modifierName != key) {
                var modifierGetter = modifierKeyGetters[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        return fullKey + key;
    };
    return KeyEventsApp;
}());
KeyEventsApp = KeyEventsApp_1 = __decorate([
    core_1.Component({
        selector: 'key-events-app',
        template: "Click in the following area and press a key to display its name:<br>\n  <div (keydown)=\"onKeyDown($event)\" class=\"sample-area\" tabindex=\"0\">{{lastKey}}</div><br>\n  Click in the following area and press shift.enter:<br>\n  <div\n    (keydown.shift.enter)=\"onShiftEnter($event)\"\n    (click)=\"resetShiftEnter()\"\n    class=\"sample-area\"\n    tabindex=\"0\"\n  >{{shiftEnter ? 'You pressed shift.enter!' : ''}}</div>"
    })
], KeyEventsApp);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [KeyEventsApp], bootstrap: [KeyEventsApp], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
var KeyEventsApp_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2tleV9ldmVudHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBQ3hELDhFQUF5RTtBQWN6RSxJQUFNLFlBQVk7SUFabEI7UUFhRSxZQUFPLEdBQVcsUUFBUSxDQUFDO1FBQzNCLGVBQVUsR0FBWSxLQUFLLENBQUM7SUE0QzlCLENBQUM7SUExQ0MsZ0NBQVMsR0FBVCxVQUFVLEtBQW9CO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBWSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsbUNBQVksR0FBWixVQUFhLEtBQW9CO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsc0NBQWUsR0FBZixjQUEwQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFcEQ7OztPQUdHO0lBQ1ksNkJBQWdCLEdBQS9CLFVBQWdDLEtBQW9CO1FBQ2xELElBQU0sWUFBWSxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBTSxrQkFBa0IsR0FBdUQ7WUFDN0UsS0FBSyxFQUFFLFVBQUMsS0FBb0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQVosQ0FBWTtZQUM3QyxTQUFTLEVBQUUsVUFBQyxLQUFvQixJQUFLLE9BQUEsS0FBSyxDQUFDLE9BQU8sRUFBYixDQUFhO1lBQ2xELE1BQU0sRUFBRSxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsT0FBTyxFQUFiLENBQWE7WUFDL0MsT0FBTyxFQUFFLFVBQUMsS0FBb0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxRQUFRLEVBQWQsQ0FBYztTQUNsRCxDQUFDO1FBRUYsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFFLGtCQUFrQjtRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBRSxvREFBb0Q7UUFDcEUsQ0FBQztRQUNELFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsT0FBTyxJQUFJLFlBQVksR0FBRyxHQUFHLENBQUM7Z0JBQ2hDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUN2QixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDO0FBOUNLLFlBQVk7SUFaakIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsUUFBUSxFQUFFLDRhQVE4QztLQUN6RCxDQUFDO0dBQ0ksWUFBWSxDQThDakI7QUFHRCxJQUFNLGFBQWE7SUFBbkI7SUFDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURLLGFBQWE7SUFEbEIsZUFBUSxDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFDLENBQUM7R0FDeEYsYUFBYSxDQUNsQjtBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=