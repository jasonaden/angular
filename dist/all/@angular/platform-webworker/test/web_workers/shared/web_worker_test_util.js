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
Object.defineProperty(exports, "__esModule", { value: true });
var client_message_broker_1 = require("@angular/platform-webworker/src/web_workers/shared/client_message_broker");
var message_bus_1 = require("@angular/platform-webworker/src/web_workers/shared/message_bus");
var mock_event_emitter_1 = require("./mock_event_emitter");
/**
 * Returns two MessageBus instances that are attached to each other.
 * Such that whatever goes into one's sink comes out the others source.
 */
function createPairedMessageBuses() {
    var firstChannels = {};
    var workerMessageBusSink = new MockMessageBusSink(firstChannels);
    var uiMessageBusSource = new MockMessageBusSource(firstChannels);
    var secondChannels = {};
    var uiMessageBusSink = new MockMessageBusSink(secondChannels);
    var workerMessageBusSource = new MockMessageBusSource(secondChannels);
    return new PairedMessageBuses(new MockMessageBus(uiMessageBusSink, uiMessageBusSource), new MockMessageBus(workerMessageBusSink, workerMessageBusSource));
}
exports.createPairedMessageBuses = createPairedMessageBuses;
/**
 * Spies on the given {@link SpyMessageBroker} and expects a call with the given methodName
 * andvalues.
 * If a handler is provided it will be called to handle the request.
 * Only intended to be called on a given broker instance once.
 */
function expectBrokerCall(broker, methodName, vals, handler) {
    broker.spy('runOnService').and.callFake(function (args, returnType) {
        expect(args.method).toEqual(methodName);
        if (vals != null) {
            expect(args.args.length).toEqual(vals.length);
            vals.forEach(function (v, i) { expect(v).toEqual(args.args[i].value); });
        }
        var promise = null;
        if (handler != null) {
            var givenValues = args.args.map(function (arg) { return arg.value; });
            if (givenValues.length > 0) {
                promise = handler(givenValues);
            }
            else {
                promise = handler();
            }
        }
        if (promise == null) {
            promise = new Promise(function (res, rej) {
                try {
                    res();
                }
                catch (e) {
                    rej(e);
                }
            });
        }
        return promise;
    });
}
exports.expectBrokerCall = expectBrokerCall;
var PairedMessageBuses = (function () {
    function PairedMessageBuses(ui, worker) {
        this.ui = ui;
        this.worker = worker;
    }
    return PairedMessageBuses;
}());
exports.PairedMessageBuses = PairedMessageBuses;
var MockMessageBusSource = (function () {
    function MockMessageBusSource(_channels) {
        this._channels = _channels;
    }
    MockMessageBusSource.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
    };
    MockMessageBusSource.prototype.from = function (channel) {
        if (!this._channels.hasOwnProperty(channel)) {
            throw new Error(channel + " is not set up. Did you forget to call initChannel?");
        }
        return this._channels[channel];
    };
    MockMessageBusSource.prototype.attachToZone = function (zone) { };
    return MockMessageBusSource;
}());
exports.MockMessageBusSource = MockMessageBusSource;
var MockMessageBusSink = (function () {
    function MockMessageBusSink(_channels) {
        this._channels = _channels;
    }
    MockMessageBusSink.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
    };
    MockMessageBusSink.prototype.to = function (channel) {
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
        return this._channels[channel];
    };
    MockMessageBusSink.prototype.attachToZone = function (zone) { };
    return MockMessageBusSink;
}());
exports.MockMessageBusSink = MockMessageBusSink;
/**
 * Mock implementation of the {@link MessageBus} for tests.
 * Runs syncronously, and does not support running within the zone.
 */
var MockMessageBus = (function (_super) {
    __extends(MockMessageBus, _super);
    function MockMessageBus(sink, source) {
        var _this = _super.call(this) || this;
        _this.sink = sink;
        _this.source = source;
        return _this;
    }
    MockMessageBus.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this.sink.initChannel(channel, runInZone);
        this.source.initChannel(channel, runInZone);
    };
    MockMessageBus.prototype.to = function (channel) { return this.sink.to(channel); };
    MockMessageBus.prototype.from = function (channel) { return this.source.from(channel); };
    MockMessageBus.prototype.attachToZone = function (zone) { };
    return MockMessageBus;
}(message_bus_1.MessageBus));
exports.MockMessageBus = MockMessageBus;
var MockMessageBrokerFactory = (function (_super) {
    __extends(MockMessageBrokerFactory, _super);
    function MockMessageBrokerFactory(_messageBroker) {
        var _this = _super.call(this, null, null) || this;
        _this._messageBroker = _messageBroker;
        return _this;
    }
    MockMessageBrokerFactory.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        return this._messageBroker;
    };
    return MockMessageBrokerFactory;
}(client_message_broker_1.ClientMessageBrokerFactory_));
exports.MockMessageBrokerFactory = MockMessageBrokerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX3dvcmtlcl90ZXN0X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvdGVzdC93ZWJfd29ya2Vycy9zaGFyZWQvd2ViX3dvcmtlcl90ZXN0X3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgsa0hBQXVKO0FBQ3ZKLDhGQUE0SDtBQUc1SCwyREFBc0Q7QUFFdEQ7OztHQUdHO0FBQ0g7SUFDRSxJQUFNLGFBQWEsR0FBMkMsRUFBRSxDQUFDO0lBQ2pFLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuRSxJQUFNLGtCQUFrQixHQUFHLElBQUksb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFbkUsSUFBTSxjQUFjLEdBQTJDLEVBQUUsQ0FBQztJQUNsRSxJQUFNLGdCQUFnQixHQUFHLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEUsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sQ0FBQyxJQUFJLGtCQUFrQixDQUN6QixJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxFQUN4RCxJQUFJLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQztBQVpELDREQVlDO0FBRUQ7Ozs7O0dBS0c7QUFDSCwwQkFDSSxNQUF3QixFQUFFLFVBQWtCLEVBQUUsSUFBaUIsRUFDL0QsT0FBNkM7SUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQUMsSUFBaUIsRUFBRSxVQUFxQjtRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFD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