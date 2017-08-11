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
var TodoStore_1 = require("./services/TodoStore");
var TodoApp = (function () {
    function TodoApp(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
        this.hideActive = false;
        this.hideCompleted = false;
        this.isComplete = false;
    }
    TodoApp.prototype.enterTodo = function () {
        this.addTodo(this.inputValue);
        this.inputValue = '';
    };
    TodoApp.prototype.doneEditing = function ($event, todo) {
        var which = $event.keyCode;
        if (which === 13) {
            todo.title = todo.editTitle;
            this.todoEdit = null;
        }
        else if (which === 27) {
            this.todoEdit = null;
            todo.editTitle = todo.title;
        }
    };
    TodoApp.prototype.editTodo = function (todo) { this.todoEdit = todo; };
    TodoApp.prototype.addTodo = function (newTitle) { this.todoStore.add(this.factory.create(newTitle, false)); };
    TodoApp.prototype.completeMe = function (todo) { todo.completed = !todo.completed; };
    TodoApp.prototype.toggleCompleted = function () {
        this.hideActive = !this.hideActive;
        this.hideCompleted = false;
    };
    TodoApp.prototype.toggleActive = function () {
        this.hideCompleted = !this.hideCompleted;
        this.hideActive = false;
    };
    TodoApp.prototype.showAll = function () {
        this.hideCompleted = false;
        this.hideActive = false;
    };
    TodoApp.prototype.deleteMe = function (todo) { this.todoStore.remove(todo); };
    TodoApp.prototype.toggleAll = function ($event) {
        var _this = this;
        this.isComplete = !this.isComplete;
        this.todoStore.list.forEach(function (todo) { todo.completed = _this.isComplete; });
    };
    TodoApp.prototype.clearCompleted = function () { this.todoStore.removeBy(function (todo) { return todo.completed; }); };
    return TodoApp;
}());
TodoApp = __decorate([
    core_1.Component({ selector: 'todo-app', viewProviders: [TodoStore_1.Store, TodoStore_1.TodoFactory], templateUrl: 'todo.html' }),
    __metadata("design:paramtypes", [TodoStore_1.Store, TodoStore_1.TodoFactory])
], TodoApp);
exports.TodoApp = TodoApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy90b2RvL2luZGV4X2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF3QztBQUV4QyxrREFBOEQ7QUFHOUQsSUFBYSxPQUFPO0lBT2xCLGlCQUFtQixTQUFzQixFQUFTLE9BQW9CO1FBQW5ELGNBQVMsR0FBVCxTQUFTLENBQWE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBTnRFLGFBQVEsR0FBUyxJQUFJLENBQUM7UUFFdEIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixlQUFVLEdBQVksS0FBSyxDQUFDO0lBRTZDLENBQUM7SUFFMUUsMkJBQVMsR0FBVDtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw2QkFBVyxHQUFYLFVBQVksTUFBcUIsRUFBRSxJQUFVO1FBQzNDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBRUQsMEJBQVEsR0FBUixVQUFTLElBQVUsSUFBVSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEQseUJBQU8sR0FBUCxVQUFRLFFBQWdCLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdGLDRCQUFVLEdBQVYsVUFBVyxJQUFVLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRWxFLGlDQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRUQsOEJBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCx5QkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUVELDBCQUFRLEdBQVIsVUFBUyxJQUFVLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNELDJCQUFTLEdBQVQsVUFBVSxNQUFrQjtRQUE1QixpQkFHQztRQUZDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVUsSUFBTyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsZ0NBQWMsR0FBZCxjQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQVUsSUFBSyxPQUFBLElBQUksQ0FBQyxTQUFTLEVBQWQsQ0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLGNBQUM7QUFBRCxDQUFDLEFBdERELElBc0RDO0FBdERZLE9BQU87SUFEbkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUMsaUJBQUssRUFBRSx1QkFBVyxDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDO3FDQVFqRSxpQkFBSyxFQUF3Qix1QkFBVztHQVAzRCxPQUFPLENBc0RuQjtBQXREWSwwQkFBTyJ9