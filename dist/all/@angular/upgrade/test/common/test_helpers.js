"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function html(html) {
    // Don't return `body` itself, because using it as a `$rootElement` for ng1
    // will attach `$injector` to it and that will affect subsequent tests.
    var body = document.body;
    body.innerHTML = "<div>" + html.trim() + "</div>";
    var div = document.body.firstChild;
    if (div.childNodes.length === 1 && div.firstChild instanceof HTMLElement) {
        return div.firstChild;
    }
    return div;
}
exports.html = html;
function multiTrim(text, allSpace) {
    if (allSpace === void 0) { allSpace = false; }
    if (typeof text == 'string') {
        var repl = allSpace ? '' : ' ';
        return text.replace(/\n/g, '').replace(/\s+/g, repl).trim();
    }
    throw new Error('Argument can not be undefined.');
}
exports.multiTrim = multiTrim;
function nodes(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    return Array.prototype.slice.call(div.childNodes);
}
exports.nodes = nodes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L2NvbW1vbi90ZXN0X2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxjQUFxQixJQUFZO0lBQy9CLDJFQUEyRTtJQUMzRSx1RUFBdUU7SUFDdkUsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFRLENBQUM7SUFDN0MsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFxQixDQUFDO0lBRWhELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDekUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBWkQsb0JBWUM7QUFFRCxtQkFBMEIsSUFBK0IsRUFBRSxRQUFnQjtJQUFoQix5QkFBQSxFQUFBLGdCQUFnQjtJQUN6RSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzlELENBQUM7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQU5ELDhCQU1DO0FBRUQsZUFBc0IsSUFBWTtJQUNoQyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFKRCxzQkFJQyJ9