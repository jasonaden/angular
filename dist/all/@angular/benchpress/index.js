"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Must be imported first, because Angular decorators throw on load.
require("reflect-metadata");
var core_1 = require("@angular/core");
exports.InjectionToken = core_1.InjectionToken;
exports.Injector = core_1.Injector;
exports.ReflectiveInjector = core_1.ReflectiveInjector;
var common_options_1 = require("./src/common_options");
exports.Options = common_options_1.Options;
var measure_values_1 = require("./src/measure_values");
exports.MeasureValues = measure_values_1.MeasureValues;
var metric_1 = require("./src/metric");
exports.Metric = metric_1.Metric;
var multi_metric_1 = require("./src/metric/multi_metric");
exports.MultiMetric = multi_metric_1.MultiMetric;
var perflog_metric_1 = require("./src/metric/perflog_metric");
exports.PerflogMetric = perflog_metric_1.PerflogMetric;
var user_metric_1 = require("./src/metric/user_metric");
exports.UserMetric = user_metric_1.UserMetric;
var reporter_1 = require("./src/reporter");
exports.Reporter = reporter_1.Reporter;
var console_reporter_1 = require("./src/reporter/console_reporter");
exports.ConsoleReporter = console_reporter_1.ConsoleReporter;
var json_file_reporter_1 = require("./src/reporter/json_file_reporter");
exports.JsonFileReporter = json_file_reporter_1.JsonFileReporter;
var multi_reporter_1 = require("./src/reporter/multi_reporter");
exports.MultiReporter = multi_reporter_1.MultiReporter;
var runner_1 = require("./src/runner");
exports.Runner = runner_1.Runner;
var sample_description_1 = require("./src/sample_description");
exports.SampleDescription = sample_description_1.SampleDescription;
var sampler_1 = require("./src/sampler");
exports.SampleState = sampler_1.SampleState;
exports.Sampler = sampler_1.Sampler;
var validator_1 = require("./src/validator");
exports.Validator = validator_1.Validator;
var regression_slope_validator_1 = require("./src/validator/regression_slope_validator");
exports.RegressionSlopeValidator = regression_slope_validator_1.RegressionSlopeValidator;
var size_validator_1 = require("./src/validator/size_validator");
exports.SizeValidator = size_validator_1.SizeValidator;
var web_driver_adapter_1 = require("./src/web_driver_adapter");
exports.WebDriverAdapter = web_driver_adapter_1.WebDriverAdapter;
var web_driver_extension_1 = require("./src/web_driver_extension");
exports.PerfLogFeatures = web_driver_extension_1.PerfLogFeatures;
exports.WebDriverExtension = web_driver_extension_1.WebDriverExtension;
var chrome_driver_extension_1 = require("./src/webdriver/chrome_driver_extension");
exports.ChromeDriverExtension = chrome_driver_extension_1.ChromeDriverExtension;
var firefox_driver_extension_1 = require("./src/webdriver/firefox_driver_extension");
exports.FirefoxDriverExtension = firefox_driver_extension_1.FirefoxDriverExtension;
var ios_driver_extension_1 = require("./src/webdriver/ios_driver_extension");
exports.IOsDriverExtension = ios_driver_extension_1.IOsDriverExtension;
var selenium_webdriver_adapter_1 = require("./src/webdriver/selenium_webdriver_adapter");
exports.SeleniumWebDriverAdapter = selenium_webdriver_adapter_1.SeleniumWebDriverAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsb0VBQW9FO0FBQ3BFLDRCQUEwQjtBQUUxQixzQ0FBcUc7QUFBN0YsZ0NBQUEsY0FBYyxDQUFBO0FBQUUsMEJBQUEsUUFBUSxDQUFBO0FBQVksb0NBQUEsa0JBQWtCLENBQUE7QUFDOUQsdURBQTZDO0FBQXJDLG1DQUFBLE9BQU8sQ0FBQTtBQUNmLHVEQUFtRDtBQUEzQyx5Q0FBQSxhQUFhLENBQUE7QUFDckIsdUNBQW9DO0FBQTVCLDBCQUFBLE1BQU0sQ0FBQTtBQUNkLDBEQUFzRDtBQUE5QyxxQ0FBQSxXQUFXLENBQUE7QUFDbkIsOERBQTBEO0FBQWxELHlDQUFBLGFBQWEsQ0FBQTtBQUNyQix3REFBb0Q7QUFBNUMsbUNBQUEsVUFBVSxDQUFBO0FBQ2xCLDJDQUF3QztBQUFoQyw4QkFBQSxRQUFRLENBQUE7QUFDaEIsb0VBQWdFO0FBQXhELDZDQUFBLGVBQWUsQ0FBQTtBQUN2Qix3RUFBbUU7QUFBM0QsZ0RBQUEsZ0JBQWdCLENBQUE7QUFDeEIsZ0VBQTREO0FBQXBELHlDQUFBLGFBQWEsQ0FBQTtBQUNyQix1Q0FBb0M7QUFBNUIsMEJBQUEsTUFBTSxDQUFBO0FBQ2QsK0RBQTJEO0FBQW5ELGlEQUFBLGlCQUFpQixDQUFBO0FBQ3pCLHlDQUFtRDtBQUEzQyxnQ0FBQSxXQUFXLENBQUE7QUFBRSw0QkFBQSxPQUFPLENBQUE7QUFDNUIsNkNBQTBDO0FBQWxDLGdDQUFBLFNBQVMsQ0FBQTtBQUNqQix5RkFBb0Y7QUFBNUUsZ0VBQUEsd0JBQXdCLENBQUE7QUFDaEMsaUVBQTZEO0FBQXJELHlDQUFBLGFBQWEsQ0FBQTtBQUNyQiwrREFBMEQ7QUFBbEQsZ0RBQUEsZ0JBQWdCLENBQUE7QUFDeEIsbUVBQTZGO0FBQXZFLGlEQUFBLGVBQWUsQ0FBQTtBQUFFLG9EQUFBLGtCQUFrQixDQUFBO0FBQ3pELG1GQUE4RTtBQUF0RSwwREFBQSxxQkFBcUIsQ0FBQTtBQUM3QixxRkFBZ0Y7QUFBeEUsNERBQUEsc0JBQXNCLENBQUE7QUFDOUIsNkVBQXdFO0FBQWhFLG9EQUFBLGtCQUFrQixDQUFBO0FBQzFCLHlGQUFvRjtBQUE1RSxnRUFBQSx3QkFBd0IsQ0FBQSJ9