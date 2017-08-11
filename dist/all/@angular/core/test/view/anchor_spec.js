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
    describe("View Anchor", function () {
        function compViewDef(nodes, updateDirectives, updateRenderer) {
            return index_1.viewDef(0 /* None */, nodes, updateDirectives, updateRenderer);
        }
        function createAndGetRootNodes(viewDef, ctx) {
            var view = helper_1.createRootView(viewDef, ctx);
            var rootNodes = index_1.rootRenderNodes(view);
            return { rootNodes: rootNodes, view: view };
        }
        describe('create', function () {
            it('should create anchor nodes without parents', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([
                    index_1.anchorDef(0 /* None */, null, null, 0)
                ])).rootNodes;
                expect(rootNodes.length).toBe(1);
            });
            it('should create views with multiple root anchor nodes', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([
                    index_1.anchorDef(0 /* None */, null, null, 0),
                    index_1.anchorDef(0 /* None */, null, null, 0)
                ])).rootNodes;
                expect(rootNodes.length).toBe(2);
            });
            it('should create anchor nodes with parents', function () {
                var rootNodes = createAndGetRootNodes(compViewDef([
                    index_1.elementDef(0 /* None */, null, null, 1, 'div'),
                    index_1.anchorDef(0 /* None */, null, null, 0),
                ])).rootNodes;
                expect(dom_adapter_1.getDOM().childNodes(rootNodes[0]).length).toBe(1);
            });
            it('should add debug information to the renderer', function () {
                var someContext = new Object();
                var _a = createAndGetRootNodes(compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]), someContext), view = _a.view, rootNodes = _a.rootNodes;
                expect(core_1.getDebugNode(rootNodes[0]).nativeNode).toBe(index_1.asElementData(view, 0).renderElement);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5jaG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvdmlldy9hbmNob3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF1STtBQUN2SSxzREFBaVA7QUFDalAsNkVBQXFFO0FBRXJFLG1DQUFtRDtBQUVuRDtJQUNFLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIscUJBQ0ksS0FBZ0IsRUFBRSxnQkFBK0IsRUFDakQsY0FBNkI7WUFDL0IsTUFBTSxDQUFDLGVBQU8sZUFBaUIsS0FBSyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFRCwrQkFDSSxPQUF1QixFQUFFLEdBQVM7WUFDcEMsSUFBTSxJQUFJLEdBQUcsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBTSxTQUFTLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MsSUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsV0FBVyxDQUFDO29CQUNoQyxpQkFBUyxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsQ0FBQztpQkFDN0MsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtnQkFDeEQsSUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsV0FBVyxDQUFDO29CQUNoQyxpQkFBUyxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDNUMsaUJBQVMsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLENBQUM7aUJBQzdDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7Z0JBQzVDLElBQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDLFdBQVcsQ0FBQztvQkFDaEMsa0JBQVUsZUFBaUIsSUFBTSxFQUFFLElBQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDO29CQUNwRCxpQkFBUyxlQUFpQixJQUFNLEVBQUUsSUFBTSxFQUFFLENBQUMsQ0FBQztpQkFDN0MsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxNQUFNLENBQUMsb0JBQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7Z0JBQ2pELElBQU0sV0FBVyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQzNCLElBQUEsc0dBQ3VFLEVBRHRFLGNBQUksRUFBRSx3QkFBUyxDQUN3RDtnQkFDOUUsTUFBTSxDQUFDLG1CQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUEvQ0Qsb0JBK0NDIn0=