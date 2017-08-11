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
var db = require("./data");
var InboxRecord = (function () {
    function InboxRecord(data) {
        if (data === void 0) { data = null; }
        this.id = '';
        this.subject = '';
        this.content = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.draft = false;
        if (data) {
            this.setData(data);
        }
    }
    InboxRecord.prototype.setData = function (record) {
        this.id = record.id;
        this.subject = record.subject;
        this.content = record.content;
        this.email = record.email;
        this.firstName = record.firstName;
        this.lastName = record.lastName;
        this.date = record.date;
        this.draft = record.draft === true;
    };
    return InboxRecord;
}());
exports.InboxRecord = InboxRecord;
var DbService = (function () {
    function DbService() {
    }
    DbService.prototype.getData = function () {
        return Promise.resolve(db.data.map(function (entry) { return new InboxRecord({
            id: entry['id'],
            subject: entry['subject'],
            content: entry['content'],
            email: entry['email'],
            firstName: entry['first-name'],
            lastName: entry['last-name'],
            date: entry['date'],
            draft: entry['draft'],
        }); }));
    };
    DbService.prototype.drafts = function () {
        return this.getData().then(function (data) { return data.filter(function (record) { return record.draft; }); });
    };
    DbService.prototype.emails = function () {
        return this.getData().then(function (data) { return data.filter(function (record) { return !record.draft; }); });
    };
    DbService.prototype.email = function (id) {
        return this.getData().then(function (data) { return data.find(function (entry) { return entry.id == id; }); });
    };
    return DbService;
}());
DbService = __decorate([
    core_1.Injectable()
], DbService);
exports.DbService = DbService;
var InboxCmp = (function () {
    function InboxCmp(router, db, route) {
        var _this = this;
        this.router = router;
        this.items = [];
        this.ready = false;
        route.params.forEach(function (p) {
            var sortEmailsByDate = p['sort'] === 'date';
            db.emails().then(function (emails) {
                _this.ready = true;
                _this.items = emails;
                if (sortEmailsByDate) {
                    _this.items.sort(function (a, b) { return new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1; });
                }
            });
        });
    }
    return InboxCmp;
}());
InboxCmp = __decorate([
    core_1.Component({ selector: 'inbox', templateUrl: 'app/inbox.html' }),
    __metadata("design:paramtypes", [router_1.Router, DbService, router_1.ActivatedRoute])
], InboxCmp);
exports.InboxCmp = InboxCmp;
var DraftsCmp = (function () {
    function DraftsCmp(router, db) {
        var _this = this;
        this.router = router;
        this.items = [];
        this.ready = false;
        db.drafts().then(function (drafts) {
            _this.ready = true;
            _this.items = drafts;
        });
    }
    return DraftsCmp;
}());
DraftsCmp = __decorate([
    core_1.Component({ selector: 'drafts', templateUrl: 'app/drafts.html' }),
    __metadata("design:paramtypes", [router_1.Router, DbService])
], DraftsCmp);
exports.DraftsCmp = DraftsCmp;
exports.ROUTER_CONFIG = [
    { path: '', pathMatch: 'full', redirectTo: 'inbox' }, { path: 'inbox', component: InboxCmp },
    { path: 'drafts', component: DraftsCmp }, { path: 'detail', loadChildren: 'app/inbox-detail.js' }
];
var InboxApp = (function () {
    function InboxApp() {
    }
    return InboxApp;
}());
InboxApp = __decorate([
    core_1.Component({ selector: 'inbox-app', templateUrl: 'app/inbox-app.html' })
], InboxApp);
exports.InboxApp = InboxApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3gtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9yb3V0aW5nL2FwcC9pbmJveC1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFHSCxzQ0FBb0Q7QUFDcEQsMENBQXVEO0FBRXZELDJCQUE2QjtBQUU3QjtJQVVFLHFCQUFZLElBUUo7UUFSSSxxQkFBQSxFQUFBLFdBUUo7UUFqQlIsT0FBRSxHQUFXLEVBQUUsQ0FBQztRQUNoQixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFFdEIsVUFBSyxHQUFZLEtBQUssQ0FBQztRQVdyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVELDZCQUFPLEdBQVAsVUFBUSxNQVFQO1FBQ0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDckMsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTFDRCxJQTBDQztBQTFDWSxrQ0FBVztBQTZDeEIsSUFBYSxTQUFTO0lBQXRCO0lBeUJBLENBQUM7SUF4QkMsMkJBQU8sR0FBUDtRQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBMkIsSUFBSyxPQUFBLElBQUksV0FBVyxDQUFDO1lBQy9DLEVBQUUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2YsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDekIsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDekIsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDckIsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDOUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDNUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUM7U0FDdEIsQ0FBQyxFQVQrQixDQVMvQixDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsMEJBQU0sR0FBTjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxLQUFLLEVBQVosQ0FBWSxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsMEJBQU0sR0FBTjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBYixDQUFhLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCx5QkFBSyxHQUFMLFVBQU0sRUFBVTtRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFkLENBQWMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSxTQUFTO0lBRHJCLGlCQUFVLEVBQUU7R0FDQSxTQUFTLENBeUJyQjtBQXpCWSw4QkFBUztBQTRCdEIsSUFBYSxRQUFRO0lBSW5CLGtCQUFtQixNQUFjLEVBQUUsRUFBYSxFQUFFLEtBQXFCO1FBQXZFLGlCQWNDO1FBZGtCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFIekIsVUFBSyxHQUFrQixFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFZLEtBQUssQ0FBQztRQUc3QixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDcEIsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDbEIsS0FBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7Z0JBRXBCLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDckIsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ1gsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztnQkFDbEYsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFuQlksUUFBUTtJQURwQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztxQ0FLakMsZUFBTSxFQUFNLFNBQVMsRUFBUyx1QkFBYztHQUo1RCxRQUFRLENBbUJwQjtBQW5CWSw0QkFBUTtBQXVCckIsSUFBYSxTQUFTO0lBSXBCLG1CQUFvQixNQUFjLEVBQUUsRUFBYTtRQUFqRCxpQkFLQztRQUxtQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSDFCLFVBQUssR0FBa0IsRUFBRSxDQUFDO1FBQzFCLFVBQUssR0FBWSxLQUFLLENBQUM7UUFHN0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU07WUFDdEIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsS0FBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQVZZLFNBQVM7SUFEckIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUM7cUNBS2xDLGVBQU0sRUFBTSxTQUFTO0dBSnRDLFNBQVMsQ0FVckI7QUFWWSw4QkFBUztBQVlULFFBQUEsYUFBYSxHQUFHO0lBQzNCLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQztJQUN4RixFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUM7Q0FDOUYsQ0FBQztBQUdGLElBQWEsUUFBUTtJQUFyQjtJQUNBLENBQUM7SUFBRCxlQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxRQUFRO0lBRHBCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBQyxDQUFDO0dBQ3pELFFBQVEsQ0FDcEI7QUFEWSw0QkFBUSJ9