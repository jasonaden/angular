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
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
function main() {
    describe('Query API', function () {
        beforeEach(function () { return testing_1.TestBed.configureTestingModule({
            declarations: [
                MyComp0,
                NeedsQuery,
                NeedsQueryDesc,
                NeedsQueryByLabel,
                NeedsQueryByTwoLabels,
                NeedsQueryAndProject,
                NeedsViewQuery,
                NeedsViewQueryIf,
                NeedsViewQueryNestedIf,
                NeedsViewQueryOrder,
                NeedsViewQueryByLabel,
                NeedsViewQueryOrderWithParent,
                NeedsContentChildren,
                NeedsViewChildren,
                NeedsViewChild,
                NeedsStaticContentAndViewChild,
                NeedsContentChild,
                NeedsTpl,
                NeedsNamedTpl,
                TextDirective,
                InertDirective,
                NeedsFourQueries,
                NeedsContentChildrenWithRead,
                NeedsContentChildWithRead,
                NeedsViewChildrenWithRead,
                NeedsViewChildWithRead,
                NeedsContentChildTemplateRef,
                NeedsContentChildTemplateRefApp,
                NeedsViewContainerWithRead,
                ManualProjecting
            ]
        }); });
        describe('querying by directive type', function () {
            it('should contain all direct child directives in the light dom (constructor)', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div text="3">' +
                    '<div text="too-deep"></div>' +
                    '</div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should contain all direct child directives in the content dom', function () {
                var template = '<needs-content-children #q><div text="foo"></div></needs-content-children>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.detectChanges();
                matchers_1.expect(q.textDirChildren.length).toEqual(1);
                matchers_1.expect(q.numberOfChildrenAfterContentInit).toEqual(1);
            });
            it('should contain the first content child', function () {
                var template = '<needs-content-child #q><div *ngIf="shouldShow" text="foo"></div></needs-content-child>';
                var view = createTestCmp(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([
                    ['setter', 'foo'], ['init', 'foo'], ['check', 'foo'], ['setter', null], ['check', null]
                ]);
            });
            it('should contain the first view child', function () {
                var template = '<needs-view-child #q></needs-view-child>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                q.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([
                    ['setter', 'foo'], ['init', 'foo'], ['check', 'foo'], ['setter', null], ['check', null]
                ]);
            });
            it('should set static view and content children already after the constructor call', function () {
                var template = '<needs-static-content-view-child #q><div text="contentFoo"></div></needs-static-content-view-child>';
                var view = createTestCmp(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.contentChild.text).toBeFalsy();
                matchers_1.expect(q.viewChild.text).toBeFalsy();
                view.detectChanges();
                matchers_1.expect(q.contentChild.text).toEqual('contentFoo');
                matchers_1.expect(q.viewChild.text).toEqual('viewFoo');
            });
            it('should contain the first view child across embedded views', function () {
                testing_1.TestBed.overrideComponent(MyComp0, { set: { template: '<needs-view-child #q></needs-view-child>' } });
                testing_1.TestBed.overrideComponent(NeedsViewChild, {
                    set: {
                        template: '<div *ngIf="true"><div *ngIf="shouldShow" text="foo"></div></div><div *ngIf="shouldShow2" text="bar"></div>'
                    }
                });
                var view = testing_1.TestBed.createComponent(MyComp0);
                view.detectChanges();
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                q.shouldShow = false;
                q.shouldShow2 = true;
                q.logs = [];
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([['setter', 'bar'], ['check', 'bar']]);
                q.shouldShow = false;
                q.shouldShow2 = false;
                q.logs = [];
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([['setter', null], ['check', null]]);
            });
            it('should contain all directives in the light dom when descendants flag is used', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query-desc text="2"><div text="3">' +
                    '<div text="4"></div>' +
                    '</div></needs-query-desc>' +
                    '<div text="5"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|4|');
            });
            it('should contain all directives in the light dom', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div text="3"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should reflect dynamically inserted directives', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngIf="shouldShow" [text]="\'3\'"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|');
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should be cleanly destroyed when a query crosses view boundaries', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngIf="shouldShow" [text]="\'3\'"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                view.destroy();
            });
            it('should reflect moved directives', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngFor="let  i of list" [text]="i"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|1d|2d|3d|');
                view.componentInstance.list = ['3d', '2d'];
                view.detectChanges();
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3d|2d|');
            });
            it('should throw with descriptive error when query selectors are not present', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyCompBroken0, HasNullQueryCondition] });
                var template = '<has-null-query-condition></has-null-query-condition>';
                testing_1.TestBed.overrideComponent(MyCompBroken0, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyCompBroken0); })
                    .toThrowError("Can't construct a query for the property \"errorTrigger\" of \"" + util_1.stringify(HasNullQueryCondition) + "\" since the query selector wasn't defined.");
            });
        });
        describe('query for TemplateRef', function () {
            it('should find TemplateRefs in the light and shadow dom', function () {
                var template = '<needs-tpl><ng-template><div>light</div></ng-template></needs-tpl>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var needsTpl = view.debugElement.children[0].injector.get(NeedsTpl);
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.query.first).rootNodes[0])
                    .toHaveText('light');
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.viewQuery.first).rootNodes[0])
                    .toHaveText('shadow');
            });
            it('should find named TemplateRefs', function () {
                var template = '<needs-named-tpl><ng-template #tpl><div>light</div></ng-template></needs-named-tpl>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var needsTpl = view.debugElement.children[0].injector.get(NeedsNamedTpl);
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.contentTpl).rootNodes[0])
                    .toHaveText('light');
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.viewTpl).rootNodes[0]).toHaveText('shadow');
            });
        });
        describe('read a different token', function () {
            it('should contain all content children', function () {
                var template = '<needs-content-children-read #q text="ca"><div #q text="cb"></div></needs-content-children-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildrenWithRead);
                matchers_1.expect(comp.textDirChildren.map(function (textDirective) { return textDirective.text; })).toEqual(['ca', 'cb']);
            });
            it('should contain the first content child', function () {
                var template = '<needs-content-child-read><div #q text="ca"></div></needs-content-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('ca');
            });
            it('should contain the first descendant content child', function () {
                var template = '<needs-content-child-read>' +
                    '<div dir><div #q text="ca"></div></div>' +
                    '</needs-content-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('ca');
            });
            it('should contain the first descendant content child templateRef', function () {
                var template = '<needs-content-child-template-ref-app>' +
                    '</needs-content-child-template-ref-app>';
                var view = createTestCmp(MyComp0, template);
                // can't execute checkNoChanges as our view modifies our content children (via a query).
                view.detectChanges(false);
                matchers_1.expect(view.nativeElement).toHaveText('OUTER');
            });
            it('should contain the first view child', function () {
                var template = '<needs-view-child-read></needs-view-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('va');
            });
            it('should contain all child directives in the view', function () {
                var template = '<needs-view-children-read></needs-view-children-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewChildrenWithRead);
                matchers_1.expect(comp.textDirChildren.map(function (textDirective) { return textDirective.text; })).toEqual(['va', 'vb']);
            });
            it('should support reading a ViewContainer', function () {
                var template = '<needs-viewcontainer-read><ng-template>hello</ng-template></needs-viewcontainer-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewContainerWithRead);
                comp.createView();
                matchers_1.expect(view.debugElement.children[0].nativeElement).toHaveText('hello');
            });
        });
        describe('changes', function () {
            it('should notify query on change', testing_1.async(function () {
                var template = '<needs-query #q>' +
                    '<div text="1"></div>' +
                    '<div *ngIf="shouldShow" text="2"></div>' +
                    '</needs-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                q.query.changes.subscribe({
                    next: function () {
                        matchers_1.expect(q.query.first.text).toEqual('1');
                        matchers_1.expect(q.query.last.text).toEqual('2');
                    }
                });
                view.componentInstance.shouldShow = true;
                view.detectChanges();
            }));
            it('should correctly clean-up when destroyed together with the directives it is querying', function () {
                var template = '<needs-query #q *ngIf="shouldShow"><div text="foo"></div></needs-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toEqual(1);
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var q2 = view.debugElement.children[0].references['q'];
                matchers_1.expect(q2.query.length).toEqual(1);
            });
        });
        describe('querying by var binding', function () {
            it('should contain all the child directives in the light dom with the given var binding', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list" [text]="item" #textLabel="textDir"></div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                matchers_1.expect(q.query.first.text).toEqual('1d');
                matchers_1.expect(q.query.last.text).toEqual('2d');
            });
            it('should support querying by multiple var bindings', function () {
                var template = '<needs-query-by-ref-bindings #q>' +
                    '<div text="one" #textLabel1="textDir"></div>' +
                    '<div text="two" #textLabel2="textDir"></div>' +
                    '</needs-query-by-ref-bindings>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.first.text).toEqual('one');
                matchers_1.expect(q.query.last.text).toEqual('two');
            });
            it('should support dynamically inserted directives', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list" [text]="item" #textLabel="textDir"></div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                view.componentInstance.list = ['2d', '1d'];
                view.detectChanges();
                matchers_1.expect(q.query.last.text).toEqual('1d');
            });
            it('should contain all the elements in the light dom with the given var binding', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list">' +
                    '<div #textLabel>{{item}}</div>' +
                    '</div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                matchers_1.expect(q.query.first.nativeElement).toHaveText('1d');
                matchers_1.expect(q.query.last.nativeElement).toHaveText('2d');
            });
            it('should contain all the elements in the light dom even if they get projected', function () {
                var template = '<needs-query-and-project #q>' +
                    '<div text="hello"></div><div text="world"></div>' +
                    '</needs-query-and-project>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('hello|world|');
            });
            it('should support querying the view by using a view query', function () {
                var template = '<needs-view-query-by-ref-binding #q></needs-view-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.first.nativeElement).toHaveText('text');
            });
            it('should contain all child directives in the view dom', function () {
                var template = '<needs-view-children #q></needs-view-children>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.textDirChildren.length).toEqual(1);
                matchers_1.expect(q.numberOfChildrenAfterViewInit).toEqual(1);
            });
        });
        describe('querying in the view', function () {
            it('should contain all the elements in the view with that have the given directive', function () {
                var template = '<needs-view-query #q><div text="ignoreme"></div></needs-view-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
            });
            it('should not include directive present on the host element', function () {
                var template = '<needs-view-query #q text="self"></needs-view-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
            });
            it('should reflect changes in the component', function () {
                var template = '<needs-view-query-if #q></needs-view-query-if>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                q.show = true;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
            });
            it('should not be affected by other changes in the component', function () {
                var template = '<needs-view-query-nested-if #q></needs-view-query-nested-if>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toEqual(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
                q.show = false;
                view.detectChanges();
                matchers_1.expect(q.query.length).toEqual(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
            });
            it('should maintain directives in pre-order depth-first DOM order after dynamic insertion', function () {
                var template = '<needs-view-query-order #q></needs-view-query-order>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
                q.list = ['-3', '2'];
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '-3', '2', '4']);
            });
            it('should maintain directives in pre-order depth-first DOM order after dynamic insertion', function () {
                var template = '<needs-view-query-order-with-p #q></needs-view-query-order-with-p>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
                q.list = ['-3', '2'];
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '-3', '2', '4']);
            });
            it('should handle long ngFor cycles', function () {
                var template = '<needs-view-query-order #q></needs-view-query-order>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                // no significance to 50, just a reasonably large cycle.
                for (var i = 0; i < 50; i++) {
                    var newString = i.toString();
                    q.list = [newString];
                    view.detectChanges();
                    matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', newString, '4']);
                }
            });
            it('should support more than three queries', function () {
                var template = '<needs-four-queries #q><div text="1"></div></needs-four-queries>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query1).toBeDefined();
                matchers_1.expect(q.query2).toBeDefined();
                matchers_1.expect(q.query3).toBeDefined();
                matchers_1.expect(q.query4).toBeDefined();
            });
        });
        describe('query over moved templates', function () {
            it('should include manually projected templates in queries', function () {
                var template = '<manual-projecting #q><ng-template><div text="1"></div></ng-template></manual-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                q.create();
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1']);
                q.destroy();
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(0);
            });
            // Note: This tests is just document our current behavior, which we do
            // for performance reasons.
            it('should not affected queries for projected templates if views are detached or moved', function () {
                var template = '<manual-projecting #q><ng-template let-x="x"><div [text]="x"></div></ng-template></manual-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                var view1 = q.vc.createEmbeddedView(q.template, { 'x': '1' });
                var view2 = q.vc.createEmbeddedView(q.template, { 'x': '2' });
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
                q.vc.detach(1);
                q.vc.detach(0);
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
                q.vc.insert(view2);
                q.vc.insert(view1);
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
            });
            it('should remove manually projected templates if their parent view is destroyed', function () {
                var template = "\n          <manual-projecting #q><ng-template #tpl><div text=\"1\"></div></ng-template></manual-projecting>\n          <div *ngIf=\"shouldShow\">\n            <ng-container [ngTemplateOutlet]=\"tpl\"></ng-container>\n          </div>\n        ";
                var view = createTestCmp(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(1);
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(0);
            });
            it('should not throw if a content template is queried and created in the view during change detection', function () {
                var AutoProjecting = (function () {
                    function AutoProjecting() {
                    }
                    return AutoProjecting;
                }());
                __decorate([
                    core_1.ContentChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], AutoProjecting.prototype, "content", void 0);
                __decorate([
                    core_1.ContentChildren(TextDirective),
                    __metadata("design:type", core_1.QueryList)
                ], AutoProjecting.prototype, "query", void 0);
                AutoProjecting = __decorate([
                    core_1.Component({ selector: 'auto-projecting', template: '<div *ngIf="true; then: content"></div>' })
                ], AutoProjecting);
                testing_1.TestBed.configureTestingModule({ declarations: [AutoProjecting] });
                var template = '<auto-projecting #q><ng-template><div text="1"></div></ng-template></auto-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                // This should be 1, but due to
                // https://github.com/angular/angular/issues/15117 this is 0.
                matchers_1.expect(q.query.length).toBe(0);
            });
        });
    });
}
exports.main = main;
var TextDirective = (function () {
    function TextDirective() {
    }
    return TextDirective;
}());
TextDirective = __decorate([
    core_1.Directive({ selector: '[text]', inputs: ['text'], exportAs: 'textDir' }),
    __metadata("design:paramtypes", [])
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
var NeedsContentChild = (function () {
    function NeedsContentChild() {
        this.logs = [];
    }
    Object.defineProperty(NeedsContentChild.prototype, "child", {
        get: function () { return this._child; },
        set: function (value) {
            this._child = value;
            this.logs.push(['setter', value ? value.text : null]);
        },
        enumerable: true,
        configurable: true
    });
    NeedsContentChild.prototype.ngAfterContentInit = function () { this.logs.push(['init', this.child ? this.child.text : null]); };
    NeedsContentChild.prototype.ngAfterContentChecked = function () { this.logs.push(['check', this.child ? this.child.text : null]); };
    return NeedsContentChild;
}());
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], NeedsContentChild.prototype, "child", null);
NeedsContentChild = __decorate([
    core_1.Component({ selector: 'needs-content-child', template: '' })
], NeedsContentChild);
var NeedsViewChild = (function () {
    function NeedsViewChild() {
        this.shouldShow = true;
        this.shouldShow2 = false;
        this.logs = [];
    }
    Object.defineProperty(NeedsViewChild.prototype, "child", {
        get: function () { return this._child; },
        set: function (value) {
            this._child = value;
            this.logs.push(['setter', value ? value.text : null]);
        },
        enumerable: true,
        configurable: true
    });
    NeedsViewChild.prototype.ngAfterViewInit = function () { this.logs.push(['init', this.child ? this.child.text : null]); };
    NeedsViewChild.prototype.ngAfterViewChecked = function () { this.logs.push(['check', this.child ? this.child.text : null]); };
    return NeedsViewChild;
}());
__decorate([
    core_1.ViewChild(TextDirective),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], NeedsViewChild.prototype, "child", null);
NeedsViewChild = __decorate([
    core_1.Component({ selector: 'needs-view-child', template: "<div *ngIf=\"shouldShow\" text=\"foo\"></div>" })
], NeedsViewChild);
function createTestCmp(type, template) {
    var view = testing_1.TestBed.overrideComponent(type, { set: { template: template } }).createComponent(type);
    return view;
}
function createTestCmpAndDetectChanges(type, template) {
    var view = createTestCmp(type, template);
    view.detectChanges();
    return view;
}
var NeedsStaticContentAndViewChild = (function () {
    function NeedsStaticContentAndViewChild() {
    }
    return NeedsStaticContentAndViewChild;
}());
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsStaticContentAndViewChild.prototype, "contentChild", void 0);
__decorate([
    core_1.ViewChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsStaticContentAndViewChild.prototype, "viewChild", void 0);
NeedsStaticContentAndViewChild = __decorate([
    core_1.Component({ selector: 'needs-static-content-view-child', template: "<div text=\"viewFoo\"></div>" })
], NeedsStaticContentAndViewChild);
var InertDirective = (function () {
    function InertDirective() {
    }
    return InertDirective;
}());
InertDirective = __decorate([
    core_1.Directive({ selector: '[dir]' })
], InertDirective);
var NeedsQuery = (function () {
    function NeedsQuery() {
    }
    return NeedsQuery;
}());
__decorate([
    core_1.ContentChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsQuery.prototype, "query", void 0);
NeedsQuery = __decorate([
    core_1.Component({
        selector: 'needs-query',
        template: '<div text="ignoreme"></div><b *ngFor="let  dir of query">{{dir.text}}|</b>'
    })
], NeedsQuery);
var NeedsFourQueries = (function () {
    function NeedsFourQueries() {
    }
    return NeedsFourQueries;
}());
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsFourQueries.prototype, "query1", void 0);
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsFourQueries.prototype, "query2", void 0);
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsFourQueries.prototype, "query3", void 0);
__decorate([
    core_1.ContentChild(TextDirective),
    __metadata("design:type", TextDirective)
], NeedsFourQueries.prototype, "query4", void 0);
NeedsFourQueries = __decorate([
    core_1.Component({ selector: 'needs-four-queries', template: '' })
], NeedsFourQueries);
var NeedsQueryDesc = (function () {
    function NeedsQueryDesc() {
    }
    return NeedsQueryDesc;
}());
__decorate([
    core_1.ContentChildren(TextDirective, { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], NeedsQueryDesc.prototype, "query", void 0);
NeedsQueryDesc = __decorate([
    core_1.Component({
        selector: 'needs-query-desc',
        template: '<ng-content></ng-content><div *ngFor="let  dir of query">{{dir.text}}|</div>'
    })
], NeedsQueryDesc);
var NeedsQueryByLabel = (function () {
    function NeedsQueryByLabel() {
    }
    return NeedsQueryByLabel;
}());
__decorate([
    core_1.ContentChildren('textLabel', { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], NeedsQueryByLabel.prototype, "query", void 0);
NeedsQueryByLabel = __decorate([
    core_1.Component({ selector: 'needs-query-by-ref-binding', template: '<ng-content>' })
], NeedsQueryByLabel);
var NeedsViewQueryByLabel = (function () {
    function NeedsViewQueryByLabel() {
    }
    return NeedsViewQueryByLabel;
}());
__decorate([
    core_1.ViewChildren('textLabel'),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQueryByLabel.prototype, "query", void 0);
NeedsViewQueryByLabel = __decorate([
    core_1.Component({ selector: 'needs-view-query-by-ref-binding', template: '<div #textLabel>text</div>' })
], NeedsViewQueryByLabel);
var NeedsQueryByTwoLabels = (function () {
    function NeedsQueryByTwoLabels() {
    }
    return NeedsQueryByTwoLabels;
}());
__decorate([
    core_1.ContentChildren('textLabel1,textLabel2', { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], NeedsQueryByTwoLabels.prototype, "query", void 0);
NeedsQueryByTwoLabels = __decorate([
    core_1.Component({ selector: 'needs-query-by-ref-bindings', template: '<ng-content>' })
], NeedsQueryByTwoLabels);
var NeedsQueryAndProject = (function () {
    function NeedsQueryAndProject() {
    }
    return NeedsQueryAndProject;
}());
__decorate([
    core_1.ContentChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsQueryAndProject.prototype, "query", void 0);
NeedsQueryAndProject = __decorate([
    core_1.Component({
        selector: 'needs-query-and-project',
        template: '<div *ngFor="let  dir of query">{{dir.text}}|</div><ng-content></ng-content>'
    })
], NeedsQueryAndProject);
var NeedsViewQuery = (function () {
    function NeedsViewQuery() {
    }
    return NeedsViewQuery;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQuery.prototype, "query", void 0);
NeedsViewQuery = __decorate([
    core_1.Component({
        selector: 'needs-view-query',
        template: '<div text="1"><div text="2"></div></div><div text="3"></div><div text="4"></div>'
    })
], NeedsViewQuery);
var NeedsViewQueryIf = (function () {
    function NeedsViewQueryIf() {
        this.show = false;
    }
    return NeedsViewQueryIf;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQueryIf.prototype, "query", void 0);
NeedsViewQueryIf = __decorate([
    core_1.Component({ selector: 'needs-view-query-if', template: '<div *ngIf="show" text="1"></div>' })
], NeedsViewQueryIf);
var NeedsViewQueryNestedIf = (function () {
    function NeedsViewQueryNestedIf() {
        this.show = true;
    }
    return NeedsViewQueryNestedIf;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQueryNestedIf.prototype, "query", void 0);
NeedsViewQueryNestedIf = __decorate([
    core_1.Component({
        selector: 'needs-view-query-nested-if',
        template: '<div text="1"><div *ngIf="show"><div dir></div></div></div>'
    })
], NeedsViewQueryNestedIf);
var NeedsViewQueryOrder = (function () {
    function NeedsViewQueryOrder() {
        this.list = ['2', '3'];
    }
    return NeedsViewQueryOrder;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQueryOrder.prototype, "query", void 0);
NeedsViewQueryOrder = __decorate([
    core_1.Component({
        selector: 'needs-view-query-order',
        template: '<div text="1"></div>' +
            '<div *ngFor="let  i of list" [text]="i"></div>' +
            '<div text="4"></div>'
    })
], NeedsViewQueryOrder);
var NeedsViewQueryOrderWithParent = (function () {
    function NeedsViewQueryOrderWithParent() {
        this.list = ['2', '3'];
    }
    return NeedsViewQueryOrderWithParent;
}());
__decorate([
    core_1.ViewChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], NeedsViewQueryOrderWithParent.prototype, "query", void 0);
NeedsViewQueryOrderWithParent = __decorate([
    core_1.Component({
        selector: 'needs-view-query-order-with-p',
        template: '<div dir><div text="1"></div>' +
            '<div *ngFor="let  i of list" [text]="i"></div>' +
            '<div text="4"></div></div>'
    })
], NeedsViewQueryOrderWithParent);
var NeedsTpl = (function () {
    function NeedsTpl(vc) {
        this.vc = vc;
    }
    return NeedsTpl;
}());
__decorate([
    core_1.ViewChildren(core_1.TemplateRef),
    __metadata("design:type", core_1.QueryList)
], NeedsTpl.prototype, "viewQuery", void 0);
__decorate([
    core_1.ContentChildren(core_1.TemplateRef),
    __metadata("design:type", core_1.QueryList)
], NeedsTpl.prototype, "query", void 0);
NeedsTpl = __decorate([
    core_1.Component({ selector: 'needs-tpl', template: '<ng-template><div>shadow</div></ng-template>' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef])
], NeedsTpl);
var NeedsNamedTpl = (function () {
    function NeedsNamedTpl(vc) {
        this.vc = vc;
    }
    return NeedsNamedTpl;
}());
__decorate([
    core_1.ViewChild('tpl'),
    __metadata("design:type", core_1.TemplateRef)
], NeedsNamedTpl.prototype, "viewTpl", void 0);
__decorate([
    core_1.ContentChild('tpl'),
    __metadata("design:type", core_1.TemplateRef)
], NeedsNamedTpl.prototype, "contentTpl", void 0);
NeedsNamedTpl = __decorate([
    core_1.Component({ selector: 'needs-named-tpl', template: '<ng-template #tpl><div>shadow</div></ng-template>' }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef])
], NeedsNamedTpl);
var NeedsContentChildrenWithRead = (function () {
    function NeedsContentChildrenWithRead() {
    }
    return NeedsContentChildrenWithRead;
}());
__decorate([
    core_1.ContentChildren('q', { read: TextDirective }),
    __metadata("design:type", core_1.QueryList)
], NeedsContentChildrenWithRead.prototype, "textDirChildren", void 0);
__decorate([
    core_1.ContentChildren('nonExisting', { read: TextDirective }),
    __metadata("design:type", core_1.QueryList)
], NeedsContentChildrenWithRead.prototype, "nonExistingVar", void 0);
NeedsContentChildrenWithRead = __decorate([
    core_1.Component({ selector: 'needs-content-children-read', template: '' })
], NeedsContentChildrenWithRead);
var NeedsContentChildWithRead = (function () {
    function NeedsContentChildWithRead() {
    }
    return NeedsContentChildWithRead;
}());
__decorate([
    core_1.ContentChild('q', { read: TextDirective }),
    __metadata("design:type", TextDirective)
], NeedsContentChildWithRead.prototype, "textDirChild", void 0);
__decorate([
    core_1.ContentChild('nonExisting', { read: TextDirective }),
    __metadata("design:type", TextDirective)
], NeedsContentChildWithRead.prototype, "nonExistingVar", void 0);
NeedsContentChildWithRead = __decorate([
    core_1.Component({ selector: 'needs-content-child-read', template: '' })
], NeedsContentChildWithRead);
var NeedsContentChildTemplateRef = (function () {
    function NeedsContentChildTemplateRef() {
    }
    return NeedsContentChildTemplateRef;
}());
__decorate([
    core_1.ContentChild(core_1.TemplateRef),
    __metadata("design:type", core_1.TemplateRef)
], NeedsContentChildTemplateRef.prototype, "templateRef", void 0);
NeedsContentChildTemplateRef = __decorate([
    core_1.Component({
        selector: 'needs-content-child-template-ref',
        template: '<div [ngTemplateOutlet]="templateRef"></div>'
    })
], NeedsContentChildTemplateRef);
var NeedsContentChildTemplateRefApp = (function () {
    function NeedsContentChildTemplateRefApp() {
    }
    return NeedsContentChildTemplateRefApp;
}());
NeedsContentChildTemplateRefApp = __decorate([
    core_1.Component({
        selector: 'needs-content-child-template-ref-app',
        template: '<needs-content-child-template-ref>' +
            '<ng-template>OUTER<ng-template>INNER</ng-template></ng-template>' +
            '</needs-content-child-template-ref>'
    })
], NeedsContentChildTemplateRefApp);
var NeedsViewChildrenWithRead = (function () {
    function NeedsViewChildrenWithRead() {
    }
    return NeedsViewChildrenWithRead;
}());
__decorate([
    core_1.ViewChildren('q,w', { read: TextDirective }),
    __metadata("design:type", core_1.QueryList)
], NeedsViewChildrenWithRead.prototype, "textDirChildren", void 0);
__decorate([
    core_1.ViewChildren('nonExisting', { read: TextDirective }),
    __metadata("design:type", core_1.QueryList)
], NeedsViewChildrenWithRead.prototype, "nonExistingVar", void 0);
NeedsViewChildrenWithRead = __decorate([
    core_1.Component({
        selector: 'needs-view-children-read',
        template: '<div #q text="va"></div><div #w text="vb"></div>',
    })
], NeedsViewChildrenWithRead);
var NeedsViewChildWithRead = (function () {
    function NeedsViewChildWithRead() {
    }
    return NeedsViewChildWithRead;
}());
__decorate([
    core_1.ViewChild('q', { read: TextDirective }),
    __metadata("design:type", TextDirective)
], NeedsViewChildWithRead.prototype, "textDirChild", void 0);
__decorate([
    core_1.ViewChild('nonExisting', { read: TextDirective }),
    __metadata("design:type", TextDirective)
], NeedsViewChildWithRead.prototype, "nonExistingVar", void 0);
NeedsViewChildWithRead = __decorate([
    core_1.Component({
        selector: 'needs-view-child-read',
        template: '<div #q text="va"></div>',
    })
], NeedsViewChildWithRead);
var NeedsViewContainerWithRead = (function () {
    function NeedsViewContainerWithRead() {
    }
    NeedsViewContainerWithRead.prototype.createView = function () { this.vc.createEmbeddedView(this.template); };
    return NeedsViewContainerWithRead;
}());
__decorate([
    core_1.ViewChild('q', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], NeedsViewContainerWithRead.prototype, "vc", void 0);
__decorate([
    core_1.ViewChild('nonExisting', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], NeedsViewContainerWithRead.prototype, "nonExistingVar", void 0);
__decorate([
    core_1.ContentChild(core_1.TemplateRef),
    __metadata("design:type", core_1.TemplateRef)
], NeedsViewContainerWithRead.prototype, "template", void 0);
NeedsViewContainerWithRead = __decorate([
    core_1.Component({ selector: 'needs-viewcontainer-read', template: '<div #q></div>' })
], NeedsViewContainerWithRead);
var HasNullQueryCondition = (function () {
    function HasNullQueryCondition() {
    }
    return HasNullQueryCondition;
}());
__decorate([
    core_1.ContentChildren(null),
    __metadata("design:type", Object)
], HasNullQueryCondition.prototype, "errorTrigger", void 0);
HasNullQueryCondition = __decorate([
    core_1.Component({ selector: 'has-null-query-condition', template: '<div></div>' })
], HasNullQueryCondition);
var MyComp0 = (function () {
    function MyComp0() {
        this.shouldShow = false;
        this.list = ['1d', '2d', '3d'];
    }
    return MyComp0;
}());
MyComp0 = __decorate([
    core_1.Component({ selector: 'my-comp', template: '' })
], MyComp0);
var MyCompBroken0 = (function () {
    function MyCompBroken0() {
    }
    return MyCompBroken0;
}());
MyCompBroken0 = __decorate([
    core_1.Component({ selector: 'my-comp', template: '' })
], MyCompBroken0);
var ManualProjecting = (function () {
    function ManualProjecting() {
    }
    ManualProjecting.prototype.create = function () { this.vc.createEmbeddedView(this.template); };
    ManualProjecting.prototype.destroy = function () { this.vc.clear(); };
    return ManualProjecting;
}());
__decorate([
    core_1.ContentChild(core_1.TemplateRef),
    __metadata("design:type", core_1.TemplateRef)
], ManualProjecting.prototype, "template", void 0);
__decorate([
    core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], ManualProjecting.prototype, "vc", void 0);
__decorate([
    core_1.ContentChildren(TextDirective),
    __metadata("design:type", core_1.QueryList)
], ManualProjecting.prototype, "query", void 0);
ManualProjecting = __decorate([
    core_1.Component({ selector: 'manual-projecting', template: '<div #vc></div>' })
], ManualProjecting);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvcXVlcnlfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFxUDtBQUNyUCxpREFBdUU7QUFDdkUsMkVBQXNFO0FBRXRFLHVDQUF5QztBQUV6QztJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsVUFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzlDLFlBQVksRUFBRTtnQkFDWixPQUFPO2dCQUNQLFVBQVU7Z0JBQ1YsY0FBYztnQkFDZCxpQkFBaUI7Z0JBQ2pCLHFCQUFxQjtnQkFDckIsb0JBQW9CO2dCQUNwQixjQUFjO2dCQUNkLGdCQUFnQjtnQkFDaEIsc0JBQXNCO2dCQUN0QixtQkFBbUI7Z0JBQ25CLHFCQUFxQjtnQkFDckIsNkJBQTZCO2dCQUM3QixvQkFBb0I7Z0JBQ3BCLGlCQUFpQjtnQkFDakIsY0FBYztnQkFDZCw4QkFBOEI7Z0JBQzlCLGlCQUFpQjtnQkFDakIsUUFBUTtnQkFDUixhQUFhO2dCQUNiLGFBQWE7Z0JBQ2IsY0FBYztnQkFDZCxnQkFBZ0I7Z0JBQ2hCLDRCQUE0QjtnQkFDNUIseUJBQXlCO2dCQUN6Qix5QkFBeUI7Z0JBQ3pCLHNCQUFzQjtnQkFDdEIsNEJBQTRCO2dCQUM1QiwrQkFBK0I7Z0JBQy9CLDBCQUEwQjtnQkFDMUIsZ0JBQWdCO2FBQ2pCO1NBQ0YsQ0FBQyxFQWpDZSxDQWlDZixDQUFDLENBQUM7UUFFSixRQUFRLENBQUMsNEJBQTRCLEVBQUU7WUFDckMsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO2dCQUM5RSxJQUFNLFFBQVEsR0FBRyxzQkFBc0I7b0JBQ25DLHNDQUFzQztvQkFDdEMsNkJBQTZCO29CQUM3QixzQkFBc0I7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