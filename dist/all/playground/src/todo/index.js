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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var TodoStore_1 = require("./app/TodoStore");
var TodoApp = (function () {
    function TodoApp(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
    }
    TodoApp.prototype.enterTodo = function (inputElement) {
        this.addTodo(inputElement.value);
        inputElement.value = '';
    };
    TodoApp.prototype.editTodo = function (todo) { this.todoEdit = todo; };
    TodoApp.prototype.doneEditing = function ($event, todo) {
        var which = $event.which;
        var target = $event.target;
        if (which === 13) {
            todo.title = target.value;
            this.todoEdit = null;
        }
        else if (which === 27) {
            this.todoEdit = null;
            target.value = todo.title;
        }
    };
    TodoApp.prototype.addTodo = function (newTitle) { this.todoStore.add(this.factory.create(newTitle, false)); };
    TodoApp.prototype.completeMe = function (todo) { todo.completed = !todo.completed; };
    TodoApp.prototype.deleteMe = function (todo) { this.todoStore.remove(todo); };
    TodoApp.prototype.toggleAll = function ($event) {
        var isComplete = $event.target.checked;
        this.todoStore.list.forEach(function (todo) { todo.completed = isComplete; });
    };
    TodoApp.prototype.clearCompleted = function () { this.todoStore.removeBy(function (todo) { return todo.completed; }); };
    return TodoApp;
}());
TodoApp = __decorate([
    core_1.Component({ selector: 'todo-app', viewProviders: [TodoStore_1.Store, TodoStore_1.TodoFactory], templateUrl: 'todo.html' }),
    __metadata("design:paramtypes", [TodoStore_1.Store, TodoStore_1.TodoFactory])
], TodoApp);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({ declarations: [TodoApp], bootstrap: [TodoApp], imports: [platform_browser_1.BrowserModule] })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3RvZG8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBQ3hELDhFQUF5RTtBQUV6RSw2Q0FBeUQ7QUFHekQsSUFBTSxPQUFPO0lBR1gsaUJBQW1CLFNBQXNCLEVBQVMsT0FBb0I7UUFBbkQsY0FBUyxHQUFULFNBQVMsQ0FBYTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFGdEUsYUFBUSxHQUFTLElBQUksQ0FBQztJQUVtRCxDQUFDO0lBRTFFLDJCQUFTLEdBQVQsVUFBVSxZQUE4QjtRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsMEJBQVEsR0FBUixVQUFTLElBQVUsSUFBVSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEQsNkJBQVcsR0FBWCxVQUFZLE1BQXFCLEVBQUUsSUFBVTtRQUMzQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUEwQixDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM1QixDQUFDO0lBQ0gsQ0FBQztJQUVELHlCQUFPLEdBQVAsVUFBUSxRQUFnQixJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3Riw0QkFBVSxHQUFWLFVBQVcsSUFBVSxJQUFVLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVsRSwwQkFBUSxHQUFSLFVBQVMsSUFBVSxJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRCwyQkFBUyxHQUFULFVBQVUsTUFBa0I7UUFDMUIsSUFBTSxVQUFVLEdBQUksTUFBTSxDQUFDLE1BQTJCLENBQUMsT0FBTyxDQUFDO1FBQy9ELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVUsSUFBTyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCxnQ0FBYyxHQUFkLGNBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQUMsSUFBVSxJQUFLLE9BQUEsSUFBSSxDQUFDLFNBQVMsRUFBZCxDQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYsY0FBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ0ssT0FBTztJQURaLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxDQUFDLGlCQUFLLEVBQUUsdUJBQVcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQztxQ0FJakUsaUJBQUssRUFBd0IsdUJBQVc7R0FIbEUsT0FBTyxDQW9DWjtBQUdELElBQU0sYUFBYTtJQUFuQjtJQUNBLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBREssYUFBYTtJQURsQixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUMsQ0FBQztHQUM5RSxhQUFhLENBQ2xCO0FBRUQ7SUFDRSxpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsb0JBRUMifQ==