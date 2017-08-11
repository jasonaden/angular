"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * The `di` module provides dependency injection container services.
 */
__export(require("./di/metadata"));
var forward_ref_1 = require("./di/forward_ref");
exports.forwardRef = forward_ref_1.forwardRef;
exports.resolveForwardRef = forward_ref_1.resolveForwardRef;
var injector_1 = require("./di/injector");
exports.Injector = injector_1.Injector;
var reflective_injector_1 = require("./di/reflective_injector");
exports.ReflectiveInjector = reflective_injector_1.ReflectiveInjector;
var reflective_provider_1 = require("./di/reflective_provider");
exports.ResolvedReflectiveFactory = reflective_provider_1.ResolvedReflectiveFactory;
var reflective_key_1 = require("./di/reflective_key");
exports.ReflectiveKey = reflective_key_1.ReflectiveKey;
var injection_token_1 = require("./di/injection_token");
exports.InjectionToken = injection_token_1.InjectionToken;
exports.OpaqueToken = injection_token_1.OpaqueToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7OztBQUVIOzs7O0dBSUc7QUFFSCxtQ0FBOEI7QUFFOUIsZ0RBQTZFO0FBQXJFLG1DQUFBLFVBQVUsQ0FBQTtBQUFFLDBDQUFBLGlCQUFpQixDQUFBO0FBRXJDLDBDQUF1QztBQUEvQiw4QkFBQSxRQUFRLENBQUE7QUFDaEIsZ0VBQTREO0FBQXBELG1EQUFBLGtCQUFrQixDQUFBO0FBRTFCLGdFQUErRjtBQUF2RiwwREFBQSx5QkFBeUIsQ0FBQTtBQUNqQyxzREFBa0Q7QUFBMUMseUNBQUEsYUFBYSxDQUFBO0FBQ3JCLHdEQUFpRTtBQUF6RCwyQ0FBQSxjQUFjLENBQUE7QUFBRSx3Q0FBQSxXQUFXLENBQUEifQ==