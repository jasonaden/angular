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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_tokens_1 = require("../dom_tokens");
var event_manager_1 = require("./event_manager");
/**
 * Detect if Zone is present. If it is then bypass 'addEventListener' since Angular can do much more
 * efficient bookkeeping than Zone can, because we have additional information. This speeds up
 * addEventListener by 3x.
 */
var Zone = core_1.ɵglobal['Zone'];
var __symbol__ = Zone && Zone['__symbol__'] || function (v) {
    return v;
};
var ADD_EVENT_LISTENER = __symbol__('addEventListener');
var REMOVE_EVENT_LISTENER = __symbol__('removeEventListener');
var DomEventsPlugin = (function (_super) {
    __extends(DomEventsPlugin, _super);
    function DomEventsPlugin(doc, ngZone) {
        var _this = _super.call(this, doc) || this;
        _this.ngZone = ngZone;
        return _this;
    }
    // This plugin should come last in the list of plugins, because it accepts all
    // events.
    DomEventsPlugin.prototype.supports = function (eventName) { return true; };
    DomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        /**
         * This code is about to add a listener to the DOM. If Zone.js is present, than
         * `addEventListener` has been patched. The patched code adds overhead in both
         * memory and speed (3x slower) than native. For this reason if we detect that
         * Zone.js is present we bypass zone and use native addEventListener instead.
         * The result is faster registration but the zone will not be restored. We do
         * manual zone restoration in element.ts renderEventHandlerClosure method.
         *
         * NOTE: it is possible that the element is from different iframe, and so we
         * have to check before we execute the method.
         */
        var self = this;
        var byPassZoneJS = element[ADD_EVENT_LISTENER];
        var callback = handler;
        if (byPassZoneJS) {
            callback = function () {
                return self.ngZone.runTask(handler, null, arguments, eventName);
            };
        }
        element[byPassZoneJS ? ADD_EVENT_LISTENER : 'addEventListener'](eventName, callback, false);
        return function () { return element[byPassZoneJS ? REMOVE_EVENT_LISTENER : 'removeEventListener'](eventName, callback, false); };
    };
    return DomEventsPlugin;
}(event_manager_1.EventManagerPlugin));
DomEventsPlugin = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(dom_tokens_1.DOCUMENT)),
    __metadata("design:paramtypes", [Object, core_1.NgZone])
], DomEventsPlugin);
exports.DomEventsPlugin = DomEventsPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2V2ZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2RvbS9ldmVudHMvZG9tX2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBNEU7QUFFNUUsNENBQXVDO0FBRXZDLGlEQUFtRDtBQUVuRDs7OztHQUlHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLElBQU0sVUFBVSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksVUFBWSxDQUFJO0lBQy9ELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDLENBQUM7QUFDRixJQUFNLGtCQUFrQixHQUF1QixVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM5RSxJQUFNLHFCQUFxQixHQUEwQixVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUd2RixJQUFhLGVBQWU7SUFBUyxtQ0FBa0I7SUFDckQseUJBQThCLEdBQVEsRUFBVSxNQUFjO1FBQTlELFlBQWtFLGtCQUFNLEdBQUcsQ0FBQyxTQUFHO1FBQS9CLFlBQU0sR0FBTixNQUFNLENBQVE7O0lBQWdCLENBQUM7SUFFL0UsOEVBQThFO0lBQzlFLFVBQVU7SUFDVixrQ0FBUSxHQUFSLFVBQVMsU0FBaUIsSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVyRCwwQ0FBZ0IsR0FBaEIsVUFBaUIsT0FBb0IsRUFBRSxTQUFpQixFQUFFLE9BQWlCO1FBQ3pFOzs7Ozs7Ozs7O1dBVUc7UUFDSCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDL0MsSUFBSSxRQUFRLEdBQWtCLE9BQXdCLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixRQUFRLEdBQUc7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWMsRUFBRSxJQUFJLEVBQUUsU0FBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNoRixDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsT0FBTyxDQUFDLFlBQVksR0FBRyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUYsTUFBTSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsWUFBWSxHQUFHLHFCQUFxQixHQUFHLHFCQUFxQixDQUFDLENBQ3ZFLFNBQVMsRUFBRSxRQUFlLEVBQUUsS0FBSyxDQUFDLEVBRGhDLENBQ2dDLENBQUM7SUFDaEQsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUFxQyxrQ0FBa0IsR0ErQnREO0FBL0JZLGVBQWU7SUFEM0IsaUJBQVUsRUFBRTtJQUVFLFdBQUEsYUFBTSxDQUFDLHFCQUFRLENBQUMsQ0FBQTs2Q0FBMkIsYUFBTTtHQURuRCxlQUFlLENBK0IzQjtBQS9CWSwwQ0FBZSJ9