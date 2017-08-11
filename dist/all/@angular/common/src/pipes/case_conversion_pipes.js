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
var core_1 = require("@angular/core");
var invalid_pipe_argument_error_1 = require("./invalid_pipe_argument_error");
/**
 * Transforms text to lowercase.
 *
 * {@example  common/pipes/ts/lowerupper_pipe.ts region='LowerUpperPipe' }
 *
 * @stable
 */
var LowerCasePipe = LowerCasePipe_1 = (function () {
    function LowerCasePipe() {
    }
    LowerCasePipe.prototype.transform = function (value) {
        if (!value)
            return value;
        if (typeof value !== 'string') {
            throw invalid_pipe_argument_error_1.invalidPipeArgumentError(LowerCasePipe_1, value);
        }
        return value.toLowerCase();
    };
    return LowerCasePipe;
}());
LowerCasePipe = LowerCasePipe_1 = __decorate([
    core_1.Pipe({ name: 'lowercase' })
], LowerCasePipe);
exports.LowerCasePipe = LowerCasePipe;
/**
 * Helper method to transform a single word to titlecase.
 *
 * @stable
 */
function titleCaseWord(word) {
    if (!word)
        return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}
/**
 * Transforms text to titlecase.
 *
 * @stable
 */
var TitleCasePipe = TitleCasePipe_1 = (function () {
    function TitleCasePipe() {
    }
    TitleCasePipe.prototype.transform = function (value) {
        if (!value)
            return value;
        if (typeof value !== 'string') {
            throw invalid_pipe_argument_error_1.invalidPipeArgumentError(TitleCasePipe_1, value);
        }
        return value.split(/\b/g).map(function (word) { return titleCaseWord(word); }).join('');
    };
    return TitleCasePipe;
}());
TitleCasePipe = TitleCasePipe_1 = __decorate([
    core_1.Pipe({ name: 'titlecase' })
], TitleCasePipe);
exports.TitleCasePipe = TitleCasePipe;
/**
 * Transforms text to uppercase.
 *
 * @stable
 */
var UpperCasePipe = UpperCasePipe_1 = (function () {
    function UpperCasePipe() {
    }
    UpperCasePipe.prototype.transform = function (value) {
        if (!value)
            return value;
        if (typeof value !== 'string') {
            throw invalid_pipe_argument_error_1.invalidPipeArgumentError(UpperCasePipe_1, value);
        }
        return value.toUpperCase();
    };
    return UpperCasePipe;
}());
UpperCasePipe = UpperCasePipe_1 = __decorate([
    core_1.Pipe({ name: 'uppercase' })
], UpperCasePipe);
exports.UpperCasePipe = UpperCasePipe;
var LowerCasePipe_1, TitleCasePipe_1, UpperCasePipe_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzZV9jb252ZXJzaW9uX3BpcGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9waXBlcy9jYXNlX2NvbnZlcnNpb25fcGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsNkVBQXVFO0FBRXZFOzs7Ozs7R0FNRztBQUVILElBQWEsYUFBYTtJQUExQjtJQVFBLENBQUM7SUFQQyxpQ0FBUyxHQUFULFVBQVUsS0FBYTtRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLHNEQUF3QixDQUFDLGVBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLGFBQWE7SUFEekIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDO0dBQ2IsYUFBYSxDQVF6QjtBQVJZLHNDQUFhO0FBVzFCOzs7O0dBSUc7QUFDSCx1QkFBdUIsSUFBWTtJQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlELENBQUM7QUFFRDs7OztHQUlHO0FBRUgsSUFBYSxhQUFhO0lBQTFCO0lBU0EsQ0FBQztJQVJDLGlDQUFTLEdBQVQsVUFBVSxLQUFhO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sc0RBQXdCLENBQUMsZUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUWSxhQUFhO0lBRHpCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQztHQUNiLGFBQWEsQ0FTekI7QUFUWSxzQ0FBYTtBQVcxQjs7OztHQUlHO0FBRUgsSUFBYSxhQUFhO0lBQTFCO0lBUUEsQ0FBQztJQVBDLGlDQUFTLEdBQVQsVUFBVSxLQUFhO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sc0RBQXdCLENBQUMsZUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksYUFBYTtJQUR6QixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLENBQUM7R0FDYixhQUFhLENBUXpCO0FBUlksc0NBQWEifQ==