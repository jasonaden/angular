"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var util_1 = require("./util");
function attachEmbeddedView(parentView, elementData, viewIndex, view) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    if (viewIndex === null || viewIndex === undefined) {
        viewIndex = embeddedViews.length;
    }
    view.viewContainerParent = parentView;
    addToArray(embeddedViews, viewIndex, view);
    attachProjectedView(elementData, view);
    types_1.Services.dirtyParentQueries(view);
    var prevView = viewIndex > 0 ? embeddedViews[viewIndex - 1] : null;
    renderAttachEmbeddedView(elementData, prevView, view);
}
exports.attachEmbeddedView = attachEmbeddedView;
function attachProjectedView(vcElementData, view) {
    var dvcElementData = util_1.declaredViewContainer(view);
    if (!dvcElementData || dvcElementData === vcElementData ||
        view.state & 16 /* IsProjectedView */) {
        return;
    }
    // Note: For performance reasons, we
    // - add a view to template._projectedViews only 1x throughout its lifetime,
    //   and remove it not until the view is destroyed.
    //   (hard, as when a parent view is attached/detached we would need to attach/detach all
    //    nested projected views as well, even accross component boundaries).
    // - don't track the insertion order of views in the projected views array
    //   (hard, as when the views of the same template are inserted different view containers)
    view.state |= 16 /* IsProjectedView */;
    var projectedViews = dvcElementData.template._projectedViews;
    if (!projectedViews) {
        projectedViews = dvcElementData.template._projectedViews = [];
    }
    projectedViews.push(view);
    // Note: we are changing the NodeDef here as we cannot calculate
    // the fact whether a template is used for projection during compilation.
    markNodeAsProjectedTemplate(view.parent.def, view.parentNodeDef);
}
function markNodeAsProjectedTemplate(viewDef, nodeDef) {
    if (nodeDef.flags & 4 /* ProjectedTemplate */) {
        return;
    }
    viewDef.nodeFlags |= 4 /* ProjectedTemplate */;
    nodeDef.flags |= 4 /* ProjectedTemplate */;
    var parentNodeDef = nodeDef.parent;
    while (parentNodeDef) {
        parentNodeDef.childFlags |= 4 /* ProjectedTemplate */;
        parentNodeDef = parentNodeDef.parent;
    }
}
function detachEmbeddedView(elementData, viewIndex) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    if (viewIndex == null || viewIndex >= embeddedViews.length) {
        viewIndex = embeddedViews.length - 1;
    }
    if (viewIndex < 0) {
        return null;
    }
    var view = embeddedViews[viewIndex];
    view.viewContainerParent = null;
    removeFromArray(embeddedViews, viewIndex);
    // See attachProjectedView for why we don't update projectedViews here.
    types_1.Services.dirtyParentQueries(view);
    renderDetachView(view);
    return view;
}
exports.detachEmbeddedView = detachEmbeddedView;
function detachProjectedView(view) {
    if (!(view.state & 16 /* IsProjectedView */)) {
        return;
    }
    var dvcElementData = util_1.declaredViewContainer(view);
    if (dvcElementData) {
        var projectedViews = dvcElementData.template._projectedViews;
        if (projectedViews) {
            removeFromArray(projectedViews, projectedViews.indexOf(view));
            types_1.Services.dirtyParentQueries(view);
        }
    }
}
exports.detachProjectedView = detachProjectedView;
function moveEmbeddedView(elementData, oldViewIndex, newViewIndex) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    var view = embeddedViews[oldViewIndex];
    removeFromArray(embeddedViews, oldViewIndex);
    if (newViewIndex == null) {
        newViewIndex = embeddedViews.length;
    }
    addToArray(embeddedViews, newViewIndex, view);
    // Note: Don't need to change projectedViews as the order in there
    // as always invalid...
    types_1.Services.dirtyParentQueries(view);
    renderDetachView(view);
    var prevView = newViewIndex > 0 ? embeddedViews[newViewIndex - 1] : null;
    renderAttachEmbeddedView(elementData, prevView, view);
    return view;
}
exports.moveEmbeddedView = moveEmbeddedView;
function renderAttachEmbeddedView(elementData, prevView, view) {
    var prevRenderNode = prevView ? util_1.renderNode(prevView, prevView.def.lastRenderRootNode) :
        elementData.renderElement;
    var parentNode = view.renderer.parentNode(prevRenderNode);
    var nextSibling = view.renderer.nextSibling(prevRenderNode);
    // Note: We can't check if `nextSibling` is present, as on WebWorkers it will always be!
    // However, browsers automatically do `appendChild` when there is no `nextSibling`.
    util_1.visitRootRenderNodes(view, 2 /* InsertBefore */, parentNode, nextSibling, undefined);
}
function renderDetachView(view) {
    util_1.visitRootRenderNodes(view, 3 /* RemoveChild */, null, null, undefined);
}
exports.renderDetachView = renderDetachView;
function addToArray(arr, index, value) {
    // perf: array.push is faster than array.splice!
    if (index >= arr.length) {
        arr.push(value);
    }
    else {
        arr.splice(index, 0, value);
    }
}
function removeFromArray(arr, index) {
    // perf: array.pop is faster than array.splice!
    if (index >= arr.length - 1) {
        arr.pop();
    }
    else {
        arr.splice(index, 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19hdHRhY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3ZpZXdfYXR0YWNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaUNBQXVHO0FBQ3ZHLCtCQUFrSDtBQUVsSCw0QkFDSSxVQUFvQixFQUFFLFdBQXdCLEVBQUUsU0FBb0MsRUFDcEYsSUFBYztJQUNoQixJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBZSxDQUFDLGNBQWMsQ0FBQztJQUMvRCxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2xELFNBQVMsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ25DLENBQUM7SUFDRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0lBQ3RDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV2QyxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLElBQU0sUUFBUSxHQUFHLFNBQVcsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLFNBQVcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDekUsd0JBQXdCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBZkQsZ0RBZUM7QUFFRCw2QkFBNkIsYUFBMEIsRUFBRSxJQUFjO0lBQ3JFLElBQU0sY0FBYyxHQUFHLDRCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLGNBQWMsS0FBSyxhQUFhO1FBQ25ELElBQUksQ0FBQyxLQUFLLDJCQUE0QixD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