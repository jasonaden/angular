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
var message_bus_1 = require("../shared/message_bus");
var serializer_1 = require("../shared/serializer");
/**
 * @experimental WebWorker support in Angular is currently experimental.
 */
var ServiceMessageBrokerFactory = (function () {
    function ServiceMessageBrokerFactory() {
    }
    return ServiceMessageBrokerFactory;
}());
exports.ServiceMessageBrokerFactory = ServiceMessageBrokerFactory;
var ServiceMessageBrokerFactory_ = (function (_super) {
    __extends(ServiceMessageBrokerFactory_, _super);
    function ServiceMessageBrokerFactory_(_messageBus, _serializer) {
        var _this = _super.call(this) || this;
        _this._messageBus = _messageBus;
        _this._serializer = _serializer;
        return _this;
    }
    ServiceMessageBrokerFactory_.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this._messageBus.initChannel(channel, runInZone);
        return new ServiceMessageBroker_(this._messageBus, this._serializer, channel);
    };
    return ServiceMessageBrokerFactory_;
}(ServiceMessageBrokerFactory));
ServiceMessageBrokerFactory_ = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [message_bus_1.MessageBus, serializer_1.Serializer])
], ServiceMessageBrokerFactory_);
exports.ServiceMessageBrokerFactory_ = ServiceMessageBrokerFactory_;
/**
 * Helper class for UIComponents that allows components to register methods.
 * If a registered method message is received from the broker on the worker,
 * the UIMessageBroker deserializes its arguments and calls the registered method.
 * If that method returns a promise, the UIMessageBroker returns the result to the worker.
 *
 * @experimental WebWorker support in Angular is currently experimental.
 */
var ServiceMessageBroker = (function () {
    function ServiceMessageBroker() {
    }
    return ServiceMessageBroker;
}());
exports.ServiceMessageBroker = ServiceMessageBroker;
var ServiceMessageBroker_ = (function (_super) {
    __extends(ServiceMessageBroker_, _super);
    function ServiceMessageBroker_(messageBus, _serializer, channel) {
        var _this = _super.call(this) || this;
        _this._serializer = _serializer;
        _this.channel = channel;
        _this._methods = new Map();
        _this._sink = messageBus.to(channel);
        var source = messageBus.from(channel);
        source.subscribe({ next: function (message) { return _this._handleMessage(message); } });
        return _this;
    }
    ServiceMessageBroker_.prototype.registerMethod = function (methodName, signature, method, returnType) {
        var _this = this;
        this._methods.set(methodName, function (message) {
            var serializedArgs = message.args;
            var numArgs = signature ? signature.length : 0;
            var deserializedArgs = new Array(numArgs);
            for (var i = 0; i < numArgs; i++) {
                var serializedArg = serializedArgs[i];
                deserializedArgs[i] = _this._serializer.deserialize(serializedArg, signature[i]);
            }
            var promise = method.apply(void 0, deserializedArgs);
            if (returnType && promise) {
                _this._wrapWebWorkerPromise(message.id, promise, returnType);
            }
        });
    };
    ServiceMessageBroker_.prototype._handleMessage = function (message) {
        if (this._methods.has(message.method)) {
            this._methods.get(message.method)(message);
        }
    };
    ServiceMessageBroker_.prototype._wrapWebWorkerPromise = function (id, promise, type) {
        var _this = this;
        promise.then(function (result) {
            _this._sink.emit({
                'type': 'result',
                'value': _this._serializer.serialize(result, type),
                'id': id,
            });
        });
    };
    return ServiceMessageBroker_;
}(ServiceMessageBroker));
exports.ServiceMessageBroker_ = ServiceMessageBroker_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZV9tZXNzYWdlX2Jyb2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTZEO0FBQzdELHFEQUFpRDtBQUNqRCxtREFBaUU7QUFHakU7O0dBRUc7QUFDSDtJQUFBO0lBS0EsQ0FBQztJQUFELGtDQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMcUIsa0VBQTJCO0FBUWpELElBQWEsNEJBQTRCO0lBQVMsZ0RBQTJCO0lBSTNFLHNDQUFvQixXQUF1QixFQUFFLFdBQXVCO1FBQXBFLFlBQ0UsaUJBQU8sU0FFUjtRQUhtQixpQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUV6QyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7SUFDakMsQ0FBQztJQUVELDBEQUFtQixHQUFuQixVQUFvQixPQUFlLEVBQUUsU0FBeUI7UUFBekIsMEJBQUEsRUFBQSxnQkFBeUI7UUFDNUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBYkQsQ0FBa0QsMkJBQTJCLEdBYTVFO0FBYlksNEJBQTRCO0lBRHhDLGlCQUFVLEVBQUU7cUNBS3NCLHdCQUFVLEVBQWUsdUJBQVU7R0FKekQsNEJBQTRCLENBYXhDO0FBYlksb0VBQTRCO0FBZXpDOzs7Ozs7O0dBT0c7QUFDSDtJQUFBO0lBSUEsQ0FBQztJQUFE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