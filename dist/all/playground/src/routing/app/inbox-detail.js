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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var inbox_app_1 = require("./inbox-app");
var InboxDetailCmp = (function () {
    function InboxDetailCmp(db, route) {
        var _this = this;
        this.record = new inbox_app_1.InboxRecord();
        this.ready = false;
        route.paramMap.forEach(function (p) { db.email(p.get('id')).then(function (data) { _this.record.setData(data); }); });
    }
    return InboxDetailCmp;
}());
InboxDetailCmp = __decorate([
    core_1.Component({ selector: 'inbox-detail', templateUrl: 'app/inbox-detail.html' }),
    __metadata("design:paramtypes", [inbox_app_1.DbService, router_1.ActivatedRoute])
], InboxDetailCmp);
exports.InboxDetailCmp = InboxDetailCmp;
var InboxDetailModule = (function () {
    function InboxDetailModule() {
    }
    return InboxDetailModule;
}());
InboxDetailModule = __decorate([
    core_1.NgModule({
        declarations: [InboxDetailCmp],
        imports: [router_1.RouterModule.forChild([{ path: ':id', component: InboxDetailCmp }])]
    })
], InboxDetailModule);
exports.default = InboxDetailModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3gtZGV0YWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9yb3V0aW5nL2FwcC9pbmJveC1kZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsMENBQTZEO0FBRTdELHlDQUFtRDtBQUduRCxJQUFhLGNBQWM7SUFJekIsd0JBQVksRUFBYSxFQUFFLEtBQXFCO1FBQWhELGlCQUdDO1FBTk8sV0FBTSxHQUFnQixJQUFJLHVCQUFXLEVBQUUsQ0FBQztRQUN4QyxVQUFLLEdBQVksS0FBSyxDQUFDO1FBRzdCLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUNsQixVQUFBLENBQUMsSUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLElBQU8sS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksY0FBYztJQUQxQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQztxQ0FLMUQscUJBQVMsRUFBUyx1QkFBYztHQUpyQyxjQUFjLENBUTFCO0FBUlksd0NBQWM7QUFjM0IsSUFBcUIsaUJBQWlCO0lBQXRDO0lBQ0EsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEb0IsaUJBQWlCO0lBSnJDLGVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQztRQUM5QixPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdFLENBQUM7R0FDbUIsaUJBQWlCLENBQ3JDO2tCQURvQixpQkFBaUIifQ==