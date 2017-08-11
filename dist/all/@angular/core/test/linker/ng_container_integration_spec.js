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
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
exports.main = main;
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('<ng-container>', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ useJit: useJit });
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    MyComp,
                    NeedsContentChildren,
                    NeedsViewChildren,
                    TextDirective,
                    Simple,
                ],
            });
        });
        it('should support the "i18n" attribute', function () {
            var template = '<ng-container i18n>foo</ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            matchers_1.expect(el).toHaveText('foo');
        });
        it('should be rendered as comment with children as siblings', function () {
            var template = '<ng-container><p></p></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(2);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[1]).toUpperCase()).toEqual('P');
        });
        it('should support nesting', function () {
            var template = '<ng-container>1</ng-container><ng-container><ng-container>2</ng-container></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(5);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            matchers_1.expect(children[1]).toHaveText('1');
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[2])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[3])).toBe(true);
            matchers_1.expect(children[4]).toHaveText('2');
        });
        it('should group inner nodes', function () {
            var template = '<ng-container *ngIf="ctxBoolProp"><p></p><b></b></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(4);
            // ngIf anchor
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            // ng-container anchor
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[1])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[2]).toUpperCase()).toEqual('P');
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[3]).toUpperCase()).toEqual('B');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(children.length).toBe(1);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
        });
        it('should work with static content projection', function () {
            var template = "<simple><ng-container><p>1</p><p>2</p></ng-container></simple>";
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            matchers_1.expect(el).toHaveText('SIMPLE(12)');
        });
        it('should support injecting the container from children', function () {
            var template = "<ng-container [text]=\"'container'\"><p></p></ng-container>";
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var dir = fixture.debugElement.children[0].injector.get(TextDirective);
            matchers_1.expect(dir).toBeAnInstanceOf(TextDirective);
            matchers_1.expect(dir.text).toEqual('container');
        });
        it('should contain all direct child directives in a <ng-container> (content dom)', function () {
            var template = '<needs-content-children #q><ng-container><div text="foo"></div></ng-container></needs-content-children>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var q = fixture.debugElement.children[0].references['q'];
            fixture.detectChanges();
            matchers_1.expect(q.textDirChildren.length).toEqual(1);
            matchers_1.expect(q.numberOfChildrenAfterContentInit).toEqual(1);
        });
        it('should contain all child directives in a <ng-container> (view dom)', function () {
            var template = '<needs-view-children #q></needs-view-children>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var q = fixture.debugElement.children[0].references['q'];
            fixture.detectChanges();
            matchers_1.expect(q.textDirChildren.length).toEqual(1);
            matchers_1.expect(q.numberOfChildrenAfterViewInit).toEqual(1);
        });
    });
}
var TextDirective = (function () {
    function TextDirective() {
        this.text = null;
    }
    return TextDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TextDirective.prototype, "text", void 0);
TextDirective = __decorate([
    core_1.Directive({ selector: '[text]' })
], TextDirective);
var NeedsContentChildren = (function () {
    function NeedsContentChildren() {
    }
    NeedsContentChildren.prototype.ngAfterContentInit = function () { this.numberOfChildrenAfterContentInit = this.textDirChildren.length; };
    return NeedsContentChildren;
}());
__decorate([
    core_1.ContentChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsContentChildren.prototype, "textDirChildren", void 0);
NeedsContentChildren = __decorate([
    core_1.Component({ selector: 'needs-content-children', template: '' })
], NeedsContentChildren);
var NeedsViewChildren = (function () {
    function NeedsViewChildren() {
    }
    NeedsViewChildren.prototype.ngAfterViewInit = function () { this.numberOfChildrenAfterViewInit = this.textDirChildren.length; };
    return NeedsViewChildren;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewChildren.prototype, "textDirChildren", void 0);
NeedsViewChildren = __decorate([
    core_1.Component({ selector: 'needs-view-children', template: '<div text></div>' })
], NeedsViewChildren);
var Simple = (function () {
    function Simple() {
    }
    return Simple;
}());
Simple = __decorate([
    core_1.Component({ selector: 'simple', template: 'SIMPLE(<ng-content></ng-content>)' })
], Simple);
var MyComp = (function () {
    function MyComp() {
        this.ctxBoolProp = false;
    }
    return MyComp;
}());
MyComp = __decorate([
    core_1.Component({ selector: 'my-comp', template: '' })
], MyComp);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udGFpbmVyX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvbGlua2VyL25nX2NvbnRhaW5lcl9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBR0gsc0NBQXFJO0FBQ3JJLGlEQUE4QztBQUM5Qyw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLEtBQUssRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUhELG9CQUdDO0FBRUQsc0JBQXNCLEVBQTJCO1FBQTFCLGtCQUFNO0lBQzNCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUV6QixVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDNUMsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFO29CQUNaLE1BQU07b0JBQ04sb0JBQW9CO29CQUNwQixpQkFBaUI7b0JBQ2pCLGFBQWE7b0JBQ2IsTUFBTTtpQkFDUDthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sUUFBUSxHQUFHLHVDQUF1QyxDQUFDO1lBQ3pELGlCQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMs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