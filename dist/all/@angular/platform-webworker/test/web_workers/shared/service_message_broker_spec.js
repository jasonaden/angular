"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var api_1 = require("@angular/platform-webworker/src/web_workers/shared/api");
var render_store_1 = require("@angular/platform-webworker/src/web_workers/shared/render_store");
var serializer_1 = require("@angular/platform-webworker/src/web_workers/shared/serializer");
var service_message_broker_1 = require("@angular/platform-webworker/src/web_workers/shared/service_message_broker");
var web_worker_test_util_1 = require("./web_worker_test_util");
function main() {
    var CHANNEL = 'UIMessageBroker Test Channel';
    var TEST_METHOD = 'TEST_METHOD';
    var PASSED_ARG_1 = 5;
    var PASSED_ARG_2 = 'TEST';
    var RESULT = 20;
    var ID = 'methodId';
    testing_internal_1.beforeEachProviders(function () { return [serializer_1.Serializer, { provide: api_1.ON_WEB_WORKER, useValue: true }, render_store_1.RenderStore]; });
    testing_internal_1.describe('UIMessageBroker', function () {
        var messageBuses /** TODO #9100 */;
        testing_internal_1.beforeEach(function () {
            messageBuses = web_worker_test_util_1.createPairedMessageBuses();
            messageBuses.ui.initChannel(CHANNEL);
            messageBuses.worker.initChannel(CHANNEL);
        });
        testing_internal_1.it('should call registered method with correct arguments', testing_internal_1.inject([serializer_1.Serializer], function (serializer) {
            var broker = new service_message_broker_1.ServiceMessageBroker_(messageBuses.ui, serializer, CHANNEL);
            broker.registerMethod(TEST_METHOD, [1 /* PRIMITIVE */, 1 /* PRIMITIVE */], function (arg1, arg2) {
                testing_internal_1.expect(arg1).toEqual(PASSED_ARG_1);
                testing_internal_1.expect(arg2).toEqual(PASSED_ARG_2);
            });
            messageBuses.worker.to(CHANNEL).emit({
                'method': TEST_METHOD,
                'args': [PASSED_ARG_1, PASSED_ARG_2],
            });
        }));
        testing_internal_1.it('should return promises to the worker', testing_internal_1.inject([serializer_1.Serializer], function (serializer) {
            var broker = new service_message_broker_1.ServiceMessageBroker_(messageBuses.ui, serializer, CHANNEL);
            broker.registerMethod(TEST_METHOD, [1 /* PRIMITIVE */], function (arg1) {
                testing_internal_1.expect(arg1).toEqual(PASSED_ARG_1);
                return new Promise(function (res, rej) {
                    try {
                        res(RESULT);
                    }
                    catch (e) {
                        rej(e);
                    }
                });
            });
            messageBuses.worker.to(CHANNEL).emit({ 'method': TEST_METHOD, 'id': ID, 'args': [PASSED_ARG_1] });
            messageBuses.worker.from(CHANNEL).subscribe({
                next: function (data) {
                    testing_internal_1.expect(data.type).toEqual('result');
                    testing_internal_1.expect(data.id).toEqual(ID);
                    testing_internal_1.expect(data.value).toEqual(RESULT);
                },
            });
        }));
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZV9tZXNzYWdlX2Jyb2tlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3Rlc3Qvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUF5SDtBQUN6SCw4RUFBcUY7QUFDckYsZ0dBQTRGO0FBQzVGLDRGQUEwRztBQUMxRyxvSEFBZ0g7QUFFaEgsK0RBQWdFO0FBRWhFO0lBQ0UsSUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUM7SUFDL0MsSUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDO0lBQ2xDLElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFNLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDNUIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztJQUV0QixzQ0FBbUIsQ0FBQyxjQUFNLE9BQUEsQ0FBQyx1QkFBVSxFQUFFLEVBQUMsT0FBTyxFQUFFLG1CQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFFLDBCQUFXLENBQUMsRUFBbkUsQ0FBbUUsQ0FBQyxDQUFDO0lBRS9GLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBSSxZQUFpQixDQUFDLGlCQUFpQixDQUFDO1FBRXhDLDZCQUFVLENBQUM7WUFDVCxZQUFZLEdBQUcsK0NBQXdCLEVBQUUsQ0FBQztZQUMxQyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFFLENBQUMsc0RBQXNELEVBQ3RELHlCQUFNLENBQUMs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