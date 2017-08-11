"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var js_emitter_1 = require("@angular/compiler/src/output/js_emitter");
var o = require("@angular/compiler/src/output/output_ast");
var parse_util_1 = require("@angular/compiler/src/parse_util");
var source_map_util_1 = require("./source_map_util");
var someGenFilePath = 'somePackage/someGenFile';
var someSourceFilePath = 'somePackage/someSourceFile';
function main() {
    describe('JavaScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () { emitter = new js_emitter_1.JavaScriptEmitter(); });
        function emitSourceMap(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someSourceFilePath, someGenFilePath, stmts, preamble);
            return source_map_util_1.extractSourceMap(source);
        }
        describe('source maps', function () {
            it('should emit an inline source map', function () {
                var source = new parse_util_1.ParseSourceFile(';;;var', 'in.js');
                var startLocation = new parse_util_1.ParseLocation(source, 0, 0, 3);
                var endLocation = new parse_util_1.ParseLocation(source, 7, 0, 6);
                var sourceSpan = new parse_util_1.ParseSourceSpan(startLocation, endLocation);
                var someVar = o.variable('someVar', null, sourceSpan);
                var sm = emitSourceMap(someVar.toStmt(), '/* MyPreamble \n */');
                expect(sm.sources).toEqual([someSourceFilePath, 'in.js']);
                expect(sm.sourcesContent).toEqual([' ', ';;;var']);
                expect(source_map_util_1.originalPositionFor(sm, { line: 3, column: 0 }))
                    .toEqual({ line: 1, column: 3, source: 'in.js' });
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNfZW1pdHRlcl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvb3V0cHV0L2pzX2VtaXR0ZXJfbm9kZV9vbmx5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxzRUFBMEU7QUFDMUUsMkRBQTZEO0FBRTdELCtEQUFpRztBQUVqRyxxREFBd0U7QUFFeEUsSUFBTSxlQUFlLEdBQUcseUJBQXlCLENBQUM7QUFDbEQsSUFBTSxrQkFBa0IsR0FBRyw0QkFBNEIsQ0FBQztBQUV4RDtJQUNFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixJQUFJLE9BQTBCLENBQUM7UUFDL0IsSUFBSSxPQUFzQixDQUFDO1FBRTNCLFVBQVUsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFJLDhCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCx1QkFBdUIsSUFBaUMsRUFBRSxRQUFpQjtZQUN6RSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsa0NBQWdCLENBQUMsTUFBTSxDQUFHLENBQUM7UUFDcEMsQ0FBQztRQUVELFFBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDdEIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO2dCQUNyQyxJQUFNLE1BQU0sR0FBRyxJQUFJLDRCQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN0RCxJQUFNLGFBQWEsR0FBRyxJQUFJLDBCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQU0sV0FBVyxHQUFHLElBQUksMEJBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBTSxVQUFVLEdBQUcsSUFBSSw0QkFBZSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDbkUsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN4RCxJQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLHFCQUFxQixDQUFDLENBQUM7Z0JBRWxFLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLHFDQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7cUJBQ2hELE9BQU8sQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBN0JELG9CQTZCQyJ9