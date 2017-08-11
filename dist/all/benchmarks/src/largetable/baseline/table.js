"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TableComponent = (function () {
    function TableComponent(_rootEl) {
        this._rootEl = _rootEl;
    }
    Object.defineProperty(TableComponent.prototype, "data", {
        set: function (data) {
            if (data.length === 0) {
                this._destroy();
            }
            else if (this._renderCells) {
                this._update(data);
            }
            else {
                this._create(data);
            }
        },
        enumerable: true,
        configurable: true
    });
    TableComponent.prototype._destroy = function () {
        while (this._rootEl.lastChild) {
            this._rootEl.lastChild.remove();
        }
        this._renderCells = null;
    };
    TableComponent.prototype._update = function (data) {
        for (var r = 0; r < data.length; r++) {
            var dataRow = data[r];
            var renderRow = this._renderCells[r];
            for (var c = 0; c < dataRow.length; c++) {
                var dataCell = dataRow[c];
                var renderCell = renderRow[c];
                this._updateCell(renderCell, dataCell);
            }
        }
    };
    TableComponent.prototype._updateCell = function (renderCell, dataCell) {
        renderCell.textContent = dataCell.value;
    };
    TableComponent.prototype._create = function (data) {
        var table = document.createElement('table');
        this._rootEl.appendChild(table);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        this._renderCells = new Array(data.length);
        for (var r = 0; r < data.length; r++) {
            var dataRow = data[r];
            var tr = document.createElement('tr');
            tbody.appendChild(tr);
            var renderRow = new Array(dataRow.length);
            this._renderCells[r] = renderRow;
            for (var c = 0; c < dataRow.length; c++) {
                var dataCell = dataRow[c];
                var renderCell = document.createElement('td');
                if (r % 2 === 0) {
                    renderCell.style.backgroundColor = 'grey';
                }
                tr.appendChild(renderCell);
                renderRow[c] = renderCell;
                this._updateCell(renderCell, dataCell);
            }
        }
    };
    return TableComponent;
}());
exports.TableComponent = TableComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvYmFzZWxpbmUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSDtJQUVFLHdCQUFvQixPQUFZO1FBQVosWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUFHLENBQUM7SUFFcEMsc0JBQUksZ0NBQUk7YUFBUixVQUFTLElBQW1CO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNILENBQUM7OztPQUFBO0lBRU8saUNBQVEsR0FBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEMsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFTyxnQ0FBTyxHQUFmLFVBQWdCLElBQW1CO1FBQ2pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENB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