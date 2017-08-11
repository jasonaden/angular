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
var application_tokens_1 = require("./application_tokens");
var console_1 = require("./console");
var di_1 = require("./di");
var testability_1 = require("./testability/testability");
var _CORE_PLATFORM_PROVIDERS = [
    // Set a default platform name for platforms that don't set it explicitly.
    { provide: application_tokens_1.PLATFORM_ID, useValue: 'unknown' },
    { provide: application_ref_1.PlatformRef_, deps: [di_1.Injector] },
    { provide: application_ref_1.PlatformRef, useExisting: application_ref_1.PlatformRef_ },
    { provide: testability_1.TestabilityRegistry, deps: [] },
    { provide: console_1.Console, deps: [] },
];
/**
 * This platform has to be included in any other platform
 *
 * @experimental
 */
exports.platformCore = application_ref_1.createPlatformFactory(null, 'core', _CORE_PLATFORM_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fY29yZV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9wbGF0Zm9ybV9jb3JlX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHFEQUFtRjtBQUNuRiwyREFBaUQ7QUFDakQscUNBQWtDO0FBQ2xDLDJCQUE4QztBQUM5Qyx5REFBOEQ7QUFFOUQsSUFBTSx3QkFBd0IsR0FBcUI7SUFDakQsMEVBQTBFO0lBQzFFLEVBQUMsT0FBTyxFQUFFLGdDQUFXLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQztJQUMzQyxFQUFDLE9BQU8sRUFBRSw4QkFBWSxFQUFFLElBQUksRUFBRSxDQUFDLGFBQVEsQ0FBQyxFQUFDO0lBQ3pDLEVBQUMsT0FBTyxFQUFFLDZCQUFXLEVBQUUsV0FBVyxFQUFFLDhCQUFZLEVBQUM7SUFDakQsRUFBQyxPQUFPLEVBQUUsaUNBQW1CLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUN4QyxFQUFDLE9BQU8sRUFBRSxpQkFBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7Q0FDN0IsQ0FBQztBQUVGOzs7O0dBSUc7QUFDVSxRQUFBLFlBQVksR0FBRyx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixDQUFDLENBQUMifQ==