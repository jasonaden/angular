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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../index");
function main() {
    testing_internal_1.describe('runner', function () {
        var injector;
        var runner;
        function createRunner(defaultProviders) {
            if (!defaultProviders) {
                defaultProviders = [];
            }
            runner = new index_1.Runner([
                defaultProviders, {
                    provide: index_1.Sampler,
                    useFactory: function (_injector) {
                        injector = _injector;
                        return new MockSampler();
                    },
                    deps: [index_1.Injector]
                },
                { provide: index_1.Metric, useFactory: function () { return new MockMetric(); }, deps: [] },
                { provide: index_1.Validator, useFactory: function () { return new MockValidator(); }, deps: [] },
                { provide: index_1.WebDriverAdapter, useFactory: function () { return new MockWebDriverAdapter(); }, deps: [] }
            ]);
            return runner;
        }
        testing_internal_1.it('should set SampleDescription.id', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner()
                .sample({ id: 'someId' })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.id).toBe('someId');
                async.done();
            });
        }));
        testing_internal_1.it('should merge SampleDescription.description', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner([{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 1 } }])
                .sample({
                id: 'someId',
                providers: [{ provide: index_1.Options.SAMPLE_DESCRIPTION, useValue: { 'b': 2 } }]
            })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.description)
                    .toEqual({ 'forceGc': false, 'userAgent': 'someUserAgent', 'a': 1, 'b': 2, 'v': 11 });
                async.done();
            });
        }));
        testing_internal_1.it('should fill SampleDescription.metrics from the Metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner()
                .sample({ id: 'someId' })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.metrics).toEqual({ 'm1': 'some metric' });
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.EXECUTE', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var execute = function () { };
            createRunner().sample({ id: 'someId', execute: execute }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.EXECUTE)).toEqual(execute);
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.PREPARE', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var prepare = function () { };
            createRunner().sample({ id: 'someId', prepare: prepare }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.PREPARE)).toEqual(prepare);
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.MICRO_METRICS', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner().sample({ id: 'someId', microMetrics: { 'a': 'b' } }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.MICRO_METRICS)).toEqual({ 'a': 'b' });
                async.done();
            });
        }));
        testing_internal_1.it('should overwrite providers per sample call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner([{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 1 } }])
                .sample({
                id: 'someId',
                providers: [{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 2 } }]
            })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.description['a']).toBe(2);
                async.done();
            });
        }));
    });
}
exports.main = main;
var MockWebDriverAdapter = (function (_super) {
    __extends(MockWebDriverAdapter, _super);
    function MockWebDriverAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockWebDriverAdapter.prototype.executeScript = function (script) { return Promise.resolve('someUserAgent'); };
    MockWebDriverAdapter.prototype.capabilities = function () { return null; };
    return MockWebDriverAdapter;
}(index_1.WebDriverAdapter));
var MockValidator = (function (_super) {
    __extends(MockValidator, _super);
    function MockValidator() {
        return _super.call(this) || this;
    }
    MockValidator.prototype.describe = function () { return { 'v': 11 }; };
    return MockValidator;
}(index_1.Validator));
var MockMetric = (function (_super) {
    __extends(MockMetric, _super);
    function MockMetric() {
        return _super.call(this) || this;
    }
    MockMetric.prototype.describe = function () { return { 'm1': 'some metric' }; };
    return MockMetric;
}(index_1.Metric));
var MockSampler = (function (_super) {
    __extends(MockSampler, _super);
    function MockSampler() {
        return _super.call(this, null, null, null, null, null, null, null) || this;
    }
    MockSampler.prototype.sample = function () { return Promise.resolve(new index_1.SampleState([], [])); };
    return MockSampler;
}(index_1.Sampler));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3Rlc3QvcnVubmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsK0VBQTRHO0FBRTVHLGtDQUFpSTtBQUVqSTtJQUNFLDJCQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLElBQUksUUFBa0IsQ0FBQztRQUN2QixJQUFJLE1BQWMsQ0FBQztRQUVuQixzQkFBc0IsZ0JBQXdCO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixnQkFBZ0IsR0FBRyxFQUFFLENBQUM7WUFDeEIsQ0FBQztZQUNELE1BQU0sR0FBRyxJQUFJLGNBQU0sQ0FBQztnQkFDbEIsZ0JBQWdCLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRSxlQUFPO29CQUNoQixVQUFVLEVBQUUsVUFBQyxTQUFtQjt3QkFDOUIsUUFBUSxHQUFHLFNBQVMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7b0JBQzNCLENBQUM7b0JBQ0QsSUFBSSxFQUFFLENBQUMsZ0JBQVEsQ0FBQztpQkFDakI7Z0JBQ0QsRUFBQyxPQUFPLEVBQUUsY0FBTSxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSxVQUFVLEVBQUUsRUFBaEIsQ0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2dCQUMvRCxFQUFDLE9BQU8sRUFBRSxpQkFBUyxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSxhQUFhLEVBQUUsRUFBbkIsQ0FBbUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2dCQUNyRSxFQUFDLE9BQU8sRUFBRSx3QkFBZ0IsRUFBRSxVQUFVLEVBQUUsY0FBTSxPQUFBLElBQUksb0JBQW9CLEVBQUUsRUFBMUIsQ0FBMEIsRUFBRSxJQUFJLEVBQUUs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