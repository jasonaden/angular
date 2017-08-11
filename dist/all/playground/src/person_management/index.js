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
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
/**
 * You can find the AngularJS implementation of this example here:
 * https://github.com/wardbell/ng1DataBinding
 */
// ---- model
var _nextId = 1;
var Person = (function () {
    function Person(firstName, lastName, yearOfBirth) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.yearOfBirth = yearOfBirth;
        this.personId = _nextId++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mom = null;
        this.dad = null;
        this.friends = [];
        this.personId = _nextId++;
    }
    Object.defineProperty(Person.prototype, "age", {
        get: function () { return 2015 - this.yearOfBirth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "fullName", {
        get: function () { return this.firstName + " " + this.lastName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "friendNames", {
        get: function () { return this.friends.map(function (f) { return f.fullName; }).join(', '); },
        enumerable: true,
        configurable: true
    });
    return Person;
}());
// ---- services
var DataService = (function () {
    function DataService() {
        var _this = this;
        this.persons = [
            new Person('Victor', 'Savkin', 1930), new Person('Igor', 'Minar', 1920),
            new Person('John', 'Papa', 1910), new Person('Nancy', 'Duarte', 1910),
            new Person('Jack', 'Papa', 1910), new Person('Jill', 'Papa', 1910),
            new Person('Ward', 'Bell', 1910), new Person('Robert', 'Bell', 1910),
            new Person('Tracy', 'Ward', 1910), new Person('Dan', 'Wahlin', 1910)
        ];
        this.persons[0].friends = [0, 1, 2, 6, 9].map(function (_) { return _this.persons[_]; });
        this.persons[1].friends = [0, 2, 6, 9].map(function (_) { return _this.persons[_]; });
        this.persons[2].friends = [0, 1, 6, 9].map(function (_) { return _this.persons[_]; });
        this.persons[6].friends = [0, 1, 2, 9].map(function (_) { return _this.persons[_]; });
        this.persons[9].friends = [0, 1, 2, 6].map(function (_) { return _this.persons[_]; });
        this.persons[2].mom = this.persons[5];
        this.persons[2].dad = this.persons[4];
        this.persons[6].mom = this.persons[8];
        this.persons[6].dad = this.persons[7];
        this.currentPerson = this.persons[0];
    }
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], DataService);
// ---- components
var FullNameComponent = (function () {
    function FullNameComponent(_service) {
        this._service = _service;
    }
    Object.defineProperty(FullNameComponent.prototype, "person", {
        get: function () { return this._service.currentPerson; },
        enumerable: true,
        configurable: true
    });
    return FullNameComponent;
}());
FullNameComponent = __decorate([
    core_1.Component({
        selector: 'full-name-cmp',
        template: "\n    <h1>Edit Full Name</h1>\n    <div>\n      <form>\n          <div>\n            <label>\n              First: <input [(ngModel)]=\"person.firstName\" type=\"text\" placeholder=\"First name\">\n            </label>\n          </div>\n\n          <div>\n            <label>\n              Last: <input [(ngModel)]=\"person.lastName\" type=\"text\" placeholder=\"Last name\">\n            </label>\n          </div>\n\n          <div>\n            <label>{{person.fullName}}</label>\n          </div>\n      </form>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [DataService])
], FullNameComponent);
var PersonsDetailComponent = (function () {
    function PersonsDetailComponent(_service) {
        this._service = _service;
    }
    Object.defineProperty(PersonsDetailComponent.prototype, "person", {
        get: function () { return this._service.currentPerson; },
        enumerable: true,
        configurable: true
    });
    return PersonsDetailComponent;
}());
PersonsDetailComponent = __decorate([
    core_1.Component({
        selector: 'person-detail-cmp',
        template: "\n    <h2>{{person.fullName}}</h2>\n\n    <div>\n      <form>\n        <div>\n\t\t\t\t\t<label>First: <input [(ngModel)]=\"person.firstName\" type=\"text\" placeholder=\"First name\"></label>\n\t\t\t\t</div>\n\n        <div>\n\t\t\t\t\t<label>Last: <input [(ngModel)]=\"person.lastName\" type=\"text\" placeholder=\"Last name\"></label>\n\t\t\t\t</div>\n\n        <div>\n\t\t\t\t\t<label>Year of birth: <input [(ngModel)]=\"person.yearOfBirth\" type=\"number\" placeholder=\"Year of birth\"></label>\n          Age: {{person.age}}\n\t\t\t\t</div>\n        <div *ngIf=\"person.mom != null\">\n\t\t\t\t\t<label>Mom:</label>\n          <input [(ngModel)]=\"person.mom.firstName\" type=\"text\" placeholder=\"Mom's first name\">\n          <input [(ngModel)]=\"person.mom.lastName\" type=\"text\" placeholder=\"Mom's last name\">\n          {{person.mom.fullName}}\n\t\t\t\t</div>\n\n        <div *ngIf=\"person.dad != null\">\n\t\t\t\t\t<label>Dad:</label>\n          <input [(ngModel)]=\"person.dad.firstName\" type=\"text\" placeholder=\"Dad's first name\">\n          <input [(ngModel)]=\"person.dad.lastName\" type=\"text\" placeholder=\"Dad's last name\">\n          {{person.dad.fullName}}\n\t\t\t\t</div>\n\n        <div *ngIf=\"person.friends.length > 0\">\n\t\t\t\t\t<label>Friends:</label>\n          {{person.friendNames}}\n\t\t\t\t</div>\n      </form>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [DataService])
], PersonsDetailComponent);
var PersonsComponent = (function () {
    function PersonsComponent(_service) {
        this._service = _service;
        this.persons = _service.persons;
    }
    PersonsComponent.prototype.select = function (person) { this._service.currentPerson = person; };
    return PersonsComponent;
}());
PersonsComponent = __decorate([
    core_1.Component({
        selector: 'persons-cmp',
        template: "\n    <h1>FullName Demo</h1>\n    <div>\n      <ul>\n  \t\t  <li *ngFor=\"let person of persons\">\n  \t\t\t  <label (click)=\"select(person)\">{{person.fullName}}</label>\n  \t\t\t</li>\n  \t </ul>\n\n     <person-detail-cmp></person-detail-cmp>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [DataService])
], PersonsComponent);
var PersonManagementApplication = (function () {
    function PersonManagementApplication() {
    }
    PersonManagementApplication.prototype.switchToEditName = function () { this.mode = 'editName'; };
    PersonManagementApplication.prototype.switchToPersonList = function () { this.mode = 'personList'; };
    return PersonManagementApplication;
}());
PersonManagementApplication = __decorate([
    core_1.Component({
        selector: 'person-management-app',
        viewProviders: [DataService],
        template: "\n    <button (click)=\"switchToEditName()\">Edit Full Name</button>\n    <button (click)=\"switchToPersonList()\">Person Array</button>\n\n    <full-name-cmp *ngIf=\"mode == 'editName'\"></full-name-cmp>\n    <persons-cmp *ngIf=\"mode == 'personList'\"></persons-cmp>\n  "
    })
], PersonManagementApplication);
var ExampleModule = (function () {
    function ExampleModule() {
    }
    return ExampleModule;
}());
ExampleModule = __decorate([
    core_1.NgModule({
        bootstrap: [PersonManagementApplication],
        declarations: [PersonManagementApplication, FullNameComponent, PersonsComponent, PersonsDetailComponent],
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
    })
], ExampleModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3BlcnNvbl9tYW5hZ2VtZW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQThEO0FBQzlELHdDQUEyQztBQUMzQyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBRXpFOzs7R0FHRztBQUVILGFBQWE7QUFFYixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEI7SUFNRSxnQkFBbUIsU0FBaUIsRUFBUyxRQUFnQixFQUFTLFdBQW1CO1FBQXRFLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDdkYsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxzQkFBSSx1QkFBRzthQUFQLGNBQW9CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3JELHNCQUFJLDRCQUFRO2FBQVosY0FBeUIsTUFBTSxDQUFJLElBQUksQ0FBQyxTQUFTLFNBQUksSUFBSSxDQUFDLFFBQVUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3ZFLHNCQUFJLCtCQUFXO2FBQWYsY0FBNEIsTUFBTSxDQUFDLElBQUks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