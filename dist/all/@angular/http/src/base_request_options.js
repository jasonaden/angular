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
var enums_1 = require("./enums");
var headers_1 = require("./headers");
var http_utils_1 = require("./http_utils");
var url_search_params_1 = require("./url_search_params");
/**
 * Creates a request options object to be optionally provided when instantiating a
 * {@link Request}.
 *
 * This class is based on the `RequestInit` description in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#requestinit).
 *
 * All values are null by default. Typical defaults can be found in the {@link BaseRequestOptions}
 * class, which sub-classes `RequestOptions`.
 *
 * ```typescript
 * import {RequestOptions, Request, RequestMethod} from '@angular/http';
 *
 * const options = new RequestOptions({
 *   method: RequestMethod.Post,
 *   url: 'https://google.com'
 * });
 * const req = new Request(options);
 * console.log('req.method:', RequestMethod[req.method]); // Post
 * console.log('options.url:', options.url); // https://google.com
 * ```
 *
 * @experimental
 */
var RequestOptions = (function () {
    // TODO(Dzmitry): remove search when this.search is removed
    function RequestOptions(opts) {
        if (opts === void 0) { opts = {}; }
        var method = opts.method, headers = opts.headers, body = opts.body, url = opts.url, search = opts.search, params = opts.params, withCredentials = opts.withCredentials, responseType = opts.responseType;
        this.method = method != null ? http_utils_1.normalizeMethodName(method) : null;
        this.headers = headers != null ? headers : null;
        this.body = body != null ? body : null;
        this.url = url != null ? url : null;
        this.params = this._mergeSearchParams(params || search);
        this.withCredentials = withCredentials != null ? withCredentials : null;
        this.responseType = responseType != null ? responseType : null;
    }
    Object.defineProperty(RequestOptions.prototype, "search", {
        /**
         * @deprecated from 4.0.0. Use params instead.
         */
        get: function () { return this.params; },
        /**
         * @deprecated from 4.0.0. Use params instead.
         */
        set: function (params) { this.params = params; },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a copy of the `RequestOptions` instance, using the optional input as values to override
     * existing values. This method will not change the values of the instance on which it is being
     * called.
     *
     * Note that `headers` and `search` will override existing values completely if present in
     * the `options` object. If these values should be merged, it should be done prior to calling
     * `merge` on the `RequestOptions` instance.
     *
     * ```typescript
     * import {RequestOptions, Request, RequestMethod} from '@angular/http';
     *
     * const options = new RequestOptions({
     *   method: RequestMethod.Post
     * });
     * const req = new Request(options.merge({
     *   url: 'https://google.com'
     * }));
     * console.log('req.method:', RequestMethod[req.method]); // Post
     * console.log('options.url:', options.url); // null
     * console.log('req.url:', req.url); // https://google.com
     * ```
     */
    RequestOptions.prototype.merge = function (options) {
        return new RequestOptions({
            method: options && options.method != null ? options.method : this.method,
            headers: options && options.headers != null ? options.headers : new headers_1.Headers(this.headers),
            body: options && options.body != null ? options.body : this.body,
            url: options && options.url != null ? options.url : this.url,
            params: options && this._mergeSearchParams(options.params || options.search),
            withCredentials: options && options.withCredentials != null ? options.withCredentials :
                this.withCredentials,
            responseType: options && options.responseType != null ? options.responseType :
                this.responseType
        });
    };
    RequestOptions.prototype._mergeSearchParams = function (params) {
        if (!params)
            return this.params;
        if (params instanceof url_search_params_1.URLSearchParams) {
            return params.clone();
        }
        if (typeof params === 'string') {
            return new url_search_params_1.URLSearchParams(params);
        }
        return this._parseParams(params);
    };
    RequestOptions.prototype._parseParams = function (objParams) {
        var _this = this;
        if (objParams === void 0) { objParams = {}; }
        var params = new url_search_params_1.URLSearchParams();
        Object.keys(objParams).forEach(function (key) {
            var value = objParams[key];
            if (Array.isArray(value)) {
                value.forEach(function (item) { return _this._appendParam(key, item, params); });
            }
            else {
                _this._appendParam(key, value, params);
            }
        });
        return params;
    };
    RequestOptions.prototype._appendParam = function (key, value, params) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        params.append(key, value);
    };
    return RequestOptions;
}());
exports.RequestOptions = RequestOptions;
/**
 * Subclass of {@link RequestOptions}, with default values.
 *
 * Default values:
 *  * method: {@link RequestMethod RequestMethod.Get}
 *  * headers: empty {@link Headers} object
 *
 * This class could be extended and bound to the {@link RequestOptions} class
 * when configuring an {@link Injector}, in order to override the default options
 * used by {@link Http} to create and send {@link Request Requests}.
 *
 * ```typescript
 * import {BaseRequestOptions, RequestOptions} from '@angular/http';
 *
 * class MyOptions extends BaseRequestOptions {
 *   search: string = 'coreTeam=true';
 * }
 *
 * {provide: RequestOptions, useClass: MyOptions};
 * ```
 *
 * The options could also be extended when manually creating a {@link Request}
 * object.
 *
 * ```
 * import {BaseRequestOptions, Request, RequestMethod} from '@angular/http';
 *
 * const options = new BaseRequestOptions();
 * const req = new Request(options.merge({
 *   method: RequestMethod.Post,
 *   url: 'https://google.com'
 * }));
 * console.log('req.method:', RequestMethod[req.method]); // Post
 * console.log('options.url:', options.url); // null
 * console.log('req.url:', req.url); // https://google.com
 * ```
 *
 * @experimental
 */
var BaseRequestOptions = (function (_super) {
    __extends(BaseRequestOptions, _super);
    function BaseRequestOptions() {
        return _super.call(this, { method: enums_1.RequestMethod.Get, headers: new headers_1.Headers() }) || this;
    }
    return BaseRequestOptions;
}(RequestOptions));
BaseRequestOptions = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], BaseRequestOptions);
exports.BaseRequestOptions = BaseRequestOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZV9yZXF1ZXN0X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9iYXNlX3JlcXVlc3Rfb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFFekMsaUNBQTJEO0FBQzNELHFDQUFrQztBQUNsQywyQ0FBaUQ7QUFFakQseURBQW9EO0FBR3BEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNIO0lBdUNFLDJEQUEyRDtJQUMzRCx3QkFBWSxJQUE2QjtRQUE3QixxQkFBQSxFQUFBLFNBQTZCO1FBQ2hDLElBQUEsb0JBQU0sRUFBRSxzQkFBTyxFQUFFLGdCQUFJLEVBQUUsY0FBRyxFQUFFLG9CQUFNLEVBQUUsb0JBQU0sRUFBRSxzQ0FBZSxFQUFFLGdDQUFZLENBQVM7UUFDekYsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxHQUFHLGdDQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLElBQUksSUFBSSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDeEUsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLElB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