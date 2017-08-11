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
    describe("View NgContent", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function embeddedViewDef(nodes, update) {
            return function () { return index_1.viewDef(0 /* None */, nodes, update); };
        }
        function hostElDef(contentNodes, viewNodes) {
            var AComp = (function () {
                function AComp() {
                }
                return AComp;
            }());
            var aCompViewDef = compViewDef(viewNodes);
            return [
                index_1.elementDef(0 /* None */, null, null, 1 + contentNodes.length, 'acomp', null, null, null, null, function () { return aCompViewDef; }),
                index_1.directiveDef(32768 /* Component */, null, 0, AComp, [])
            ].concat(contentNodes);
        }
        function createAndGetRootNodes(viewDef, ctx) {
            var view = helper_1.createRootView(viewDef, ctx || {});
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        it('should create ng-content nodes without parents', function () {
            var _a = createAndGetRootNodes(compViewDef(hostElDef([index_1.textDef(0, ['a'])], [index_1.ngContentDef(null, 0)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(rootNodes[0])).toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should create views with multiple root ng-content nodes', function () {
            var _a = createAndGetRootNodes(compViewDef(hostElDef([index_1.textDef(0, ['a']), index_1.textDef(1, ['b'])], [index_1.ngContentDef(null, 0), index_1.ngContentDef(null, 1)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[0]).toBe(index_1.asTextData(view, 2).renderText);
            expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[1]).toBe(index_1.asTextData(view, 3).renderText);
        });
        it('should create ng-content nodes with parents', function () {
            var _a = createAndGetRootNodes(compViewDef(hostElDef([index_1.textDef(0, ['a'])], [index_1.elementDef(0 /* None */, null, null, 1, 'div'), index_1.ngContentDef(null, 0)]))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(rootNodes[0])))
                .toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should reproject ng-content nodes', function () {
            var _a = createAndGetRootNodes(compViewDef(hostElDef([index_1.textDef(0, ['a'])], hostElDef([index_1.ngContentDef(0, 0)], [
                index_1.elementDef(0 /* None */, null, null, 1, 'span'), index_1.ngContentDef(null, 0)
            ])))), view = _a.view, rootNodes = _a.rootNodes;
            expect(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(dom_adapter_1.getDOM().firstChild(rootNodes[0]))))
                .toBe(index_1.asTextData(view, 2).renderText);
        });
        it('should project already attached embedded views', function () {
            var CreateViewService = (function () {
                function CreateViewService(templateRef, viewContainerRef) {
                    viewContainerRef.createEmbeddedView(templateRef);
                }
                return CreateViewService;
            }());
            var _a = createAndGetRootNodes(compViewDef(hostElDef([
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, 0, 1, null, embeddedViewDef([index_1.textDef(null, ['a'])])),
                index_1.directiveDef(0 /* None */, null, 0, CreateViewService, [core_1.TemplateRef, core_1.ViewContainerRef])
            ], [
                index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                index_1.ngContentDef(null, 0)
            ]))), view = _a.view, rootNodes = _a.rootNodes;
            var anchor = index_1.asElementData(view, 2);
            expect((dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[0]))
                .toBe(anchor.renderElement);
            var embeddedView = anchor.viewContainer._embeddedViews[0];
            expect((dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[1]))
                .toBe(index_1.asTextData(embeddedView, 0).renderText);
        });
        it('should include projected nodes when attaching / detaching embedded views', function () {
            var _a = createAndGetRootNodes(compViewDef(hostElDef([index_1.textDef(0, ['a'])], [
                index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                index_1.anchorDef(16777216 /* EmbeddedViews */, null, 0, 0, null, embeddedViewDef([
                    index_1.ngContentDef(null, 0),
                    // The anchor would be added by the compiler after the ngContent
                    index_1.anchorDef(0 /* None */, null, null, 0),
                ])),
            ]))), view = _a.view, rootNodes = _a.rootNodes;
            var componentView = index_1.asElementData(view, 0).componentView;
            var rf = componentView.root.rendererFactory;
            var view0 = helper_1.createEmbeddedView(componentView, componentView.def.nodes[1]);
            index_1.attachEmbeddedView(view, index_1.asElementData(componentView, 1), 0, view0);
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0])).length).toBe(3);
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0]))[1])
                .toBe(index_1.asTextData(view, 2).renderText);
            rf.begin();
            index_1.detachEmbeddedView(index_1.asElementData(componentView, 1), 0);
            rf.end();
            expect(dom_adapter_1.getDOM().childNodes(dom_adapter_1.getDOM().firstChild(rootNodes[0])).length).toBe(1);
        });
        if (helper_1.isBrowser()) {
            it('should use root projectable nodes', function () {
                var projectableNodes = [[document.createTextNode('a')], [document.createTextNode('b')]];
                var view = helper_1.createRootView(compViewDef(hostElDef([], [index_1.ngContentDef(null, 0), index_1.ngContentDef(null, 1)])), {}, projectableNodes);
                var rootNodes = index_1.rootRenderNodes(view);
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[0]).toBe(projectableNodes[0][0]);
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0])[1]).toBe(projectableNodes[1][0]);
            });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udGVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvbmdfY29udGVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXNLO0FBQ3RLLHNEQUF3VztBQUN4Vyw2RUFBcUU7QUFFckUsbUNBQXVFO0FBRXZFO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLHFCQUNJLEtBQWdCLEVBQUUsZ0JBQStCLEVBQUUsY0FBNkIsRUFDaEYsU0FBcUM7WUFBckMsMEJBQUEsRUFBQSx3QkFBcUM7WUFDdkMsTUFBTSxDQUFDLGVBQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCx5QkFBeUIsS0FBZ0IsRUFBRSxNQUFxQjtZQUM5RCxNQUFNLENBQUMsY0FBTSxPQUFBLGVBQU8sZUFBaUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUF0QyxDQUFzQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxtQkFBbUIsWUFBdUIsRUFBRSxTQUFvQjtZQUM5RDtnQkFBQTtnQkFBYSxDQUFDO2dCQUFELFlBQUM7WUFBRCxDQUFDLEFBQWQsSUFBYztZQUVkLElBQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU1QyxNQUFNO2dCQUNKLGtCQUFVLGVBQ1UsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBTSxFQUFFLElBQU0sRUFDaEYsSUFBTSxFQUFFLElBQU0sRUFBRSxjQUFNLE9BQUEsWUFBWSxFQUFaLENBQVksQ0FBQztnQkFDdkMsb0JBQVksd0JBQXNCLElBQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztxQkFBSyxZQUFZLEVBQ3hFO1FBQ0os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