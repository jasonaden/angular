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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var change_detection_1 = require("@angular/core/src/change_detection/change_detection");
var errors_1 = require("@angular/core/src/errors");
var component_factory_resolver_1 = require("@angular/core/src/linker/component_factory_resolver");
var element_ref_1 = require("@angular/core/src/linker/element_ref");
var query_list_1 = require("@angular/core/src/linker/query_list");
var template_ref_1 = require("@angular/core/src/linker/template_ref");
var view_container_ref_1 = require("@angular/core/src/linker/view_container_ref");
var metadata_1 = require("@angular/core/src/metadata");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
var ANCHOR_ELEMENT = new core_1.InjectionToken('AnchorElement');
function main() {
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
exports.main = main;
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('integration tests', function () {
        beforeEach(function () { testing_1.TestBed.configureCompiler({ useJit: useJit }); });
        describe('react to record changes', function () {
            it('should consume text node changes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div>{{ctxProp}}</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Hello World!');
            });
            it('should update text node with a blank string when interpolation evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div>{{null}}{{ctxProp}}</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('');
            });
            it('should allow both null and undefined in expressions', function () {
                var template = '<div>{{null == undefined}}|{{null === undefined}}</div>';
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: template } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true|false');
            });
            it('should support an arbitrary number of interpolations in an element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>before{{'0'}}a{{'1'}}b{{'2'}}c{{'3'}}d{{'4'}}e{{'5'}}f{{'6'}}g{{'7'}}h{{'8'}}i{{'9'}}j{{'10'}}after</div>";
                var fixture = testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('before0a1b2c3d4e5f6g7h8i9j10after');
            });
            it('should use a blank string when interpolation evaluates to null or undefined with an arbitrary number of interpolations', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>0{{null}}a{{undefined}}b{{null}}c{{undefined}}d{{null}}e{{undefined}}f{{null}}g{{undefined}}h{{null}}i{{undefined}}j{{null}}1</div>";
                var fixture = testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('0abcdefghij1');
            });
            it('should consume element binding changes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [id]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'id'))
                    .toEqual('Hello World!');
            });
            it('should consume binding to aria-* attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [attr.aria-label]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Initial aria label';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'aria-label'))
                    .toEqual('Initial aria label');
                fixture.componentInstance.ctxProp = 'Changed aria label';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'aria-label'))
                    .toEqual('Changed aria label');
            });
            it('should remove an attribute when attribute expression evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [attr.foo]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'bar';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'foo'))
                    .toEqual('bar');
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().hasAttribute(fixture.debugElement.children[0].nativeElement, 'foo'))
                    .toBeFalsy();
            });
            it('should remove style when when style expression evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [style.height.px]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = '10';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(fixture.debugElement.children[0].nativeElement, 'height'))
                    .toEqual('10px');
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(fixture.debugElement.children[0].nativeElement, 'height'))
                    .toEqual('');
            });
            it('should consume binding to property names where attr name and property name do not match', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [tabindex]="ctxNumProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'tabIndex'))
                    .toEqual(0);
                fixture.componentInstance.ctxNumProp = 5;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'tabIndex'))
                    .toEqual(5);
            });
            it('should consume binding to camel-cased properties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<input [readOnly]="ctxBoolProp">';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'readOnly'))
                    .toBeFalsy();
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'readOnly'))
                    .toBeTruthy();
            });
            it('should consume binding to innerHtml', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div innerHtml="{{ctxProp}}"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Some <span>HTML</span>';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.debugElement.children[0].nativeElement))
                    .toEqual('Some <span>HTML</span>');
                fixture.componentInstance.ctxProp = 'Some other <div>HTML</div>';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.debugElement.children[0].nativeElement))
                    .toEqual('Some other <div>HTML</div>');
            });
            it('should consume binding to className using class alias', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div class="initial" [class]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var nativeEl = fixture.debugElement.children[0].nativeElement;
                fixture.componentInstance.ctxProp = 'foo bar';
                fixture.detectChanges();
                matchers_1.expect(nativeEl).toHaveCssClass('foo');
                matchers_1.expect(nativeEl).toHaveCssClass('bar');
                matchers_1.expect(nativeEl).not.toHaveCssClass('initial');
            });
            it('should consume binding to htmlFor using for alias', function () {
                var template = '<label [for]="ctxProp"></label>';
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: template } })
                    .createComponent(MyComp);
                var nativeEl = fixture.debugElement.children[0].nativeElement;
                fixture.debugElement.componentInstance.ctxProp = 'foo';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(nativeEl, 'htmlFor')).toBe('foo');
            });
            it('should consume directive watch expression change.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<span>' +
                    '<div my-dir [elprop]="ctxProp"></div>' +
                    '<div my-dir elprop="Hi there!"></div>' +
                    '<div my-dir elprop="Hi {{\'there!\'}}"></div>' +
                    '<div my-dir elprop="One more {{ctxProp}}"></div>' +
                    '</span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                var containerSpan = fixture.debugElement.children[0];
                matchers_1.expect(containerSpan.children[0].injector.get(MyDir).dirProp).toEqual('Hello World!');
                matchers_1.expect(containerSpan.children[1].injector.get(MyDir).dirProp).toEqual('Hi there!');
                matchers_1.expect(containerSpan.children[2].injector.get(MyDir).dirProp).toEqual('Hi there!');
                matchers_1.expect(containerSpan.children[3].injector.get(MyDir).dirProp)
                    .toEqual('One more Hello World!');
            });
            describe('pipes', function () {
                it('should support pipes in bindings', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir, DoublePipe] });
                    var template = '<div my-dir #dir="mydir" [elprop]="ctxProp | double"></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.componentInstance.ctxProp = 'a';
                    fixture.detectChanges();
                    var dir = fixture.debugElement.children[0].references['dir'];
                    matchers_1.expect(dir.dirProp).toEqual('aa');
                });
            });
            it('should support nested components.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                var template = '<child-cmp></child-cmp>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            });
            // GH issue 328 - https://github.com/angular/angular/issues/328
            it('should support different directive types on a single node', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp, MyDir] });
                var template = '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.injector.get(MyDir).dirProp).toEqual('Hello World!');
                matchers_1.expect(tc.injector.get(ChildComp).dirProp).toEqual(null);
            });
            it('should support directives where a binding attribute is not given', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<p my-dir></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
            });
            it('should execute a given directive once, even if specified multiple times', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DuplicateDir, DuplicateDir, [DuplicateDir, [DuplicateDir]]] });
                var template = '<p no-duplicate></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                matchers_1.expect(fixture.nativeElement).toHaveText('noduplicate');
            });
            it('should support directives where a selector matches property binding', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, IdDir] });
                var template = '<p [id]="ctxProp"></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var idDir = tc.injector.get(IdDir);
                fixture.componentInstance.ctxProp = 'some_id';
                fixture.detectChanges();
                matchers_1.expect(idDir.id).toEqual('some_id');
                fixture.componentInstance.ctxProp = 'other_id';
                fixture.detectChanges();
                matchers_1.expect(idDir.id).toEqual('other_id');
            });
            it('should support directives where a selector matches event binding', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, EventDir] });
                var template = '<p (customEvent)="doNothing()"></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.injector.get(EventDir)).not.toBe(null);
            });
            it('should read directives metadata from their binding token', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PrivateImpl, NeedsPublicApi] });
                var template = '<div public-api><div needs-public-api></div></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
            });
            it('should support template directives via `<ng-template>` elements.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeViewport] });
                var template = '<ng-template some-viewport let-greeting="someTmpl"><span>{{greeting}}</span></ng-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var childNodesOfWrapper = dom_adapter_1.getDOM().childNodes(fixture.nativeElement);
                // 1 template + 2 copies.
                matchers_1.expect(childNodesOfWrapper.length).toBe(3);
                matchers_1.expect(childNodesOfWrapper[1]).toHaveText('hello');
                matchers_1.expect(childNodesOfWrapper[2]).toHaveText('again');
            });
            it('should not share empty context for template directives - issue #10045', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PollutedContext, NoContext] });
                var template = '<ng-template pollutedContext let-foo="bar">{{foo}}</ng-template><ng-template noContext let-foo="bar">{{foo}}</ng-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('baz');
            });
            it('should not detach views in ViewContainers when the parent view is destroyed.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeViewport] });
                var template = '<div *ngIf="ctxBoolProp"><ng-template some-viewport let-greeting="someTmpl"><span>{{greeting}}</span></ng-template></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                var ngIfEl = fixture.debugElement.children[0];
                var someViewport = ngIfEl.childNodes[0].injector.get(SomeViewport);
                matchers_1.expect(someViewport.container.length).toBe(2);
                matchers_1.expect(ngIfEl.children.length).toBe(2);
                fixture.componentInstance.ctxBoolProp = false;
                fixture.detectChanges();
                matchers_1.expect(someViewport.container.length).toBe(2);
                matchers_1.expect(fixture.debugElement.children.length).toBe(0);
            });
            it('should use a comment while stamping out `<ng-template>` elements.', function () {
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: '<ng-template></ng-template>' } })
                    .createComponent(MyComp);
                var childNodesOfWrapper = dom_adapter_1.getDOM().childNodes(fixture.nativeElement);
                matchers_1.expect(childNodesOfWrapper.length).toBe(1);
                matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(childNodesOfWrapper[0])).toBe(true);
            });
            it('should support template directives via `template` attribute.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeViewport] });
                var template = '<span template="some-viewport: let greeting=someTmpl">{{greeting}}</span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var childNodesOfWrapper = dom_adapter_1.getDOM().childNodes(fixture.nativeElement);
                // 1 template + 2 copies.
                matchers_1.expect(childNodesOfWrapper.length).toBe(3);
                matchers_1.expect(childNodesOfWrapper[1]).toHaveText('hello');
                matchers_1.expect(childNodesOfWrapper[2]).toHaveText('again');
            });
            it('should allow to transplant TemplateRefs into other ViewContainers', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, SomeDirective, CompWithHost, ToolbarComponent, ToolbarViewContainer, ToolbarPart
                    ],
                    imports: [common_1.CommonModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<some-directive><toolbar><ng-template toolbarpart let-toolbarProp="toolbarProp">{{ctxProp}},{{toolbarProp}},<cmp-with-host></cmp-with-host></ng-template></toolbar></some-directive>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'From myComp';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement)
                    .toHaveText('TOOLBAR(From myComp,From toolbar,Component with an injected host)');
            });
            describe('reference bindings', function () {
                it('should assign a component to a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-alice></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['alice'])
                        .toBeAnInstanceOf(ChildComp);
                });
                it('should assign a directive to a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ExportDir] });
                    var template = '<div><div export-dir #localdir="dir"></div></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['localdir'])
                        .toBeAnInstanceOf(ExportDir);
                });
                it('should make the assigned component accessible in property bindings, even if they were declared before the component', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<ng-template [ngIf]="true">{{alice.ctxProp}}</ng-template>|{{alice.ctxProp}}|<child-cmp ref-alice></child-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.detectChanges();
                    matchers_1.expect(fixture.nativeElement).toHaveText('hello|hello|hello');
                });
                it('should assign two component instances each with a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-alice></child-cmp><child-cmp ref-bob></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var pEl = fixture.debugElement.children[0];
                    var alice = pEl.children[0].references['alice'];
                    var bob = pEl.children[1].references['bob'];
                    matchers_1.expect(alice).toBeAnInstanceOf(ChildComp);
                    matchers_1.expect(bob).toBeAnInstanceOf(ChildComp);
                    matchers_1.expect(alice).not.toBe(bob);
                });
                it('should assign the component instance to a ref- with shorthand syntax', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<child-cmp #alice></child-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].references['alice'])
                        .toBeAnInstanceOf(ChildComp);
                });
                it('should assign the element instance to a user-defined variable', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<div><div ref-alice><i>Hello</i></div></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var value = fixture.debugElement.children[0].children[0].references['alice'];
                    matchers_1.expect(value).not.toBe(null);
                    matchers_1.expect(value.tagName.toLowerCase()).toEqual('div');
                });
                it('should assign the TemplateRef to a user-defined variable', function () {
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                        .overrideComponent(MyComp, { set: { template: '<ng-template ref-alice></ng-template>' } })
                        .createComponent(MyComp);
                    var value = fixture.debugElement.childNodes[0].references['alice'];
                    matchers_1.expect(value.createEmbeddedView).toBeTruthy();
                });
                it('should preserve case', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-superAlice></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['superAlice'])
                        .toBeAnInstanceOf(ChildComp);
                });
            });
            describe('variables', function () {
                it('should allow to use variables in a for loop', function () {
                    var template = '<ng-template ngFor [ngForOf]="[1]" let-i><child-cmp-no-template #cmp></child-cmp-no-template>{{i}}-{{cmp.ctxProp}}</ng-template>';
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildCompNoTemplate] })
                        .overrideComponent(MyComp, { set: { template: template } })
                        .createComponent(MyComp);
                    fixture.detectChanges();
                    // Get the element at index 2, since index 0 is the <ng-template>.
                    matchers_1.expect(dom_adapter_1.getDOM().childNodes(fixture.nativeElement)[2]).toHaveText('1-hello');
                });
            });
            describe('OnPush components', function () {
                it('should use ChangeDetectorRef to manually request a check', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithRef]]] });
                    var template = '<push-cmp-with-ref #cmp></push-cmp-with-ref>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    cmp.propagate();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                });
                it('should be checked when its bindings got updated', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmp, EventCmp], imports: [common_1.CommonModule] });
                    var template = '<push-cmp [prop]="ctxProp" #cmp></push-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.componentInstance.ctxProp = 'one';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    fixture.componentInstance.ctxProp = 'two';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                });
                if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                    it('should allow to destroy a component from within a host event handler', testing_1.fakeAsync(function () {
                        testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithHostEvent]]] });
                        var template = '<push-cmp-with-host-event></push-cmp-with-host-event>';
                        testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                        var fixture = testing_1.TestBed.createComponent(MyComp);
                        testing_1.tick();
                        fixture.detectChanges();
                        var cmpEl = fixture.debugElement.children[0];
                        var cmp = cmpEl.injector.get(PushCmpWithHostEvent);
                        cmp.ctxCallback = function (_) { return fixture.destroy(); };
                        matchers_1.expect(function () { return cmpEl.triggerEventHandler('click', {}); }).not.toThrow();
                    }));
                }
                it('should be checked when an event is fired', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmp, EventCmp], imports: [common_1.CommonModule] });
                    var template = '<push-cmp [prop]="ctxProp" #cmp></push-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmpEl = fixture.debugElement.children[0];
                    var cmp = cmpEl.componentInstance;
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    // regular element
                    cmpEl.children[0].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                    // element inside of an *ngIf
                    cmpEl.children[1].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(3);
                    // element inside a nested component
                    cmpEl.children[2].children[0].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(4);
                    // host element
                    cmpEl.triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(5);
                });
                it('should not affect updating properties on the component', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithRef]]] });
                    var template = '<push-cmp-with-ref [prop]="ctxProp" #cmp></push-cmp-with-ref>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.componentInstance.ctxProp = 'one';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.prop).toEqual('one');
                    fixture.componentInstance.ctxProp = 'two';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.prop).toEqual('two');
                });
                if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                    it('should be checked when an async pipe requests a check', testing_1.fakeAsync(function () {
                        testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmpWithAsyncPipe], imports: [common_1.CommonModule] });
                        var template = '<push-cmp-with-async #cmp></push-cmp-with-async>';
                        testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                        var fixture = testing_1.TestBed.createComponent(MyComp);
                        testing_1.tick();
                        var cmp = fixture.debugElement.children[0].references['cmp'];
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                        fixture.detectChanges();
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                        cmp.resolve(2);
                        testing_1.tick();
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                    }));
                }
            });
            it('should create a component that injects an @Host', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, SomeDirective, CompWithHost],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <some-directive>\n              <p>\n                <cmp-with-host #child></cmp-with-host>\n              </p>\n            </some-directive>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var childComponent = fixture.debugElement.children[0].children[0].children[0].references['child'];
                matchers_1.expect(childComponent.myHost).toBeAnInstanceOf(SomeDirective);
            });
            it('should create a component that injects an @Host through viewcontainer directive', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, SomeDirective, CompWithHost],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <some-directive>\n              <p *ngIf=\"true\">\n                <cmp-with-host #child></cmp-with-host>\n              </p>\n            </some-directive>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0].children[0].children[0];
                var childComponent = tc.references['child'];
                matchers_1.expect(childComponent.myHost).toBeAnInstanceOf(SomeDirective);
            });
            it('should support events via EventEmitter on regular elements', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent] });
                var template = '<div emitter listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var emitter = tc.injector.get(DirectiveEmittingEvent);
                var listener = tc.injector.get(DirectiveListeningEvent);
                matchers_1.expect(listener.msg).toEqual('');
                var eventCount = 0;
                emitter.event.subscribe({
                    next: function () {
                        eventCount++;
                        if (eventCount === 1) {
                            matchers_1.expect(listener.msg).toEqual('fired !');
                            fixture.destroy();
                            emitter.fireEvent('fired again !');
                        }
                        else {
                            matchers_1.expect(listener.msg).toEqual('fired !');
                        }
                    }
                });
                emitter.fireEvent('fired !');
            }));
            it('should support events via EventEmitter on template elements', testing_1.async(function () {
                var fixture = testing_1.TestBed
                    .configureTestingModule({ declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent] })
                    .overrideComponent(MyComp, {
                    set: {
                        template: '<ng-template emitter listener (event)="ctxProp=$event"></ng-template>'
                    }
                })
                    .createComponent(MyComp);
                var tc = fixture.debugElement.childNodes[0];
                var emitter = tc.injector.get(DirectiveEmittingEvent);
                var myComp = fixture.debugElement.injector.get(MyComp);
                var listener = tc.injector.get(DirectiveListeningEvent);
                myComp.ctxProp = '';
                matchers_1.expect(listener.msg).toEqual('');
                emitter.event.subscribe({
                    next: function () {
                        matchers_1.expect(listener.msg).toEqual('fired !');
                        matchers_1.expect(myComp.ctxProp).toEqual('fired !');
                    }
                });
                emitter.fireEvent('fired !');
            }));
            it('should support [()] syntax', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTwoWayBinding] });
                var template = '<div [(control)]="ctxProp" two-way></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var dir = tc.injector.get(DirectiveWithTwoWayBinding);
                fixture.componentInstance.ctxProp = 'one';
                fixture.detectChanges();
                matchers_1.expect(dir.control).toEqual('one');
                dir.controlChange.subscribe({ next: function () { matchers_1.expect(fixture.componentInstance.ctxProp).toEqual('two'); } });
                dir.triggerChange('two');
            }));
            it('should support render events', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent] });
                var template = '<div listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                browser_util_1.dispatchEvent(tc.nativeElement, 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([
                    'domEvent', 'body_domEvent', 'document_domEvent', 'window_domEvent'
                ]);
                fixture.destroy();
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(tc.nativeElement, 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([]);
            });
            it('should support render global events', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent] });
                var template = '<div listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['window_domEvent']);
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'document'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['document_domEvent', 'window_domEvent']);
                fixture.destroy();
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'body'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([]);
            });
            it('should support updating host element via hostAttributes on root elements', function () {
                var ComponentUpdatingHostAttributes = (function () {
                    function ComponentUpdatingHostAttributes() {
                    }
                    return ComponentUpdatingHostAttributes;
                }());
                ComponentUpdatingHostAttributes = __decorate([
                    metadata_1.Component({ host: { 'role': 'button' }, template: '' })
                ], ComponentUpdatingHostAttributes);
                testing_1.TestBed.configureTestingModule({ declarations: [ComponentUpdatingHostAttributes] });
                var fixture = testing_1.TestBed.createComponent(ComponentUpdatingHostAttributes);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.nativeElement, 'role')).toEqual('button');
            });
            it('should support updating host element via hostAttributes on host elements', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveUpdatingHostAttributes] });
                var template = '<div update-host-attributes></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'role'))
                    .toEqual('button');
            });
            it('should support updating host element via hostProperties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveUpdatingHostProperties] });
                var template = '<div update-host-properties></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var updateHost = tc.injector.get(DirectiveUpdatingHostProperties);
                updateHost.id = 'newId';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(tc.nativeElement, 'id')).toEqual('newId');
            });
            it('should not use template variables for expressions in hostProperties', function () {
                var DirectiveWithHostProps = (function () {
                    function DirectiveWithHostProps() {
                        this.id = 'one';
                    }
                    return DirectiveWithHostProps;
                }());
                DirectiveWithHostProps = __decorate([
                    metadata_1.Directive({ selector: '[host-properties]', host: { '[id]': 'id', '[title]': 'unknownProp' } })
                ], DirectiveWithHostProps);
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostProps] })
                    .overrideComponent(MyComp, { set: { template: "<div *ngFor=\"let id of ['forId']\" host-properties></div>" } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.properties['id']).toBe('one');
                matchers_1.expect(tc.properties['title']).toBe(undefined);
            });
            it('should not allow pipes in hostProperties', function () {
                var DirectiveWithHostProps = (function () {
                    function DirectiveWithHostProps() {
                    }
                    return DirectiveWithHostProps;
                }());
                DirectiveWithHostProps = __decorate([
                    metadata_1.Directive({ selector: '[host-properties]', host: { '[id]': 'id | uppercase' } })
                ], DirectiveWithHostProps);
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostProps] });
                var template = '<div host-properties></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError(/Host binding expression cannot contain pipes/);
            });
            it('should not use template variables for expressions in hostListeners', function () {
                var DirectiveWithHostListener = (function () {
                    function DirectiveWithHostListener() {
                        this.id = 'one';
                    }
                    DirectiveWithHostListener.prototype.doIt = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        this.receivedArgs = args;
                    };
                    return DirectiveWithHostListener;
                }());
                DirectiveWithHostListener = __decorate([
                    metadata_1.Directive({ selector: '[host-listener]', host: { '(click)': 'doIt(id, unknownProp)' } })
                ], DirectiveWithHostListener);
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostListener] })
                    .overrideComponent(MyComp, { set: { template: "<div *ngFor=\"let id of ['forId']\" host-listener></div>" } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                tc.triggerEventHandler('click', {});
                var dir = tc.injector.get(DirectiveWithHostListener);
                matchers_1.expect(dir.receivedArgs).toEqual(['one', undefined]);
            });
            it('should not allow pipes in hostListeners', function () {
                var DirectiveWithHostListener = (function () {
                    function DirectiveWithHostListener() {
                    }
                    return DirectiveWithHostListener;
                }());
                DirectiveWithHostListener = __decorate([
                    metadata_1.Directive({ selector: '[host-listener]', host: { '(click)': 'doIt() | somePipe' } })
                ], DirectiveWithHostListener);
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostListener] });
                var template = '<div host-listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError(/Cannot have a pipe in an action expression/);
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                it('should support preventing default on render events', function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveListeningDomEventPrevent, DirectiveListeningDomEventNoPrevent]
                    });
                    var template = '<input type="checkbox" listenerprevent><input type="checkbox" listenernoprevent>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
                    var dispatchedEvent2 = dom_adapter_1.getDOM().createMouseEvent('click');
                    dom_adapter_1.getDOM().dispatchEvent(fixture.debugElement.children[0].nativeElement, dispatchedEvent);
                    dom_adapter_1.getDOM().dispatchEvent(fixture.debugElement.children[1].nativeElement, dispatchedEvent2);
                    matchers_1.expect(dom_adapter_1.getDOM().isPrevented(dispatchedEvent)).toBe(true);
                    matchers_1.expect(dom_adapter_1.getDOM().isPrevented(dispatchedEvent2)).toBe(false);
                    matchers_1.expect(dom_adapter_1.getDOM().getChecked(fixture.debugElement.children[0].nativeElement)).toBeFalsy();
                    matchers_1.expect(dom_adapter_1.getDOM().getChecked(fixture.debugElement.children[1].nativeElement)).toBeTruthy();
                });
            }
            it('should support render global events from multiple directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent, DirectiveListeningDomEventOther] });
                var template = '<div *ngIf="ctxBoolProp" listener listenerother></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
                globalCounter = 0;
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                var listenerother = tc.injector.get(DirectiveListeningDomEventOther);
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['window_domEvent']);
                matchers_1.expect(listenerother.eventType).toEqual('other_domEvent');
                matchers_1.expect(globalCounter).toEqual(1);
                fixture.componentInstance.ctxBoolProp = false;
                fixture.detectChanges();
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(globalCounter).toEqual(1);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(globalCounter).toEqual(2);
                // need to destroy to release all remaining global event listeners
                fixture.destroy();
            });
            describe('ViewContainerRef', function () {
                beforeEach(function () {
                    // we need a module to declarate ChildCompUsingService as an entryComponent otherwise the
                    // factory doesn't get created
                    var MyModule = (function () {
                        function MyModule() {
                        }
                        return MyModule;
                    }());
                    MyModule = __decorate([
                        core_1.NgModule({
                            declarations: [MyComp, DynamicViewport, ChildCompUsingService],
                            entryComponents: [ChildCompUsingService],
                            schemas: [core_1.NO_ERRORS_SCHEMA],
                        })
                    ], MyModule);
                    testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                    testing_1.TestBed.overrideComponent(MyComp, { add: { template: '<div><dynamic-vp #dynamic></dynamic-vp></div>' } });
                });
                describe('.createComponent', function () {
                    it('should allow to create a component at any bound location', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        dynamicVp.create();
                        fixture.detectChanges();
                        matchers_1.expect(fixture.debugElement.children[0].children[1].nativeElement)
                            .toHaveText('dynamic greet');
                    }));
                    it('should allow to create multiple components at a location', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        dynamicVp.create();
                        dynamicVp.create();
                        fixture.detectChanges();
                        matchers_1.expect(fixture.debugElement.children[0].children[1].nativeElement)
                            .toHaveText('dynamic greet');
                        matchers_1.expect(fixture.debugElement.children[0].children[2].nativeElement)
                            .toHaveText('dynamic greet');
                    }));
                    it('should create a component that has been freshly compiled', function () {
                        var RootComp = (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            return RootComp;
                        }());
                        RootComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                        ], RootComp);
                        var RootModule = (function () {
                            function RootModule() {
                            }
                            return RootModule;
                        }());
                        RootModule = __decorate([
                            core_1.NgModule({
                                declarations: [RootComp],
                                providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                            })
                        ], RootModule);
                        var MyComp = (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __param(0, core_1.Inject('someToken')),
                            __metadata("design:paramtypes", [String])
                        ], MyComp);
                        var MyModule = (function () {
                            function MyModule() {
                            }
                            return MyModule;
                        }());
                        MyModule = __decorate([
                            core_1.NgModule({
                                declarations: [MyComp],
                                providers: [{ provide: 'someToken', useValue: 'someValue' }],
                            })
                        ], MyModule);
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] }).createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myCompFactory = compiler.compileModuleAndAllComponentsSync(MyModule)
                            .componentFactories[0];
                        // Note: the ComponentFactory was created directly via the compiler, i.e. it
                        // does not have an association to an NgModuleRef.
                        // -> expect the providers of the module that the view container belongs to.
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory);
                        matchers_1.expect(compRef.instance.someToken).toBe('someRootValue');
                    });
                    it('should create a component with the passed NgModuleRef', function () {
                        var RootComp = (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            return RootComp;
                        }());
                        RootComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                        ], RootComp);
                        var MyComp = (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __param(0, core_1.Inject('someToken')),
                            __metadata("design:paramtypes", [String])
                        ], MyComp);
                        var RootModule = (function () {
                            function RootModule() {
                            }
                            return RootModule;
                        }());
                        RootModule = __decorate([
                            core_1.NgModule({
                                declarations: [RootComp, MyComp],
                                entryComponents: [MyComp],
                                providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                            })
                        ], RootModule);
                        var MyModule = (function () {
                            function MyModule() {
                            }
                            return MyModule;
                        }());
                        MyModule = __decorate([
                            core_1.NgModule({ providers: [{ provide: 'someToken', useValue: 'someValue' }] })
                        ], MyModule);
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] }).createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myModule = compiler.compileModuleSync(MyModule).create(testing_1.TestBed.get(core_1.NgModuleRef));
                        var myCompFactory = testing_1.TestBed.get(component_factory_resolver_1.ComponentFactoryResolver)
                            .resolveComponentFactory(MyComp);
                        // Note: MyComp was declared as entryComponent in the RootModule,
                        // but we pass MyModule to the createComponent call.
                        // -> expect the providers of MyModule!
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory, undefined, undefined, undefined, myModule);
                        matchers_1.expect(compRef.instance.someToken).toBe('someValue');
                    });
                    it('should create a component with the NgModuleRef of the ComponentFactoryResolver', function () {
                        var RootComp = (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            return RootComp;
                        }());
                        RootComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                        ], RootComp);
                        var RootModule = (function () {
                            function RootModule() {
                            }
                            return RootModule;
                        }());
                        RootModule = __decorate([
                            core_1.NgModule({
                                declarations: [RootComp],
                                providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                            })
                        ], RootModule);
                        var MyComp = (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            return MyComp;
                        }());
                        MyComp = __decorate([
                            metadata_1.Component({ template: '' }),
                            __param(0, core_1.Inject('someToken')),
                            __metadata("design:paramtypes", [String])
                        ], MyComp);
                        var MyModule = (function () {
                            function MyModule() {
                            }
                            return MyModule;
                        }());
                        MyModule = __decorate([
                            core_1.NgModule({
                                declarations: [MyComp],
                                entryComponents: [MyComp],
                                providers: [{ provide: 'someToken', useValue: 'someValue' }],
                            })
                        ], MyModule);
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] })
                            .createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myModule = compiler.compileModuleSync(MyModule).create(testing_1.TestBed.get(core_1.NgModuleRef));
                        var myCompFactory = myModule.componentFactoryResolver.resolveComponentFactory(MyComp);
                        // Note: MyComp was declared as entryComponent in MyModule,
                        // and we don't pass an explicit ModuleRef to the createComponent call.
                        // -> expect the providers of MyModule!
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory);
                        matchers_1.expect(compRef.instance.someToken).toBe('someValue');
                    });
                });
                describe('.insert', function () {
                    it('should throw with destroyed views', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        var ref = dynamicVp.create();
                        fixture.detectChanges();
                        ref.destroy();
                        matchers_1.expect(function () {
                            dynamicVp.insert(ref.hostView);
                        }).toThrowError('Cannot insert a destroyed View in a ViewContainer!');
                    }));
                });
                describe('.move', function () {
                    it('should throw with destroyed views', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        var ref = dynamicVp.create();
                        fixture.detectChanges();
                        ref.destroy();
                        matchers_1.expect(function () {
                            dynamicVp.move(ref.hostView, 1);
                        }).toThrowError('Cannot move a destroyed View in a ViewContainer!');
                    }));
                });
            });
            it('should support static attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, NeedsAttribute] });
                var template = '<input static type="text" title>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var needsAttribute = tc.injector.get(NeedsAttribute);
                matchers_1.expect(needsAttribute.typeAttribute).toEqual('text');
                matchers_1.expect(needsAttribute.staticAttribute).toEqual('');
                matchers_1.expect(needsAttribute.fooAttribute).toEqual(null);
            });
            it('should support custom interpolation', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, ComponentWithCustomInterpolationA, ComponentWithCustomInterpolationB,
                        ComponentWithDefaultInterpolation
                    ]
                });
                var template = "<div>{{ctxProp}}</div>\n<cmp-with-custom-interpolation-a></cmp-with-custom-interpolation-a>\n<cmp-with-custom-interpolation-b></cmp-with-custom-interpolation-b>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Default Interpolation';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement)
                    .toHaveText('Default Interpolation\nCustom Interpolation A\nCustom Interpolation B (Default Interpolation)');
            });
        });
        describe('dependency injection', function () {
            it('should support bindings', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveProvidingInjectable, DirectiveConsumingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <directive-providing-injectable >\n              <directive-consuming-injectable #consuming>\n              </directive-consuming-injectable>\n            </directive-providing-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var comp = fixture.debugElement.children[0].children[0].references['consuming'];
                matchers_1.expect(comp.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support viewProviders', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveProvidingInjectableInView, DirectiveConsumingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n              <directive-consuming-injectable #consuming>\n              </directive-consuming-injectable>\n          ";
                testing_1.TestBed.overrideComponent(DirectiveProvidingInjectableInView, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(DirectiveProvidingInjectableInView);
                var comp = fixture.debugElement.children[0].references['consuming'];
                matchers_1.expect(comp.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support unbounded lookup', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, DirectiveProvidingInjectable, DirectiveContainingDirectiveConsumingAnInjectable,
                        DirectiveConsumingInjectableUnbounded
                    ],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <directive-providing-injectable>\n              <directive-containing-directive-consuming-an-injectable #dir>\n              </directive-containing-directive-consuming-an-injectable>\n            </directive-providing-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                testing_1.TestBed.overrideComponent(DirectiveContainingDirectiveConsumingAnInjectable, {
                    set: {
                        template: "\n            <directive-consuming-injectable-unbounded></directive-consuming-injectable-unbounded>\n          "
                    }
                });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var comp = fixture.debugElement.children[0].children[0].references['dir'];
                matchers_1.expect(comp.directive.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support the event-bus scenario', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, GrandParentProvidingEventBus, ParentProvidingEventBus, ChildConsumingEventBus
                    ],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <grand-parent-providing-event-bus>\n              <parent-providing-event-bus>\n                <child-consuming-event-bus>\n                </child-consuming-event-bus>\n              </parent-providing-event-bus>\n            </grand-parent-providing-event-bus>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var gpComp = fixture.debugElement.children[0];
                var parentComp = gpComp.children[0];
                var childComp = parentComp.children[0];
                var grandParent = gpComp.injector.get(GrandParentProvidingEventBus);
                var parent = parentComp.injector.get(ParentProvidingEventBus);
                var child = childComp.injector.get(ChildConsumingEventBus);
                matchers_1.expect(grandParent.bus.name).toEqual('grandparent');
                matchers_1.expect(parent.bus.name).toEqual('parent');
                matchers_1.expect(parent.grandParentBus).toBe(grandParent.bus);
                matchers_1.expect(child.bus).toBe(parent.bus);
            });
            it('should instantiate bindings lazily', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveConsumingInjectable, ComponentProvidingLoggingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n              <component-providing-logging-injectable #providing>\n                <directive-consuming-injectable *ngIf=\"ctxBoolProp\">\n                </directive-consuming-injectable>\n              </component-providing-logging-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var providing = fixture.debugElement.children[0].references['providing'];
                matchers_1.expect(providing.created).toBe(false);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(providing.created).toBe(true);
            });
        });
        describe('corner cases', function () {
            it('should remove script tags from templates', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "\n            <script>alert(\"Ooops\");</script>\n            <div>before<script>alert(\"Ooops\");</script><span>inside</span>after</div>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                matchers_1.expect(dom_adapter_1.getDOM().querySelectorAll(fixture.nativeElement, 'script').length).toEqual(0);
            });
            it('should throw when using directives without selector', function () {
                var SomeDirective = (function () {
                    function SomeDirective() {
                    }
                    return SomeDirective;
                }());
                SomeDirective = __decorate([
                    metadata_1.Directive({})
                ], SomeDirective);
                var SomeComponent = (function () {
                    function SomeComponent() {
                    }
                    return SomeComponent;
                }());
                SomeComponent = __decorate([
                    metadata_1.Component({ selector: 'comp', template: '' })
                ], SomeComponent);
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeDirective, SomeComponent] });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError("Directive " + util_1.stringify(SomeDirective) + " has no selector, please add it!");
            });
            it('should use a default element name for components without selectors', function () {
                var noSelectorComponentFactory = undefined;
                var NoSelectorComponent = (function () {
                    function NoSelectorComponent() {
                    }
                    return NoSelectorComponent;
                }());
                NoSelectorComponent = __decorate([
                    metadata_1.Component({ template: '----' })
                ], NoSelectorComponent);
                var SomeComponent = (function () {
                    function SomeComponent(componentFactoryResolver) {
                        // grab its own component factory
                        noSelectorComponentFactory =
                            componentFactoryResolver.resolveComponentFactory(NoSelectorComponent);
                    }
                    return SomeComponent;
                }());
                SomeComponent = __decorate([
                    metadata_1.Component({ selector: 'some-comp', template: '', entryComponents: [NoSelectorComponent] }),
                    __metadata("design:paramtypes", [component_factory_resolver_1.ComponentFactoryResolver])
                ], SomeComponent);
                testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent, NoSelectorComponent] });
                // get the factory
                testing_1.TestBed.createComponent(SomeComponent);
                matchers_1.expect(noSelectorComponentFactory.selector).toBe('ng-component');
                matchers_1.expect(dom_adapter_1.getDOM()
                    .nodeName(noSelectorComponentFactory.create(core_1.Injector.NULL).location.nativeElement)
                    .toLowerCase())
                    .toEqual('ng-component');
            });
        });
        describe('error handling', function () {
            it('should report a meaningful error when a directive is missing annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeDirectiveMissingAnnotation] });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError("Unexpected value '" + util_1.stringify(SomeDirectiveMissingAnnotation) + "' declared by the module 'DynamicTestModule'. Please add a @Pipe/@Directive/@Component annotation.");
            });
            it('should report a meaningful error when a component is missing view annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ComponentWithoutView] });
                try {
                    testing_1.TestBed.createComponent(ComponentWithoutView);
                    matchers_1.expect(true).toBe(false);
                }
                catch (e) {
                    matchers_1.expect(e.message).toContain("No template specified for component " + util_1.stringify(ComponentWithoutView));
                }
            });
            it('should provide an error context when an error happens in DI', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveThrowingAnError],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "<directive-throwing-error></directive-throwing-error>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                try {
                    testing_1.TestBed.createComponent(MyComp);
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                }
            });
            it('should provide an error context when an error happens in change detection', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveThrowingAnError] });
                var template = "<input [value]=\"one.two.three\" #local>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                try {
                    fixture.detectChanges();
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.renderNode).toUpperCase()).toEqual('INPUT');
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                    matchers_1.expect(c.context).toBe(fixture.componentInstance);
                    matchers_1.expect(c.references['local']).toBeDefined();
                }
            });
            it('should provide an error context when an error happens in change detection (text node)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>{{one.two.three}}</div>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                try {
                    fixture.detectChanges();
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(c.renderNode).toBeTruthy();
                }
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                it('should provide an error context when an error happens in an event handler', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = "<span emitter listener (event)=\"throwError()\" #local></span>";
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    testing_1.tick();
                    var tc = fixture.debugElement.children[0];
                    var errorHandler = tc.injector.get(core_1.ErrorHandler);
                    var err;
                    spyOn(errorHandler, 'handleError').and.callFake(function (e) { return err = e; });
                    tc.injector.get(DirectiveEmittingEvent).fireEvent('boom');
                    matchers_1.expect(err).toBeTruthy();
                    var c = errors_1.getDebugContext(err);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.renderNode).toUpperCase()).toEqual('SPAN');
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                    matchers_1.expect(c.context).toBe(fixture.componentInstance);
                    matchers_1.expect(c.references['local']).toBeDefined();
                }));
            }
        });
        it('should support imperative views', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SimpleImperativeViewComponent] });
            var template = '<simple-imp-cmp></simple-imp-cmp>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello imp view');
        });
        it('should support moving embedded views around', function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [MyComp, SomeImperativeViewport],
                providers: [{ provide: ANCHOR_ELEMENT, useValue: browser_util_1.el('<div></div>') }],
            });
            var template = '<div><div *someImpvp="ctxBoolProp">hello</div></div>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var anchorElement = testing_1.getTestBed().get(ANCHOR_ELEMENT);
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            matchers_1.expect(anchorElement).toHaveText('');
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            matchers_1.expect(anchorElement).toHaveText('hello');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        });
        describe('Property bindings', function () {
            it('should throw on bindings to unknown properties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div unknown="{{ctxProp}}"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                try {
                    testing_1.TestBed.createComponent(MyComp);
                    throw 'Should throw';
                }
                catch (e) {
                    matchers_1.expect(e.message).toMatch(/Template parse errors:\nCan't bind to 'unknown' since it isn't a known property of 'div'. \("<div \[ERROR ->\]unknown="{{ctxProp}}"><\/div>"\): .*MyComp.html@0:5/);
                }
            });
            it('should not throw for property binding to a non-existing property when there is a matching directive property', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div my-dir [elprop]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); }).not.toThrow();
            });
            it('should not be created when there is a directive with the same property', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTitle] });
                var template = '<span [title]="ctxProp"></span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'TITLE';
                fixture.detectChanges();
                var el = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, 'span');
                matchers_1.expect(el.title).toBeFalsy();
            });
            it('should work when a directive uses hostProperty to update the DOM element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTitleAndHostProperty] });
                var template = '<span [title]="ctxProp"></span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'TITLE';
                fixture.detectChanges();
                var el = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, 'span');
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(el, 'title')).toEqual('TITLE');
            });
        });
        describe('logging property updates', function () {
            it('should reflect property values as attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div>' +
                    '<div my-dir [elprop]="ctxProp"></div>' +
                    '</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'hello';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement))
                    .toContain('ng-reflect-dir-prop="hello"');
            });
            it("should work with prop names containing '$'", function () {
                testing_1.TestBed.configureTestingModule({ declarations: [ParentCmp, SomeCmpWithInput] });
                var fixture = testing_1.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement)).toContain('ng-reflect-test_="hello"');
            });
            it('should reflect property values on template comments', function () {
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: '<ng-template [ngIf]="ctxBoolProp"></ng-template>' } })
                    .createComponent(MyComp);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement))
                    .toContain('"ng\-reflect\-ng\-if"\: "true"');
            });
            it('should indicate when toString() throws', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div my-dir [elprop]="toStringThrow"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement)).toContain('[ERROR]');
            });
        });
        describe('property decorators', function () {
            it('should support property decorators', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveWithPropDecorators],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<with-prop-decorators elProp="aaa"></with-prop-decorators>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                matchers_1.expect(dir.dirProp).toEqual('aaa');
            });
            it('should support host binding decorators', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveWithPropDecorators],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<with-prop-decorators></with-prop-decorators>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                dir.myAttr = 'aaa';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getOuterHTML(fixture.debugElement.children[0].nativeElement))
                    .toContain('my-attr="aaa"');
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                it('should support event decorators', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveWithPropDecorators],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = "<with-prop-decorators (elEvent)=\"ctxProp='called'\">";
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    testing_1.tick();
                    var emitter = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                    emitter.fireEvent('fired !');
                    testing_1.tick();
                    matchers_1.expect(fixture.componentInstance.ctxProp).toEqual('called');
                }));
                it('should support host listener decorators', function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveWithPropDecorators],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = '<with-prop-decorators></with-prop-decorators>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.detectChanges();
                    var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                    var native = fixture.debugElement.children[0].nativeElement;
                    dom_adapter_1.getDOM().dispatchEvent(native, dom_adapter_1.getDOM().createMouseEvent('click'));
                    matchers_1.expect(dir.target).toBe(native);
                });
            }
            it('should support defining views in the component decorator', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, ComponentWithTemplate],
                    imports: [common_1.CommonModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<component-with-template></component-with-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var native = fixture.debugElement.children[0].nativeElement;
                matchers_1.expect(native).toHaveText('No View Decorator: 123');
            });
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            describe('svg', function () {
                it('should support svg elements', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<svg><use xlink:href="Port" /></svg>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var el = fixture.nativeElement;
                    var svg = dom_adapter_1.getDOM().childNodes(el)[0];
                    var use = dom_adapter_1.getDOM().childNodes(svg)[0];
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(svg, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(use, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    var firstAttribute = dom_adapter_1.getDOM().getProperty(use, 'attributes')[0];
                    matchers_1.expect(firstAttribute.name).toEqual('xlink:href');
                    matchers_1.expect(firstAttribute.namespaceURI).toEqual('http://www.w3.org/1999/xlink');
                });
                it('should support foreignObjects with document fragments', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<svg><foreignObject><xhtml:div><p>Test</p></xhtml:div></foreignObject></svg>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var el = fixture.nativeElement;
                    var svg = dom_adapter_1.getDOM().childNodes(el)[0];
                    var foreignObject = dom_adapter_1.getDOM().childNodes(svg)[0];
                    var p = dom_adapter_1.getDOM().childNodes(foreignObject)[0];
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(svg, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(foreignObject, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(p, 'namespaceURI'))
                        .toEqual('http://www.w3.org/1999/xhtml');
                });
            });
            describe('attributes', function () {
                it('should support attributes with namespace', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeCmp] });
                    var template = '<svg:use xlink:href="#id" />';
                    testing_1.TestBed.overrideComponent(SomeCmp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(SomeCmp);
                    var useEl = dom_adapter_1.getDOM().firstChild(fixture.nativeElement);
                    matchers_1.expect(dom_adapter_1.getDOM().getAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual('#id');
                });
                it('should support binding to attributes with namespace', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeCmp] });
                    var template = '<svg:use [attr.xlink:href]="value" />';
                    testing_1.TestBed.overrideComponent(SomeCmp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(SomeCmp);
                    var cmp = fixture.componentInstance;
                    var useEl = dom_adapter_1.getDOM().firstChild(fixture.nativeElement);
                    cmp.value = '#id';
                    fixture.detectChanges();
                    matchers_1.expect(dom_adapter_1.getDOM().getAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual('#id');
                    cmp.value = null;
                    fixture.detectChanges();
                    matchers_1.expect(dom_adapter_1.getDOM().hasAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual(false);
                });
            });
        }
    });
}
var ComponentWithDefaultInterpolation = (function () {
    function ComponentWithDefaultInterpolation() {
        this.text = 'Default Interpolation';
    }
    return ComponentWithDefaultInterpolation;
}());
ComponentWithDefaultInterpolation = __decorate([
    metadata_1.Component({ selector: 'cmp-with-default-interpolation', template: "{{text}}" })
], ComponentWithDefaultInterpolation);
var ComponentWithCustomInterpolationA = (function () {
    function ComponentWithCustomInterpolationA() {
        this.text = 'Custom Interpolation A';
    }
    return ComponentWithCustomInterpolationA;
}());
ComponentWithCustomInterpolationA = __decorate([
    metadata_1.Component({
        selector: 'cmp-with-custom-interpolation-a',
        template: "<div>{%text%}</div>",
        interpolation: ['{%', '%}']
    })
], ComponentWithCustomInterpolationA);
var ComponentWithCustomInterpolationB = (function () {
    function ComponentWithCustomInterpolationB() {
        this.text = 'Custom Interpolation B';
    }
    return ComponentWithCustomInterpolationB;
}());
ComponentWithCustomInterpolationB = __decorate([
    metadata_1.Component({
        selector: 'cmp-with-custom-interpolation-b',
        template: "<div>{**text%}</div> (<cmp-with-default-interpolation></cmp-with-default-interpolation>)",
        interpolation: ['{**', '%}']
    })
], ComponentWithCustomInterpolationB);
var MyService = (function () {
    function MyService() {
        this.greeting = 'hello';
    }
    return MyService;
}());
MyService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], MyService);
var SimpleImperativeViewComponent = (function () {
    function SimpleImperativeViewComponent(self) {
        var hostElement = self.nativeElement;
        dom_adapter_1.getDOM().appendChild(hostElement, browser_util_1.el('hello imp view'));
    }
    return SimpleImperativeViewComponent;
}());
SimpleImperativeViewComponent = __decorate([
    metadata_1.Component({ selector: 'simple-imp-cmp', template: '' }),
    __metadata("design:paramtypes", [element_ref_1.ElementRef])
], SimpleImperativeViewComponent);
var DynamicViewport = (function () {
    function DynamicViewport(vc, componentFactoryResolver) {
        this.vc = vc;
        var myService = new MyService();
        myService.greeting = 'dynamic greet';
        this.injector = core_1.Injector.create([{ provide: MyService, useValue: myService }], vc.injector);
        this.componentFactory =
            componentFactoryResolver.resolveComponentFactory(ChildCompUsingService);
    }
    DynamicViewport.prototype.create = function () {
        return this.vc.createComponent(this.componentFactory, this.vc.length, this.injector);
    };
    DynamicViewport.prototype.insert = function (viewRef, index) { return this.vc.insert(viewRef, index); };
    DynamicViewport.prototype.move = function (viewRef, currentIndex) {
        return this.vc.move(viewRef, currentIndex);
    };
    return DynamicViewport;
}());
DynamicViewport = __decorate([
    metadata_1.Directive({ selector: 'dynamic-vp' }),
    __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, component_factory_resolver_1.ComponentFactoryResolver])
], DynamicViewport);
var MyDir = (function () {
    function MyDir() {
        this.dirProp = '';
    }
    return MyDir;
}());
MyDir = __decorate([
    metadata_1.Directive({ selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir' }),
    __metadata("design:paramtypes", [])
], MyDir);
var DirectiveWithTitle = (function () {
    function DirectiveWithTitle() {
    }
    return DirectiveWithTitle;
}());
DirectiveWithTitle = __decorate([
    metadata_1.Directive({ selector: '[title]', inputs: ['title'] })
], DirectiveWithTitle);
var DirectiveWithTitleAndHostProperty = (function () {
    function DirectiveWithTitleAndHostProperty() {
    }
    return DirectiveWithTitleAndHostProperty;
}());
DirectiveWithTitleAndHostProperty = __decorate([
    metadata_1.Directive({ selector: '[title]', inputs: ['title'], host: { '[title]': 'title' } })
], DirectiveWithTitleAndHostProperty);
var EventCmp = (function () {
    function EventCmp() {
    }
    EventCmp.prototype.noop = function () { };
    return EventCmp;
}());
EventCmp = __decorate([
    metadata_1.Component({ selector: 'event-cmp', template: '<div (click)="noop()"></div>' })
], EventCmp);
var PushCmp = (function () {
    function PushCmp() {
        this.numberOfChecks = 0;
    }
    PushCmp.prototype.noop = function () { };
    Object.defineProperty(PushCmp.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return 'fixed';
        },
        enumerable: true,
        configurable: true
    });
    return PushCmp;
}());
PushCmp = __decorate([
    metadata_1.Component({
        selector: 'push-cmp',
        inputs: ['prop'],
        host: { '(click)': 'true' },
        changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
        template: '{{field}}<div (click)="noop()"></div><div *ngIf="true" (click)="noop()"></div><event-cmp></event-cmp>'
    }),
    __metadata("design:paramtypes", [])
], PushCmp);
var PushCmpWithRef = (function () {
    function PushCmpWithRef(ref) {
        this.numberOfChecks = 0;
        this.ref = ref;
    }
    Object.defineProperty(PushCmpWithRef.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return 'fixed';
        },
        enumerable: true,
        configurable: true
    });
    PushCmpWithRef.prototype.propagate = function () { this.ref.markForCheck(); };
    return PushCmpWithRef;
}());
PushCmpWithRef = __decorate([
    metadata_1.Component({
        selector: 'push-cmp-with-ref',
        inputs: ['prop'],
        changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
        template: '{{field}}'
    }),
    __metadata("design:paramtypes", [change_detection_1.ChangeDetectorRef])
], PushCmpWithRef);
var PushCmpWithHostEvent = (function () {
    function PushCmpWithHostEvent() {
        this.ctxCallback = function (_) { };
    }
    return PushCmpWithHostEvent;
}());
PushCmpWithHostEvent = __decorate([
    metadata_1.Component({
        selector: 'push-cmp-with-host-event',
        host: { '(click)': 'ctxCallback($event)' },
        changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
        template: ''
    })
], PushCmpWithHostEvent);
var PushCmpWithAsyncPipe = (function () {
    function PushCmpWithAsyncPipe() {
        var _this = this;
        this.numberOfChecks = 0;
        this.promise = new Promise(function (resolve) { _this.resolve = resolve; });
    }
    Object.defineProperty(PushCmpWithAsyncPipe.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return this.promise;
        },
        enumerable: true,
        configurable: true
    });
    return PushCmpWithAsyncPipe;
}());
PushCmpWithAsyncPipe = __decorate([
    metadata_1.Component({
        selector: 'push-cmp-with-async',
        changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
        template: '{{field | async}}'
    }),
    __metadata("design:paramtypes", [])
], PushCmpWithAsyncPipe);
var MyComp = (function () {
    function MyComp() {
        this.toStringThrow = { toString: function () { throw 'boom'; } };
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    MyComp.prototype.throwError = function () { throw 'boom'; };
    return MyComp;
}());
MyComp = __decorate([
    metadata_1.Component({ selector: 'my-comp', template: '' }),
    __metadata("design:paramtypes", [])
], MyComp);
var ChildComp = (function () {
    function ChildComp(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    return ChildComp;
}());
ChildComp = __decorate([
    metadata_1.Component({
        selector: 'child-cmp',
        inputs: ['dirProp'],
        viewProviders: [MyService],
        template: '{{ctxProp}}'
    }),
    __metadata("design:paramtypes", [MyService])
], ChildComp);
var ChildCompNoTemplate = (function () {
    function ChildCompNoTemplate() {
        this.ctxProp = 'hello';
    }
    return ChildCompNoTemplate;
}());
ChildCompNoTemplate = __decorate([
    metadata_1.Component({ selector: 'child-cmp-no-template', template: '' })
], ChildCompNoTemplate);
var ChildCompUsingService = (function () {
    function ChildCompUsingService(service) {
        this.ctxProp = service.greeting;
    }
    return ChildCompUsingService;
}());
ChildCompUsingService = __decorate([
    metadata_1.Component({ selector: 'child-cmp-svc', template: '{{ctxProp}}' }),
    __metadata("design:paramtypes", [MyService])
], ChildCompUsingService);
var SomeDirective = (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
SomeDirective = __decorate([
    metadata_1.Directive({ selector: 'some-directive' })
], SomeDirective);
var SomeDirectiveMissingAnnotation = (function () {
    function SomeDirectiveMissingAnnotation() {
    }
    return SomeDirectiveMissingAnnotation;
}());
var CompWithHost = (function () {
    function CompWithHost(someComp) {
        this.myHost = someComp;
    }
    return CompWithHost;
}());
CompWithHost = __decorate([
    metadata_1.Component({
        selector: 'cmp-with-host',
        template: '<p>Component with an injected host</p>',
    }),
    __param(0, core_1.Host()),
    __metadata("design:paramtypes", [SomeDirective])
], CompWithHost);
var ChildComp2 = (function () {
    function ChildComp2(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    return ChildComp2;
}());
ChildComp2 = __decorate([
    metadata_1.Component({ selector: '[child-cmp2]', viewProviders: [MyService] }),
    __metadata("design:paramtypes", [MyService])
], ChildComp2);
var SomeViewportContext = (function () {
    function SomeViewportContext(someTmpl) {
        this.someTmpl = someTmpl;
    }
    return SomeViewportContext;
}());
var SomeViewport = (function () {
    function SomeViewport(container, templateRef) {
        this.container = container;
        container.createEmbeddedView(templateRef, new SomeViewportContext('hello'));
        container.createEmbeddedView(templateRef, new SomeViewportContext('again'));
    }
    return SomeViewport;
}());
SomeViewport = __decorate([
    metadata_1.Directive({ selector: '[some-viewport]' }),
    __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, template_ref_1.TemplateRef])
], SomeViewport);
var PollutedContext = (function () {
    function PollutedContext(tplRef, vcRef) {
        this.tplRef = tplRef;
        this.vcRef = vcRef;
        var evRef = this.vcRef.createEmbeddedView(this.tplRef);
        evRef.context.bar = 'baz';
    }
    return PollutedContext;
}());
PollutedContext = __decorate([
    metadata_1.Directive({ selector: '[pollutedContext]' }),
    __metadata("design:paramtypes", [template_ref_1.TemplateRef, view_container_ref_1.ViewContainerRef])
], PollutedContext);
var NoContext = (function () {
    function NoContext(tplRef, vcRef) {
        this.tplRef = tplRef;
        this.vcRef = vcRef;
        this.vcRef.createEmbeddedView(this.tplRef);
    }
    return NoContext;
}());
NoContext = __decorate([
    metadata_1.Directive({ selector: '[noContext]' }),
    __metadata("design:paramtypes", [template_ref_1.TemplateRef, view_container_ref_1.ViewContainerRef])
], NoContext);
var DoublePipe = (function () {
    function DoublePipe() {
    }
    DoublePipe.prototype.ngOnDestroy = function () { };
    DoublePipe.prototype.transform = function (value) { return "" + value + value; };
    return DoublePipe;
}());
DoublePipe = __decorate([
    metadata_1.Pipe({ name: 'double' })
], DoublePipe);
var DirectiveEmittingEvent = (function () {
    function DirectiveEmittingEvent() {
        this.msg = '';
        this.event = new core_1.EventEmitter();
    }
    DirectiveEmittingEvent.prototype.fireEvent = function (msg) { this.event.emit(msg); };
    return DirectiveEmittingEvent;
}());
DirectiveEmittingEvent = __decorate([
    metadata_1.Directive({ selector: '[emitter]', outputs: ['event'] }),
    __metadata("design:paramtypes", [])
], DirectiveEmittingEvent);
var DirectiveUpdatingHostAttributes = (function () {
    function DirectiveUpdatingHostAttributes() {
    }
    return DirectiveUpdatingHostAttributes;
}());
DirectiveUpdatingHostAttributes = __decorate([
    metadata_1.Directive({ selector: '[update-host-attributes]', host: { 'role': 'button' } })
], DirectiveUpdatingHostAttributes);
var DirectiveUpdatingHostProperties = (function () {
    function DirectiveUpdatingHostProperties() {
        this.id = 'one';
    }
    return DirectiveUpdatingHostProperties;
}());
DirectiveUpdatingHostProperties = __decorate([
    metadata_1.Directive({ selector: '[update-host-properties]', host: { '[id]': 'id' } }),
    __metadata("design:paramtypes", [])
], DirectiveUpdatingHostProperties);
var DirectiveListeningEvent = (function () {
    function DirectiveListeningEvent() {
        this.msg = '';
    }
    DirectiveListeningEvent.prototype.onEvent = function (msg) { this.msg = msg; };
    return DirectiveListeningEvent;
}());
DirectiveListeningEvent = __decorate([
    metadata_1.Directive({ selector: '[listener]', host: { '(event)': 'onEvent($event)' } }),
    __metadata("design:paramtypes", [])
], DirectiveListeningEvent);
var DirectiveListeningDomEvent = (function () {
    function DirectiveListeningDomEvent() {
        this.eventTypes = [];
    }
    DirectiveListeningDomEvent.prototype.onEvent = function (eventType) { this.eventTypes.push(eventType); };
    DirectiveListeningDomEvent.prototype.onWindowEvent = function (eventType) { this.eventTypes.push('window_' + eventType); };
    DirectiveListeningDomEvent.prototype.onDocumentEvent = function (eventType) { this.eventTypes.push('document_' + eventType); };
    DirectiveListeningDomEvent.prototype.onBodyEvent = function (eventType) { this.eventTypes.push('body_' + eventType); };
    return DirectiveListeningDomEvent;
}());
DirectiveListeningDomEvent = __decorate([
    metadata_1.Directive({
        selector: '[listener]',
        host: {
            '(domEvent)': 'onEvent($event.type)',
            '(window:domEvent)': 'onWindowEvent($event.type)',
            '(document:domEvent)': 'onDocumentEvent($event.type)',
            '(body:domEvent)': 'onBodyEvent($event.type)'
        }
    })
], DirectiveListeningDomEvent);
var globalCounter = 0;
var DirectiveListeningDomEventOther = (function () {
    function DirectiveListeningDomEventOther() {
        this.eventType = '';
    }
    DirectiveListeningDomEventOther.prototype.onEvent = function (eventType) {
        globalCounter++;
        this.eventType = 'other_' + eventType;
    };
    return DirectiveListeningDomEventOther;
}());
DirectiveListeningDomEventOther = __decorate([
    metadata_1.Directive({ selector: '[listenerother]', host: { '(window:domEvent)': 'onEvent($event.type)' } }),
    __metadata("design:paramtypes", [])
], DirectiveListeningDomEventOther);
var DirectiveListeningDomEventPrevent = (function () {
    function DirectiveListeningDomEventPrevent() {
    }
    DirectiveListeningDomEventPrevent.prototype.onEvent = function (event) { return false; };
    return DirectiveListeningDomEventPrevent;
}());
DirectiveListeningDomEventPrevent = __decorate([
    metadata_1.Directive({ selector: '[listenerprevent]', host: { '(click)': 'onEvent($event)' } })
], DirectiveListeningDomEventPrevent);
var DirectiveListeningDomEventNoPrevent = (function () {
    function DirectiveListeningDomEventNoPrevent() {
    }
    DirectiveListeningDomEventNoPrevent.prototype.onEvent = function (event) { return true; };
    return DirectiveListeningDomEventNoPrevent;
}());
DirectiveListeningDomEventNoPrevent = __decorate([
    metadata_1.Directive({ selector: '[listenernoprevent]', host: { '(click)': 'onEvent($event)' } })
], DirectiveListeningDomEventNoPrevent);
var IdDir = (function () {
    function IdDir() {
    }
    return IdDir;
}());
IdDir = __decorate([
    metadata_1.Directive({ selector: '[id]', inputs: ['id'] })
], IdDir);
var EventDir = (function () {
    function EventDir() {
        this.customEvent = new core_1.EventEmitter();
    }
    EventDir.prototype.doSomething = function () { };
    return EventDir;
}());
__decorate([
    metadata_1.Output(),
    __metadata("design:type", Object)
], EventDir.prototype, "customEvent", void 0);
EventDir = __decorate([
    metadata_1.Directive({ selector: '[customEvent]' })
], EventDir);
var NeedsAttribute = (function () {
    function NeedsAttribute(typeAttribute, staticAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.staticAttribute = staticAttribute;
        this.fooAttribute = fooAttribute;
    }
    return NeedsAttribute;
}());
NeedsAttribute = __decorate([
    metadata_1.Directive({ selector: '[static]' }),
    __param(0, metadata_1.Attribute('type')), __param(1, metadata_1.Attribute('static')),
    __param(2, metadata_1.Attribute('foo')),
    __metadata("design:paramtypes", [String, String, String])
], NeedsAttribute);
var PublicApi = (function () {
    function PublicApi() {
    }
    return PublicApi;
}());
PublicApi = __decorate([
    core_1.Injectable()
], PublicApi);
var PrivateImpl = PrivateImpl_1 = (function (_super) {
    __extends(PrivateImpl, _super);
    function PrivateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PrivateImpl;
}(PublicApi));
PrivateImpl = PrivateImpl_1 = __decorate([
    metadata_1.Directive({
        selector: '[public-api]',
        providers: [{ provide: PublicApi, useExisting: PrivateImpl_1, deps: [] }]
    })
], PrivateImpl);
var NeedsPublicApi = (function () {
    function NeedsPublicApi(api) {
        matchers_1.expect(api instanceof PrivateImpl).toBe(true);
    }
    return NeedsPublicApi;
}());
NeedsPublicApi = __decorate([
    metadata_1.Directive({ selector: '[needs-public-api]' }),
    __param(0, core_1.Host()),
    __metadata("design:paramtypes", [PublicApi])
], NeedsPublicApi);
var ToolbarContext = (function () {
    function ToolbarContext(toolbarProp) {
        this.toolbarProp = toolbarProp;
    }
    return ToolbarContext;
}());
var ToolbarPart = (function () {
    function ToolbarPart(templateRef) {
        this.templateRef = templateRef;
    }
    return ToolbarPart;
}());
ToolbarPart = __decorate([
    metadata_1.Directive({ selector: '[toolbarpart]' }),
    __metadata("design:paramtypes", [template_ref_1.TemplateRef])
], ToolbarPart);
var ToolbarViewContainer = (function () {
    function ToolbarViewContainer(vc) {
        this.vc = vc;
    }
    Object.defineProperty(ToolbarViewContainer.prototype, "toolbarVc", {
        set: function (part) {
            this.vc.createEmbeddedView(part.templateRef, new ToolbarContext('From toolbar'), 0);
        },
        enumerable: true,
        configurable: true
    });
    return ToolbarViewContainer;
}());
ToolbarViewContainer = __decorate([
    metadata_1.Directive({ selector: '[toolbarVc]', inputs: ['toolbarVc'] }),
    __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
], ToolbarViewContainer);
var ToolbarComponent = (function () {
    function ToolbarComponent() {
        this.ctxProp = 'hello world';
    }
    return ToolbarComponent;
}());
__decorate([
    metadata_1.ContentChildren(ToolbarPart),
    __metadata("design:type", query_list_1.QueryList)
], ToolbarComponent.prototype, "query", void 0);
ToolbarComponent = __decorate([
    metadata_1.Component({
        selector: 'toolbar',
        template: 'TOOLBAR(<div *ngFor="let  part of query" [toolbarVc]="part"></div>)',
    }),
    __metadata("design:paramtypes", [])
], ToolbarComponent);
var DirectiveWithTwoWayBinding = (function () {
    function DirectiveWithTwoWayBinding() {
        this.controlChange = new core_1.EventEmitter();
        this.control = null;
    }
    DirectiveWithTwoWayBinding.prototype.triggerChange = function (value) { this.controlChange.emit(value); };
    return DirectiveWithTwoWayBinding;
}());
DirectiveWithTwoWayBinding = __decorate([
    metadata_1.Directive({ selector: '[two-way]', inputs: ['control'], outputs: ['controlChange'] })
], DirectiveWithTwoWayBinding);
var InjectableService = (function () {
    function InjectableService() {
    }
    return InjectableService;
}());
InjectableService = __decorate([
    core_1.Injectable()
], InjectableService);
function createInjectableWithLogging(inj) {
    inj.get(ComponentProvidingLoggingInjectable).created = true;
    return new InjectableService();
}
var ComponentProvidingLoggingInjectable = (function () {
    function ComponentProvidingLoggingInjectable() {
        this.created = false;
    }
    return ComponentProvidingLoggingInjectable;
}());
ComponentProvidingLoggingInjectable = __decorate([
    metadata_1.Component({
        selector: 'component-providing-logging-injectable',
        providers: [{ provide: InjectableService, useFactory: createInjectableWithLogging, deps: [core_1.Injector] }],
        template: ''
    })
], ComponentProvidingLoggingInjectable);
var DirectiveProvidingInjectable = (function () {
    function DirectiveProvidingInjectable() {
    }
    return DirectiveProvidingInjectable;
}());
DirectiveProvidingInjectable = __decorate([
    metadata_1.Directive({ selector: 'directive-providing-injectable', providers: [[InjectableService]] })
], DirectiveProvidingInjectable);
var DirectiveProvidingInjectableInView = (function () {
    function DirectiveProvidingInjectableInView() {
    }
    return DirectiveProvidingInjectableInView;
}());
DirectiveProvidingInjectableInView = __decorate([
    metadata_1.Component({
        selector: 'directive-providing-injectable',
        viewProviders: [[InjectableService]],
        template: ''
    })
], DirectiveProvidingInjectableInView);
var DirectiveProvidingInjectableInHostAndView = (function () {
    function DirectiveProvidingInjectableInHostAndView() {
    }
    return DirectiveProvidingInjectableInHostAndView;
}());
DirectiveProvidingInjectableInHostAndView = __decorate([
    metadata_1.Component({
        selector: 'directive-providing-injectable',
        providers: [{ provide: InjectableService, useValue: 'host' }],
        viewProviders: [{ provide: InjectableService, useValue: 'view' }],
        template: ''
    })
], DirectiveProvidingInjectableInHostAndView);
var DirectiveConsumingInjectable = (function () {
    function DirectiveConsumingInjectable(injectable) {
        this.injectable = injectable;
    }
    return DirectiveConsumingInjectable;
}());
DirectiveConsumingInjectable = __decorate([
    metadata_1.Component({ selector: 'directive-consuming-injectable', template: '' }),
    __param(0, core_1.Host()), __param(0, core_1.Inject(InjectableService)),
    __metadata("design:paramtypes", [Object])
], DirectiveConsumingInjectable);
var DirectiveContainingDirectiveConsumingAnInjectable = (function () {
    function DirectiveContainingDirectiveConsumingAnInjectable() {
    }
    return DirectiveContainingDirectiveConsumingAnInjectable;
}());
DirectiveContainingDirectiveConsumingAnInjectable = __decorate([
    metadata_1.Component({ selector: 'directive-containing-directive-consuming-an-injectable' })
], DirectiveContainingDirectiveConsumingAnInjectable);
var DirectiveConsumingInjectableUnbounded = (function () {
    function DirectiveConsumingInjectableUnbounded(injectable, parent) {
        this.injectable = injectable;
        parent.directive = this;
    }
    return DirectiveConsumingInjectableUnbounded;
}());
DirectiveConsumingInjectableUnbounded = __decorate([
    metadata_1.Component({ selector: 'directive-consuming-injectable-unbounded', template: '' }),
    __param(1, core_1.SkipSelf()),
    __metadata("design:paramtypes", [InjectableService,
        DirectiveContainingDirectiveConsumingAnInjectable])
], DirectiveConsumingInjectableUnbounded);
var EventBus = (function () {
    function EventBus(parentEventBus, name) {
        this.parentEventBus = parentEventBus;
        this.name = name;
    }
    return EventBus;
}());
var GrandParentProvidingEventBus = (function () {
    function GrandParentProvidingEventBus(bus) {
        this.bus = bus;
    }
    return GrandParentProvidingEventBus;
}());
GrandParentProvidingEventBus = __decorate([
    metadata_1.Directive({
        selector: 'grand-parent-providing-event-bus',
        providers: [{ provide: EventBus, useValue: new EventBus(null, 'grandparent') }]
    }),
    __metadata("design:paramtypes", [EventBus])
], GrandParentProvidingEventBus);
function createParentBus(peb) {
    return new EventBus(peb, 'parent');
}
var ParentProvidingEventBus = (function () {
    function ParentProvidingEventBus(bus, grandParentBus) {
        this.bus = bus;
        this.grandParentBus = grandParentBus;
    }
    return ParentProvidingEventBus;
}());
ParentProvidingEventBus = __decorate([
    metadata_1.Component({
        selector: 'parent-providing-event-bus',
        providers: [{ provide: EventBus, useFactory: createParentBus, deps: [[EventBus, new core_1.SkipSelf()]] }],
        template: "<child-consuming-event-bus></child-consuming-event-bus>"
    }),
    __param(1, core_1.SkipSelf()),
    __metadata("design:paramtypes", [EventBus, EventBus])
], ParentProvidingEventBus);
var ChildConsumingEventBus = (function () {
    function ChildConsumingEventBus(bus) {
        this.bus = bus;
    }
    return ChildConsumingEventBus;
}());
ChildConsumingEventBus = __decorate([
    metadata_1.Directive({ selector: 'child-consuming-event-bus' }),
    __param(0, core_1.SkipSelf()),
    __metadata("design:paramtypes", [EventBus])
], ChildConsumingEventBus);
var SomeImperativeViewport = (function () {
    function SomeImperativeViewport(vc, templateRef, anchor) {
        this.vc = vc;
        this.templateRef = templateRef;
        this.view = null;
        this.anchor = anchor;
    }
    Object.defineProperty(SomeImperativeViewport.prototype, "someImpvp", {
        set: function (value) {
            if (this.view) {
                this.vc.clear();
                this.view = null;
            }
            if (value) {
                this.view = this.vc.createEmbeddedView(this.templateRef);
                var nodes = this.view.rootNodes;
                for (var i = 0; i < nodes.length; i++) {
                    dom_adapter_1.getDOM().appendChild(this.anchor, nodes[i]);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return SomeImperativeViewport;
}());
SomeImperativeViewport = __decorate([
    metadata_1.Directive({ selector: '[someImpvp]', inputs: ['someImpvp'] }),
    __param(2, core_1.Inject(ANCHOR_ELEMENT)),
    __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, template_ref_1.TemplateRef, Object])
], SomeImperativeViewport);
var ExportDir = (function () {
    function ExportDir() {
    }
    return ExportDir;
}());
ExportDir = __decorate([
    metadata_1.Directive({ selector: '[export-dir]', exportAs: 'dir' })
], ExportDir);
var ComponentWithoutView = (function () {
    function ComponentWithoutView() {
    }
    return ComponentWithoutView;
}());
ComponentWithoutView = __decorate([
    metadata_1.Component({ selector: 'comp' })
], ComponentWithoutView);
var DuplicateDir = (function () {
    function DuplicateDir(elRef) {
        dom_adapter_1.getDOM().setText(elRef.nativeElement, dom_adapter_1.getDOM().getText(elRef.nativeElement) + 'noduplicate');
    }
    return DuplicateDir;
}());
DuplicateDir = __decorate([
    metadata_1.Directive({ selector: '[no-duplicate]' }),
    __metadata("design:paramtypes", [element_ref_1.ElementRef])
], DuplicateDir);
var OtherDuplicateDir = (function () {
    function OtherDuplicateDir(elRef) {
        dom_adapter_1.getDOM().setText(elRef.nativeElement, dom_adapter_1.getDOM().getText(elRef.nativeElement) + 'othernoduplicate');
    }
    return OtherDuplicateDir;
}());
OtherDuplicateDir = __decorate([
    metadata_1.Directive({ selector: '[no-duplicate]' }),
    __metadata("design:paramtypes", [element_ref_1.ElementRef])
], OtherDuplicateDir);
var DirectiveThrowingAnError = (function () {
    function DirectiveThrowingAnError() {
        throw new Error('BOOM');
    }
    return DirectiveThrowingAnError;
}());
DirectiveThrowingAnError = __decorate([
    metadata_1.Directive({ selector: 'directive-throwing-error' }),
    __metadata("design:paramtypes", [])
], DirectiveThrowingAnError);
var ComponentWithTemplate = (function () {
    function ComponentWithTemplate() {
        this.items = [1, 2, 3];
    }
    return ComponentWithTemplate;
}());
ComponentWithTemplate = __decorate([
    metadata_1.Component({
        selector: 'component-with-template',
        template: "No View Decorator: <div *ngFor=\"let item of items\">{{item}}</div>"
    })
], ComponentWithTemplate);
var DirectiveWithPropDecorators = (function () {
    function DirectiveWithPropDecorators() {
        this.event = new core_1.EventEmitter();
    }
    DirectiveWithPropDecorators.prototype.onClick = function (target) { this.target = target; };
    DirectiveWithPropDecorators.prototype.fireEvent = function (msg) { this.event.emit(msg); };
    return DirectiveWithPropDecorators;
}());
__decorate([
    metadata_1.Input('elProp'),
    __metadata("design:type", String)
], DirectiveWithPropDecorators.prototype, "dirProp", void 0);
__decorate([
    metadata_1.Output('elEvent'),
    __metadata("design:type", Object)
], DirectiveWithPropDecorators.prototype, "event", void 0);
__decorate([
    metadata_1.HostBinding('attr.my-attr'),
    __metadata("design:type", String)
], DirectiveWithPropDecorators.prototype, "myAttr", void 0);
__decorate([
    metadata_1.HostListener('click', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DirectiveWithPropDecorators.prototype, "onClick", null);
DirectiveWithPropDecorators = __decorate([
    metadata_1.Directive({ selector: 'with-prop-decorators' })
], DirectiveWithPropDecorators);
var SomeCmp = (function () {
    function SomeCmp() {
    }
    return SomeCmp;
}());
SomeCmp = __decorate([
    metadata_1.Component({ selector: 'some-cmp' })
], SomeCmp);
var ParentCmp = (function () {
    function ParentCmp() {
        this.name = 'hello';
    }
    return ParentCmp;
}());
ParentCmp = __decorate([
    metadata_1.Component({
        selector: 'parent-cmp',
        template: "<cmp [test$]=\"name\"></cmp>",
    })
], ParentCmp);
exports.ParentCmp = ParentCmp;
var SomeCmpWithInput = (function () {
    function SomeCmpWithInput() {
    }
    return SomeCmpWithInput;
}());
__decorate([
    metadata_1.Input(),
    __metadata("design:type", Object)
], SomeCmpWithInput.prototype, "test$", void 0);
SomeCmpWithInput = __decorate([
    metadata_1.Component({ selector: 'cmp', template: '' })
], SomeCmpWithInput);
var PrivateImpl_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBNkM7QUFDN0Msc0NBQThOO0FBQzlOLHdGQUE4SDtBQUM5SCxtREFBeUQ7QUFDekQsa0dBQTZGO0FBQzdGLG9FQUFnRTtBQUNoRSxrRUFBOEQ7QUFDOUQsc0VBQWtFO0FBQ2xFLGtGQUE2RTtBQUU3RSx1REFBNEk7QUFDNUksaURBQWtGO0FBQ2xGLDZFQUFxRTtBQUNyRSwyRUFBc0U7QUFDdEUsbUZBQXFGO0FBQ3JGLDJFQUFzRTtBQUV0RSx1Q0FBeUM7QUFFekMsSUFBTSxjQUFjLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTNEO0lBQ0UsUUFBUSxDQUFDLEtBQUssRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekQsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUpELG9CQUlDO0FBR0Qsc0JBQXNCLEVBQTJCO1FBQTFCLGtCQUFNO0lBQzNCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUU1QixVQUFVLENBQUMsY0FBUSxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0QsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1lBQ2xDLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsaUJBQU8sQ0FB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