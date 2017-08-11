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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// base model for RecordStore
var KeyModel = (function () {
    function KeyModel(key) {
        this.key = key;
    }
    return KeyModel;
}());
exports.KeyModel = KeyModel;
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo(key, title, completed) {
        var _this = _super.call(this, key) || this;
        _this.title = title;
        _this.completed = completed;
        _this.editTitle = title;
        return _this;
    }
    return Todo;
}(KeyModel));
exports.Todo = Todo;
var TodoFactory = (function () {
    function TodoFactory() {
        this._uid = 0;
    }
    TodoFactory.prototype.nextUid = function () { return ++this._uid; };
    TodoFactory.prototype.create = function (title, isCompleted) {
        return new Todo(this.nextUid(), title, isCompleted);
    };
    return TodoFactory;
}());
TodoFactory = __decorate([
    core_1.Injectable()
], TodoFactory);
exports.TodoFactory = TodoFactory;
// Store manages any generic item that inherits from KeyModel
var Store = (function () {
    function Store() {
        this.list = [];
    }
    Store.prototype.add = function (record) { this.list.push(record); };
    Store.prototype.remove = function (record) { this.removeBy(function (item) { return item === record; }); };
    Store.prototype.removeBy = function (callback) {
        this.list = this.list.filter(function (record) { return !callback(record); });
    };
    return Store;
}());
Store = __decorate([
    core_1.Injectable()
], Store);
exports.Store = Store;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9kb1N0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy90b2RvL3NlcnZpY2VzL1RvZG9TdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFFekMsNkJBQTZCO0FBQzdCO0lBQ0Usa0JBQW1CLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUcsQ0FBQztJQUNwQyxlQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw0QkFBUTtBQUlyQjtJQUEwQix3QkFBUTtJQUVoQyxjQUFZLEdBQVcsRUFBUyxLQUFhLEVBQVMsU0FBa0I7UUFBeEUsWUFDRSxrQkFBTSxHQUFHLENBQUMsU0FFWDtRQUgrQixXQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsZUFBUyxHQUFULFNBQVMsQ0FBUztRQUV0RSxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7SUFDekIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEIsUUFBUSxHQU1qQztBQU5ZLG9CQUFJO0FBU2pCLElBQWEsV0FBVztJQUR4QjtRQUVVLFNBQUksR0FBVyxDQUFDLENBQUM7SUFPM0IsQ0FBQztJQUxDLDZCQUFPLEdBQVAsY0FBb0IsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFekMsNEJBQU0sR0FBTixVQUFPLEtBQWEsRUFBRSxXQUFvQjtRQUN4QyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLFdBQVc7SUFEdkIsaUJBQVUsRUFBRTtHQUNBLFdBQVcsQ0FRdkI7QUFSWSxrQ0FBVztBQVV4Qiw2REFBNkQ7QUFFN0QsSUFBYSxLQUFLO0lBRGxCO1FBRUUsU0FBSSxHQUFRLEVBQUUsQ0FBQztJQVNqQixDQUFDO0lBUEMsbUJBQUcsR0FBSCxVQUFJLE1BQVMsSUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEQsc0JBQU0sR0FBTixVQUFPLE1BQVMsSUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxLQUFLLE1BQU0sRUFBZixDQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckUsd0JBQVEsR0FBUixVQUFTLFFBQWdDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWWSxLQUFLO0lBRGpCLGlCQUFVLEVBQUU7R0FDQSxLQUFLLENBVWpCO0FBVlksc0JBQUsifQ==