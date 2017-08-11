"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var html_info_1 = require("../src/html_info");
describe('html_info', function () {
    var domRegistry = new compiler_1.DomElementSchemaRegistry();
    it('should have the same elements as the dom registry', function () {
        // If this test fails, replace the SCHEMA constant in html_info with the one
        // from dom_element_schema_registry and also verify the code to interpret
        // the schema is the same.
        var domElements = domRegistry.allKnownElementNames();
        var infoElements = html_info_1.SchemaInformation.instance.allKnownElements();
        var uniqueToDom = uniqueElements(infoElements, domElements);
        var uniqueToInfo = uniqueElements(domElements, infoElements);
        expect(uniqueToDom).toEqual([]);
        expect(uniqueToInfo).toEqual([]);
    });
    it('should have at least a sub-set of properties', function () {
        var elements = html_info_1.SchemaInformation.instance.allKnownElements();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            for (var _a = 0, _b = html_info_1.SchemaInformation.instance.propertiesOf(element); _a < _b.length; _a++) {
                var prop = _b[_a];
                expect(domRegistry.hasProperty(element, prop, []));
            }
        }
    });
});
function uniqueElements(a, b) {
    var s = new Set();
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var aItem = a_1[_i];
        s.add(aItem);
    }
    var result = [];
    var reported = new Set();
    for (var _a = 0, b_1 = b; _a < b_1.length; _a++) {
        var bItem = b_1[_a];
        if (!s.has(bItem) && !reported.has(bItem)) {
            reported.add(bItem);
            result.push(bItem);
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9pbmZvX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvaHRtbF9pbmZvX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMkQ7QUFDM0QsOENBQW1EO0FBRW5ELFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsSUFBTSxXQUFXLEdBQUcsSUFBSSxtQ0FBd0IsRUFBRSxDQUFDO0lBRW5ELEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtRQUN0RCw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLDBCQUEwQjtRQUMxQixJQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFNLFlBQVksR0FBRyw2QkFBaUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuRSxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlELElBQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sUUFBUSxHQUFHLDZCQUFpQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQy9ELEdBQUcsQ0FBQyxDQUFrQixVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVE7WUFBekIsSUFBTSxPQUFPLGlCQUFBO1lBQ2hCLEdBQUcsQ0FBQyxDQUFlLFVBQWdELEVBQWhELEtBQUEsNkJBQWlCLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBaEQsY0FBZ0QsRUFBaEQsSUFBZ0Q7Z0JBQTlELElBQU0sSUFBSSxTQUFBO2dCQUNiLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNwRDtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILHdCQUEyQixDQUFNLEVBQUUsQ0FBTTtJQUN2QyxJQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBSyxDQUFDO0lBQ3ZCLEdBQUcsQ0FBQyxDQUFnQixVQUFDLEVBQUQsT0FBQyxFQUFELGVBQUMsRUFBRCxJQUFDO1FBQWhCLElBQU0sS0FBSyxVQUFBO1FBQ2QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNkO0lBQ0QsSUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ3ZCLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFLLENBQUM7SUFDOUIsR0FBRyxDQUFDLENBQWdCLFVBQUMsRUFBRCxPQUFDLEVBQUQsZUFBQyxFQUFELElBQUM7UUFBaEIsSUFBTSxLQUFLLFVBQUE7UUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDIn0=