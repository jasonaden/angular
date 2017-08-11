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
var dom_adapter_1 = require("../dom/dom_adapter");
var url_sanitizer_1 = require("./url_sanitizer");
/** A <body> element that can be safely used to parse untrusted HTML. Lazily initialized below. */
var inertElement = null;
/** Lazily initialized to make sure the DOM adapter gets set before use. */
var DOM = null;
/** Returns an HTML element that is guaranteed to not execute code when creating elements in it. */
function getInertElement() {
    if (inertElement)
        return inertElement;
    DOM = dom_adapter_1.getDOM();
    // Prefer using <template> element if supported.
    var templateEl = DOM.createElement('template');
    if ('content' in templateEl)
        return templateEl;
    var doc = DOM.createHtmlDocument();
    inertElement = DOM.querySelector(doc, 'body');
    if (inertElement == null) {
        // usually there should be only one body element in the document, but IE doesn't have any, so we
        // need to create one.
        var html = DOM.createElement('html', doc);
        inertElement = DOM.createElement('body', doc);
        DOM.appendChild(html, inertElement);
        DOM.appendChild(doc, html);
    }
    return inertElement;
}
function tagSet(tags) {
    var res = {};
    for (var _i = 0, _a = tags.split(','); _i < _a.length; _i++) {
        var t = _a[_i];
        res[t] = true;
    }
    return res;
}
function merge() {
    var sets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i] = arguments[_i];
    }
    var res = {};
    for (var _a = 0, sets_1 = sets; _a < sets_1.length; _a++) {
        var s = sets_1[_a];
        for (var v in s) {
            if (s.hasOwnProperty(v))
                res[v] = true;
        }
    }
    return res;
}
// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements
// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var VOID_ELEMENTS = tagSet('area,br,col,hr,img,wbr');
// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr');
var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet('rp,rt');
var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
// Safe Block Elements - HTML5
var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet('address,article,' +
    'aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' +
    'h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'));
// Inline Elements - HTML5
var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet('a,abbr,acronym,audio,b,' +
    'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,' +
    'samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'));
var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
// Attributes that have href and hence need to be sanitized
var URI_ATTRS = tagSet('background,cite,href,itemtype,longdesc,poster,src,xlink:href');
// Attributes that have special href set hence need to be sanitized
var SRCSET_ATTRS = tagSet('srcset');
var HTML_ATTRS = tagSet('abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,' +
    'compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,' +
    'ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,' +
    'scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,' +
    'valign,value,vspace,width');
// NB: This currently consciously doesn't support SVG. SVG sanitization has had several security
// issues in the past, so it seems safer to leave it out if possible. If support for binding SVG via
// innerHTML is required, SVG attributes should be added here.
// NB: Sanitization does not allow <form> elements or other active elements (<button> etc). Those
// can be sanitized, but they increase security surface area without a legitimate use case, so they
// are left out here.
var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
/**
 * SanitizingHtmlSerializer serializes a DOM fragment, stripping out any unsafe elements and unsafe
 * attributes.
 */
