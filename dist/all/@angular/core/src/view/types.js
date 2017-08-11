"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
;
/**
 * Node instance data.
 *
 * We have a separate type per NodeType to save memory
 * (TextData | ElementData | ProviderData | PureExpressionData | QueryList<any>)
 *
 * To keep our code monomorphic,
 * we prohibit using `NodeData` directly but enforce the use of accessors (`asElementData`, ...).
 * This way, no usage site can get a `NodeData` from view.nodes and then use it for different
 * purposes.
 */
var NodeData = (function () {
    function NodeData() {
    }
    return NodeData;
}());
exports.NodeData = NodeData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asTextData(view, index) {
    return view.nodes[index];
}
exports.asTextData = asTextData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asElementData(view, index) {
    return view.nodes[index];
}
exports.asElementData = asElementData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asProviderData(view, index) {
    return view.nodes[index];
}
exports.asProviderData = asProviderData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asPureExpressionData(view, index) {
    return view.nodes[index];
}
exports.asPureExpressionData = asPureExpressionData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asQueryList(view, index) {
    return view.nodes[index];
}
exports.asQueryList = asQueryList;
var DebugContext = (function () {
    function DebugContext() {
    }
    return DebugContext;
}());
exports.DebugContext = DebugContext;
/**
 * This object is used to prevent cycles in the source files and to have a place where
 * debug mode can hook it. It is lazily filled when `isDevMode` is known.
 */
exports.Services = {
    setCurrentNode: undefined,
    createRootView: undefined,
    createEmbeddedView: undefined,
    createComponentView: undefined,
    createNgModuleRef: undefined,
    overrideProvider: undefined,
    clearProviderOverrides: undefined,
    checkAndUpdateView: undefined,
    checkNoChangesView: undefined,
    destroyView: undefined,
    resolveDep: undefined,
    createDebugContext: undefined,
    handleEvent: undefined,
    updateDirectives: undefined,
    updateRenderer: undefined,
    dirtyParentQueries: undefined,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBdUNILENBQUM7QUFzVUQ7Ozs7Ozs7Ozs7R0FVRztBQUNIO0lBQUE7SUFBOEMsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBQS9DLElBQStDO0FBQWxDLDRCQUFRO0FBU3JCOztHQUVHO0FBQ0gsb0JBQTJCLElBQWMsRUFBRSxLQUFhO0lBQ3RELE1BQU0sQ0FBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCxnQ0FFQztBQStCRDs7R0FFRztBQUNILHVCQUE4QixJQUFjLEVBQUUsS0FBYTtJQUN6RCxNQUFNLENBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsc0NBRUM7QUFTRDs7R0FFRztBQUNILHdCQUErQixJQUFjLEVBQUUsS0FBYTtJQUMxRCxNQUFNLENBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsd0NBRUM7QUFTRDs7R0FFRztBQUNILDhCQUFxQyxJQUFjLEVBQUUsS0FBYTtJQUNoRSxNQUFNLENBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsb0RBRUM7QUFFRDs7R0FFRztBQUNILHFCQUE0QixJQUFjLEVBQUUsS0FBYTtJQUN2RCxNQUFNLENBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsa0NBRUM7QUFhRDtJQUFBO0lBV0EsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYcUIsb0NBQVk7QUFxRGxDOzs7R0FHRztBQUNVLFFBQUEsUUFBUSxHQUFhO0lBQ2hDLGNBQWMsRUFBRSxTQUFXO0lBQzNCLGNBQWMsRUFBRSxTQUFXO0lBQzNCLGtCQUFrQixFQUFFLFNBQVc7SUFDL0IsbUJBQW1CLEVBQUUsU0FBVztJQUNoQyxpQkFBaUIsRUFBRSxTQUFXO0lBQzlCLGdCQUFnQixFQUFFLFNBQVc7SUFDN0Isc0JBQXNCLEVBQUUsU0FBVztJQUNuQyxrQkFBa0IsRUFBRSxTQUFXO0lBQy9CLGtCQUFrQixFQUFFLFNBQVc7SUFDL0IsV0FBVyxFQUFFLFNBQVc7SUFDeEIsVUFBVSxFQUFFLFNBQVc7SUFDdkIsa0JBQWtCLEVBQUUsU0FBVztJQUMvQixXQUFXLEVBQUUsU0FBVztJQUN4QixnQkFBZ0IsRUFBRSxTQUFXO0lBQzdCLGNBQWMsRUFBRSxTQUFXO0lBQzNCLGtCQUFrQixFQUFFLFNBQVc7Q0FDaEMsQ0FBQyJ9