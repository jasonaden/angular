"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var index_1 = require("@angular/core/src/view/index");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
function main() {
    describe("Embedded Views", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function embeddedViewDef(nodes, update) {
            return function () { return index_1.viewDef(0 /* None */, nodes, update); };
        }
        function createAndGetRootNodes(viewDef, context) {
            if (context === void 0) { context = null; }
            var view = helper_1.createRootView(viewDef, context);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        it('should create embedded views with the right context', function () {
            var parentContext = new Object();
            var childContext = new Object();
            var parentView = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([index_1.elementDef(0 /* None */, null, null, 0, 'span')])),
            ]), parentContext).view;
            var childView = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1], childContext);
            expect(childView.component).toBe(parentContext);
            expect(childView.context).toBe(childContext);
        });
        it('should attach and detach embedded views', function () {
            var _a = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 2, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                    index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.anchorDef(0 /* None */, null, null, 0, null, embeddedViewDef([index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'child1']])]))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var viewContainerData = index_1.asElementData(parentView, 1);
            var rf = parentView.root.rendererFactory;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            var childView1 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[2]);
            index_1.attachEmbeddedView(parentView, viewContainerData, 0, childView0);
            index_1.attachEmbeddedView(parentView, viewContainerData, 1, childView1);
            // 2 anchors + 2 elements
            var rootChildren = dom_adapter_1.getDOM().childNodes(rootNodes[0]);
            expect(rootChildren.length).toBe(4);
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[1], 'name')).toBe('child0');
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[2], 'name')).toBe('child1');
            rf.begin();
            index_1.detachEmbeddedView(viewContainerData, 1);
            index_1.detachEmbeddedView(viewContainerData, 0);
            rf.end();
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0]).length).toBe(2);
        });
        it('should move embedded views', function () {
            var _a = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 2, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                    index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.anchorDef(0 /* None */, null, null, 0, null, embeddedViewDef([index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'child1']])]))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var viewContainerData = index_1.asElementData(parentView, 1);
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            var childView1 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[2]);
            index_1.attachEmbeddedView(parentView, viewContainerData, 0, childView0);
            index_1.attachEmbeddedView(parentView, viewContainerData, 1, childView1);
            index_1.moveEmbeddedView(viewContainerData, 0, 1);
            expect(viewContainerData.viewContainer._embeddedViews).toEqual([childView1, childView0]);
            // 2 anchors + 2 elements
            var rootChildren = dom_adapter_1.getDOM().childNodes(rootNodes[0]);
            expect(rootChildren.length).toBe(4);
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[1], 'name')).toBe('child1');
            expect(dom_adapter_1.getDOM().getAttribute(rootChildren[2], 'name')).toBe('child0');
        });
        it('should include embedded views in root nodes', function () {
            var parentView = createAndGetRootNodes(compViewDef([
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                    index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'child0']])
                ])),
                index_1.elementDef(0 /* None */, null, null, 0, 'span', [['name', 'after']])
            ])).view;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[0]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 0), 0, childView0);
            var rootNodes = index_1.rootRenderNodes(parentView);
            expect(rootNodes.length).toBe(3);
            expect(dom_adapter_1.getDOM().getAttribute(rootNodes[1], 'name')).toBe('child0');
            expect(dom_adapter_1.getDOM().getAttribute(rootNodes[2], 'name')).toBe('after');
        });
        it('should dirty check embedded views', function () {
            var childValue = 'v1';
            var update = jasmine.createSpy('updater').and.callFake(function (check, view) {
                check(view, 0, 0 /* Inline */, childValue);
            });
            var _a = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([index_1.elementDef(0 /* None */, null, null, 0, 'span', null, [[1 /* TypeElementAttribute */, 'name', core_1.SecurityContext.NONE]])], update))
            ])), parentView = _a.view, rootNodes = _a.rootNodes;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 1), 0, childView0);
            index_1.Services.checkAndUpdateView(parentView);
            expect(update.calls.mostRecent().args[1]).toBe(childView0);
            update.calls.reset();
            index_1.Services.checkNoChangesView(parentView);
            expect(update.calls.mostRecent().args[1]).toBe(childView0);
            childValue = 'v2';
            expect(function () { return index_1.Services.checkNoChangesView(parentView); })
                .toThrowError("ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'v1'. Current value: 'v2'.");
        });
        it('should destroy embedded views', function () {
            var log = [];
            var ChildProvider = (function () {
                function ChildProvider() {
                }
                ChildProvider.prototype.ngOnDestroy = function () { log.push('ngOnDestroy'); };
                ;
                return ChildProvider;
            }());
            var parentView = createAndGetRootNodes(compViewDef([
                index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 0, null, embeddedViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(131072 /* OnDestroy */, null, 0, ChildProvider, [])
                ]))
            ])).view;
            var childView0 = helper_1.createEmbeddedView(parentView, parentView.def.nodes[1]);
            index_1.attachEmbeddedView(parentView, index_1.asElementData(parentView, 1), 0, childView0);
            index_1.Services.destroyView(parentView);
            expect(log).toEqual(['ngOnDestroy']);
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRkZWRfdmlld19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvZW1iZWRkZWRfdmlld19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXlIO0FBQ3pILHNEQUEyVztBQUUzVyw2RUFBcUU7QUFFckUsbUNBQXVFO0FBRXZFO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLHFCQUNJLEtBQWdCLEVBQUUsZ0JBQStCLEVBQUUsY0FBNkIsRUFDaEYsU0FBcUM7WUFBckMsMEJBQUEsRUFBQSx3QkFBcUM7WUFDdkMsTUFBTSxDQUFDLGVBQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCx5QkFBeUIsS0FBZ0IsRUFBRSxNQUFxQjtZQUM5RCxNQUFNLENBQUMsY0FBTSxPQUFBLGVBQU8sZUFBaUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUF0QyxDQUFzQyxDQUFDO1FBQ3RELENBQUM7UUFFRCwrQkFDSSxPQUF1QixFQUFFLE9BQW1CO1lBQW5CLHdCQUFBLEVBQUEsY0FBbUI7WUFDOUMsSUFBTSxJQUFJLEdBQUcsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUMsSUFBTSxTQUFTLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxhQUFhLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNuQyxJQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRTNCLElBQUE7OzttQ0FBZ0IsQ0FPSjtZQUVuQixJ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