var SanitizingHtmlSerializer = (function () {
    function SanitizingHtmlSerializer() {
        // Explicitly track if something was stripped, to avoid accidentally warning of sanitization just
        // because characters were re-encoded.
        this.sanitizedSomething = false;
        this.buf = [];
    }
    SanitizingHtmlSerializer.prototype.sanitizeChildren = function (el) {
        // This cannot use a TreeWalker, as it has to run on Angular's various DOM adapters.
        // However this code never accesses properties off of `document` before deleting its contents
        // again, so it shouldn't be vulnerable to DOM clobbering.
        var current = el.firstChild;
        while (current) {
            if (DOM.isElementNode(current)) {
                this.startElement(current);
            }
            else if (DOM.isTextNode(current)) {
                this.chars(DOM.nodeValue(current));
            }
            else {
                // Strip non-element, non-text nodes.
                this.sanitizedSomething = true;
            }
            if (DOM.firstChild(current)) {
                current = DOM.firstChild(current);
                continue;
            }
            while (current) {
                // Leaving the element. Walk up and to the right, closing tags as we go.
                if (DOM.isElementNode(current)) {
                    this.endElement(current);
                }
                var next = checkClobberedElement(current, DOM.nextSibling(current));
                if (next) {
                    current = next;
                    break;
                }
                current = checkClobberedElement(current, DOM.parentElement(current));
            }
        }
        return this.buf.join('');
    };
    SanitizingHtmlSerializer.prototype.startElement = function (element) {
        var _this = this;
        var tagName = DOM.nodeName(element).toLowerCase();
        if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
            this.sanitizedSomething = true;
            return;
        }
        this.buf.push('<');
        this.buf.push(tagName);
        DOM.attributeMap(element).forEach(function (value, attrName) {
            var lower = attrName.toLowerCase();
            if (!VALID_ATTRS.hasOwnProperty(lower)) {
                _this.sanitizedSomething = true;
                return;
            }
            // TODO(martinprobst): Special case image URIs for data:image/...
            if (URI_ATTRS[lower])
                value = url_sanitizer_1.sanitizeUrl(value);
            if (SRCSET_ATTRS[lower])
                value = url_sanitizer_1.sanitizeSrcset(value);
            _this.buf.push(' ');
            _this.buf.push(attrName);
            _this.buf.push('="');
            _this.buf.push(encodeEntities(value));
            _this.buf.push('"');
        });
        this.buf.push('>');
    };
    SanitizingHtmlSerializer.prototype.endElement = function (current) {
        var tagName = DOM.nodeName(current).toLowerCase();
        if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
            this.buf.push('</');
            this.buf.push(tagName);
            this.buf.push('>');
        }
    };
    SanitizingHtmlSerializer.prototype.chars = function (chars) { this.buf.push(encodeEntities(chars)); };
    return SanitizingHtmlSerializer;
}());
function checkClobberedElement(node, nextNode) {
    if (nextNode && DOM.contains(node, nextNode)) {
        throw new Error("Failed to sanitize html because the element is clobbered: " + DOM.getOuterHTML(node));
    }
    return nextNode;
}
// Regular Expressions for parsing tags and attributes
var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
// ! to ~ is the ASCII range.
var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 */
function encodeEntities(value) {
    return value.replace(/&/g, '&amp;')
        .replace(SURROGATE_PAIR_REGEXP, function (match) {
        var hi = match.charCodeAt(0);
        var low = match.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    })
        .replace(NON_ALPHANUMERIC_REGEXP, function (match) { return '&#' + match.charCodeAt(0) + ';'; })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
/**
 * When IE9-11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1'
 * attribute to declare ns1 namespace and prefixes the attribute with 'ns1' (e.g. 'ns1:xlink:foo').
 *
 * This is undesirable since we don't want to allow any of these custom attributes. This method
 * strips them all.
 */
function stripCustomNsAttrs(el) {
    DOM.attributeMap(el).forEach(function (_, attrName) {
        if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
            DOM.removeAttribute(el, attrName);
        }
    });
    for (var _i = 0, _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
        var n = _a[_i];
        if (DOM.isElementNode(n))
            stripCustomNsAttrs(n);
    }
}
/**
 * Sanitizes the given unsafe, untrusted HTML fragment, and returns HTML text that is safe to add to
 * the DOM in a browser environment.
 */
