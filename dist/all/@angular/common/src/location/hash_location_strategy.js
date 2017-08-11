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
var location_1 = require("./location");
var location_strategy_1 = require("./location_strategy");
var platform_location_1 = require("./platform_location");
/**
 * @whatItDoes Use URL hash for storing application location data.
 * @description
 * `HashLocationStrategy` is a {@link LocationStrategy} used to configure the
 * {@link Location} service to represent its state in the
 * [hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
 * of the browser's URL.
 *
 * For instance, if you call `location.go('/foo')`, the browser's URL will become
 * `example.com#/foo`.
 *
 * ### Example
 *
 * {@example common/location/ts/hash_location_component.ts region='LocationComponent'}
 *
 * @stable
 */
var HashLocationStrategy = (function (_super) {
    __extends(HashLocationStrategy, _super);
    function HashLocationStrategy(_platformLocation, _baseHref) {
        var _this = _super.call(this) || this;
        _this._platformLocation = _platformLocation;
        _this._baseHref = '';
        if (_baseHref != null) {
            _this._baseHref = _baseHref;
        }
        return _this;
    }
    HashLocationStrategy.prototype.onPopState = function (fn) {
        this._platformLocation.onPopState(fn);
        this._platformLocation.onHashChange(fn);
    };
    HashLocationStrategy.prototype.getBaseHref = function () { return this._baseHref; };
    HashLocationStrategy.prototype.path = function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        // the hash value is always prefixed with a `#`
        // and if it is empty then it will stay empty
        var path = this._platformLocation.hash;
        if (path == null)
            path = '#';
        return path.length > 0 ? path.substring(1) : path;
    };
    HashLocationStrategy.prototype.prepareExternalUrl = function (internal) {
        var url = location_1.Location.joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
    };
    HashLocationStrategy.prototype.pushState = function (state, title, path, queryParams) {
        var url = this.prepareExternalUrl(path + location_1.Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.pushState(state, title, url);
    };
    HashLocationStrategy.prototype.replaceState = function (state, title, path, queryParams) {
        var url = this.prepareExternalUrl(path + location_1.Location.normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this._platformLocation.pathname;
        }
        this._platformLocation.replaceState(state, title, url);
    };
    HashLocationStrategy.prototype.forward = function () { this._platformLocation.forward(); };
    HashLocationStrategy.prototype.back = function () { this._platformLocation.back(); };
    return HashLocationStrategy;
}(location_strategy_1.LocationStrategy));
HashLocationStrategy = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Optional()), __param(1, core_1.Inject(location_strategy_1.APP_BASE_HREF)),
    __metadata("design:paramtypes", [platform_location_1.PlatformLocation, String])
], HashLocationStrategy);
exports.HashLocationStrategy = HashLocationStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaF9sb2NhdGlvbl9zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvbG9jYXRpb24vaGFzaF9sb2NhdGlvbl9zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkQ7QUFHM0QsdUNBQW9DO0FBQ3BDLHlEQUFvRTtBQUNwRSx5REFBNkU7QUFJN0U7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxJQUFhLG9CQUFvQjtJQUFTLHdDQUFnQjtJQUV4RCw4QkFDWSxpQkFBbUMsRUFDUixTQUFrQjtRQUZ6RCxZQUdFLGlCQUFPLFNBSVI7UUFOVyx1QkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBRnZDLGVBQVMsR0FBVyxFQUFFLENBQUM7UUFLN0IsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsQ0FBQzs7SUFDSCxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLEVBQTBCO1FBQ25DLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsMENBQVcsR0FBWCxjQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFaEQsbUNBQUksR0FBSixVQUFLLFdBQTRCO1FBQTVCLDRCQUFBLEVBQUEsbUJBQTRCO1FBQy9CLCtDQUErQztRQUMvQyw2Q0FBNkM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUU3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVELGlEQUFrQixHQUFsQixVQUFtQixRQUFnQjtRQUNqQyxJQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDNUMsQ0FBQztJQUVELHdDQUFTLEdBQVQsVUFBVSxLQUFVLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxXQUFtQjtRQUNwRSxJQUFJLEdBQUcsR0FDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLG1CQUFRLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMvRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7UUFDeEMsQ0FBQztRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsMkNBQVksR0FBWixVQUFhLEtBQVUsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsbUJBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxzQ0FBTyxHQUFQLGNBQWtCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFckQsbUNBQUksR0FBSixjQUFlLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakQsMkJBQUM7QUFBRCxDQUFDLEFBcERELENBQTBDLG9DQUFnQixHQW9EekQ7QUFwRFksb0JBQW9CO0lBRGhDLGlCQUFVLEVBQUU7SUFLTixXQUFBLGVBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxhQUFNLENBQUMsaUNBQWEsQ0FBQyxDQUFBO3FDQURQLG9DQUFnQjtHQUhwQyxvQkFBb0IsQ0FvRGhDO0FBcERZLG9EQUFvQiJ9