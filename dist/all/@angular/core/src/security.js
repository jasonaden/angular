"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A SecurityContext marks a location that has dangerous security implications, e.g. a DOM property
 * like `innerHTML` that could cause Cross Site Scripting (XSS) security bugs when improperly
 * handled.
 *
 * See DomSanitizer for more details on security in Angular applications.
 *
 * @stable
 */
var SecurityContext;
(function (SecurityContext) {
    SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
    SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
    SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
    SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
    SecurityContext[SecurityContext["URL"] = 4] = "URL";
    SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
})(SecurityContext = exports.SecurityContext || (exports.SecurityContext = {}));
/**
 * Sanitizer is used by the views to sanitize potentially dangerous values.
 *
 * @stable
 */
var Sanitizer = (function () {
    function Sanitizer() {
    }
    return Sanitizer;
}());
exports.Sanitizer = Sanitizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9zZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7Ozs7OztHQVFHO0FBQ0gsSUFBWSxlQU9YO0FBUEQsV0FBWSxlQUFlO0lBQ3pCLHFEQUFJLENBQUE7SUFDSixxREFBSSxDQUFBO0lBQ0osdURBQUssQ0FBQTtJQUNMLHlEQUFNLENBQUE7SUFDTixtREFBRyxDQUFBO0lBQ0gscUVBQVksQ0FBQTtBQUNkLENBQUMsRUFQVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQU8xQjtBQUVEOzs7O0dBSUc7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGcUIsOEJBQVMifQ==