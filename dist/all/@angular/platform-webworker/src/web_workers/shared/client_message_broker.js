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
var message_bus_1 = require("./message_bus");
var serializer_1 = require("./serializer");
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var ClientMessageBrokerFactory = (function () {
    function ClientMessageBrokerFactory() {
    }
    return ClientMessageBrokerFactory;
}());
exports.ClientMessageBrokerFactory = ClientMessageBrokerFactory;
var ClientMessageBrokerFactory_ = (function (_super) {
    __extends(ClientMessageBrokerFactory_, _super);
    function ClientMessageBrokerFactory_(_messageBus, _serializer) {
        var _this = _super.call(this) || this;
        _this._messageBus = _messageBus;
        _this._serializer = _serializer;
        return _this;
    }
    /**
     * Initializes the given channel and attaches a new {@link ClientMessageBroker} to it.
     */
    ClientMessageBrokerFactory_.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this._messageBus.initChannel(channel, runInZone);
        return new ClientMessageBroker_(this._messageBus, this._serializer, channel);
    };
    return ClientMessageBrokerFactory_;
}(ClientMessageBrokerFactory));
ClientMessageBrokerFactory_ = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [message_bus_1.MessageBus, serializer_1.Serializer])
], ClientMessageBrokerFactory_);
exports.ClientMessageBrokerFactory_ = ClientMessageBrokerFactory_;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var ClientMessageBroker = (function () {
    function ClientMessageBroker() {
    }
    return ClientMessageBroker;
}());
exports.ClientMessageBroker = ClientMessageBroker;
var ClientMessageBroker_ = (function (_super) {
    __extends(ClientMessageBroker_, _super);
    function ClientMessageBroker_(messageBus, _serializer, channel) {
        var _this = _super.call(this) || this;
        _this.channel = channel;
        _this._pending = new Map();
        _this._sink = messageBus.to(channel);
        _this._serializer = _serializer;
        var source = messageBus.from(channel);
        source.subscribe({ next: function (message) { return _this._handleMessage(message); } });
        return _this;
    }
    ClientMessageBroker_.prototype._generateMessageId = function (name) {
        var time = core_1.ɵstringify(new Date().getTime());
        var iteration = 0;
        var id = name + time + core_1.ɵstringify(iteration);
        while (this._pending.has(id)) {
            id = "" + name + time + iteration;
            iteration++;
        }
        return id;
    };
    ClientMessageBroker_.prototype.runOnService = function (args, returnType) {
        var _this = this;
        var fnArgs = [];
        if (args.args) {
            args.args.forEach(function (argument) {
                if (argument.type != null) {
                    fnArgs.push(_this._serializer.serialize(argument.value, argument.type));
                }
                else {
                    fnArgs.push(argument.value);
                }
            });
        }
        var promise;
        var id = null;
        if (returnType != null) {
            var completer_1 = undefined;
            promise = new Promise(function (resolve, reject) { completer_1 = { resolve: resolve, reject: reject }; });
            id = this._generateMessageId(args.method);
            this._pending.set(id, completer_1);
            promise.catch(function (err) {
                if (console && console.error) {
                    // tslint:disable-next-line:no-console
                    console.error(err);
                }
                completer_1.reject(err);
            });
            promise = promise.then(function (v) { return _this._serializer ? _this._serializer.deserialize(v, returnType) : v; });
        }
        else {
            promise = null;
        }
        var message = {
            'method': args.method,
            'args': fnArgs,
        };
        if (id != null) {
            message['id'] = id;
        }
        this._sink.emit(message);
        return promise;
    };
    ClientMessageBroker_.prototype._handleMessage = function (message) {
        if (message.type === 'result' || message.type === 'error') {
            var id = message.id;
            if (this._pending.has(id)) {
                if (message.type === 'result') {
                    this._pending.get(id).resolve(message.value);
                }
                else {
                    this._pending.get(id).reject(message.value);
                }
                this._pending.delete(id);
            }
        }
    };
    return ClientMessageBroker_;
}(ClientMessageBroker));
exports.ClientMessageBroker_ = ClientMessageBroker_;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var FnArg = (function () {
    function FnArg(value, type) {
        if (type === void 0) { type = 1 /* PRIMITIVE */; }
        this.value = value;
        this.type = type;
    }
    return FnArg;
}());
exports.FnArg = FnArg;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var UiArguments = (function () {
    function UiArguments(method, args) {
        this.method = method;
        this.args = args;
    }
    return UiArguments;
}());
exports.UiArguments = UiArguments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X21lc3NhZ2VfYnJva2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvY2xpZW50X21lc3NhZ2VfYnJva2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFzRjtBQUN0Riw2Q0FBeUM7QUFDekMsMkNBQXlEO0FBSXpEOztHQUVHO0FBQ0g7SUFBQTtJQUtBLENBQUM7SUFBRCxpQ0FBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTHFCLGdFQUEwQjtBQVFoRCxJQUFhLDJCQUEyQjtJQUFTLCtDQUEwQjtJQUd6RSxxQ0FBb0IsV0FBdUIsRUFBRSxXQUF1QjtRQUFwRSxZQUNFLGlCQUFPLFNBRVI7UUFIbUIsaUJBQVcsR0FBWCxXQUFXLENBQVk7UUFFekMsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNILHlEQUFtQixHQUFuQixVQUFvQixPQUFlLEVBQUUsU0FBeUI7UUFBekIsMEJBQUEsRUFBQSxnQkFBeUI7UUFDNUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ0gsa0NBQUM7QUFBRCxDQUFDLEFBZkQsQ0FBaUQsMEJBQTBCLEdBZTFFO0FBZlksMkJBQTJCO0lBRHZDLGlCQUFVLEVBQUU7cUNBSXNCLHdCQUFVLEVBQWUsdUJBQVU7R0FIekQsMkJBQTJCLENBZXZDO0FBZlksa0VBQTJCO0FBaUJ4Qzs7R0FFRztBQUNIO0lBQUE7SUFHQSxDQUFD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