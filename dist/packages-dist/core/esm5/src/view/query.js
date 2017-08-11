/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '../linker/element_ref';
import { QueryList } from '../linker/query_list';
import { asElementData, asProviderData, asQueryList } from './types';
import { declaredViewContainer, filterQueryId, isEmbeddedView } from './util';
/**
 * @param {?} flags
 * @param {?} id
 * @param {?} bindings
 * @return {?}
 */
export function queryDef(flags, id, bindings) {
    var /** @type {?} */ bindingDefs = [];
    for (var /** @type {?} */ propName in bindings) {
        var /** @type {?} */ bindingType = bindings[propName];
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
        query: { id: id, filterId: filterQueryId(id), bindings: bindingDefs },
        ngContent: null
    };
}
/**
 * @return {?}
 */
export function createQuery() {
    return new QueryList();
}
/**
 * @param {?} view
 * @return {?}
 */
export function dirtyParentQueries(view) {
    var /** @type {?} */ queryIds = view.def.nodeMatchedQueries;
    while (view.parent && isEmbeddedView(view)) {
        var /** @type {?} */ tplDef = ((view.parentNodeDef));
        view = view.parent;
        // content queries
        var /** @type {?} */ end = tplDef.index + tplDef.childCount;
        for (var /** @type {?} */ i = 0; i <= end; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 67108864 /* TypeContentQuery */) &&
                (nodeDef.flags & 536870912 /* DynamicQuery */) &&
                (((nodeDef.query)).filterId & queryIds) === ((nodeDef.query)).filterId) {
                asQueryList(view, i).setDirty();
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
        for (var /** @type {?} */ i = 0; i < view.def.nodes.length; i++) {
            var /** @type {?} */ nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 134217728 /* TypeViewQuery */) && (nodeDef.flags & 536870912 /* DynamicQuery */)) {
                asQueryList(view, i).setDirty();
            }
            // only visit the root nodes
            i += nodeDef.childCount;
        }
    }
}
/**
 * @param {?} view
 * @param {?} nodeDef
 * @return {?}
 */
export function checkAndUpdateQuery(view, nodeDef) {
    var /** @type {?} */ queryList = asQueryList(view, nodeDef.index);
    if (!queryList.dirty) {
        return;
    }
    var /** @type {?} */ directiveInstance;
    var /** @type {?} */ newValues = ((undefined));
    if (nodeDef.flags & 67108864 /* TypeContentQuery */) {
        var /** @type {?} */ elementDef = ((((nodeDef.parent)).parent));
        newValues = calcQueryValues(view, elementDef.index, elementDef.index + elementDef.childCount, /** @type {?} */ ((nodeDef.query)), []);
        directiveInstance = asProviderData(view, /** @type {?} */ ((nodeDef.parent)).index).instance;
    }
    else if (nodeDef.flags & 134217728 /* TypeViewQuery */) {
        newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, /** @type {?} */ ((nodeDef.query)), []);
        directiveInstance = view.component;
    }
    queryList.reset(newValues);
    var /** @type {?} */ bindings = ((nodeDef.query)).bindings;
    var /** @type {?} */ notify = false;
    for (var /** @type {?} */ i = 0; i < bindings.length; i++) {
        var /** @type {?} */ binding = bindings[i];
        var /** @type {?} */ boundValue = void 0;
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
/**
 * @param {?} view
 * @param {?} startIndex
 * @param {?} endIndex
 * @param {?} queryDef
 * @param {?} values
 * @return {?}
 */
function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
    for (var /** @type {?} */ i = startIndex; i <= endIndex; i++) {
        var /** @type {?} */ nodeDef = view.def.nodes[i];
        var /** @type {?} */ valueType = nodeDef.matchedQueries[queryDef.id];
        if (valueType != null) {
            values.push(getQueryValue(view, nodeDef, valueType));
        }
        if (nodeDef.flags & 1 /* TypeElement */ && ((nodeDef.element)).template &&
            (((((nodeDef.element)).template)).nodeMatchedQueries & queryDef.filterId) ===
                queryDef.filterId) {
            // check embedded views that were attached at the place of their template.
            var /** @type {?} */ elementData = asElementData(view, i);
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                var /** @type {?} */ embeddedViews = ((elementData.viewContainer))._embeddedViews;
                for (var /** @type {?} */ k = 0; k < embeddedViews.length; k++) {
                    var /** @type {?} */ embeddedView = embeddedViews[k];
                    var /** @type {?} */ dvc = declaredViewContainer(embeddedView);
                    if (dvc && dvc === elementData) {
                        calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
                    }
                }
            }
            var /** @type {?} */ projectedViews = elementData.template._projectedViews;
            if (projectedViews) {
                for (var /** @type {?} */ k = 0; k < projectedViews.length; k++) {
                    var /** @type {?} */ projectedView = projectedViews[k];
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
/**
 * @param {?} view
 * @param {?} nodeDef
 * @param {?} queryValueType
 * @return {?}
 */
export function getQueryValue(view, nodeDef, queryValueType) {
    if (queryValueType != null) {
        // a match
        var /** @type {?} */ value = void 0;
        switch (queryValueType) {
            case 1 /* RenderElement */:
                value = asElementData(view, nodeDef.index).renderElement;
                break;
            case 0 /* ElementRef */:
                value = new ElementRef(asElementData(view, nodeDef.index).renderElement);
                break;
            case 2 /* TemplateRef */:
                value = asElementData(view, nodeDef.index).template;
                break;
            case 3 /* ViewContainerRef */:
                value = asElementData(view, nodeDef.index).viewContainer;
                break;
            case 4 /* Provider */:
                value = asProviderData(view, nodeDef.index).instance;
                break;
        }
        return value;
    }
}
//# sourceMappingURL=query.js.map