"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var i18n = require("../i18n_ast");
var Serializer = (function () {
    function Serializer() {
    }
    // Creates a name mapper, see `PlaceholderMapper`
    // Returning `null` means that no name mapping is used.
    Serializer.prototype.createNameMapper = function (message) { return null; };
    return Serializer;
}());
exports.Serializer = Serializer;
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
var SimplePlaceholderMapper = (function (_super) {
    __extends(SimplePlaceholderMapper, _super);
    // create a mapping from the message
    function SimplePlaceholderMapper(message, mapName) {
        var _this = _super.call(this) || this;
        _this.mapName = mapName;
        _this.internalToPublic = {};
        _this.publicToNextId = {};
        _this.publicToInternal = {};
        message.nodes.forEach(function (node) { return node.visit(_this); });
        return _this;
    }
    SimplePlaceholderMapper.prototype.toPublicName = function (internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ?
            this.internalToPublic[internalName] :
            null;
    };
    SimplePlaceholderMapper.prototype.toInternalName = function (publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
            null;
    };
    SimplePlaceholderMapper.prototype.visitText = function (text, context) { return null; };
    SimplePlaceholderMapper.prototype.visitTagPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.startName);
        _super.prototype.visitTagPlaceholder.call(this, ph, context);
        this.visitPlaceholderName(ph.closeName);
    };
    SimplePlaceholderMapper.prototype.visitPlaceholder = function (ph, context) { this.visitPlaceholderName(ph.name); };
    SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.name);
    };
    // XMB placeholders could only contains A-Z, 0-9 and _
    SimplePlaceholderMapper.prototype.visitPlaceholderName = function (internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        var publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            var nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = publicName + "_" + nextId;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    };
    return SimplePlaceholderMapper;
}(i18n.RecurseVisitor));
exports.SimplePlaceholderMapper = SimplePlaceholderMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsa0NBQW9DO0FBRXBDO0lBQUE7SUFjQSxDQUFDO0lBSEMsaURBQWlEO0lBQ2pELHVEQUF1RDtJQUN2RCxxQ0FBZ0IsR0FBaEIsVUFBaUIsT0FBcUIsSUFBNEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEYsaUJBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRxQixnQ0FBVTtBQTRCaEM7O0dBRUc7QUFDSDtJQUE2QywyQ0FBbUI7SUFLOUQsb0NBQW9DO0lBQ3BDLGlDQUFZLE9BQXFCLEVBQVUsT0FBaUM7UUFBNUUsWUFDRSxpQkFBTyxTQUVSO1FBSDBDLGFBQU8sR0FBUCxPQUFPLENBQTBCO1FBTHBFLHNCQUFnQixHQUEwQixFQUFFLENBQUM7UUFDN0Msb0JBQWMsR0FBMEIsRUFBRSxDQUFDO1FBQzNDLHNCQUFnQixHQUEwQixFQUFFLENBQUM7UUFLbkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7O0lBQ2xELENBQUM7SUFFRCw4Q0FBWSxHQUFaLFVBQWEsWUFBb0I7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7WUFDbkMsSUFBSSxDQUFDO0lBQ1gsQ0FBQztJQUVELGdEQUFjLEdBQWQsVUFBZSxVQUFrQjtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO1lBQ2pDLElBQUksQ0FBQztJQUNqRSxDQUFDO0lBRUQsMkNBQVMsR0FBVCxVQUFVLElBQWUsRUFBRSxPQUFhLElBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFL0QscURBQW1CLEdBQW5CLFVBQW9CLEVBQXVCLEVBQUUsT0FBYTtRQUN4RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLGlCQUFNLG1CQUFtQixZQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxrREFBZ0IsR0FBaEIsVUFBaUIsRUFBb0IsRUFBRSxPQUFhLElBQVMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEcscURBQW1CLEdBQW5CLFVBQW9CLEVBQXVCLEVBQUUsT0FBYTtRQUN4RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxzREFBc0Q7SUFDOUMsc0RBQW9CLEdBQTVCLFVBQTZCLFlBQW9CO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELGlEQUFpRDtZQUNqRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUM3QyxVQUFVLEdBQU0sVUFBVSxTQUFJLE1BQVEsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNqRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEdBQUcsWUFBWSxDQUFDO0lBQ25ELENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUF4REQsQ0FBNkMsSUFBSSxDQUFDLGNBQWMsR0F3RC9EO0FBeERZLDBEQUF1QiJ9