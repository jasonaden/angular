"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function ngContentDef(ngContentIndex, index) {
    return {
        // will bet set by the view definition
        index: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: 8 /* TypeNgContent */,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {}, ngContentIndex: ngContentIndex,
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: null,
        ngContent: { index: index }
    };
}
exports.ngContentDef = ngContentDef;
function appendNgContent(view, renderHost, def) {
    var parentEl = util_1.getParentRenderElement(view, renderHost, def);
    if (!parentEl) {
        // Nothing to do if there is no parent element.
        return;
    }
    var ngContentIndex = def.ngContent.index;
    util_1.visitProjectedRenderNodes(view, ngContentIndex, 1 /* AppendChild */, parentEl, null, undefined);
}
exports.appendNgContent = appendNgContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvbmdfY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUEyRjtBQUUzRixzQkFBNkIsY0FBc0IsRUFBRSxLQUFhO0lBQ2hFLE1BQU0sQ0FBQztRQUNMLHNDQUFzQztRQUN0QyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUUsSUFBSTtRQUNsQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDZixpQkFBaUI7UUFDakIsS0FBSyx1QkFBeUI7UUFDOUIsVUFBVSxFQUFFLENBQUM7UUFDYixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLG1CQUFtQixFQUFFLENBQUM7UUFDdEIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsZUFBZSxFQUFFLENBQUM7UUFDbEIsVUFBVSxFQUFFLEVBQUUsRUFBRSxjQUFjLGdCQUFBO1FBQzlCLFVBQVUsRUFBRSxDQUFDO1FBQ2IsUUFBUSxFQUFFLEVBQUU7UUFDWixZQUFZLEVBQUUsQ0FBQztRQUNmLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFLElBQUk7UUFDWCxTQUFTLEVBQUUsRUFBQyxLQUFLLE9BQUEsRUFBQztLQUNuQixDQUFDO0FBQ0osQ0FBQztBQTFCRCxvQ0EwQkM7QUFFRCx5QkFBZ0MsSUFBYyxFQUFFLFVBQWUsRUFBRSxHQUFZO0lBQzNFLElBQU0sUUFBUSxHQUFHLDZCQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2QsK0NBQStDO1FBQy9DLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRCxJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsU0FBVyxDQUFDLEtBQUssQ0FBQztJQUM3QyxnQ0FBeUIsQ0FDckIsSUFBSSxFQUFFLGNBQWMsdUJBQWdDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQVRELDBDQVNDIn0=