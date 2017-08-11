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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9kb1N0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy90b2RvL2FwcC9Ub2RvU3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBRXpDLDZCQUE2QjtBQUM3QjtJQUNFLGtCQUFtQixHQUFXO1FBQVgsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7SUFDcEMsZUFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRnFCLDRCQUFRO0FBSTlCO0lBQTBCLHdCQUFRO0lBQ2hDLGNBQVksR0FBVyxFQUFTLEtBQWEsRUFBUyxTQUFrQjtRQUF4RSxZQUE0RSxrQkFBTSxHQUFHLENBQUMsU0FBRztRQUF6RCxXQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsZUFBUyxHQUFULFNBQVMsQ0FBUzs7SUFBZ0IsQ0FBQztJQUMzRixXQUFDO0FBQUQsQ0FBQyxBQUZELENBQTBCLFFBQVEsR0FFakM7QUFGWSxvQkFBSTtBQUtqQixJQUFhLFdBQVc7SUFEeEI7UUFFVSxTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBTzNCLENBQUM7SUFMQyw2QkFBTyxHQUFQLGNBQW9CLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXpDLDRCQUFNLEdBQU4sVUFBTyxLQUFhLEVBQUUsV0FBb0I7UUFDeEMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxXQUFXO0lBRHZCLGlCQUFVLEVBQUU7R0FDQSxXQUFXLENBUXZCO0FBUlksa0NBQVc7QUFVeEIsNkRBQTZEO0FBRTdELElBQWEsS0FBSztJQURsQjtRQUVFLFNBQUksR0FBUSxFQUFFLENBQUM7SUFTakIsQ0FBQztJQVBDLG1CQUFHLEdBQUgsVUFBSSxNQUFTLElBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhELHNCQUFNLEdBQU4sVUFBTyxNQUFTLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksS0FBSyxNQUFNLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJFLHdCQUFRLEdBQVIsVUFBUyxRQUFnQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxJQUFLLE9BQUEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0gsWUFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksS0FBSztJQURqQixpQkFBVSxFQUFFO0dBQ0EsS0FBSyxDQVVqQjtBQVZZLHNCQUFLIn0=