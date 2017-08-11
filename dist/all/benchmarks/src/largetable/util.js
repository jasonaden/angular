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
var TableCell = (function () {
    function TableCell(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
    }
    return TableCell;
}());
exports.TableCell = TableCell;
var tableCreateCount;
var numberData;
var charData;
init();
function init() {
    exports.maxRow = util_1.getIntParameter('rows');
    exports.maxCol = util_1.getIntParameter('cols');
    tableCreateCount = 0;
    numberData = [];
    charData = [];
    for (var r = 0; r <= exports.maxRow; r++) {
        var numberRow = [];
        numberData.push(numberRow);
        var charRow = [];
        charData.push(charRow);
        for (var c = 0; c <= exports.maxCol; c++) {
            numberRow.push(new TableCell(r, c, c + "/" + r));
            charRow.push(new TableCell(r, c, charValue(c) + "/" + charValue(r)));
        }
    }
}
function charValue(i) {
    return String.fromCharCode('A'.charCodeAt(0) + (i % 26));
}
exports.emptyTable = [];
function buildTable() {
    tableCreateCount++;
    return tableCreateCount % 2 ? numberData : charData;
}
exports.buildTable = buildTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvbGFyZ2V0YWJsZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQXdDO0FBRXhDO0lBQ0UsbUJBQW1CLEdBQVcsRUFBUyxHQUFXLEVBQVMsS0FBYTtRQUFyRCxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBQzlFLGdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw4QkFBUztBQUl0QixJQUFJLGdCQUF3QixDQUFDO0FBRzdCLElBQUksVUFBeUIsQ0FBQztBQUM5QixJQUFJLFFBQXVCLENBQUM7QUFFNUIsSUFBSSxFQUFFLENBQUM7QUFFUDtJQUNFLGNBQU0sR0FBRyxzQkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLGNBQU0sR0FBRyxzQkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztJQUNyQixVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGNBQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2pDLElBQU0sU0FBUyxHQUFnQixFQUFFLENBQUM7UUFDbEMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQixJQUFNLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO1FBQ2hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxjQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNqQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUssQ0FBQyxTQUFJLENBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBSSxTQUFTLENBQUMsQ0FBQyxDQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELG1CQUFtQixDQUFTO0lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRVksUUFBQSxVQUFVLEdBQWtCLEVBQUUsQ0FBQztBQUU1QztJQUNFLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsTUFBTSxDQUFDLGdCQUFnQixHQUFHLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3RELENBQUM7QUFIRCxnQ0FHQyJ9