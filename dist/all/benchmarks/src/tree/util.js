"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var TreeNode = (function () {
    function TreeNode(value, depth, maxDepth, left, right) {
        this.value = value;
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.left = left;
        this.right = right;
        this.transitiveChildCount = Math.pow(2, (this.maxDepth - this.depth + 1)) - 1;
        this.children = this.left ? [this.left, this.right] : [];
    }
    Object.defineProperty(TreeNode.prototype, "style", {
        // Needed for Polymer as it does not support ternary nor modulo operator
        // in expressions
        get: function () { return this.depth % 2 === 0 ? 'background-color: grey' : ''; },
        enumerable: true,
        configurable: true
    });
    return TreeNode;
}());
exports.TreeNode = TreeNode;
var treeCreateCount;
var numberData;
var charData;
init();
function init() {
    exports.maxDepth = util_1.getIntParameter('depth');
    treeCreateCount = 0;
    numberData = _buildTree(0, numberValues);
    charData = _buildTree(0, charValues);
}
function _buildTree(currDepth, valueFn) {
    var children = currDepth < exports.maxDepth ? _buildTree(currDepth + 1, valueFn) : null;
    return new TreeNode(valueFn(currDepth), currDepth, exports.maxDepth, children, children);
}
exports.emptyTree = new TreeNode('', 0, 0, null, null);
function buildTree() {
    treeCreateCount++;
    return treeCreateCount % 2 ? numberData : charData;
}
exports.buildTree = buildTree;
function numberValues(depth) {
    return depth.toString();
}
function charValues(depth) {
    return String.fromCharCode('A'.charCodeAt(0) + (depth % 26));
}
function flattenTree(node, target) {
    if (target === void 0) { target = []; }
    target.push(node);
    if (node.left) {
        flattenTree(node.left, target);
    }
    if (node.right) {
        flattenTree(node.right, target);
    }
    return target;
}
exports.flattenTree = flattenTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQXdDO0FBRXhDO0lBSUUsa0JBQ1csS0FBYSxFQUFTLEtBQWEsRUFBUyxRQUFnQixFQUM1RCxJQUFtQixFQUFTLEtBQW9CO1FBRGhELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUM1RCxTQUFJLEdBQUosSUFBSSxDQUFlO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUN6RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFJRCxzQkFBSSwyQkFBSztRQUZULHdFQUF3RTtRQUN4RSxpQkFBaUI7YUFDakIsY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyx3QkFBd0IsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN0RixlQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFkWSw0QkFBUTtBQWdCckIsSUFBSSxlQUF1QixDQUFDO0FBRTVCLElBQUksVUFBb0IsQ0FBQztBQUN6QixJQUFJLFFBQWtCLENBQUM7QUFFdkIsSUFBSSxFQUFFLENBQUM7QUFFUDtJQUNFLGdCQUFRLEdBQUcsc0JBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3pDLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxvQkFBb0IsU0FBaUIsRUFBRSxPQUFrQztJQUN2RSxJQUFNLFFBQVEsR0FBRyxTQUFTLEdBQUcsZ0JBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbEYsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkYsQ0FBQztBQUVZLFFBQUEsU0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUU1RDtJQUNFLGVBQWUsRUFBRSxDQUFDO0lBQ2xCLE1BQU0sQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDckQsQ0FBQztBQUhELDhCQUdDO0FBRUQsc0JBQXNCLEtBQWE7SUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBRUQsb0JBQW9CLEtBQWE7SUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRCxxQkFBNEIsSUFBYyxFQUFFLE1BQXVCO0lBQXZCLHVCQUFBLEVBQUEsV0FBdUI7SUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNkLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNmLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFURCxrQ0FTQyJ9