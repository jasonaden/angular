"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_options_1 = require("./common_options");
var metric_1 = require("./metric");
var validator_1 = require("./validator");
/**
 * SampleDescription merges all available descriptions about a sample
 */
var SampleDescription = (function () {
    function SampleDescription(id, descriptions, metrics) {
        var _this = this;
        this.id = id;
        this.metrics = metrics;
        this.description = {};
        descriptions.forEach(function (description) {
            Object.keys(description).forEach(function (prop) { _this.description[prop] = description[prop]; });
        });
    }
    SampleDescription.prototype.toJson = function () { return { 'id': this.id, 'description': this.description, 'metrics': this.metrics }; };
    return SampleDescription;
}());
SampleDescription.PROVIDERS = [{
        provide: SampleDescription,
        useFactory: function (metric, id, forceGc, userAgent, validator, defaultDesc, userDesc) {
            return new SampleDescription(id, [
                { 'forceGc': forceGc, 'userAgent': userAgent }, validator.describe(), defaultDesc,
                userDesc
            ], metric.describe());
        },
        deps: [
            metric_1.Metric, common_options_1.Options.SAMPLE_ID, common_options_1.Options.FORCE_GC, common_options_1.Options.USER_AGENT, validator_1.Validator,
            common_options_1.Options.DEFAULT_DESCRIPTION, common_options_1.Options.SAMPLE_DESCRIPTION
        ]
    }];
exports.SampleDescription = SampleDescription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlX2Rlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvc2FtcGxlX2Rlc2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsbURBQXlDO0FBQ3pDLG1DQUFnQztBQUNoQyx5Q0FBc0M7QUFHdEM7O0dBRUc7QUFDSDtJQW9CRSwyQkFDVyxFQUFVLEVBQUUsWUFBeUMsRUFDckQsT0FBNkI7UUFGeEMsaUJBT0M7UUFOVSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQU0sS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBTSxHQUFOLGNBQVcsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsd0JBQUM7QUFBRCxDQUFDLEFBOUJEO0FBQ1MsMkJBQVMsR0FBRyxDQUFDO1FBQ2xCLE9BQU8sRUFBRSxpQkFBaUI7UUFDMUIsVUFBVSxFQUNOLFVBQUMsTUFBYyxFQUFFLEVBQVUsRUFBRSxPQUFnQixFQUFFLFNBQWlCLEVBQUUsU0FBb0IsRUFDckYsV0FBb0MsRUFBRSxRQUFpQztZQUNwRSxPQUFBLElBQUksaUJBQWlCLENBQ2pCLEVBQUUsRUFDRjtnQkFDRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxXQUFXO2dCQUMvRSxRQUFRO2FBQ1QsRUFDRCxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFOdEIsQ0FNc0I7UUFDOUIsSUFBSSxFQUFFO1lBQ0osZUFBTSxFQUFFLHdCQUFPLENBQUMsU0FBUyxFQUFFLHdCQUFPLENBQUMsUUFBUSxFQUFFLHdCQUFPLENBQUMsVUFBVSxFQUFFLHFCQUFTO1lBQzFFLHdCQUFPLENBQUMsbUJBQW1CLEVBQUUsd0JBQU8sQ0FBQyxrQkFBa0I7U0FDeEQ7S0FDRixDQUFDLENBQUM7QUFqQlEsOENBQWlCIn0=