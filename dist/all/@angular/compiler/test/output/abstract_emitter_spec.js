"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_emitter_1 = require("@angular/compiler/src/output/abstract_emitter");
function main() {
    describe('AbstractEmitter', function () {
        describe('escapeIdentifier', function () {
            it('should escape single quotes', function () { expect(abstract_emitter_1.escapeIdentifier("'", false)).toEqual("'\\''"); });
            it('should escape backslash', function () { expect(abstract_emitter_1.escapeIdentifier('\\', false)).toEqual("'\\\\'"); });
            it('should escape newlines', function () { expect(abstract_emitter_1.escapeIdentifier('\n', false)).toEqual("'\\n'"); });
            it('should escape carriage returns', function () { expect(abstract_emitter_1.escapeIdentifier('\r', false)).toEqual("'\\r'"); });
            it('should escape $', function () { expect(abstract_emitter_1.escapeIdentifier('$', true)).toEqual("'\\$'"); });
            it('should not escape $', function () { expect(abstract_emitter_1.escapeIdentifier('$', false)).toEqual("'$'"); });
            it('should add quotes for non-identifiers', function () { expect(abstract_emitter_1.escapeIdentifier('==', false, false)).toEqual("'=='"); });
            it('does not escape class (but it probably should)', function () { expect(abstract_emitter_1.escapeIdentifier('class', false, false)).toEqual('class'); });
        });
    });
}
exports.main = main;
function stripSourceMapAndNewLine(source) {
    if (source.endsWith('\n')) {
        source = source.substring(0, source.length - 1);
    }
    var smi = source.lastIndexOf('\n//#');
    if (smi == -1)
        return source;
    return source.slice(0, smi);
}
exports.stripSourceMapAndNewLine = stripSourceMapAndNewLine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfZW1pdHRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvYWJzdHJhY3RfZW1pdHRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0ZBQStFO0FBRS9FO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixFQUFFLENBQUMsNkJBQTZCLEVBQzdCLGNBQVEsTUFBTSxDQUFDLG1DQUFnQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJFLEVBQUUsQ0FBQyx5QkFBeUIsRUFDekIsY0FBUSxNQUFNLENBQUMsbUNBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkUsRUFBRSxDQUFDLHdCQUF3QixFQUN4QixjQUFRLE1BQU0sQ0FBQyxtQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0RSxFQUFFLENBQUMsZ0NBQWdDLEVBQ2hDLGNBQVEsTUFBTSxDQUFDLG1DQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXRFLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFRLE1BQU0sQ0FBQyxtQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RixFQUFFLENBQUMscUJBQXFCLEVBQUUsY0FBUSxNQUFNLENBQUMsbUNBQWdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsRUFBRSxDQUFDLHVDQUF1QyxFQUN2QyxjQUFRLE1BQU0sQ0FBQyxtQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUUsRUFBRSxDQUFDLGdEQUFnRCxFQUNoRCxjQUFRLE1BQU0sQ0FBQyxtQ0FBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF2QkQsb0JBdUJDO0FBRUQsa0NBQXlDLE1BQWM7SUFDckQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQVBELDREQU9DIn0=