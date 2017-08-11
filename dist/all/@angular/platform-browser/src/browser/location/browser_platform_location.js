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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../../dom/dom_adapter");
var dom_tokens_1 = require("../../dom/dom_tokens");
var history_1 = require("./history");
/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 */
var BrowserPlatformLocation = (function (_super) {
    __extends(BrowserPlatformLocation, _super);
    function BrowserPlatformLocation(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        _this._init();
        return _this;
    }
    // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
    /** @internal */
    BrowserPlatformLocation.prototype._init = function () {
        this._location = dom_adapter_1.getDOM().getLocation();
        this._history = dom_adapter_1.getDOM().getHistory();
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
        get: function () { return this._location; },
        enumerable: true,
        configurable: true
    });
    BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function () { return dom_adapter_1.getDOM().getBaseHref(this._doc); };
    BrowserPlatformLocation.prototype.onPopState = function (fn) {
        dom_adapter_1.getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('popstate', fn, false);
    };
    BrowserPlatformLocation.prototype.onHashChange = function (fn) {
        dom_adapter_1.getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('hashchange', fn, false);
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
        get: function () { return this._location.pathname; },
        set: function (newPath) { this._location.pathname = newPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
        get: function () { return this._location.search; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
        get: function () { return this._location.hash; },
        enumerable: true,
        configurable: true
    });
    BrowserPlatformLocation.prototype.pushState = function (state, title, url) {
        if (history_1.supportsState()) {
            this._history.pushState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    BrowserPlatformLocation.prototype.replaceState = function (state, title, url) {
        if (history_1.supportsState()) {
            this._history.replaceState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    BrowserPlatformLocation.prototype.forward = function () { this._history.forward(); };
    BrowserPlatformLocation.prototype.back = function () { this._history.back(); };
    return BrowserPlatformLocation;
}(common_1.PlatformLocation));
BrowserPlatformLocation = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(dom_tokens_1.DOCUMENT)),
    __metadata("design:paramtypes", [Object])
], BrowserPlatformLocation);
exports.BrowserPlatformLocation = BrowserPlatformLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIvbG9jYXRpb24vYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBeUU7QUFDekUsc0NBQWlEO0FBRWpELHFEQUE2QztBQUM3QyxtREFBOEM7QUFFOUMscUNBQXdDO0FBSXhDOzs7O0dBSUc7QUFFSCxJQUFhLHVCQUF1QjtJQUFTLDJDQUFnQjtJQUkzRCxpQ0FBc0MsSUFBUztRQUEvQyxZQUNFLGlCQUFPLFNBRVI7UUFIcUMsVUFBSSxHQUFKLElBQUksQ0FBSztRQUU3QyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0lBQ2YsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixnQkFBZ0I7SUFDaEIsdUNBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxzQkFBSSw2Q0FBUTthQUFaLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbkQsb0RBQWtCLEdBQWxCLGNBQStCLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDLENBQUM7SUFFMUUsNENBQVUsR0FBVixVQUFXLEVBQTBCO1FBQ25DLG9CQUFNLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELDhDQUFZLEdBQVosVUFBYSxFQUEwQjtRQUNyQyxvQkFBTSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRCxzQkFBSSw2Q0FBUTthQUFaLGNBQXlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFHMUQsVUFBYSxPQUFlLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQzs7O09BSFY7SUFDMUQsc0JBQUksMkNBQU07YUFBVixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN0RCxzQkFBSSx5Q0FBSTthQUFSLGNBQXFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBR2xELDJDQUFTLEdBQVQsVUFBVSxLQUFVLEVBQUUsS0FBYSxFQUFFLEdBQVc7UUFDOUMsRUFBRSxDQUFDLENBQUMsdUJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVELDhDQUFZLEdBQVosVUFBYSxLQUFVLEVBQUUsS0FBYSxFQUFFLEdBQVc7UUFDakQsRUFBRSxDQUFDLENBQUMsdUJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVELHlDQUFPLEdBQVAsY0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFNUMsc0NBQUksR0FBSixjQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLDhCQUFDO0FBQUQsQ0FBQyxBQXBERCxDQUE2Qyx5QkFBZ0IsR0FvRDVEO0FBcERZLHVCQUF1QjtJQURuQyxpQkFBVSxFQUFFO0lBS0UsV0FBQSxhQUFNLENBQUMscUJBQVEsQ0FBQyxDQUFBOztHQUpsQix1QkFBdUIsQ0FvRG5DO0FBcERZLDBEQUF1QiJ9