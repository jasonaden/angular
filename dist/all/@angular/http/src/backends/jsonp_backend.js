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
var Observable_1 = require("rxjs/Observable");
var base_response_options_1 = require("../base_response_options");
var enums_1 = require("../enums");
var interfaces_1 = require("../interfaces");
var static_response_1 = require("../static_response");
var browser_jsonp_1 = require("./browser_jsonp");
var JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
var JSONP_ERR_WRONG_METHOD = 'JSONP requests must use GET request method.';
/**
 * Abstract base class for an in-flight JSONP request.
 *
 * @experimental
 */
var JSONPConnection = (function () {
    function JSONPConnection() {
    }
    return JSONPConnection;
}());
exports.JSONPConnection = JSONPConnection;
var JSONPConnection_ = (function (_super) {
    __extends(JSONPConnection_, _super);
    function JSONPConnection_(req, _dom, baseResponseOptions) {
        var _this = _super.call(this) || this;
        _this._dom = _dom;
        _this.baseResponseOptions = baseResponseOptions;
        _this._finished = false;
        if (req.method !== enums_1.RequestMethod.Get) {
            throw new TypeError(JSONP_ERR_WRONG_METHOD);
        }
        _this.request = req;
        _this.response = new Observable_1.Observable(function (responseObserver) {
            _this.readyState = enums_1.ReadyState.Loading;
            var id = _this._id = _dom.nextRequestID();
            _dom.exposeConnection(id, _this);
            // Workaround Dart
            // url = url.replace(/=JSONP_CALLBACK(&|$)/, `generated method`);
            var callback = _dom.requestCallback(_this._id);
            var url = req.url;
            if (url.indexOf('=JSONP_CALLBACK&') > -1) {
                url = url.replace('=JSONP_CALLBACK&', "=" + callback + "&");
            }
            else if (url.lastIndexOf('=JSONP_CALLBACK') === url.length - '=JSONP_CALLBACK'.length) {
                url = url.substring(0, url.length - '=JSONP_CALLBACK'.length) + ("=" + callback);
            }
            var script = _this._script = _dom.build(url);
            var onLoad = function (event) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                if (!_this._finished) {
                    var responseOptions_1 = new base_response_options_1.ResponseOptions({ body: JSONP_ERR_NO_CALLBACK, type: enums_1.ResponseType.Error, url: url });
                    if (baseResponseOptions) {
                        responseOptions_1 = baseResponseOptions.merge(responseOptions_1);
                    }
                    responseObserver.error(new static_response_1.Response(responseOptions_1));
                    return;
                }
                var responseOptions = new base_response_options_1.ResponseOptions({ body: _this._responseData, url: url });
                if (_this.baseResponseOptions) {
                    responseOptions = _this.baseResponseOptions.merge(responseOptions);
                }
                responseObserver.next(new static_response_1.Response(responseOptions));
                responseObserver.complete();
            };
            var onError = function (error) {
                if (_this.readyState === enums_1.ReadyState.Cancelled)
                    return;
                _this.readyState = enums_1.ReadyState.Done;
                _dom.cleanup(script);
                var responseOptions = new base_response_options_1.ResponseOptions({ body: error.message, type: enums_1.ResponseType.Error });
                if (baseResponseOptions) {
                    responseOptions = baseResponseOptions.merge(responseOptions);
                }
                responseObserver.error(new static_response_1.Response(responseOptions));
            };
            script.addEventListener('load', onLoad);
            script.addEventListener('error', onError);
            _dom.send(script);
            return function () {
                _this.readyState = enums_1.ReadyState.Cancelled;
                script.removeEventListener('load', onLoad);
                script.removeEventListener('error', onError);
                _this._dom.cleanup(script);
            };
        });
        return _this;
    }
    JSONPConnection_.prototype.finished = function (data) {
        // Don't leak connections
        this._finished = true;
        this._dom.removeConnection(this._id);
        if (this.readyState === enums_1.ReadyState.Cancelled)
            return;
        this._responseData = data;
    };
    return JSONPConnection_;
}(JSONPConnection));
exports.JSONPConnection_ = JSONPConnection_;
/**
 * A {@link ConnectionBackend} that uses the JSONP strategy of making requests.
 *
 * @experimental
 */
var JSONPBackend = (function (_super) {
    __extends(JSONPBackend, _super);
    function JSONPBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return JSONPBackend;
}(interfaces_1.ConnectionBackend));
exports.JSONPBackend = JSONPBackend;
var JSONPBackend_ = (function (_super) {
    __extends(JSONPBackend_, _super);
    function JSONPBackend_(_browserJSONP, _baseResponseOptions) {
        var _this = _super.call(this) || this;
        _this._browserJSONP = _browserJSONP;
        _this._baseResponseOptions = _baseResponseOptions;
        return _this;
    }
    JSONPBackend_.prototype.createConnection = function (request) {
        return new JSONPConnection_(request, this._browserJSONP, this._baseResponseOptions);
    };
    return JSONPBackend_;
}(JSONPBackend));
JSONPBackend_ = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [browser_jsonp_1.BrowserJsonp, base_response_options_1.ResponseOptions])
], JSONPBackend_);
exports.JSONPBackend_ = JSONPBackend_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvc3JjL2JhY2tlbmRzL2pzb25wX2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLDhDQUEyQztBQUczQyxrRUFBeUQ7QUFDekQsa0NBQWlFO0FBQ2pFLDRDQUE0RDtBQUU1RCxzREFBNEM7QUFFNUMsaURBQTZDO0FBRTdDLElBQU0scUJBQXFCLEdBQUcsZ0RBQWdELENBQUM7QUFDL0UsSUFBTSxzQkFBc0IsR0FBRyw2Q0FBNkMsQ0FBQztBQUU3RTs7OztHQUlHO0FBQ0g7SUFBQTtJQXFCQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJxQiwwQ0FBZTtBQXVCckM7SUFBc0Msb0NBQWU7SUFNbkQsMEJBQ0ksR0FBWSxFQUFVLElBQWtCLEVBQVUsbUJBQXFDO1FBRDNGLFlBRUUsaUJBQU8sU0FzRVI7UUF2RXlCLFVBQUksR0FBSixJQUFJLENBQWM7UUFBVSx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQWtCO1FBSG5GLGVBQVMsR0FBWSxLQUFLLENBQUM7UUFLakMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxxQkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxLQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksdUJBQVUsQ0FBVyxVQUFDLGdCQUFvQztZQUU1RSxLQUFJLENBQUMsVUFBVSxHQUFHLGtCQUFVLENBQUMsT0FBTyxDQUFDO1lBQ3JDLElBQU0sRUFBRSxHQUFHLEtBQUksQ0FBQyxHQUFHLEdBQUcs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