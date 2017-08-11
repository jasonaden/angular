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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var application_init_1 = require("./application_init");
var application_ref_1 = require("./application_ref");
var application_tokens_1 = require("./application_tokens");
var change_detection_1 = require("./change_detection/change_detection");
var metadata_1 = require("./di/metadata");
var tokens_1 = require("./i18n/tokens");
var compiler_1 = require("./linker/compiler");
var metadata_2 = require("./metadata");
function _iterableDiffersFactory() {
    return change_detection_1.defaultIterableDiffers;
}
exports._iterableDiffersFactory = _iterableDiffersFactory;
function _keyValueDiffersFactory() {
    return change_detection_1.defaultKeyValueDiffers;
}
exports._keyValueDiffersFactory = _keyValueDiffersFactory;
function _localeFactory(locale) {
    return locale || 'en-US';
}
exports._localeFactory = _localeFactory;
/**
 * This module includes the providers of @angular/core that are needed
 * to bootstrap components via `ApplicationRef`.
 *
 * @experimental
 */
var ApplicationModule = (function () {
    // Inject ApplicationRef to make it eager...
    function ApplicationModule(appRef) {
    }
    return ApplicationModule;
}());
ApplicationModule = __decorate([
    metadata_2.NgModule({
        providers: [
            application_ref_1.ApplicationRef_,
            { provide: application_ref_1.ApplicationRef, useExisting: application_ref_1.ApplicationRef_ },
            application_init_1.ApplicationInitStatus,
            compiler_1.Compiler,
            application_tokens_1.APP_ID_RANDOM_PROVIDER,
            { provide: change_detection_1.IterableDiffers, useFactory: _iterableDiffersFactory },
            { provide: change_detection_1.KeyValueDiffers, useFactory: _keyValueDiffersFactory },
            {
                provide: tokens_1.LOCALE_ID,
                useFactory: _localeFactory,
                deps: [[new metadata_1.Inject(tokens_1.LOCALE_ID), new metadata_1.Optional(), new metadata_1.SkipSelf()]]
            },
        ]
    }),
    __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
], ApplicationModule);
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdURBQXlEO0FBQ3pELHFEQUFrRTtBQUNsRSwyREFBNEQ7QUFDNUQsd0VBQXFJO0FBQ3JJLDBDQUF5RDtBQUN6RCx3Q0FBd0M7QUFDeEMsOENBQTJDO0FBQzNDLHVDQUFvQztBQUVwQztJQUNFLE1BQU0sQ0FBQyx5Q0FBc0IsQ0FBQztBQUNoQyxDQUFDO0FBRkQsMERBRUM7QUFFRDtJQUNFLE1BQU0sQ0FBQyx5Q0FBc0IsQ0FBQztBQUNoQyxDQUFDO0FBRkQsMERBRUM7QUFFRCx3QkFBK0IsTUFBZTtJQUM1QyxNQUFNLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQztBQUMzQixDQUFDO0FBRkQsd0NBRUM7QUFFRDs7Ozs7R0FLRztBQWlCSCxJQUFhLGlCQUFpQjtJQUM1Qiw0Q0FBNEM7SUFDNUMsMkJBQVksTUFBc0I7SUFBRyxDQUFDO0lBQ3hDLHdCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxpQkFBaUI7SUFoQjdCLG1CQUFRLENBQUM7UUFDUixTQUFTLEVBQUU7WUFDVCxpQ0FBZTtZQUNmLEVBQUMsT0FBTyxFQUFFLGdDQUFjLEVBQUUsV0FBVyxFQUFFLGlDQUFlLEVBQUM7WUFDdkQsd0NBQXFCO1lBQ3JCLG1CQUFRO1lBQ1IsMkNBQXNCO1lBQ3RCLEVBQUMsT0FBTyxFQUFFLGtDQUFlLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFDO1lBQy9ELEVBQUMsT0FBTyxFQUFFLGtDQUFlLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFDO1lBQy9EO2dCQUNFLE9BQU8sRUFBRSxrQkFBUztnQkFDbEIsVUFBVSxFQUFFLGNBQWM7Z0JBQzFCLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxpQkFBTSxDQUFDLGtCQUFTLENBQUMsRUFBRSxJQUFJLG1CQUFRLEVBQUUsRUFBRSxJQUFJLG1CQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ2hFO1NBQ0Y7S0FDRixDQUFDO3FDQUdvQixnQ0FBYztHQUZ2QixpQkFBaUIsQ0FHN0I7QUFIWSw4Q0FBaUIifQ==