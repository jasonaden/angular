"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var application_ref_1 = require("./application_ref");
exports.ɵALLOW_MULTIPLE_PLATFORMS = application_ref_1.ALLOW_MULTIPLE_PLATFORMS;
var application_tokens_1 = require("./application_tokens");
exports.ɵAPP_ID_RANDOM_PROVIDER = application_tokens_1.APP_ID_RANDOM_PROVIDER;
var change_detection_util_1 = require("./change_detection/change_detection_util");
exports.ɵValueUnwrapper = change_detection_util_1.ValueUnwrapper;
exports.ɵdevModeEqual = change_detection_util_1.devModeEqual;
var change_detection_util_2 = require("./change_detection/change_detection_util");
exports.ɵisListLikeIterable = change_detection_util_2.isListLikeIterable;
var constants_1 = require("./change_detection/constants");
exports.ɵChangeDetectorStatus = constants_1.ChangeDetectorStatus;
exports.ɵisDefaultChangeDetectionStrategy = constants_1.isDefaultChangeDetectionStrategy;
var console_1 = require("./console");
exports.ɵConsole = console_1.Console;
var errors_1 = require("./errors");
exports.ɵERROR_COMPONENT_TYPE = errors_1.ERROR_COMPONENT_TYPE;
var component_factory_1 = require("./linker/component_factory");
exports.ɵComponentFactory = component_factory_1.ComponentFactory;
var component_factory_resolver_1 = require("./linker/component_factory_resolver");
exports.ɵCodegenComponentFactoryResolver = component_factory_resolver_1.CodegenComponentFactoryResolver;
var view_1 = require("./metadata/view");
exports.ɵViewMetadata = view_1.ViewMetadata;
var reflection_capabilities_1 = require("./reflection/reflection_capabilities");
exports.ɵReflectionCapabilities = reflection_capabilities_1.ReflectionCapabilities;
var api_1 = require("./render/api");
exports.ɵRenderDebugInfo = api_1.RenderDebugInfo;
var util_1 = require("./util");
exports.ɵglobal = util_1.global;
exports.ɵlooseIdentical = util_1.looseIdentical;
exports.ɵstringify = util_1.stringify;
var decorators_1 = require("./util/decorators");
exports.ɵmakeDecorator = decorators_1.makeDecorator;
var lang_1 = require("./util/lang");
exports.ɵisObservable = lang_1.isObservable;
exports.ɵisPromise = lang_1.isPromise;
var index_1 = require("./view/index");
exports.ɵclearProviderOverrides = index_1.clearProviderOverrides;
exports.ɵoverrideProvider = index_1.overrideProvider;
var provider_1 = require("./view/provider");
exports.ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = provider_1.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZV9wcml2YXRlX2V4cG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NvcmVfcHJpdmF0ZV9leHBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxxREFBd0Y7QUFBaEYsc0RBQUEsd0JBQXdCLENBQTZCO0FBQzdELDJEQUF1RjtBQUEvRSx1REFBQSxzQkFBc0IsQ0FBMkI7QUFDekQsa0ZBQTBIO0FBQWxILGtEQUFBLGNBQWMsQ0FBbUI7QUFBRSxnREFBQSxZQUFZLENBQWlCO0FBQ3hFLGtGQUFtRztBQUEzRixzREFBQSxrQkFBa0IsQ0FBdUI7QUFDakQsMERBQWtLO0FBQTFKLDRDQUFBLG9CQUFvQixDQUF5QjtBQUFFLHdEQUFBLGdDQUFnQyxDQUFxQztBQUM1SCxxQ0FBOEM7QUFBdEMsNkJBQUEsT0FBTyxDQUFZO0FBQzNCLG1DQUF1RTtBQUEvRCx5Q0FBQSxvQkFBb0IsQ0FBeUI7QUFDckQsZ0VBQWlGO0FBQXpFLGdEQUFBLGdCQUFnQixDQUFxQjtBQUM3QyxrRkFBd0g7QUFBaEgsd0VBQUEsK0JBQStCLENBQW9DO0FBQzNFLHdDQUE4RDtBQUF0RCwrQkFBQSxZQUFZLENBQWlCO0FBQ3JDLGdGQUF1RztBQUEvRiw0REFBQSxzQkFBc0IsQ0FBMkI7QUFFekQsb0NBQW9HO0FBQXpELGlDQUFBLGVBQWUsQ0FBb0I7QUFDOUUsK0JBQXFHO0FBQTdGLHlCQUFBLE1BQU0sQ0FBVztBQUFFLGlDQUFBLGNBQWMsQ0FBbUI7QUFBRSw0QkFBQSxTQUFTLENBQWM7QUFDckYsZ0RBQWtFO0FBQTFELHNDQUFBLGFBQWEsQ0FBa0I7QUFDdkMsb0NBQW1GO0FBQTNFLCtCQUFBLFlBQVksQ0FBaUI7QUFBRSw0QkFBQSxTQUFTLENBQWM7QUFDOUQsc0NBQXNIO0FBQTlHLDBDQUFBLHNCQUFzQixDQUEyQjtBQUFFLG9DQUFBLGdCQUFnQixDQUFxQjtBQUNoRyw0Q0FBZ0g7QUFBeEcsNERBQUEscUNBQXFDLENBQTBDIn0=