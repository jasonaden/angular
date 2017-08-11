"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assertions_1 = require("../assertions");
var InterpolationConfig = (function () {
    function InterpolationConfig(start, end) {
        this.start = start;
        this.end = end;
    }
    InterpolationConfig.fromArray = function (markers) {
        if (!markers) {
            return exports.DEFAULT_INTERPOLATION_CONFIG;
        }
        assertions_1.assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    };
    ;
    return InterpolationConfig;
}());
exports.InterpolationConfig = InterpolationConfig;
exports.DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJwb2xhdGlvbl9jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWxfcGFyc2VyL2ludGVycG9sYXRpb25fY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNENBQXlEO0FBRXpEO0lBVUUsNkJBQW1CLEtBQWEsRUFBUyxHQUFXO1FBQWpDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUUsQ0FBQztJQVRoRCw2QkFBUyxHQUFoQixVQUFpQixPQUE4QjtRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUMsb0NBQTRCLENBQUM7UUFDdEMsQ0FBQztRQUVELHVDQUEwQixDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVzRCxDQUFDO0lBQzFELDBCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSxrREFBbUI7QUFhbkIsUUFBQSw0QkFBNEIsR0FDckMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMifQ==