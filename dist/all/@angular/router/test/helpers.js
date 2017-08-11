"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var router_state_1 = require("../src/router_state");
var Logger = (function () {
    function Logger() {
        this.logs = [];
    }
    Logger.prototype.add = function (thing) { this.logs.push(thing); };
    Logger.prototype.empty = function () { this.logs.length = 0; };
    return Logger;
}());
exports.Logger = Logger;
function provideTokenLogger(token, returnValue) {
    if (returnValue === void 0) { returnValue = true; }
    return {
        provide: token,
        useFactory: function (logger) { return function () { return (logger.add(token), returnValue); }; },
        deps: [Logger]
    };
}
exports.provideTokenLogger = provideTokenLogger;
;
function createActivatedRouteSnapshot(args) {
    return new router_state_1.ActivatedRouteSnapshot(args.url || [], args.params || {}, args.queryParams || null, args.fragment || null, args.data || null, args.outlet || null, args.component, args.routeConfig || {}, args.urlSegment || null, args.lastPathIndex || -1, args.resolve || {});
}
exports.createActivatedRouteSnapshot = createActivatedRouteSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFLSCxvREFBMkQ7QUFJM0Q7SUFBQTtRQUNFLFNBQUksR0FBYSxFQUFFLENBQUM7SUFHdEIsQ0FBQztJQUZDLG9CQUFHLEdBQUgsVUFBSSxLQUFhLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLHNCQUFLLEdBQUwsY0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLGFBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHdCQUFNO0FBTW5CLDRCQUFtQyxLQUFhLEVBQUUsV0FBa0I7SUFBbEIsNEJBQUEsRUFBQSxrQkFBa0I7SUFDbEUsTUFBTSxDQUFDO1FBQ0wsT0FBTyxFQUFFLEtBQUs7UUFDZCxVQUFVLEVBQUUsVUFBQyxNQUFjLElBQUssT0FBQSxjQUFNLE9BQUEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQyxFQUFoQyxDQUFnQyxFQUF0QyxDQUFzQztRQUN0RSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7S0FDZixDQUFDO0FBQ0osQ0FBQztBQU5ELGdEQU1DO0FBQUEsQ0FBQztBQWdCRixzQ0FBNkMsSUFBYTtJQUN4RCxNQUFNLENBQUMsSUFBSSxxQ0FBc0IsQ0FDN0IsSUFBSSxDQUFDLEdBQUcsSUFBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBUyxJQUFJLEVBQ3JFLElBQUksQ0FBQyxRQUFRLElBQVMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQVMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQVMsSUFBSSxFQUN2RSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLElBQVMsSUFBSSxFQUM5RSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQU5ELG9FQU1DIn0=