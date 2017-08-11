/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TreeNode } from '../util';
export declare class TreeComponent {
    private _rootEl;
    private _renderNodes;
    constructor(_rootEl: any);
    data: TreeNode;
    private _create(parentNode, dataNode, index);
    private _updateNode(renderNode, dataNode);
    private _update(dataNode, index);
    private _destroy();
}
