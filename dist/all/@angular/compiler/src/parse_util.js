"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var chars = require("./chars");
var compile_metadata_1 = require("./compile_metadata");
var ParseLocation = (function () {
    function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    ParseLocation.prototype.toString = function () {
        return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
    };
    ParseLocation.prototype.moveBy = function (delta) {
        var source = this.file.content;
        var len = source.length;
        var offset = this.offset;
        var line = this.line;
        var col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            var ch = source.charCodeAt(offset);
            if (ch == chars.$LF) {
                line--;
                var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            var ch = source.charCodeAt(offset);
            offset++;
            delta--;
            if (ch == chars.$LF) {
                line++;
                col = 0;
            }
            else {
                col++;
            }
        }
        return new ParseLocation(this.file, offset, line, col);
    };
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    ParseLocation.prototype.getContext = function (maxChars, maxLines) {
        var content = this.file.content;
        var startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            var endOffset = startOffset;
            var ctxChars = 0;
            var ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1),
            };
        }
        return null;
    };
    return ParseLocation;
}());
exports.ParseLocation = ParseLocation;
var ParseSourceFile = (function () {
    function ParseSourceFile(content, url) {
        this.content = content;
        this.url = url;
    }
    return ParseSourceFile;
}());
exports.ParseSourceFile = ParseSourceFile;
var ParseSourceSpan = (function () {
    function ParseSourceSpan(start, end, details) {
        if (details === void 0) { details = null; }
        this.start = start;
        this.end = end;
        this.details = details;
    }
    ParseSourceSpan.prototype.toString = function () {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    };
    return ParseSourceSpan;
}());
exports.ParseSourceSpan = ParseSourceSpan;
var ParseErrorLevel;
(function (ParseErrorLevel) {
    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel = exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
var ParseError = (function () {
    function ParseError(span, msg, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    ParseError.prototype.contextualMessage = function () {
        var ctx = this.span.start.getContext(100, 3);
        return ctx ? " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" : '';
    };
    ParseError.prototype.toString = function () {
        var details = this.span.details ? ", " + this.span.details : '';
        return "" + this.msg + this.contextualMessage() + ": " + this.span.start + details;
    };
    return ParseError;
}());
exports.ParseError = ParseError;
function typeSourceSpan(kind, type) {
    var moduleUrl = compile_metadata_1.identifierModuleUrl(type);
    var sourceFileName = moduleUrl != null ? "in " + kind + " " + compile_metadata_1.identifierName(type) + " in " + moduleUrl :
        "in " + kind + " " + compile_metadata_1.identifierName(type);
    var sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
exports.typeSourceSpan = typeSourceSpan;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9wYXJzZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0JBQWlDO0FBQ2pDLHVEQUFrRztBQUVsRztJQUNFLHVCQUNXLElBQXFCLEVBQVMsTUFBYyxFQUFTLElBQVksRUFDakUsR0FBVztRQURYLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFDakUsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7SUFFMUIsZ0NBQVEsR0FBUjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksR0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBSSxJQUFJLENBQUMsSUFBSSxTQUFJLElBQUksQ0FBQyxHQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDM0YsQ0FBQztJQUVELDhCQUFNLEdBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUMvQixNQUFNLEVBQUUsQ0FBQztZQUNULEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxN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