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
Object.defineProperty(exports, "__esModule", { value: true });
var xhr2 = require('xhr2');
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var Observable_1 = require("rxjs/Observable");
var isAbsoluteUrl = /^[a-zA-Z\-\+.]+:\/\//;
function validateRequestUrl(url) {
    if (!isAbsoluteUrl.test(url)) {
        throw new Error("URLs requested via Http on the server must be absolute. URL: " + url);
    }
}
var ServerXhr = (function () {
    function ServerXhr() {
    }
    ServerXhr.prototype.build = function () { return new xhr2.XMLHttpRequest(); };
    return ServerXhr;
}());
ServerXhr = __decorate([
    core_1.Injectable()
], ServerXhr);
exports.ServerXhr = ServerXhr;
var ServerXsrfStrategy = (function () {
    function ServerXsrfStrategy() {
    }
    ServerXsrfStrategy.prototype.configureRequest = function (req) { };
    return ServerXsrfStrategy;
}());
ServerXsrfStrategy = __decorate([
    core_1.Injectable()
], ServerXsrfStrategy);
exports.ServerXsrfStrategy = ServerXsrfStrategy;
var ZoneMacroTaskWrapper = (function () {
    function ZoneMacroTaskWrapper() {
    }
    ZoneMacroTaskWrapper.prototype.wrap = function (request) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var task = null;
            var scheduled = false;
            var sub = null;
            var savedResult = null;
            var savedError = null;
            var scheduleTask = function (_task) {
                task = _task;
                scheduled = true;
                var delegate = _this.delegate(request);
                sub = delegate.subscribe(function (res) { return savedResult = res; }, function (err) {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    savedError = err;
                    scheduled = false;
                    task.invoke();
                }, function () {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    scheduled = false;
                    task.invoke();
                });
            };
            var cancelTask = function (_task) {
                if (!scheduled) {
                    return;
                }
                scheduled = false;
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
            var onComplete = function () {
                if (savedError !== null) {
                    observer.error(savedError);
                }
                else {
                    observer.next(savedResult);
                    observer.complete();
                }
            };
            // MockBackend for Http is synchronous, which means that if scheduleTask is by
            // scheduleMacroTask, the request will hit MockBackend and the response will be
            // sent, causing task.invoke() to be called.
            var _task = Zone.current.scheduleMacroTask('ZoneMacroTaskWrapper.subscribe', onComplete, {}, function () { return null; }, cancelTask);
            scheduleTask(_task);
            return function () {
                if (scheduled && task) {
                    task.zone.cancelTask(task);
                    scheduled = false;
                }
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
        });
    };
    return ZoneMacroTaskWrapper;
}());
exports.ZoneMacroTaskWrapper = ZoneMacroTaskWrapper;
var ZoneMacroTaskConnection = (function (_super) {
    __extends(ZoneMacroTaskConnection, _super);
    function ZoneMacroTaskConnection(request, backend) {
        var _this = _super.call(this) || this;
        _this.request = request;
        _this.backend = backend;
        validateRequestUrl(request.url);
        _this.response = _this.wrap(request);
        return _this;
    }
    ZoneMacroTaskConnection.prototype.delegate = function (request) {
        this.lastConnection = this.backend.createConnection(request);
        return this.lastConnection.response;
    };
    Object.defineProperty(ZoneMacroTaskConnection.prototype, "readyState", {
        get: function () {
            return !!this.lastConnection ? this.lastConnection.readyState : http_1.ReadyState.Unsent;
        },
        enumerable: true,
        configurable: true
    });
    return ZoneMacroTaskConnection;
}(ZoneMacroTaskWrapper));
exports.ZoneMacroTaskConnection = ZoneMacroTaskConnection;
var ZoneMacroTaskBackend = (function () {
    function ZoneMacroTaskBackend(backend) {
        this.backend = backend;
    }
    ZoneMacroTaskBackend.prototype.createConnection = function (request) {
        return new ZoneMacroTaskConnection(request, this.backend);
    };
    return ZoneMacroTaskBackend;
}());
exports.ZoneMacroTaskBackend = ZoneMacroTaskBackend;
var ZoneClientBackend = (function (_super) {
    __extends(ZoneClientBackend, _super);
    function ZoneClientBackend(backend) {
        var _this = _super.call(this) || this;
        _this.backend = backend;
        return _this;
    }
    ZoneClientBackend.prototype.handle = function (request) { return this.wrap(request); };
    ZoneClientBackend.prototype.delegate = function (request) {
        return this.backend.handle(request);
    };
    return ZoneClientBackend;
}(ZoneMacroTaskWrapper));
exports.ZoneClientBackend = ZoneClientBackend;
function httpFactory(xhrBackend, options) {
    var macroBackend = new ZoneMacroTaskBackend(xhrBackend);
    return new http_1.Http(macroBackend, options);
}
exports.httpFactory = httpFactory;
function zoneWrappedInterceptingHandler(backend, interceptors) {
    var realBackend = http_2.ɵinterceptingHandler(backend, interceptors);
    return new ZoneClientBackend(realBackend);
}
exports.zoneWrappedInterceptingHandler = zoneWrappedInterceptingHandler;
exports.SERVER_HTTP_PROVIDERS = [
    { provide: http_1.Http, useFactory: httpFactory, deps: [http_1.XHRBackend, http_1.RequestOptions] },
    { provide: http_1.BrowserXhr, useClass: ServerXhr }, { provide: http_1.XSRFStrategy, useClass: ServerXsrfStrategy },
    { provide: http_2.XhrFactory, useClass: ServerXhr }, {
        provide: http_2.HttpHandler,
        useFactory: zoneWrappedInterceptingHandler,
        deps: [http_2.HttpBackend, [new core_1.Optional(), http_2.HTTP_INTERCEPTORS]]
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci9zcmMvaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxJQUFNLElBQUksR0FBUSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFbEMsc0NBQTZEO0FBQzdELHNDQUF1SjtBQUV2Siw2Q0FBNk07QUFFN00sOENBQTJDO0FBSTNDLElBQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDO0FBRTdDLDRCQUE0QixHQUFXO0lBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBZ0UsR0FBSyxDQUFDLENBQUM7SUFDekYsQ0FBQztBQUNILENBQUM7QUFHRCxJQUFhLFNBQVM7SUFBdEI7SUFFQSxDQUFDO0lBREMseUJBQUssR0FBTCxjQUEwQixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9ELGdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxTQUFTO0lBRHJCLGlCQUFVLEVBQUU7R0FDQSxTQUFTLENBRXJCO0FBRlksOEJBQVM7QUFLdEIsSUFBYSxrQkFBa0I7SUFBL0I7SUFFQSxDQUFDO0lBREMsNkNBQWdCLEdBQWhCLFVBQWlCLEdBQVksSUFBUyxDQUFDO0lBQ3pDLHlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxrQkFBa0I7SUFEOUIsaUJBQVUsRUFBRTtHQUNBLGtCQUFrQixDQUU5QjtBQUZZLGdEQUFrQjtBQUkvQjtJQUFBO0lBNEVBLENBQUM7SUEzRUMsbUNBQUksR0FBSixVQUFLLE9BQVU7UUFBZixpQkF3RUM7UUF2RUMsTUFBTSxDQUFDLElBQUksdUJBQVUsQ0FB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