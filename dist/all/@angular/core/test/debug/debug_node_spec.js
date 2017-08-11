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
var metadata_1 = require("@angular/core/src/metadata");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var Logger = (function () {
    function Logger() {
        this.logs = [];
    }
    Logger.prototype.add = function (thing) { this.logs.push(thing); };
    return Logger;
}());
Logger = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Logger);
var MessageDir = (function () {
    function MessageDir(logger) {
        this.logger = logger;
    }
    Object.defineProperty(MessageDir.prototype, "message", {
        set: function (newMessage) { this.logger.add(newMessage); },
        enumerable: true,
        configurable: true
    });
    return MessageDir;
}());
MessageDir = __decorate([
    metadata_1.Directive({ selector: '[message]', inputs: ['message'] }),
    __metadata("design:paramtypes", [Logger])
], MessageDir);
var ChildComp = (function () {
    function ChildComp() {
        this.childBinding = 'Original';
    }
    return ChildComp;
}());
ChildComp = __decorate([
    metadata_1.Component({
        selector: 'child-comp',
        template: "<div class=\"child\" message=\"child\">\n               <span class=\"childnested\" message=\"nestedchild\">Child</span>\n             </div>\n             <span class=\"child\" [innerHtml]=\"childBinding\"></span>",
    }),
    __metadata("design:paramtypes", [])
], ChildComp);
var ParentComp = (function () {
    function ParentComp() {
        this.parentBinding = 'OriginalParent';
    }
    return ParentComp;
}());
ParentComp = __decorate([
    metadata_1.Component({
        selector: 'parent-comp',
        viewProviders: [Logger],
        template: "<div class=\"parent\" message=\"parent\">\n               <span class=\"parentnested\" message=\"nestedparent\">Parent</span>\n             </div>\n             <span class=\"parent\" [innerHtml]=\"parentBinding\"></span>\n             <child-comp class=\"child-comp-class\"></child-comp>",
    }),
    __metadata("design:paramtypes", [])
], ParentComp);
var CustomEmitter = (function () {
    function CustomEmitter() {
        this.myevent = new core_1.EventEmitter();
    }
    return CustomEmitter;
}());
CustomEmitter = __decorate([
    metadata_1.Directive({ selector: 'custom-emitter', outputs: ['myevent'] }),
    __metadata("design:paramtypes", [])
], CustomEmitter);
var EventsComp = (function () {
    function EventsComp() {
        this.clicked = false;
        this.customed = false;
    }
    EventsComp.prototype.handleClick = function () { this.clicked = true; };
    EventsComp.prototype.handleCustom = function () { this.customed = true; };
    return EventsComp;
}());
EventsComp = __decorate([
    metadata_1.Component({
        selector: 'events-comp',
        template: "<button (click)=\"handleClick()\"></button>\n             <custom-emitter (myevent)=\"handleCustom()\"></custom-emitter>",
    }),
    __metadata("design:paramtypes", [])
], EventsComp);
var ConditionalContentComp = (function () {
    function ConditionalContentComp() {
        this.myBool = false;
    }
    return ConditionalContentComp;
}());
ConditionalContentComp = __decorate([
    metadata_1.Component({
        selector: 'cond-content-comp',
        viewProviders: [Logger],
        template: "<div class=\"child\" message=\"child\" *ngIf=\"myBool\"><ng-content></ng-content></div>",
    })
], ConditionalContentComp);
var ConditionalParentComp = (function () {
    function ConditionalParentComp() {
        this.parentBinding = 'OriginalParent';
    }
    return ConditionalParentComp;
}());
ConditionalParentComp = __decorate([
    metadata_1.Component({
        selector: 'conditional-parent-comp',
        viewProviders: [Logger],
        template: "<span class=\"parent\" [innerHtml]=\"parentBinding\"></span>\n            <cond-content-comp class=\"cond-content-comp-class\">\n              <span class=\"from-parent\"></span>\n            </cond-content-comp>",
    }),
    __metadata("design:paramtypes", [])
], ConditionalParentComp);
var UsingFor = (function () {
    function UsingFor() {
        this.stuff = ['one', 'two', 'three'];
    }
    return UsingFor;
}());
UsingFor = __decorate([
    metadata_1.Component({
        selector: 'using-for',
        viewProviders: [Logger],
        template: "<span *ngFor=\"let thing of stuff\" [innerHtml]=\"thing\"></span>\n            <ul message=\"list\">\n              <li *ngFor=\"let item of stuff\" [innerHtml]=\"item\"></li>\n            </ul>",
    }),
    __metadata("design:paramtypes", [])
], UsingFor);
var MyDir = (function () {
    function MyDir() {
    }
    return MyDir;
}());
MyDir = __decorate([
    metadata_1.Directive({ selector: '[mydir]', exportAs: 'mydir' })
], MyDir);
var LocalsComp = (function () {
    function LocalsComp() {
    }
    return LocalsComp;
}());
LocalsComp = __decorate([
    metadata_1.Component({
        selector: 'locals-comp',
        template: "\n   <div mydir #alice=\"mydir\"></div>\n ",
    })
], LocalsComp);
var BankAccount = (function () {
    function BankAccount() {
    }
    return BankAccount;
}());
__decorate([
    metadata_1.Input(),
    __metadata("design:type", String)
], BankAccount.prototype, "bank", void 0);
__decorate([
    metadata_1.Input('account'),
    __metadata("design:type", String)
], BankAccount.prototype, "id", void 0);
BankAccount = __decorate([
    metadata_1.Component({
        selector: 'bank-account',
        template: "\n   Bank Name: {{bank}}\n   Account Id: {{id}}\n "
    })
], BankAccount);
var TestApp = (function () {
    function TestApp() {
        this.width = 200;
        this.color = 'red';
        this.isClosed = true;
    }
    return TestApp;
}());
TestApp = __decorate([
    metadata_1.Component({
        selector: 'test-app',
        template: "\n   <bank-account bank=\"RBC\"\n                 account=\"4747\"\n                 [style.width.px]=\"width\"\n                 [style.color]=\"color\"\n                 [class.closed]=\"isClosed\"\n                 [class.open]=\"!isClosed\"></bank-account>\n ",
    })
], TestApp);
function main() {
    describe('debug element', function () {
        var fixture;
        beforeEach(testing_1.async(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    ChildComp,
                    ConditionalContentComp,
                    ConditionalParentComp,
                    CustomEmitter,
                    EventsComp,
                    LocalsComp,
                    MessageDir,
                    MyDir,
                    ParentComp,
                    TestApp,
                    UsingFor,
                ],
                providers: [Logger],
                schemas: [core_1.NO_ERRORS_SCHEMA],
            });
        }));
        it('should list all child nodes', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            // The root component has 3 elements and 2 text node children.
            matchers_1.expect(fixture.debugElement.childNodes.length).toEqual(5);
        });
        it('should list all component child elements', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            var childEls = fixture.debugElement.children;
            // The root component has 3 elements in its view.
            matchers_1.expect(childEls.length).toEqual(3);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childEls[0].nativeElement, 'parent')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childEls[1].nativeElement, 'parent')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childEls[2].nativeElement, 'child-comp-class')).toBe(true);
            var nested = childEls[0].children;
            matchers_1.expect(nested.length).toEqual(1);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(nested[0].nativeElement, 'parentnested')).toBe(true);
            var childComponent = childEls[2];
            var childCompChildren = childComponent.children;
            matchers_1.expect(childCompChildren.length).toEqual(2);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childCompChildren[0].nativeElement, 'child')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childCompChildren[1].nativeElement, 'child')).toBe(true);
            var childNested = childCompChildren[0].children;
            matchers_1.expect(childNested.length).toEqual(1);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childNested[0].nativeElement, 'childnested')).toBe(true);
        });
        it('should list conditional component child elements', function () {
            fixture = testing_1.TestBed.createComponent(ConditionalParentComp);
            fixture.detectChanges();
            var childEls = fixture.debugElement.children;
            // The root component has 2 elements in its view.
            matchers_1.expect(childEls.length).toEqual(2);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childEls[0].nativeElement, 'parent')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childEls[1].nativeElement, 'cond-content-comp-class')).toBe(true);
            var conditionalContentComp = childEls[1];
            matchers_1.expect(conditionalContentComp.children.length).toEqual(0);
            conditionalContentComp.componentInstance.myBool = true;
            fixture.detectChanges();
            matchers_1.expect(conditionalContentComp.children.length).toEqual(1);
        });
        it('should list child elements within viewports', function () {
            fixture = testing_1.TestBed.createComponent(UsingFor);
            fixture.detectChanges();
            var childEls = fixture.debugElement.children;
            matchers_1.expect(childEls.length).toEqual(4);
            // The 4th child is the <ul>
            var list = childEls[3];
            matchers_1.expect(list.children.length).toEqual(3);
        });
        it('should list element attributes', function () {
            fixture = testing_1.TestBed.createComponent(TestApp);
            fixture.detectChanges();
            var bankElem = fixture.debugElement.children[0];
            matchers_1.expect(bankElem.attributes['bank']).toEqual('RBC');
            matchers_1.expect(bankElem.attributes['account']).toEqual('4747');
        });
        it('should list element classes', function () {
            fixture = testing_1.TestBed.createComponent(TestApp);
            fixture.detectChanges();
            var bankElem = fixture.debugElement.children[0];
            matchers_1.expect(bankElem.classes['closed']).toBe(true);
            matchers_1.expect(bankElem.classes['open']).toBe(false);
        });
        it('should list element styles', function () {
            fixture = testing_1.TestBed.createComponent(TestApp);
            fixture.detectChanges();
            var bankElem = fixture.debugElement.children[0];
            matchers_1.expect(bankElem.styles['width']).toEqual('200px');
            matchers_1.expect(bankElem.styles['color']).toEqual('red');
        });
        it('should query child elements by css', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            var childTestEls = fixture.debugElement.queryAll(by_1.By.css('child-comp'));
            matchers_1.expect(childTestEls.length).toBe(1);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childTestEls[0].nativeElement, 'child-comp-class')).toBe(true);
        });
        it('should query child elements by directive', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            var childTestEls = fixture.debugElement.queryAll(by_1.By.directive(MessageDir));
            matchers_1.expect(childTestEls.length).toBe(4);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childTestEls[0].nativeElement, 'parent')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childTestEls[1].nativeElement, 'parentnested')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childTestEls[2].nativeElement, 'child')).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(childTestEls[3].nativeElement, 'childnested')).toBe(true);
        });
        it('should list providerTokens', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.providerTokens).toContain(Logger);
        });
        it('should list locals', function () {
            fixture = testing_1.TestBed.createComponent(LocalsComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.children[0].references['alice']).toBeAnInstanceOf(MyDir);
        });
        it('should allow injecting from the element injector', function () {
            fixture = testing_1.TestBed.createComponent(ParentComp);
            fixture.detectChanges();
            matchers_1.expect((fixture.debugElement.children[0].injector.get(Logger)).logs).toEqual([
                'parent', 'nestedparent', 'child', 'nestedchild'
            ]);
        });
        it('should list event listeners', function () {
            fixture = testing_1.TestBed.createComponent(EventsComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.children[0].listeners.length).toEqual(1);
            matchers_1.expect(fixture.debugElement.children[1].listeners.length).toEqual(1);
        });
        it('should trigger event handlers', function () {
            fixture = testing_1.TestBed.createComponent(EventsComp);
            fixture.detectChanges();
            matchers_1.expect(fixture.componentInstance.clicked).toBe(false);
            matchers_1.expect(fixture.componentInstance.customed).toBe(false);
            fixture.debugElement.children[0].triggerEventHandler('click', {});
            matchers_1.expect(fixture.componentInstance.clicked).toBe(true);
            fixture.debugElement.children[1].triggerEventHandler('myevent', {});
            matchers_1.expect(fixture.componentInstance.customed).toBe(true);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfbm9kZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2RlYnVnL2RlYnVnX25vZGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUdILHNDQUF5RTtBQUN6RSx1REFBdUU7QUFDdkUsaURBQXVFO0FBQ3ZFLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBR3RFLElBQU0sTUFBTTtJQUdWO1FBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUVqQyxvQkFBRyxHQUFILFVBQUksS0FBYSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxhQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOSyxNQUFNO0lBRFgsaUJBQVUsRUFBRTs7R0FDUCxNQUFNLENBTVg7QUFHRCxJQUFNLFVBQVU7SUFHZCxvQkFBWSxNQUFjO1FBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFBQyxDQUFDO0lBRXJELHNCQUFJLCtCQUFPO2FBQVgsVUFBWSxVQUFrQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDbEUsaUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5LLFVBQVU7SUFEZixvQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDO3FDQUlsQyxNQUFNO0dBSHRCLFVBQVUsQ0FNZjtBQVNELElBQU0sU0FBUztJQUdiO1FBQWdCLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBQUMsQ0FBQztJQUNuRCxnQkFBQztBQUFELENBQUMsQUFK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