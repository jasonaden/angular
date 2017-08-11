"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var element_ref_1 = require("../linker/element_ref");
var query_list_1 = require("../linker/query_list");
var types_1 = require("./types");
var util_1 = require("./util");
function queryDef(flags, id, bindings) {
    var bindingDefs = [];
    for (var propName in bindings) {
        var bindingType = bindings[propName];
        bindingDefs.push({ propName: propName, bindingType: bindingType });
    }
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        ngContentIndex: -1,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: { id: id, filterId: util_1.filterQueryId(id), bindings: bindingDefs },
        ngContent: null
    };
}
exports.queryDef = queryDef;
function createQuery() {
    return new query_list_1.QueryList();
}
exports.createQuery = createQuery;
function dirtyParentQueries(view) {
    var queryIds = view.def.nodeMatchedQueries;
    while (view.parent && util_1.isEmbeddedView(view)) {
        var tplDef = view.parentNodeDef;
        view = view.parent;
        // content queries
        var end = tplDef.index + tplDef.childCount;
        for (var i = 0; i <= end; i++) {
            var nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 67108864 /* TypeContentQuery */) &&
                (nodeDef.flags & 536870912 /* DynamicQuery */) &&
                (nodeDef.query.filterId & queryIds) === nodeDef.query.filterId) {
                types_1.asQueryList(view, i).setDirty();
            }
            if ((nodeDef.flags & 1 /* TypeElement */ && i + nodeDef.childCount < tplDef.index) ||
                !(nodeDef.childFlags & 67108864 /* TypeContentQuery */) ||
                !(nodeDef.childFlags & 536870912 /* DynamicQuery */)) {
                // skip elements that don't contain the template element or no query.
                i += nodeDef.childCount;
            }
        }
    }
    // view queries
    if (view.def.nodeFlags & 134217728 /* TypeViewQuery */) {
        for (var i = 0; i < view.def.nodes.length; i++) {
            var nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 134217728 /* TypeViewQuery */) && (nodeDef.flags & 536870912 /* DynamicQuery */)) {
                types_1.asQueryList(view, i).setDirty();
            }
            // only visit the root nodes
            i += nodeDef.childCount;
        }
    }
}
exports.dirtyParentQueries = dirtyParentQueries;
function checkAndUpdateQuery(view, nodeDef) {
    var queryList = types_1.asQueryList(view, nodeDef.index);
    if (!queryList.dirty) {
        return;
    }
    var directiveInstance;
    var newValues = undefined;
    if (nodeDef.flags & 67108864 /* TypeContentQuery */) {
        var elementDef = nodeDef.parent.parent;
        newValues = calcQueryValues(view, elementDef.index, elementDef.index + elementDef.childCount, nodeDef.query, []);
        directiveInstance = types_1.asProviderData(view, nodeDef.parent.index).instance;
    }
    else if (nodeDef.flags & 134217728 /* TypeViewQuery */) {
        newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, nodeDef.query, []);
        directiveInstance = view.component;
    }
    queryList.reset(newValues);
    var bindings = nodeDef.query.bindings;
    var notify = false;
    for (var i = 0; i < bindings.length; i++) {
        var binding = bindings[i];
        var boundValue = void 0;
        switch (binding.bindingType) {
            case 0 /* First */:
                boundValue = queryList.first;
                break;
            case 1 /* All */:
                boundValue = queryList;
                notify = true;
                break;
        }
        directiveInstance[binding.propName] = boundValue;
    }
    if (notify) {
        queryList.notifyOnChanges();
    }
}
exports.checkAndUpdateQuery = checkAndUpdateQuery;
function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        var valueType = nodeDef.matchedQueries[queryDef.id];
        if (valueType != null) {
            values.push(getQueryValue(view, nodeDef, valueType));
        }
        if (nodeDef.flags & 1 /* TypeElement */ && nodeDef.element.template &&
            (nodeDef.element.template.nodeMatchedQueries & queryDef.filterId) ===
                queryDef.filterId) {
            // check embedded views that were attached at the place of their template.
            var elementData = types_1.asElementData(view, i);
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                var embeddedViews = elementData.viewContainer._embeddedViews;
                for (var k = 0; k < embeddedViews.length; k++) {
                    var embeddedView = embeddedViews[k];
                    var dvc = util_1.declaredViewContainer(embeddedView);
                    if (dvc && dvc === elementData) {
                        calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
                    }
                }
            }
            var projectedViews = elementData.template._projectedViews;
            if (projectedViews) {
                for (var k = 0; k < projectedViews.length; k++) {
                    var projectedView = projectedViews[k];
                    calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
                }
            }
        }
        if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
            // if no child matches the query, skip the children.
            i += nodeDef.childCount;
        }
    }
    return values;
}
function getQueryValue(view, nodeDef, queryValueType) {
    if (queryValueType != null) {
        // a match
        var value = void 0;
        switch (queryValueType) {
            case 1 /* RenderElement */:
                value = types_1.asElementData(view, nodeDef.index).renderElement;
                break;
            case 0 /* ElementRef */:
                value = new element_ref_1.ElementRef(types_1.asElementData(view, nodeDef.index).renderElement);
                break;
            case 2 /* TemplateRef */:
                value = types_1.asElementData(view, nodeDef.index).template;
                break;
            case 3 /* ViewContainerRef */:
                value = types_1.asElementData(view, nodeDef.index).viewContainer;
                break;
            case 4 /* Provider */:
                value = types_1.asProviderData(view, nodeDef.index).instance;
                break;
        }
        return value;
    }
}
exports.getQueryValue = getQueryValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgscURBQWlEO0FBQ2pELG1EQUErQztBQUUvQyxpQ0FBOEo7QUFDOUosK0JBQTRFO0FBRTVFLGtCQUNJLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdEO0lBQ2hGLElBQUksV0FBVyxHQUFzQixFQUFFLENBQUM7SUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5QixJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFFLFdBQVcsYUFBQSxFQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQ0wsc0NBQXNDO1FBQ3RDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDVCxNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxJQUFJO1FBQ2xCLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDaEIsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNmLGlCQUFpQjtRQUNqQixLQUFLLE9BQUE7UUFDTCxVQUFVLEVBQUUsQ0FBQztRQUNiLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLGVBQWUsRUFBRSxDQUFDO1FBQ2xCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsVUFBVSxFQUFFLENBQUM7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLFlBQVksRUFBRSxDQUFDO1FBQ2YsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUUsRUFBQyxFQUFFLElBQUEsRUFBRSxRQUFRLEVBQUUsb0JBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFDO1FBQy9ELFNBQVMsRUFBRSxJQUFJO0tBQ2hCLENBQUM7QUFDSixDQUFDO0FBbENELDRCQWtDQztBQUVEO0lBQ0UsTUFBTSxDQUFDLElBQUksc0JBQVMsRUFBRSxDQUFDO0FBQ3pCLENBQUM7QUFGRCxrQ0FFQztBQUVELDRCQUFtQyxJQUFjO0lBQy9DLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7SUFDN0MsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLHFCQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUMzQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBZSxDQUFDO1FBQ2xDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ25CLGtCQUFrQjtRQUNsQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLGtDQUE2QixDQUFDO2dCQUM1QyxDQUFDLE9BQU8sQ0FBQyxLQUFLLCtCQUF5QixDQUFDO2dCQUN4QyxDQUFDLE9BQU8sQ0FBQyxLQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxLQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdkUsbUJBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssc0JBQXdCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDaEYsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLGtDQUE2QixDQUFDO2dCQUNsRCxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsK0JBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELHFFQUFxRTtnQkFDckUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDMUIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsZUFBZTtJQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxnQ0FBMEIsQ0FBQyxDQUFDLENBQUM7UUFDakQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMvQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLGdDQUEwQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSywrQkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUYsbUJBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEMsQ0FBQztZQUNELDRCQUE0QjtZQUM1QixDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFsQ0QsZ0RBa0NDO0FBRUQsNkJBQW9DLElBQWMsRUFBRSxPQUFnQjtJQUNsRSxJQUFNLFNBQVMsR0FBRyxtQkFBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUM7SUFDVCxDQUFDO0lBQ0QsSUFBSSxpQkFBc0IsQ0FBQztJQUMzQixJQUFJLFNBQVMsR0FBVSxTQUFXLENBQUM7SUFDbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssa0NBQTZCLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFRLENBQUMsTUFBUSxDQUFDO1FBQzdDLFNBQVMsR0FBRyxlQUFlLENBQ3ZCLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNGLGlCQUFpQixHQUFHLHNCQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzVFLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssZ0NBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQ25ELFNBQVMsR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckYsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBTyxDQUFDLFFBQVEsQ0FBQztJQUMxQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksVUFBVSxTQUFLLENBQUM7UUFDcEIsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDNUI7Z0JBQ0UsVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLEtBQUssQ0FBQztZQUNSO2dCQUNFLFVBQVUsR0FBRyxTQUFTLENBQUM7Z0JBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsS0FBSyxDQUFDO1FBQ1YsQ0FBQztRQUNELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDbkQsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWCxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDOUIsQ0FBQztBQUNILENBQUM7QUFwQ0Qsa0RBb0NDO0FBRUQseUJBQ0ksSUFBYyxFQUFFLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxRQUFrQixFQUN4RSxNQUFhO0lBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLHNCQUF3QixJQUFJLE9BQU8sQ0FBQyxPQUFTLENBQUMsUUFBUTtZQUNuRSxDQUFDLE9BQU8sQ0FBQyxPQUFTLENBQUMsUUFBVSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2pFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFCLDBFQUEwRTtZQUMxRSxJQUFNLFdBQVcsR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSywrQkFBMEIsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxhQUFlLENBQUMsY0FBYyxDQUFDO2dCQUNqRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDOUMsSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFNLEdBQUcsR0FBRyw0QkFBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDaEQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDeEYsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQUNELElBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQzVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMvQyxJQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDNUUsb0RBQW9EO1lBQ3BELENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsdUJBQ0ksSUFBYyxFQUFFLE9BQWdCLEVBQUUsY0FBOEI7SUFDbEUsRUFBRSxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0IsVUFBVTtRQUNWLElBQUksS0FBSyxTQUFLLENBQUM7UUFDZixNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCO2dCQUNFLEtBQUssR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUN6RCxLQUFLLENBQUM7WUFDUjtnQkFDRSxLQUFLLEdBQUcsSUFBSSx3QkFBVSxDQUFDLHFCQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDekUsS0FBSyxDQUFDO1lBQ1I7Z0JBQ0UsS0FBSyxHQUFHLHFCQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQ3BELEtBQUssQ0FBQztZQUNSO2dCQUNFLEtBQUssR0FBRyxxQkFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUN6RCxLQUFLLENBQUM7WUFDUjtnQkFDRSxLQUFLLEdBQUcsc0JBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDckQsS0FBSyxDQUFDO1FBQ1YsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQXhCRCxzQ0F3QkMifQ==