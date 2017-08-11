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
require("rxjs/add/operator/map");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var HttpCmp = (function () {
    function HttpCmp(http) {
        var _this = this;
        http.get('./people.json')
            .map(function (res) { return res.json(); })
            .subscribe(function (people) { return _this.people = people; });
    }
    return HttpCmp;
}());
HttpCmp = __decorate([
    core_1.Component({
        selector: 'http-app',
        template: "\n    <h1>people</h1>\n    <ul class=\"people\">\n      <li *ngFor=\"let person of people\">\n        hello, {{person['name']}}\n      </li>\n    </ul>\n  "
    }),
    __metadata("design:paramtypes", [http_1.Http])
], HttpCmp);
exports.HttpCmp = HttpCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9jb21wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9odHRwL2FwcC9odHRwX2NvbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxpQ0FBK0I7QUFFL0Isc0NBQXdDO0FBQ3hDLHNDQUE2QztBQWE3QyxJQUFhLE9BQU87SUFFbEIsaUJBQVksSUFBVTtRQUF0QixpQkFJQztRQUhDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO2FBQ3BCLEdBQUcsQ0FBQyxVQUFDLEdBQWEsSUFBSyxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBVixDQUFVLENBQUM7YUFDbEMsU0FBUyxDQUFDLFVBQUMsTUFBcUIsSUFBSyxPQUFBLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFwQixDQUFvQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLE9BQU87SUFYbkIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFFBQVEsRUFBRSw2SkFPVDtLQUNGLENBQUM7cUNBR2tCLFdBQUk7R0FGWCxPQUFPLENBT25CO0FBUFksMEJBQU8ifQ==