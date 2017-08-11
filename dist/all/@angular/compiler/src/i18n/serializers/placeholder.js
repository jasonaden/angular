"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 *
 * @internal
 */
var PlaceholderRegistry = (function () {
    function PlaceholderRegistry() {
        // Count the occurrence of the base name top generate a unique name
        this._placeHolderNameCounts = {};
        // Maps signature to placeholder names
        this._signatureToName = {};
    }
    PlaceholderRegistry.prototype.getStartTagPlaceholderName = function (tag, attrs, isVoid) {
        var signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var upperTag = tag.toUpperCase();
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    PlaceholderRegistry.prototype.getCloseTagPlaceholderName = function (tag) {
        var signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var upperTag = tag.toUpperCase();
        var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    PlaceholderRegistry.prototype.getPlaceholderName = function (name, content) {
        var upperName = name.toUpperCase();
        var signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    };
    PlaceholderRegistry.prototype.getUniquePlaceholder = function (name) {
        return this._generateUniqueName(name.toUpperCase());
    };
    // Generate a hash for a tag - does not take attribute order into account
    PlaceholderRegistry.prototype._hashTag = function (tag, attrs, isVoid) {
        var start = "<" + tag;
        var strAttrs = Object.keys(attrs).sort().map(function (name) { return " " + name + "=" + attrs[name]; }).join('');
        var end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
    };
    PlaceholderRegistry.prototype._hashClosingTag = function (tag) { return this._hashTag("/" + tag, {}, false); };
    PlaceholderRegistry.prototype._generateUniqueName = function (base) {
        var seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        var id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return base + "_" + id;
    };
    return PlaceholderRegistry;
}());
exports.PlaceholderRegistry = PlaceholderRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaTE4bi9zZXJpYWxpemVycy9wbGFjZWhvbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sd0JBQXdCLEdBQTBCO0lBQ3RELEdBQUcsRUFBRSxNQUFNO0lBQ1gsR0FBRyxFQUFFLFdBQVc7SUFDaEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLEdBQUcsRUFBRSxhQUFhO0lBQ2xCLElBQUksRUFBRSxXQUFXO0lBQ2pCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLElBQUksRUFBRSxjQUFjO0lBQ3BCLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsT0FBTyxFQUFFLFlBQVk7SUFDckIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsS0FBSyxFQUFFLGFBQWE7SUFDcEIsT0FBTyxFQUFFLFlBQVk7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsT0FBTyxFQUFFLGNBQWM7SUFDdkIsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixPQUFPLEVBQUUsY0FBYztJQUN2QixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLEdBQUcsRUFBRSxpQkFBaUI7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtDQUN2QixDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ0g7SUFBQTtRQUNF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