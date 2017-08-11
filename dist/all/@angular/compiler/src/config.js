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
var CompilerConfig = (function () {
    function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.defaultEncapsulation, defaultEncapsulation = _c === void 0 ? core_1.ViewEncapsulation.Emulated : _c, _d = _b.useJit, useJit = _d === void 0 ? true : _d, missingTranslation = _b.missingTranslation, enableLegacyTemplate = _b.enableLegacyTemplate;
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.missingTranslation = missingTranslation || null;
        this.enableLegacyTemplate = enableLegacyTemplate !== false;
    }
    return CompilerConfig;
}());
exports.CompilerConfig = CompilerConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF1RztBQU12RztJQVFFLHdCQUNJLEVBTU07WUFOTiw0QkFNTSxFQU5MLDRCQUFpRCxFQUFqRCw2RUFBaUQsRUFBRSxjQUFhLEVBQWIsa0NBQWEsRUFBRSwwQ0FBa0IsRUFDcEYsOENBQW9CO1FBTXZCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixJQUFJLElBQUksQ0FBQztRQUNyRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLEtBQUssS0FBSyxDQUFDO0lBQzdELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQlksd0NBQWMifQ==