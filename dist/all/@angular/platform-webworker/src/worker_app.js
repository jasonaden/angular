"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var api_1 = require("./web_workers/shared/api");
var client_message_broker_1 = require("./web_workers/shared/client_message_broker");
var message_bus_1 = require("./web_workers/shared/message_bus");
var post_message_bus_1 = require("./web_workers/shared/post_message_bus");
var render_store_1 = require("./web_workers/shared/render_store");
var serializer_1 = require("./web_workers/shared/serializer");
var service_message_broker_1 = require("./web_workers/shared/service_message_broker");
var renderer_1 = require("./web_workers/worker/renderer");
var worker_adapter_1 = require("./web_workers/worker/worker_adapter");
/**
 * @experimental
 */
exports.platformWorkerApp = core_1.createPlatformFactory(core_1.platformCore, 'workerApp', [{ provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_WORKER_APP_ID }]);
function errorHandler() {
    return new core_1.ErrorHandler();
}
exports.errorHandler = errorHandler;
// TODO(jteplitz602) remove this and compile with lib.webworker.d.ts (#3492)
var _postMessage = {
    postMessage: function (message, transferrables) {
        postMessage(message, transferrables);
    }
};
function createMessageBus(zone) {
    var sink = new post_message_bus_1.PostMessageBusSink(_postMessage);
    var source = new post_message_bus_1.PostMessageBusSource();
    var bus = new post_message_bus_1.PostMessageBus(sink, source);
    bus.attachToZone(zone);
    return bus;
}
exports.createMessageBus = createMessageBus;
function setupWebWorker() {
    worker_adapter_1.WorkerDomAdapter.makeCurrent();
}
exports.setupWebWorker = setupWebWorker;
/**
 * The ng module for the worker app side.
 *
 * @experimental
 */
var WorkerAppModule = (function () {
    function WorkerAppModule() {
    }
    return WorkerAppModule;
}());
WorkerAppModule = __decorate([
    core_1.NgModule({
        providers: [
            platform_browser_1.ɵBROWSER_SANITIZATION_PROVIDERS,
            serializer_1.Serializer,
            { provide: platform_browser_1.DOCUMENT, useValue: null },
            { provide: client_message_broker_1.ClientMessageBrokerFactory, useClass: client_message_broker_1.ClientMessageBrokerFactory_ },
            { provide: service_message_broker_1.ServiceMessageBrokerFactory, useClass: service_message_broker_1.ServiceMessageBrokerFactory_ },
            renderer_1.WebWorkerRendererFactory2,
            { provide: core_1.RendererFactory2, useExisting: renderer_1.WebWorkerRendererFactory2 },
            { provide: api_1.ON_WEB_WORKER, useValue: true },
            render_store_1.RenderStore,
            { provide: core_1.ErrorHandler, useFactory: errorHandler, deps: [] },
            { provide: message_bus_1.MessageBus, useFactory: createMessageBus, deps: [core_1.NgZone] },
            { provide: core_1.APP_INITIALIZER, useValue: setupWebWorker, multi: true },
        ],
        exports: [
            common_1.CommonModule,
            core_1.ApplicationModule,
        ]
    })
], WorkerAppModule);
exports.WorkerAppModule = WorkerAppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci9zcmMvd29ya2VyX2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUFnRztBQUNoRyxzQ0FBZ047QUFDaE4sOERBQXNIO0FBRXRILGdEQUF1RDtBQUN2RCxvRkFBbUg7QUFDbkgsZ0VBQTREO0FBQzVELDBFQUErRztBQUMvRyxrRUFBOEQ7QUFDOUQsOERBQTJEO0FBQzNELHNGQUFzSDtBQUN0SCwwREFBd0U7QUFDeEUsc0VBQXFFO0FBSXJFOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyw0QkFBcUIsQ0FDbEQsbUJBQVksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFFBQVEsRUFBRSxnQ0FBc0IsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUUzRjtJQUNFLE1BQU0sQ0FBQyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztBQUM1QixDQUFDO0FBRkQsb0NBRUM7QUFHRCw0RUFBNEU7QUFDNUUsSUFBTSxZQUFZLEdBQUc7SUFDbkIsV0FBVyxFQUFFLFVBQUMsT0FBWSxFQUFFLGNBQThCO1FBQ2xELFdBQVksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGLENBQUM7QUFFRiwwQkFBaUMsSUFBWTtJQUMzQyxJQUFNLElBQUksR0FBRyxJQUFJLHFDQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xELElBQU0sTUFBTSxHQUFHLElBQUksdUNBQW9CLEVBQUUsQ0FBQztJQUMxQyxJQUFNLEdBQUcsR0FBRyxJQUFJLGlDQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFORCw0Q0FNQztBQUVEO0lBQ0UsaUNBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakMsQ0FBQztBQUZELHdDQUVDO0FBRUQ7Ozs7R0FJRztBQXFCSCxJQUFhLGVBQWU7SUFBNUI7SUFDQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBREQsSUFDQztBQURZLGVBQWU7SUFwQjNCLGVBQVEsQ0FBQztRQUNSLFNBQVMsRUFBRTtZQUNULGtEQUE4QjtZQUM5Qix1QkFBVTtZQUNWLEVBQUMsT0FBTyxFQUFFLDJCQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztZQUNuQyxFQUFDLE9BQU8sRUFBRSxrREFBMEIsRUFBRSxRQUFRLEVBQUUsbURBQTJCLEVBQUM7WUFDNUUsRUFBQyxPQUFPLEVBQUUsb0RBQTJCLEVBQUUsUUFBUSxFQUFFLHFEQUE0QixFQUFDO1lBQzlFLG9DQUF5QjtZQUN6QixFQUFDLE9BQU8sRUFBRSx1QkFBZ0IsRUFBRSxXQUFXLEVBQUUsb0NBQXlCLEVBQUM7WUFDbkUsRUFBQyxPQUFPLEVBQUUsbUJBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1lBQ3hDLDBCQUFXO1lBQ1gsRUFBQyxPQUFPLEVBQUUsbUJBQVksRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7WUFDM0QsRUFBQyxPQUFPLEVBQUUsd0JBQVUsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBTSxDQUFDLEVBQUM7WUFDbkUsRUFBQyxPQUFPLEVBQUUsc0JBQWUsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7U0FDbEU7UUFDRCxPQUFPLEVBQUU7WUFDUCxxQkFBWTtZQUNaLHdCQUFpQjtTQUNsQjtLQUNGLENBQUM7R0FDVyxlQUFlLENBQzNCO0FBRFksMENBQWUifQ==