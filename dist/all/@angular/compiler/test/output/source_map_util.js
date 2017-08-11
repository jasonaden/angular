"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var b64 = require('base64-js');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
function originalPositionFor(sourceMap, genPosition) {
    var smc = new SourceMapConsumer(sourceMap);
    // Note: We don't return the original object as it also contains a `name` property
    // which is always null and we don't want to include that in our assertions...
    var _a = smc.originalPositionFor(genPosition), line = _a.line, column = _a.column, source = _a.source;
    return { line: line, column: column, source: source };
}
exports.originalPositionFor = originalPositionFor;
function extractSourceMap(source) {
    var idx = source.lastIndexOf('\n//#');
    if (idx == -1)
        return null;
    var smComment = source.slice(idx).trim();
    var smB64 = smComment.split('sourceMappingURL=data:application/json;base64,')[1];
    return smB64 ? JSON.parse(decodeB64String(smB64)) : null;
}
exports.extractSourceMap = extractSourceMap;
function decodeB64String(s) {
    return b64.toByteArray(s).reduce(function (s, c) { return s + String.fromCharCode(c); }, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvc291cmNlX21hcF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2pDLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLGlCQUFpQixDQUFDO0FBUWxFLDZCQUNJLFNBQW9CLEVBQ3BCLFdBQXlEO0lBQzNELElBQU0sR0FBRyxHQUFHLElBQUksaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0Msa0ZBQWtGO0lBQ2xGLDhFQUE4RTtJQUN4RSxJQUFBLHlDQUE2RCxFQUE1RCxjQUFJLEVBQUUsa0JBQU0sRUFBRSxrQkFBTSxDQUF5QztJQUNwRSxNQUFNLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDO0FBQ2hDLENBQUM7QUFSRCxrREFRQztBQUVELDBCQUFpQyxNQUFjO0lBQzdDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNELENBQUM7QUFORCw0Q0FNQztBQUVELHlCQUF5QixDQUFTO0lBQ2hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQVMsRUFBRSxDQUFTLElBQUssT0FBQSxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBMUIsQ0FBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3RixDQUFDIn0=