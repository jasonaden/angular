"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//        DO NOT EDIT THIS LIST OF SECURITY SENSITIVE PROPERTIES WITHOUT A SECURITY REVIEW!
//                               Reach out to mprobst for details.
//
// =================================================================================================
/** Map from tagName|propertyName SecurityContext. Properties applying to all tags use '*'. */
exports.SECURITY_SCHEMA = {};
function registerContext(ctx, specs) {
    for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
        var spec = specs_1[_i];
        exports.SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
    }
}
// Case is insignificant below, all element and attribute names are lower-cased for lookup.
registerContext(core_1.SecurityContext.HTML, [
    'iframe|srcdoc',
    '*|innerHTML',
    '*|outerHTML',
]);
registerContext(core_1.SecurityContext.STYLE, ['*|style']);
// NB: no SCRIPT contexts here, they are never allowed due to the parser stripping them.
registerContext(core_1.SecurityContext.URL, [
    '*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href',
    'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action',
    'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite',
    'source|src', 'source|srcset', 'track|src', 'video|poster', 'video|src',
]);
registerContext(core_1.SecurityContext.RESOURCE_URL, [
    'applet|code',
    'applet|codebase',
    'base|href',
    'embed|src',
    'frame|src',
    'head|profile',
    'html|manifest',
    'iframe|src',
    'link|href',
    'media|src',
    'object|codebase',
    'object|data',
    'script|src',
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3NlY3VyaXR5X3NjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9zY2hlbWEvZG9tX3NlY3VyaXR5X3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE4QztBQUU5QyxvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLG9HQUFvRztBQUNwRyxvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLEVBQUU7QUFDRiwyRkFBMkY7QUFDM0Ysa0VBQWtFO0FBQ2xFLEVBQUU7QUFDRixvR0FBb0c7QUFFcEcsOEZBQThGO0FBQ2pGLFFBQUEsZUFBZSxHQUFtQyxFQUFFLENBQUM7QUFFbEUseUJBQXlCLEdBQW9CLEVBQUUsS0FBZTtJQUM1RCxHQUFHLENBQUMsQ0FBZSxVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSztRQUFuQixJQUFNLElBQUksY0FBQTtRQUFXLHVCQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQUE7QUFDdEUsQ0FBQztBQUVELDJGQUEyRjtBQUUzRixlQUFlLENBQUMsc0JBQWUsQ0FBQyxJQUFJLEVBQUU7SUFDcEMsZUFBZTtJQUNmLGFBQWE7SUFDYixhQUFhO0NBQ2QsQ0FBQyxDQUFDO0FBQ0gsZUFBZSxDQUFDLHNCQUFlLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNwRCx3RkFBd0Y7QUFDeEYsZUFBZSxDQUFDLHNCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25DLGNBQWMsRUFBRSxXQUFXLEVBQVEsV0FBVyxFQUFRLFdBQVcsRUFBSyxRQUFRO0lBQzlFLFFBQVEsRUFBUSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQU0sYUFBYTtJQUNuRixTQUFTLEVBQU8sWUFBWSxFQUFPLFdBQVcsRUFBUSxVQUFVLEVBQU0sUUFBUTtJQUM5RSxZQUFZLEVBQUksZUFBZSxFQUFJLFdBQVcsRUFBUSxjQUFjLEVBQUUsV0FBVztDQUNsRixDQUFDLENBQUM7QUFDSCxlQUFlLENBQUMsc0JBQWUsQ0FBQyxZQUFZLEVBQUU7SUFDNUMsYUFBYTtJQUNiLGlCQUFpQjtJQUNqQixXQUFXO0lBQ1gsV0FBVztJQUNYLFdBQVc7SUFDWCxjQUFjO0lBQ2QsZUFBZTtJQUNmLFlBQVk7SUFDWixXQUFXO0lBQ1gsV0FBVztJQUNYLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsWUFBWTtDQUNiLENBQUMsQ0FBQyJ9