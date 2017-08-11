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
var testing_1 = require("@angular/core/testing");
var element_schema_registry_1 = require("../../src/schema/element_schema_registry");
var binding_parser_1 = require("../../src/template_parser/binding_parser");
function main() {
    describe('BindingParser', function () {
        var registry;
        beforeEach(testing_1.inject([element_schema_registry_1.ElementSchemaRegistry], function (_registry) { registry = _registry; }));
        describe('possibleSecurityContexts', function () {
            function hrefSecurityContexts(selector) {
                return binding_parser_1.calcPossibleSecurityContexts(registry, selector, 'href', false);
            }
            it('should return a single security context if the selector as an element name', function () { expect(hrefSecurityContexts('a')).toEqual([core_1.SecurityContext.URL]); });
            it('should return the possible security contexts if the selector has no element name', function () {
                expect(hrefSecurityContexts('[myDir]')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
            it('should exclude possible elements via :not', function () {
                expect(hrefSecurityContexts('[myDir]:not(link):not(base)')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL
                ]);
            });
            it('should not exclude possible narrowed elements via :not', function () {
                expect(hrefSecurityContexts('[myDir]:not(link.someClass):not(base.someClass)')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
            it('should return SecurityContext.NONE if there are no possible elements', function () { expect(hrefSecurityContexts('img:not(img)')).toEqual([core_1.SecurityContext.NONE]); });
            it('should return the union of the possible security contexts if multiple selectors are specified', function () {
                expect(binding_parser_1.calcPossibleSecurityContexts(registry, 'a,link', 'href', false)).toEqual([
                    core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ19wYXJzZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvdGVtcGxhdGVfcGFyc2VyL2JpbmRpbmdfcGFyc2VyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEM7QUFDOUMsaURBQTZDO0FBRTdDLG9GQUErRTtBQUMvRSwyRUFBc0Y7QUFFdEY7SUFDRSxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksUUFBK0IsQ0FBQztRQUVwQyxVQUFVLENBQUMsZ0JBQU0sQ0FDYixDQUFDLCtDQUFxQixDQUFDLEVBQUUsVUFBQyxTQUFnQyxJQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9GLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtZQUNuQyw4QkFBOEIsUUFBZ0I7Z0JBQzVDLE1BQU0sQ0FBQyw2Q0FBNEIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6RSxDQUFDO1lBRUQsRUFBRSxDQUFDLDRFQUE0RSxFQUM1RSxjQUFRLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHNCQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhGLEVBQUUsQ0FBQyxrRkFBa0YsRUFBRTtnQkFDckYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUM5QyxzQkFBZSxDQUFDLElBQUksRUFBRSxzQkFBZSxDQUFDLEdBQUcsRUFBRSxzQkFBZSxDQUFDLFlBQVk7aUJBQ3hFLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO2dCQUM5QyxNQUFNLENBQUMsb0JBQW9CLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDbEUsc0JBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQWUsQ0FBQyxHQUFHO2lCQUMxQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtnQkFDM0QsTUFBTSxDQUFDLG9CQUFvQixDQUFDLGlEQUFpRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3RGLHNCQUFlLENBQUMsSUFBSSxFQUFFLHNCQUFlLENBQUMsR0FBRyxFQUFFLHNCQUFlLENBQUMsWUFBWTtpQkFDeEUsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQ3RFLGNBQVEsTUFBTSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsc0JBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUYsRUFBRSxDQUFDLCtGQUErRixFQUMvRjtnQkFDRSxNQUFNLENBQUMsNkNBQTRCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzlFLHNCQUFlLENBQUMsR0FBRyxFQUFFLHNCQUFlLENBQUMsWUFBWTtpQkFDbEQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTVDRCxvQkE0Q0MifQ==