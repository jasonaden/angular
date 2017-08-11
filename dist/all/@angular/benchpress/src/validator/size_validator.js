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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validator_1 = require("../validator");
/**
 * A validator that waits for the sample to have a certain size.
 */
var SizeValidator = SizeValidator_1 = (function (_super) {
    __extends(SizeValidator, _super);
    function SizeValidator(_sampleSize) {
        var _this = _super.call(this) || this;
        _this._sampleSize = _sampleSize;
        return _this;
    }
    SizeValidator.prototype.describe = function () { return { 'sampleSize': this._sampleSize }; };
    SizeValidator.prototype.validate = function (completeSample) {
        if (completeSample.length >= this._sampleSize) {
            return completeSample.slice(completeSample.length - this._sampleSize, completeSample.length);
        }
        else {
            return null;
        }
    };
    return SizeValidator;
}(validator_1.Validator));
SizeValidator.SAMPLE_SIZE = new core_1.InjectionToken('SizeValidator.sampleSize');
SizeValidator.PROVIDERS = [
    { provide: SizeValidator_1, deps: [SizeValidator_1.SAMPLE_SIZE] },
    { provide: SizeValidator_1.SAMPLE_SIZE, useValue: 10 }
];
SizeValidator = SizeValidator_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(SizeValidator_1.SAMPLE_SIZE)),
    __metadata("design:paramtypes", [Number])
], SizeValidator);
exports.SizeValidator = SizeValidator;
var SizeValidator_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZV92YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy92YWxpZGF0b3Ivc2l6ZV92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBR2pFLDBDQUF1QztBQUV2Qzs7R0FFRztBQUVILElBQWEsYUFBYTtJQUFTLGlDQUFTO0lBTzFDLHVCQUF1RCxXQUFtQjtRQUExRSxZQUE4RSxpQkFBTyxTQUFHO1FBQWpDLGlCQUFXLEdBQVgsV0FBVyxDQUFROztJQUFhLENBQUM7SUFFeEYsZ0NBQVEsR0FBUixjQUFtQyxNQUFNLENBQUMsRUFBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQztJQUU3RSxnQ0FBUSxHQUFSLFVBQVMsY0FBK0I7UUFDdEMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQWxCRCxDQUFtQyxxQkFBUyxHQWtCM0M7QUFqQlEseUJBQVcsR0FBRyxJQUFJLHFCQUFjLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUM3RCx1QkFBUyxHQUFHO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLGVBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFhLENBQUMsV0FBVyxDQUFDLEVBQUM7SUFDM0QsRUFBQyxPQUFPLEVBQUUsZUFBYSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO0NBQ25ELENBQUM7QUFMUyxhQUFhO0lBRHpCLGlCQUFVLEVBQUU7SUFRRSxXQUFBLGFBQU0sQ0FBQyxlQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7O0dBUG5DLGFBQWEsQ0FrQnpCO0FBbEJZLHNDQUFhIn0=