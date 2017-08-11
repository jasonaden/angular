"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MockSchemaRegistry = (function () {
    function MockSchemaRegistry(existingProperties, attrPropMapping, existingElements, invalidProperties, invalidAttributes) {
        this.existingProperties = existingProperties;
        this.attrPropMapping = attrPropMapping;
        this.existingElements = existingElements;
        this.invalidProperties = invalidProperties;
        this.invalidAttributes = invalidAttributes;
    }
    MockSchemaRegistry.prototype.hasProperty = function (tagName, property, schemas) {
        var value = this.existingProperties[property];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        var value = this.existingElements[tagName.toLowerCase()];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this.existingElements); };
    MockSchemaRegistry.prototype.securityContext = function (selector, property, isAttribute) {
        return core_1.SecurityContext.NONE;
    };
    MockSchemaRegistry.prototype.getMappedPropName = function (attrName) { return this.attrPropMapping[attrName] || attrName; };
    MockSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    MockSchemaRegistry.prototype.validateProperty = function (name) {
        if (this.invalidProperties.indexOf(name) > -1) {
            return { error: true, msg: "Binding to property '" + name + "' is disallowed for security reasons" };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.validateAttribute = function (name) {
        if (this.invalidAttributes.indexOf(name) > -1) {
            return {
                error: true,
                msg: "Binding to attribute '" + name + "' is disallowed for security reasons"
            };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { return propName; };
    MockSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        return { error: null, value: val.toString() };
    };
    return MockSchemaRegistry;
}());
exports.MockSchemaRegistry = MockSchemaRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hX3JlZ2lzdHJ5X21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9zY2hlbWFfcmVnaXN0cnlfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHNDQUE4RDtBQUU5RDtJQUNFLDRCQUNXLGtCQUE0QyxFQUM1QyxlQUF3QyxFQUN4QyxnQkFBMEMsRUFBUyxpQkFBZ0MsRUFDbkYsaUJBQWdDO1FBSGhDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUMsb0JBQWUsR0FBZixlQUFlLENBQXlCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEI7UUFBUyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWU7UUFDbkYsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFlO0lBQUcsQ0FBQztJQUUvQyx3Q0FBVyxHQUFYLFVBQVksT0FBZSxFQUFFLFFBQWdCLEVBQUUsT0FBeUI7UUFDdEUsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN6QyxDQUFDO0lBRUQsdUNBQVUsR0FBVixVQUFXLE9BQWUsRUFBRSxXQUE2QjtRQUN2RCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxpREFBb0IsR0FBcEIsY0FBbUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9FLDRDQUFlLEdBQWYsVUFBZ0IsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLFdBQW9CO1FBQ3RFLE1BQU0sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsOENBQWlCLEdBQWpCLFVBQWtCLFFBQWdCLElBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVsRywyREFBOEIsR0FBOUIsY0FBMkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFbkUsNkNBQWdCLEdBQWhCLFVBQWlCLElBQVk7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsMEJBQXdCLElBQUkseUNBQXNDLEVBQUMsQ0FBQztRQUNoRyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRCw4Q0FBaUIsR0FBakIsVUFBa0IsSUFBWTtRQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUM7Z0JBQ0wsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLDJCQUF5QixJQUFJLHlDQUFzQzthQUN6RSxDQUFDO1FBQ0osQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsNERBQStCLEdBQS9CLFVBQWdDLFFBQWdCLElBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDOUUseURBQTRCLEdBQTVCLFVBQTZCLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsR0FBa0I7UUFFOUYsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQW5ERCxJQW1EQztBQW5EWSxnREFBa0IifQ==