function sanitizeHtml(defaultDoc, unsafeHtmlInput) {
    try {
        var containerEl = getInertElement();
        // Make sure unsafeHtml is actually a string (TypeScript types are not enforced at runtime).
        var unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : '';
        // mXSS protection. Repeatedly parse the document to make sure it stabilizes, so that a browser
        // trying to auto-correct incorrect HTML cannot cause formerly inert HTML to become dangerous.
        var mXSSAttempts = 5;
        var parsedHtml = unsafeHtml;
        do {
            if (mXSSAttempts === 0) {
                throw new Error('Failed to sanitize html because the input is unstable');
            }
            mXSSAttempts--;
            unsafeHtml = parsedHtml;
            DOM.setInnerHTML(containerEl, unsafeHtml);
            if (defaultDoc.documentMode) {
                // strip custom-namespaced attributes on IE<=11
                stripCustomNsAttrs(containerEl);
            }
            parsedHtml = DOM.getInnerHTML(containerEl);
        } while (unsafeHtml !== parsedHtml);
        var sanitizer = new SanitizingHtmlSerializer();
        var safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
        // Clear out the body element.
        var parent_1 = DOM.getTemplateContent(containerEl) || containerEl;
        for (var _i = 0, _a = DOM.childNodesAsList(parent_1); _i < _a.length; _i++) {
            var child = _a[_i];
            DOM.removeChild(parent_1, child);
        }
        if (core_1.isDevMode() && sanitizer.sanitizedSomething) {
            DOM.log('WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).');
        }
        return safeHtml;
    }
    catch (e) {
        // In case anything goes wrong, clear out inertElement to reset the entire DOM structure.
        inertElement = null;
        throw e;
    }
}
exports.sanitizeHtml = sanitizeHtml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9zYW5pdGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9zZWN1cml0eS9odG1sX3Nhbml0aXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF3QztBQUV4QyxrREFBc0Q7QUFFdEQsaURBQTREO0FBRTVELGtHQUFrRztBQUNsRyxJQUFJLFlBQVksR0FBcUIsSUFBSSxDQUFDO0FBQzFDLDJFQUEyRTtBQUMzRSxJQUFJLEdBQUcsR0FBZSxJQUFNLENBQUM7QUFFN0IsbUdBQW1HO0FBQ25HO0lBQ0UsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDO1FBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN0QyxHQUFHLEdBQUcsb0JBQU0sRUFBRSxDQUFDO0lBRWYsZ0RBQWdEO0lBQ2hELElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLFVBQVUsQ0FBQztRQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFFL0MsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDckMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLGdHQUFnRztRQUNoRyxzQkFBc0I7UUFDdEIsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFFRCxnQkFBZ0IsSUFBWTtJQUMxQixJQUFNLEdBQUcsR0FBMkIsRUFBRSxDQUFDO0lBQ3ZDLEdBQUcsQ0FBQyxDQUFZLFVBQWUsRUFBZixLQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQWYsY0FBZSxFQUFmLElBQWU7UUFBMUIsSUFBTSxDQUFDLFNBQUE7UUFBcUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUFBO0lBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQ7SUFBZSxjQUFpQztTQUFqQyxVQUFpQyxFQUFqQyxxQkFBaUMsRUFBakMsSUFBaUM7UUFBakMseUJBQWlDOztJQUM5QyxJQUFNLEdBQUcsR0FBMkIsRUFBRSxDQUFDO0lBQ3ZDLEdBQUcsQ0FBQyxDQUFZLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJO1FBQWYsSUFBTSxDQUFDLGFBQUE7UUFDVixHQUFHLENBQUMsQ0FBQyxJQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN6QyxDQUFDO0tBQ0Y7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELG9EQUFvRDtBQUNwRCx1REFBdUQ7QUFDdkQsdUNBQXVDO0FBRXZDLDZCQUE2QjtBQUM3QiwyREFBMkQ7QUFDM0QsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFdkQsZ0ZBQWdGO0FBQ2hGLDJEQUEyRDtBQUMzRCxJQUFNLCtCQUErQixHQUFHLE1BQU0sQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0FBQ2pHLElBQU0sZ0NBQWdDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELElBQU0seUJBQXlCLEdBQzNCLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0FBRTdFLDhCQUE4QjtBQUM5QixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQ3hCLCtCQUErQixFQUMvQixNQUFNLENBQ0Ysa0JBQWtCO0lBQ2xCLHdHQUF3RztJQUN4RywyRUFBMkUsQ0FBQyxDQUFDLENBQUM7QUFFdEYsMEJBQTBCO0FBQzFCLElBQU0sZUFBZSxHQUFHLEtBQUssQ0FDekIsZ0NBQWdDLEVBQ2hDLE1BQU0sQ0FDRix5QkFBeUI7SUFDekIsK0ZBQStGO0lBQy9GLHdFQUF3RSxDQUFDLENBQUMsQ0FBQztBQUVuRixJQUFNLGNBQWMsR0FDaEIsS0FBSyxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFFckYsMkRBQTJEO0FBQzNELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO0FBRXpGLG1FQUFtRTtBQUNuRSxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUNyQiwrR0FBK0c7SUFDL0csbUdBQW1HO0lBQ25HLGdJQUFnSTtJQUNoSSwwR0FBMEc7SUFDMUcsMkJBQTJCLENBQUMsQ0FBQztBQUVqQyxnR0FBZ0c7QUFDaEcsb0dBQW9HO0FBQ3BHLDhEQUE4RDtBQUU5RCxpR0FBaUc7QUFDakcsbUdBQW1HO0FBQ25HLHFCQUFxQjtBQUVyQixJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUUvRDs7O0dBR0c7QUFDSDtJQUFBO1FBQ0UsaUdBQWlHO1FBQ2pHLHNDQUFzQztRQUMvQix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDMUIsUUFBRyxHQUFhLEVBQUUsQ0FBQztJQTJFN0IsQ0FBQztJQXpFQyxtREFBZ0IsR0FBaEIsVUFBaUIsRUFBVztRQUMxQixvRkFBb0Y7UUFDcEYsNkZBQTZGO1FBQzdGLDBEQUEwRDtRQUMxRCxJQUFJLE9BQU8sR0FBUyxFQUFFLENBQUMsVUFBWSxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxFQUFFLENBQUM7WUFDZixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFrQixDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLHFDQUFxQztnQkFDckMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBRyxDQUFDO2dCQUNwQyxRQUFRLENBQUM7WUFDWCxDQUFDO1lBQ0QsT0FBTyxPQUFPLEVBQUUsQ0FBQztnQkFDZix3RUFBd0U7Z0JBQ3hFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQWtCLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFFRCxJQUFJLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUcsQ0FBQyxDQUFDO2dCQUV0RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNULE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ2YsS0FBSyxDQUFDO2dCQUNSLENBQUM7Z0JBRUQsT0FBTyxHQUFHLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBRyxDQUFDLENBQUM7WUFDekUsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVPLCtDQUFZLEdBQXBCLFVBQXFCLE9BQWdCO1FBQXJDLGlCQXdCQztRQXZCQyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMvQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFhLEVBQUUsUUFBZ0I7WUFDaEUsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQztZQUNULENBQUM7WUFDRCxpRUFBaUU7WUFDakUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFDLEtBQUssR0FBRywyQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxLQUFLLEdBQUcsOEJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2RCxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNyQyxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFTyw2Q0FBVSxHQUFsQixVQUFtQixPQUFnQjtRQUNqQyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVPLHdDQUFLLEdBQWIsVUFBYyxLQUFhLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLCtCQUFDO0FBQUQsQ0FBQyxBQS9FRCxJQStFQztBQUVELCtCQUErQixJQUFVLEVBQUUsUUFBYztJQUN2RCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxLQUFLLENBQ1gsK0RBQTZELEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBRUQsc0RBQXNEO0FBQ3RELElBQU0scUJBQXFCLEdBQUcsaUNBQWlDLENBQUM7QUFDaEUsNkJBQTZCO0FBQzdCLElBQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDO0FBRWhEOzs7OztHQUtHO0FBQ0gsd0JBQXdCLEtBQWE7SUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUM5QixPQUFPLENBQ0oscUJBQXFCLEVBQ3JCLFVBQVMsS0FBYTtRQUNwQixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzNFLENBQUMsQ0FBQztTQUNMLE9BQU8sQ0FDSix1QkFBdUIsRUFDdkIsVUFBUyxLQUFhLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztTQUNyQixPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCw0QkFBNEIsRUFBVztJQUNyQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxRQUFRO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxXQUFXLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9ELEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILEdBQUcsQ0FBQyxDQUFZLFVBQXdCLEVBQXhCLEtBQUEsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUF4QixjQUF3QixFQUF4QixJQUF3QjtRQUFuQyxJQUFNLENBQUMsU0FBQTtRQUNWLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxrQkFBa0IsQ0FBQyxDQUFZLENBQUMsQ0FBQztLQUM1RDtBQUNILENBQUM7QUFFRDs7O0dBR0c7QUFDSCxzQkFBNkIsVUFBZSxFQUFFLGVBQXVCO0lBQ25FLElBQUksQ0FBQztRQUNILElBQU0sV0FBVyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQ3RDLDRGQUE0RjtRQUM1RixJQUFJLFVBQVUsR0FBRyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVoRSwrRkFBK0Y7UUFDL0YsOEZBQThGO1FBQzlGLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFNUIsR0FBRyxDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBQ0QsWUFBWSxFQUFFLENBQUM7WUFFZixVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUM1QiwrQ0FBK0M7Z0JBQy9DLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxDQUFDLFFBQVEsVUFBVSxLQUFLLFVBQVUsRUFBRTtRQUVwQyxJQUFNLFNBQVMsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7UUFDakQsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQztRQUVoRyw4QkFBOEI7UUFDOUIsSUFBTSxRQUFNLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQztRQUNsRSxHQUFHLENBQUMsQ0FBZ0IsVUFBNEIsRUFBNUIsS0FBQSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBTSxDQUFDLEVBQTVCLGNBQTRCLEVBQTVCLElBQTRCO1lBQTNDLElBQU0sS0FBSyxTQUFBO1lBQ2QsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7UUFFRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxFQUFFLElBQUksU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUNoRCxHQUFHLENBQUMsR0FBRyxDQUFDLG1GQUFtRixDQUFDLENBQUM7UUFDL0YsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCx5RkFBeUY7UUFDekYsWUFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixNQUFNLENBQUMsQ0FBQztJQUNWLENBQUM7QUFDSCxDQUFDO0FBN0NELG9DQTZDQyJ9