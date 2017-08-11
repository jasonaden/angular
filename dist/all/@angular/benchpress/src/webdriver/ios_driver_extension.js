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
var web_driver_adapter_1 = require("../web_driver_adapter");
var web_driver_extension_1 = require("../web_driver_extension");
var IOsDriverExtension = IOsDriverExtension_1 = (function (_super) {
    __extends(IOsDriverExtension, _super);
    function IOsDriverExtension(_driver) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        return _this;
    }
    IOsDriverExtension.prototype.gc = function () { throw new Error('Force GC is not supported on iOS'); };
    IOsDriverExtension.prototype.timeBegin = function (name) {
        return this._driver.executeScript("console.time('" + name + "');");
    };
    IOsDriverExtension.prototype.timeEnd = function (name, restartName) {
        if (restartName === void 0) { restartName = null; }
        var script = "console.timeEnd('" + name + "');";
        if (restartName != null) {
            script += "console.time('" + restartName + "');";
        }
        return this._driver.executeScript(script);
    };
    // See https://github.com/WebKit/webkit/tree/master/Source/WebInspectorUI/Versions
    IOsDriverExtension.prototype.readPerfLog = function () {
        var _this = this;
        // TODO(tbosch): Bug in IOsDriver: Need to execute at least one command
        // so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then(function (_) { return _this._driver.logs('performance'); })
            .then(function (entries) {
            var records = [];
            entries.forEach(function (entry) {
                var message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Timeline.eventRecorded') {
                    records.push(message['params']['record']);
                }
            });
            return _this._convertPerfRecordsToEvents(records);
        });
    };
    /** @internal */
    IOsDriverExtension.prototype._convertPerfRecordsToEvents = function (records, events) {
        var _this = this;
        if (events === void 0) { events = null; }
        if (!events) {
            events = [];
        }
        records.forEach(function (record) {
            var endEvent = null;
            var type = record['type'];
            var data = record['data'];
            var startTime = record['startTime'];
            var endTime = record['endTime'];
            if (type === 'FunctionCall' && (data == null || data['scriptName'] !== 'InjectedScript')) {
                events.push(createStartEvent('script', startTime));
                endEvent = createEndEvent('script', endTime);
            }
            else if (type === 'Time') {
                events.push(createMarkStartEvent(data['message'], startTime));
            }
            else if (type === 'TimeEnd') {
                events.push(createMarkEndEvent(data['message'], startTime));
            }
            else if (type === 'RecalculateStyles' || type === 'Layout' || type === 'UpdateLayerTree' ||
                type === 'Paint' || type === 'Rasterize' || type === 'CompositeLayers') {
                events.push(createStartEvent('render', startTime));
                endEvent = createEndEvent('render', endTime);
            }
            // Note: ios used to support GCEvent up until iOS 6 :-(
            if (record['children'] != null) {
                _this._convertPerfRecordsToEvents(record['children'], events);
            }
            if (endEvent != null) {
                events.push(endEvent);
            }
        });
        return events;
    };
    IOsDriverExtension.prototype.perfLogFeatures = function () { return new web_driver_extension_1.PerfLogFeatures({ render: true }); };
    IOsDriverExtension.prototype.supports = function (capabilities) {
        return capabilities['browserName'].toLowerCase() === 'safari';
    };
    return IOsDriverExtension;
}(web_driver_extension_1.WebDriverExtension));
IOsDriverExtension.PROVIDERS = [{ provide: IOsDriverExtension_1, deps: [web_driver_adapter_1.WebDriverAdapter] }];
IOsDriverExtension = IOsDriverExtension_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter])
], IOsDriverExtension);
exports.IOsDriverExtension = IOsDriverExtension;
function createEvent(ph, name, time, args) {
    if (args === void 0) { args = null; }
    var result = {
        'cat': 'timeline',
        'name': name,
        'ts': time,
        'ph': ph,
        // The ios protocol does not support the notions of multiple processes in
        // the perflog...
        'pid': 'pid0'
    };
    if (args != null) {
        result['args'] = args;
    }
    return result;
}
function createStartEvent(name, time, args) {
    if (args === void 0) { args = null; }
    return createEvent('B', name, time, args);
}
function createEndEvent(name, time, args) {
    if (args === void 0) { args = null; }
    return createEvent('E', name, time, args);
}
function createMarkStartEvent(name, time) {
    return createEvent('B', name, time);
}
function createMarkEndEvent(name, time) {
    return createEvent('E', name, time);
}
var IOsDriverExtension_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zX2RyaXZlcl9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvaW9zX2RyaXZlcl9leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBRXpDLDREQUF1RDtBQUN2RCxnRUFBMEY7QUFHMUYsSUFBYSxrQkFBa0I7SUFBUyxzQ0FBa0I7SUFHeEQsNEJBQW9CLE9BQXlCO1FBQTdDLFlBQWlELGlCQUFPLFNBQUc7UUFBdkMsYUFBTyxHQUFQLE9BQU8sQ0FBa0I7O0lBQWEsQ0FBQztJQUUzRCwrQkFBRSxHQUFGLGNBQXFCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0Usc0NBQVMsR0FBVCxVQUFVLElBQVk7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFpQixJQUFJLFFBQUssQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxvQ0FBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLFdBQStCO1FBQS9CLDRCQUFBLEVBQUEsa0JBQStCO1FBQ25ELElBQUksTUFBTSxHQUFHLHNCQUFvQixJQUFJLFFBQUssQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLElBQUksbUJBQWlCLFdBQVcsUUFBSyxDQUFDO1FBQzlDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELGtGQUFrRjtJQUNsRix3Q0FBVyxHQUFYO1FBQUEsaUJBZUM7UUFkQyx1RUFBdUU7UUFDdkUsNENBQTRDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJ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