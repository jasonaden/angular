"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var ServerStylesHost = (function (_super) {
    __extends(ServerStylesHost, _super);
    function ServerStylesHost(doc, transitionId) {
        var _this = _super.call(this) || this;
        _this.doc = doc;
        _this.transitionId = transitionId;
        _this.head = null;
        _this.head = platform_browser_1.ɵgetDOM().getElementsByTagName(doc, 'head')[0];
        return _this;
    }
    ServerStylesHost.prototype._addStyle = function (style) {
        var adapter = platform_browser_1.ɵgetDOM();
        var el = adapter.createElement('style');
        adapter.setText(el, style);
        if (!!this.transitionId) {
            adapter.setAttribute(el, 'ng-transition', this.transitionId);
        }
        adapter.appendChild(this.head, el);
    };
    ServerStylesHost.prototype.onStylesAdded = function (additions) {
        var _this = this;
        additions.forEach(function (style) { return _this._addStyle(style); });
    };
    return ServerStylesHost;
}(platform_browser_1.ɵSharedStylesHost));
ServerStylesHost = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(platform_browser_1.DOCUMENT)),
    __param(1, core_1.Optional()), __param(1, core_1.Inject(platform_browser_1.ɵTRANSITION_ID)),
    __metadata("design:paramtypes", [Object, String])
], ServerStylesHost);
exports.ServerStylesHost = ServerStylesHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVzX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL3N0eWxlc19ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEyRTtBQUMzRSw4REFBNkg7QUFLN0gsSUFBYSxnQkFBZ0I7SUFBUyxvQ0FBZ0I7SUFHcEQsMEJBQzhCLEdBQVEsRUFDVSxZQUFvQjtRQUZwRSxZQUdFLGlCQUFPLFNBRVI7UUFKNkIsU0FBRyxHQUFILEdBQUcsQ0FBSztRQUNVLGtCQUFZLEdBQVosWUFBWSxDQUFRO1FBSjVELFVBQUksR0FBUSxJQUFJLENBQUM7UUFNdkIsS0FBSSxDQUFDLElBQUksR0FBRywwQkFBTSxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUM1RCxDQUFDO0lBRU8sb0NBQVMsR0FBakIsVUFBa0IsS0FBYTtRQUM3QixJQUFJLE9BQU8sR0FBcUIsMEJBQU0sRUFBc0IsQ0FBQztRQUM3RCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHdDQUFhLEdBQWIsVUFBYyxTQUFzQjtRQUFwQyxpQkFBNEY7UUFBcEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDOUYsdUJBQUM7QUFBRCxDQUFDLEFBckJELENBQXNDLG9DQUFnQixHQXFCckQ7QUFyQlksZ0JBQWdCO0lBRDVCLGlCQUFVLEVBQUU7SUFLTixXQUFBLGFBQU0sQ0FBQywyQkFBUSxDQUFDLENBQUE7SUFDaEIsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsYUFBTSxDQUFDLGlDQUFjLENBQUMsQ0FBQTs7R0FMNUIsZ0JBQWdCLENBcUI1QjtBQXJCWSw0Q0FBZ0IifQ==