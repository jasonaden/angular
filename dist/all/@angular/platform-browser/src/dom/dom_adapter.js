"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _DOM = null;
function getDOM() {
    return _DOM;
}
exports.getDOM = getDOM;
function setDOM(adapter) {
    _DOM = adapter;
}
exports.setDOM = setDOM;
function setRootDomAdapter(adapter) {
    if (!_DOM) {
        _DOM = adapter;
    }
}
exports.setRootDomAdapter = setRootDomAdapter;
/* tslint:disable:requireParameterType */
/**
 * Provides DOM operations in an environment-agnostic way.
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
var DomAdapter = (function () {
    function DomAdapter() {
        this.resourceLoaderType = null;
    }
    Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
        /**
         * Maps attribute names to their corresponding property names for cases
         * where attribute name doesn't match property name.
         */
        get: function () { return this._attrToPropMap; },
        set: function (value) { this._attrToPropMap = value; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    return DomAdapter;
}());
exports.DomAdapter = DomAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZG9tX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxJQUFJLElBQUksR0FBZSxJQUFNLENBQUM7QUFFOUI7SUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUZELHdCQUVDO0FBRUQsZ0JBQXVCLE9BQW1CO0lBQ3hDLElBQUksR0FBRyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUZELHdCQUVDO0FBRUQsMkJBQWtDLE9BQW1CO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNWLElBQUksR0FBRyxPQUFPLENBQUM7SUFDakIsQ0FBQztBQUNILENBQUM7QUFKRCw4Q0FJQztBQUVELHlDQUF5QztBQUN6Qzs7Ozs7R0FLRztBQUNIO0lBQUE7UUFDUyx1QkFBa0IsR0FBYyxJQUFNLENBQUM7SUFnSWhELENBQUM7SUFqSEMsc0JBQUkscUNBQWE7UUFKakI7OztXQUdHO2FBQ0gsY0FBK0MsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2FBQzVFLFVBQWtCLEtBQThCLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FETjtJQUFBLENBQUM7SUFDSyxDQUFDO0lBZ0hyRixpQkFBQztBQUFELENBQUMsQUFqSUQsSUFpSUM7QUFqSXFCLGdDQUFVIn0=