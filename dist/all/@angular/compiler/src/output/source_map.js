"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
var VERSION = 3;
var JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
var SourceMapGenerator = (function () {
    function SourceMapGenerator(file) {
        if (file === void 0) { file = null; }
        this.file = file;
        this.sourcesContent = new Map();
        this.lines = [];
        this.lastCol0 = 0;
        this.hasMappings = false;
    }
    // The content is `null` when the content is expected to be loaded using the URL
    SourceMapGenerator.prototype.addSource = function (url, content) {
        if (content === void 0) { content = null; }
        if (!this.sourcesContent.has(url)) {
            this.sourcesContent.set(url, content);
        }
        return this;
    };
    SourceMapGenerator.prototype.addLine = function () {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
    };
    SourceMapGenerator.prototype.addMapping = function (col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
            throw new Error("A line must be added before mappings can be added");
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
            throw new Error("Unknown source file \"" + sourceUrl + "\"");
        }
        if (col0 == null) {
            throw new Error("The column in the generated code must be provided");
        }
        if (col0 < this.lastCol0) {
            throw new Error("Mapping should be added in output order");
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
            throw new Error("The source location must be provided when a source url is provided");
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({ col0: col0, sourceUrl: sourceUrl, sourceLine0: sourceLine0, sourceCol0: sourceCol0 });
        return this;
    };
    Object.defineProperty(SourceMapGenerator.prototype, "currentLine", {
        get: function () { return this.lines.slice(-1)[0]; },
        enumerable: true,
        configurable: true
    });
    SourceMapGenerator.prototype.toJSON = function () {
        var _this = this;
        if (!this.hasMappings) {
            return null;
        }
        var sourcesIndex = new Map();
        var sources = [];
        var sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach(function (url, i) {
            sourcesIndex.set(url, i);
            sources.push(url);
            sourcesContent.push(_this.sourcesContent.get(url) || null);
        });
        var mappings = '';
        var lastCol0 = 0;
        var lastSourceIndex = 0;
        var lastSourceLine0 = 0;
        var lastSourceCol0 = 0;
        this.lines.forEach(function (segments) {
            lastCol0 = 0;
            mappings += segments
                .map(function (segment) {
                // zero-based starting column of the line in the generated code
                var segAsStr = toBase64VLQ(segment.col0 - lastCol0);
                lastCol0 = segment.col0;
                if (segment.sourceUrl != null) {
                    // zero-based index into the “sources” list
                    segAsStr +=
                        toBase64VLQ(sourcesIndex.get(segment.sourceUrl) - lastSourceIndex);
                    lastSourceIndex = sourcesIndex.get(segment.sourceUrl);
                    // the zero-based starting line in the original source
                    segAsStr += toBase64VLQ(segment.sourceLine0 - lastSourceLine0);
                    lastSourceLine0 = segment.sourceLine0;
                    // the zero-based starting column in the original source
                    segAsStr += toBase64VLQ(segment.sourceCol0 - lastSourceCol0);
                    lastSourceCol0 = segment.sourceCol0;
                }
                return segAsStr;
            })
                .join(',');
            mappings += ';';
        });
        mappings = mappings.slice(0, -1);
        return {
            'file': this.file || '',
            'version': VERSION,
            'sourceRoot': '',
            'sources': sources,
            'sourcesContent': sourcesContent,
            'mappings': mappings,
        };
    };
    SourceMapGenerator.prototype.toJsComment = function () {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
            '';
    };
    return SourceMapGenerator;
}());
exports.SourceMapGenerator = SourceMapGenerator;
function toBase64String(value) {
    var b64 = '';
    value = util_1.utf8Encode(value);
    for (var i = 0; i < value.length;) {
        var i1 = value.charCodeAt(i++);
        var i2 = value.charCodeAt(i++);
        var i3 = value.charCodeAt(i++);
        b64 += toBase64Digit(i1 >> 2);
        b64 += toBase64Digit(((i1 & 3) << 4) | (isNaN(i2) ? 0 : i2 >> 4));
        b64 += isNaN(i2) ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 >> 6));
        b64 += isNaN(i2) || isNaN(i3) ? '=' : toBase64Digit(i3 & 63);
    }
    return b64;
}
exports.toBase64String = toBase64String;
function toBase64VLQ(value) {
    value = value < 0 ? ((-value) << 1) + 1 : value << 1;
    var out = '';
    do {
        var digit = value & 31;
        value = value >> 5;
        if (value > 0) {
            digit = digit | 32;
        }
        out += toBase64Digit(digit);
    } while (value > 0);
    return out;
}
var B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function toBase64Digit(value) {
    if (value < 0 || value >= 64) {
        throw new Error("Can only encode value in the range [0, 63]");
    }
    return B64_DIGITS[value];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvc291cmNlX21hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdDQUFtQztBQUVuQyx1RkFBdUY7QUFDdkYsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBRWxCLElBQU0sYUFBYSxHQUFHLGtEQUFrRCxDQUFDO0FBa0J6RTtJQU1FLDRCQUFvQixJQUF3QjtRQUF4QixxQkFBQSxFQUFBLFdBQXdCO1FBQXhCLFNBQUksR0FBSixJQUFJLENBQW9CO1FBTHBDLG1CQUFjLEdBQTZCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDckQsVUFBSyxHQUFnQixFQUFFLENBQUM7UUFDeEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixnQkFBVyxHQUFHLEtBQUssQ0FBQztJQUVtQixDQUFDO0lBRWhELGdGQUFnRjtJQUNoRixzQ0FBUyxHQUFULFVBQVUsR0FBVyxFQUFFLE9BQTJCO1FBQTNCLHdCQUFBLEVBQUEsY0FBMkI7UUFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELG9DQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHVDQUFVLEdBQVYsVUFBVyxJQUFZLEVBQUUsU0FBa0IsRUFB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