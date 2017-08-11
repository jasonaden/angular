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
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
function isBrowser() {
    return dom_adapter_1.getDOM().supportsDOMEvents();
}
exports.isBrowser = isBrowser;
exports.ARG_TYPE_VALUES = [0 /* Inline */, 1 /* Dynamic */];
function checkNodeInlineOrDynamic(check, view, nodeIndex, argType, values) {
    switch (argType) {
        case 0 /* Inline */:
            return check.apply(void 0, [view, nodeIndex, argType].concat(values));
        case 1 /* Dynamic */:
            return check(view, nodeIndex, argType, values);
    }
}
exports.checkNodeInlineOrDynamic = checkNodeInlineOrDynamic;
function createRootView(def, context, projectableNodes, rootSelectorOrNode) {
    index_1.initServicesIfNeeded();
    return index_1.Services.createRootView(testing_1.TestBed.get(core_1.Injector), projectableNodes || [], rootSelectorOrNode, def, testing_1.TestBed.get(core_1.NgModuleRef), context);
}
exports.createRootView = createRootView;
function createEmbeddedView(parent, anchorDef, context) {
    return index_1.Services.createEmbeddedView(parent, anchorDef, anchorDef.element.template, context);
}
exports.createEmbeddedView = createEmbeddedView;
var removeNodes;
beforeEach(function () { removeNodes = []; });
afterEach(function () { removeNodes.forEach(function (node) { return dom_adapter_1.getDOM().remove(node); }); });
function recordNodeToRemove(node) {
    removeNodes.push(node);
}
exports.recordNodeToRemove = recordNodeToRemove;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTZFO0FBQzdFLHNEQUFvSjtBQUNwSixpREFBOEM7QUFDOUMsNkVBQXFFO0FBRXJFO0lBQ0UsTUFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3RDLENBQUM7QUFGRCw4QkFFQztBQUVZLFFBQUEsZUFBZSxHQUFHLGlDQUEyQyxDQUFDO0FBRTNFLGtDQUNJLEtBQWtCLEVBQUUsSUFBYyxFQUFFLFNBQWlCLEVBQUUsT0FBcUIsRUFDNUUsTUFBYTtJQUNmLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEI7WUFDRSxNQUFNLENBQU8sS0FBTSxnQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sU0FBSyxNQUFNLEdBQUU7UUFDM0Q7WUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7QUFDSCxDQUFDO0FBVEQsNERBU0M7QUFFRCx3QkFDSSxHQUFtQixFQUFFLE9BQWEsRUFBRSxnQkFBMEIsRUFDOUQsa0JBQXdCO0lBQzFCLDRCQUFvQixFQUFFLENBQUM7SUFDdkIsTUFBTSxDQUFDLGdCQUFRLENBQUMsY0FBYyxDQUMxQixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFRLENBQUMsRUFBRSxnQkFBZ0IsSUFBSSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxFQUN0RSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBVyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQVBELHdDQU9DO0FBRUQsNEJBQW1DLE1BQWdCLEVBQUUsU0FBa0IsRUFBRSxPQUFhO0lBQ3BGLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLE9BQVMsQ0FBQyxRQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakcsQ0FBQztBQUZELGdEQUVDO0FBRUQsSUFBSSxXQUFtQixDQUFDO0FBRXhCLFVBQVUsQ0FBQyxjQUFRLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxTQUFTLENBQUMsY0FBUSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsb0JBQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFM0UsNEJBQW1DLElBQVU7SUFDM0MsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsZ0RBRUMifQ==