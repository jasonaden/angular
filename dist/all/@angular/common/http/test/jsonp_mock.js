"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MockScriptElement = (function () {
    function MockScriptElement() {
        this.listeners = {};
    }
    MockScriptElement.prototype.addEventListener = function (event, handler) {
        this.listeners[event] = handler;
    };
    MockScriptElement.prototype.removeEventListener = function (event) { delete this.listeners[event]; };
    return MockScriptElement;
}());
exports.MockScriptElement = MockScriptElement;
var MockDocument = (function () {
    function MockDocument() {
    }
    MockDocument.prototype.createElement = function (tag) {
        return new MockScriptElement();
    };
    Object.defineProperty(MockDocument.prototype, "body", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    MockDocument.prototype.appendChild = function (node) { this.mock = node; };
    MockDocument.prototype.removeNode = function (node) {
        if (this.mock === node) {
            this.mock = null;
        }
    };
    MockDocument.prototype.mockLoad = function () { this.mock.listeners.load(null); };
    MockDocument.prototype.mockError = function (err) { this.mock.listeners.error(err); };
    return MockDocument;
}());
exports.MockDocument = MockDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfbW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3QvanNvbnBfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIO0lBQ0U7UUFFQSxjQUFTLEdBR0wsRUFBRSxDQUFDO0lBTFEsQ0FBQztJQU9oQiw0Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBcUIsRUFBRSxPQUFpQjtRQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQWMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsK0NBQW1CLEdBQW5CLFVBQW9CLEtBQXFCLElBQVUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRix3QkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksOENBQWlCO0FBZTlCO0lBQUE7SUFvQkEsQ0FBQztJQWpCQyxvQ0FBYSxHQUFiLFVBQWMsR0FBYTtRQUN6QixNQUFNLENBQUMsSUFBSSxpQkFBaUIsRUFBOEIsQ0FBQztJQUM3RCxDQUFDO0lBRUQsc0JBQUksOEJBQUk7YUFBUixjQUFrQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFaEMsa0NBQVcsR0FBWCxVQUFZLElBQVMsSUFBVSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFbEQsaUNBQVUsR0FBVixVQUFXLElBQVM7UUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0lBRUQsK0JBQVEsR0FBUixjQUFtQixJQUFJLENBQUMsSUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFNLENBQUMsSUFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9ELGdDQUFTLEdBQVQsVUFBVSxHQUFVLElBQUksSUFBSSxDQUFDLElBQU0sQ0FBQyxTQUFTLENBQUMsS0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxtQkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksb0NBQVkifQ==