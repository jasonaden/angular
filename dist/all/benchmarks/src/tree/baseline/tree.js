"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TreeComponent = (function () {
    function TreeComponent(_rootEl) {
        this._rootEl = _rootEl;
    }
    Object.defineProperty(TreeComponent.prototype, "data", {
        set: function (data) {
            if (!data.left) {
                this._destroy();
            }
            else if (this._renderNodes) {
                this._update(data, 0);
            }
            else {
                this._create(this._rootEl, data, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    TreeComponent.prototype._create = function (parentNode, dataNode, index) {
        if (!this._renderNodes) {
            this._renderNodes = new Array(dataNode.transitiveChildCount);
        }
        var span = document.createElement('span');
        if (dataNode.depth % 2 === 0) {
            span.style.backgroundColor = 'grey';
        }
        parentNode.appendChild(span);
        this._renderNodes[index] = span;
        this._updateNode(span, dataNode);
        if (dataNode.left) {
            var leftTree = document.createElement('tree');
            parentNode.appendChild(leftTree);
            this._create(leftTree, dataNode.left, index + 1);
        }
        if (dataNode.right) {
            var rightTree = document.createElement('tree');
            parentNode.appendChild(rightTree);
            this._create(rightTree, dataNode.right, index + dataNode.left.transitiveChildCount + 1);
        }
    };
    TreeComponent.prototype._updateNode = function (renderNode, dataNode) {
        renderNode.textContent = " " + dataNode.value + " ";
    };
    TreeComponent.prototype._update = function (dataNode, index) {
        this._updateNode(this._renderNodes[index], dataNode);
        if (dataNode.left) {
            this._update(dataNode.left, index + 1);
        }
        if (dataNode.right) {
            this._update(dataNode.right, index + dataNode.left.transitiveChildCount + 1);
        }
    };
    TreeComponent.prototype._destroy = function () {
        while (this._rootEl.lastChild)
            this._rootEl.lastChild.remove();
        this._renderNodes = null;
    };
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9iYXNlbGluZS90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUg7SUFHRSx1QkFBb0IsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7SUFBRyxDQUFDO0lBRXBDLHNCQUFJLCtCQUFJO2FBQVIsVUFBUyxJQUFjO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDSCxDQUFDOzs7T0FBQTtJQUVPLCtCQUFPLEdBQWYsVUFBZ0IsVUFBZSxFQUFFLFFBQWtCLEVBQUUsS0FBYTtRQUNoRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVELElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDdEMsQ0FBQztRQUNELFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoRCxVQUFVLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDO0lBQ0gsQ0FBQztJQUVPLG1DQUFXLEdBQW5CLFVBQW9CLFVBQWUsRUFBRSxRQUFrQjtRQUNyRCxVQUFVLENBQUMsV0FBVyxHQUFHLE1BQUksUUFBUSxDQUFDLEtBQUssTUFBRyxDQUFDO0lBQ2pELENBQUM7SUFFTywrQkFBTyxHQUFmLFVBQWdCLFFBQWtCLEVBQUUsS0FBYTtRQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7SUFDSCxDQUFDO0lBRU8sZ0NBQVEsR0FBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUExREQsSUEwREM7QUExRFksc0NBQWEifQ==