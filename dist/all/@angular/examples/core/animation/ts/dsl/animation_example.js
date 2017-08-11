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
// #docregion Component
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var MyExpandoCmp = (function () {
    function MyExpandoCmp() {
        this.collapse();
    }
    MyExpandoCmp.prototype.expand = function () { this.stateExpression = 'expanded'; };
    MyExpandoCmp.prototype.collapse = function () { this.stateExpression = 'collapsed'; };
    return MyExpandoCmp;
}());
MyExpandoCmp = __decorate([
    core_1.Component({
        selector: 'example-app',
        styles: ["\n    .toggle-container {\n      background-color:white;\n      border:10px solid black;\n      width:200px;\n      text-align:center;\n      line-height:100px;\n      font-size:50px;\n      box-sizing:border-box;\n      overflow:hidden;\n    }\n  "],
        animations: [animations_1.trigger('openClose', [
                animations_1.state('collapsed, void', animations_1.style({ height: '0px', color: 'maroon', borderColor: 'maroon' })),
                animations_1.state('expanded', animations_1.style({ height: '*', borderColor: 'green', color: 'green' })),
                animations_1.transition('collapsed <=> expanded', [animations_1.animate(500, animations_1.style({ height: '250px' })), animations_1.animate(500)])
            ])],
        template: "\n    <button (click)=\"expand()\">Open</button>\n    <button (click)=\"collapse()\">Closed</button>\n    <hr />\n    <div class=\"toggle-container\" [@openClose]=\"stateExpression\">\n      Look at this box\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [])
], MyExpandoCmp);
exports.MyExpandoCmp = MyExpandoCmp;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({ imports: [animations_2.BrowserAnimationsModule], declarations: [MyExpandoCmp], bootstrap: [MyExpandoCmp] })
], AppModule);
exports.AppModule = AppModule;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2V4YW1wbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL2FuaW1hdGlvbi90cy9kc2wvYW5pbWF0aW9uX2V4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCx1QkFBdUI7QUFDdkIsa0RBQStFO0FBQy9FLHNDQUFrRDtBQUNsRCxtRUFBNkU7QUFpQzdFLElBQWEsWUFBWTtJQUV2QjtRQUFnQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFBQyxDQUFDO0lBQ2xDLDZCQUFNLEdBQU4sY0FBVyxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsK0JBQVEsR0FBUixjQUFhLElBQUksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNwRCxtQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksWUFBWTtJQS9CeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLE1BQU0sRUFBRSxDQUFDLDBQQVdSLENBQUM7UUFDRixVQUFVLEVBQUUsQ0FBQyxvQkFBTyxDQUNoQixXQUFXLEVBQ1g7Z0JBQ0Usa0JBQUssQ0FBQyxpQkFBaUIsRUFBRSxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO2dCQUN4RixrQkFBSyxDQUFDLFVBQVUsRUFBRSxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO2dCQUM3RSx1QkFBVSxDQUNOLHdCQUF3QixFQUFFLENBQUMsb0JBQU8sQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3RGLENBQUMsQ0FBQztRQUNQLFFBQVEsRUFBRSxpT0FPVDtLQUNGLENBQUM7O0dBQ1csWUFBWSxDQUt4QjtBQUxZLG9DQUFZO0FBU3pCLElBQWEsU0FBUztJQUF0QjtJQUNBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFERCxJQUNDO0FBRFksU0FBUztJQUZyQixlQUFRLENBQ0wsRUFBQyxPQUFPLEVBQUUsQ0FBQyxvQ0FBdUIsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUM7R0FDckYsU0FBUyxDQUNyQjtBQURZLDhCQUFTO0FBR3RCLGdCQUFnQiJ9