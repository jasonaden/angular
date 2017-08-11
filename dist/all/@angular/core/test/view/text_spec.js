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
    describe("View Text", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
            if (viewFlags === void 0) { viewFlags = 0 /* None */; }
            return index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
        }
        function createAndGetRootNodes(viewDef, context) {
            var view = helper_1.createRootView(viewDef, context);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        describe('create', function () {
            it('should create text nodes without parents', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([index_1.textDef(null, ['a'])])).rootNodes;
                expect(rootNodes.length).toBe(1);
                expect(dom_adapter_1.getDOM().getText(rootNodes[0])).toBe('a');
            });
            it('should create views with multiple root text nodes', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([
                    index_1.textDef(null, ['a']), index_1.textDef(null, ['b'])
                ])).rootNodes;
                expect(rootNodes.length).toBe(2);
            });
            it('should create text nodes with parents', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                    index_1.textDef(null, ['a']),
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
                var textNode = dom_adapter_1.getDOM().firstChild(rootNodes[0]);
                expect(dom_adapter_1.getDOM().getText(textNode)).toBe('a');
            });
            it('should add debug information to the renderer', function () {
                var someContext = new Object();
                var _a = createAndGetRootNodes(compViewDef([index_1.textDef(null, ['a'])]), someContext), view = _a.view, rootNodes = _a.rootNodes;
                expect(core_1.getDebugNode(rootNodes[0]).nativeNode).toBe(index_1.asTextData(view, 0).renderText);
            });
        });
        describe('change text', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var _a = createAndGetRootNodes(compViewDef([
                        index_1.textDef(null, ['0', '1', '2']),
                    ], null, function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 0, inlineDynamic, ['a', 'b']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    var node = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getText(rootNodes[0])).toBe('0a1b2');
                });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvdGV4dF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXFKO0FBQ3JKLHNEQUE0UDtBQUU1UCw2RUFBcUU7QUFFckUsbUNBQThGO0FBRTlGO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixxQkFDSSxLQUFnQixFQUFFLGdCQUErQixFQUFFLGNBQTZCLEVBQ2hGLFNBQXFDO1lBQXJDLDBCQUFBLEVBQUEsd0JBQXFDO1lBQ3ZDLE1BQU0sQ0FBQyxlQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsK0JBQ0ksT0FBdUIsRUFBRSxPQUFhO1lBQ3hDLElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLEVBQUMsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztRQUMzQixDQUFDO1FBRUQsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNqQixFQUFFLENBQUMsMENBQTBDLEVBQUU7Z0JBQzdDLElBQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLGVBQU8sQ0FBQyxJQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDekYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENB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