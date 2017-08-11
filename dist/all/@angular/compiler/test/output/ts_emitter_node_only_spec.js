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
var o = require("@angular/compiler/src/output/output_ast");
var ts_emitter_1 = require("@angular/compiler/src/output/ts_emitter");
var parse_util_1 = require("@angular/compiler/src/parse_util");
var source_map_util_1 = require("./source_map_util");
var someGenFilePath = 'somePackage/someGenFile';
var someSourceFilePath = 'somePackage/someSourceFile';
function main() {
    // Not supported features of our OutputAst in TS:
    // - real `const` like in Dart
    // - final fields
    describe('TypeScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () {
            emitter = new ts_emitter_1.TypeScriptEmitter();
            someVar = o.variable('someVar');
        });
        function emitSourceMap(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someSourceFilePath, someGenFilePath, stmts, preamble);
            return source_map_util_1.extractSourceMap(source);
        }
        describe('source maps', function () {
            it('should emit an inline source map', function () {
                var source = new compiler_1.ParseSourceFile(';;;var', 'in.js');
                var startLocation = new compiler_1.ParseLocation(source, 0, 0, 3);
                var endLocation = new compiler_1.ParseLocation(source, 7, 0, 6);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfZW1pdHRlcl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvb3V0cHV0L3RzX2VtaXR0ZXJfbm9kZV9vbmx5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBaUU7QUFFakUsMkRBQTZEO0FBRTdELHNFQUEwRTtBQUMxRSwrREFBaUU7QUFFakUscURBQXdFO0FBRXhFLElBQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDO0FBQ2xELElBQU0sa0JBQWtCLEdBQUcsNEJBQTRCLENBQUM7QUFFeEQ7SUFDRSxpREFBaUQ7SUFDakQsOEJBQThCO0lBQzlCLGlCQUFpQjtJQUVqQixRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUEwQixDQUFDO1FBQy9CLElBQUksT0FBc0IsQ0FBQztRQUUzQixVQUFVLENBQUM7WUFDVCxPQUFPLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUJBQXVCLElBQWlDLEVBQUUsUUFBaUI7WUFDekUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUYsTUFBTSxDQUFDLGtDQUFnQixDQUFDLE1BQU0sQ0FBRyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsSUFBTSxNQUFNLEdBQUcsSUFBSSwwQkFBZSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdEQsSUFBTSxhQUFhLEdBQUcsSUFBSSx3QkFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFNLFdBQVcsR0FBRyxJQUFJLHdCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQU0sVUFBVSxHQUFHLElBQUksNEJBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ25FLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDeEQsSUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUVsRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxxQ0FBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO3FCQUNoRCxPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXBDRCxvQkFvQ0MifQ==