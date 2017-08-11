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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AnimateApp = (function () {
    function AnimateApp() {
        this.items = [];
        this.bgStatus = 'focus';
    }
    AnimateApp.prototype.remove = function (item) {
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    };
    AnimateApp.prototype.reorderAndRemove = function () {
        this.items = this.items.sort(function (a, b) { return Math.random() - 0.5; });
        this.items.splice(Math.floor(Math.random() * this.items.length), 1);
        this.items.splice(Math.floor(Math.random() * this.items.length), 1);
        this.items[Math.floor(Math.random() * this.items.length)] = 99;
    };
    AnimateApp.prototype.bgStatusChanged = function (data, phase) {
        alert("backgroundAnimation has " + phase + " from " + data['fromState'] + " to " + data['toState']);
    };
    Object.defineProperty(AnimateApp.prototype, "state", {
        get: function () { return this._state; },
        set: function (s) {
            this._state = s;
            if (s == 'void') {
                this.items = [];
            }
            else {
                this.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            }
        },
        enumerable: true,
        configurable: true
    });
    return AnimateApp;
}());
AnimateApp = __decorate([
    core_1.Component({
        host: {
            '[@backgroundAnimation]': 'bgStatus',
            '(@backgroundAnimation.start)': 'bgStatusChanged($event, "started")',
            '(@backgroundAnimation.done)': 'bgStatusChanged($event, "completed")'
        },
        selector: 'animate-app',
        styleUrls: ['css/animate-app.css'],
        template: "\n    <button (click)=\"state='start'\">Start State</button>\n    <button (click)=\"state='active'\">Active State</button>\n    |\n    <button (click)=\"state='void'\">Void State</button>\n    <button (click)=\"reorderAndRemove()\">Scramble!</button>\n    <button (click)=\"state='default'\">Unhandled (default) State</button>\n    <button style=\"float:right\" (click)=\"bgStatus='blur'\">Blur Page (Host)</button>\n    <hr />\n    <div *ngFor=\"let item of items; let i=index\" class=\"box\" [@boxAnimation]=\"state\">\n      {{ item }} - {{ i }}\n      <button (click)=\"remove(item)\">x</button>\n    </div>\n  ",
        animations: [
            core_1.trigger('backgroundAnimation', [
                core_1.state('focus', core_1.style({ 'background-color': 'white' })),
                core_1.state('blur', core_1.style({ 'background-color': 'grey' })),
                core_1.transition('* => *', [
                    core_1.animate(500)
                ])
            ]),
            core_1.trigger('boxAnimation', [
                core_1.state('*', core_1.style({ 'height': '*', 'background-color': '#dddddd', 'color': 'black' })),
                core_1.state('void, hidden', core_1.style({ 'height': 0, 'opacity': 0 })),
                core_1.state('start', core_1.style({ 'background-color': 'red', 'height': '*' })),
                core_1.state('active', core_1.style({ 'background-color': 'orange', 'color': 'white', 'font-size': '100px' })),
                core_1.transition('active <=> start', [
                    core_1.animate(500, core_1.style({ 'transform': 'scale(2)' })),
                    core_1.animate(500)
                ]),
                core_1.transition('* => *', [
                    core_1.animate(1000, core_1.style({ 'opacity': 1, 'height': 300 })),
                    core_1.animate(1000, core_1.style({ 'background-color': 'blue' })),
                    core_1.animate(1000, core_1.keyframes([
                        core_1.style({ 'background-color': 'blue', 'color': 'black', 'offset': 0.2 }),
                        core_1.style({ 'background-color': 'brown', 'color': 'black', 'offset': 0.5 }),
                        core_1.style({ 'background-color': 'black', 'color': 'white', 'offset': 1 })
                    ])),
                    core_1.animate(2000)
                ])
            ])
        ]
    })
], AnimateApp);
exports.AnimateApp = AnimateApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0ZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2FuaW1hdGUvYXBwL2FuaW1hdGUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQStGO0FBd0QvRixJQUFhLFVBQVU7SUF0RHZCO1FBdURTLFVBQUssR0FBYSxFQUFFLENBQUM7UUFHckIsYUFBUSxHQUFHLE9BQU8sQ0FBQztJQTZCNUIsQ0FBQztJQTNCQywyQkFBTSxHQUFOLFVBQU8sSUFBWTtRQUNqQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVELHFDQUFnQixHQUFoQjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENB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