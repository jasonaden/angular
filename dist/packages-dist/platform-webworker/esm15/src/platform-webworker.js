/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { WORKER_SCRIPT, platformWorkerUi } from './worker_render';
export { VERSION } from './version';
export { ClientMessageBroker, ClientMessageBrokerFactory, FnArg, UiArguments } from './web_workers/shared/client_message_broker';
export { MessageBus, MessageBusSink, MessageBusSource } from './web_workers/shared/message_bus';
export { PRIMITIVE } from './web_workers/shared/serializer';
export { ReceivedMessage, ServiceMessageBroker, ServiceMessageBrokerFactory } from './web_workers/shared/service_message_broker';
export { WORKER_UI_LOCATION_PROVIDERS } from './web_workers/ui/location_providers';
export { WORKER_APP_LOCATION_PROVIDERS } from './web_workers/worker/location_providers';
export { WorkerAppModule, platformWorkerApp } from './worker_app';
export { platformWorkerUi } from './worker_render';
/**
 * Bootstraps the worker ui.
 *
 * \@experimental
 * @param {?} workerScriptUri
 * @param {?=} customProviders
 * @return {?}
 */
export function bootstrapWorkerUi(workerScriptUri, customProviders = []) {
    // For now, just creates the worker ui platform...
    const /** @type {?} */ platform = platformWorkerUi([
        { provide: WORKER_SCRIPT, useValue: workerScriptUri },
        ...customProviders,
    ]);
    return Promise.resolve(platform);
}
//# sourceMappingURL=platform-webworker.js.map