"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SVG_PREFIX = ':svg:';
// Element | Node interfaces
// see https://developer.mozilla.org/en-US/docs/Web/API/Element
// see https://developer.mozilla.org/en-US/docs/Web/API/Node
var ELEMENT_IF = '[Element]';
// HTMLElement interface
// see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
var HTMLELEMENT_IF = '[HTMLElement]';
var HTMLELEMENT_TAGS = 'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr';
var ALL_HTML_TAGS = 
// https://www.w3.org/TR/html5/index.html
'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr,' +
    // https://html.spec.whatwg.org/
    'details,summary,menu,menuitem';
// Elements missing from Chrome (HtmlUnknownElement), to be manually added
var MISSING_FROM_CHROME = {
    'data^[HTMLElement]': ['value'],
    'keygen^[HTMLElement]': ['!autofocus', 'challenge', '!disabled', 'form', 'keytype', 'name'],
    // TODO(vicb): Figure out why Chrome and WhatWG do not agree on the props
    // 'menu^[HTMLElement]': ['type', 'label'],
    'menuitem^[HTMLElement]': ['type', 'label', 'icon', '!disabled', '!checked', 'radiogroup', '!default'],
    'summary^[HTMLElement]': [],
    'time^[HTMLElement]': ['dateTime'],
    ':svg:cursor^:svg:': [],
};
var _G = global;
var document = typeof _G['document'] == 'object' ? _G['document'] : null;
function extractSchema() {
    if (!document)
        return null;
    var SVGGraphicsElement = _G['SVGGraphicsElement'];
    if (!SVGGraphicsElement)
        return null;
    var element = document.createElement('video');
    var descMap = new Map();
    var visited = {};
    // HTML top level
    extractProperties(Node, element, visited, descMap, ELEMENT_IF, '');
    extractProperties(Element, element, visited, descMap, ELEMENT_IF, '');
    extractProperties(HTMLElement, element, visited, descMap, HTMLELEMENT_IF, ELEMENT_IF);
    extractProperties(HTMLElement, element, visited, descMap, HTMLELEMENT_TAGS, HTMLELEMENT_IF);
    extractProperties(HTMLMediaElement, element, visited, descMap, 'media', HTMLELEMENT_IF);
    // SVG top level
    var svgAnimation = document.createElementNS('http://www.w3.org/2000/svg', 'set');
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var svgFeFuncA = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA');
    var svgGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    var svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    var SVGAnimationElement = _G['SVGAnimationElement'];
    var SVGGeometryElement = _G['SVGGeometryElement'];
    var SVGComponentTransferFunctionElement = _G['SVGComponentTransferFunctionElement'];
    var SVGGradientElement = _G['SVGGradientElement'];
    var SVGTextContentElement = _G['SVGTextContentElement'];
    var SVGTextPositioningElement = _G['SVGTextPositioningElement'];
    extractProperties(SVGElement, svgText, visited, descMap, SVG_PREFIX, HTMLELEMENT_IF);
    extractProperties(SVGGraphicsElement, svgText, visited, descMap, SVG_PREFIX + 'graphics', SVG_PREFIX);
    extractProperties(SVGAnimationElement, svgAnimation, visited, descMap, SVG_PREFIX + 'animation', SVG_PREFIX);
    extractProperties(SVGGeometryElement, svgPath, visited, descMap, SVG_PREFIX + 'geometry', SVG_PREFIX);
    extractProperties(SVGComponentTransferFunctionElement, svgFeFuncA, visited, descMap, SVG_PREFIX + 'componentTransferFunction', SVG_PREFIX);
    extractProperties(SVGGradientElement, svgGradient, visited, descMap, SVG_PREFIX + 'gradient', SVG_PREFIX);
    extractProperties(SVGTextContentElement, svgText, visited, descMap, SVG_PREFIX + 'textContent', SVG_PREFIX + 'graphics');
    extractProperties(SVGTextPositioningElement, svgText, visited, descMap, SVG_PREFIX + 'textPositioning', SVG_PREFIX + 'textContent');
    // Get all element types
    var types = Object.getOwnPropertyNames(window).filter(function (k) { return /^(HTML|SVG).*?Element$/.test(k); });
    types.sort();
    types.forEach(function (type) { extractRecursiveProperties(visited, descMap, window[type]); });
    // Add elements missed by Chrome auto-detection
    Object.keys(MISSING_FROM_CHROME).forEach(function (elHierarchy) {
        descMap.set(elHierarchy, MISSING_FROM_CHROME[elHierarchy]);
    });
    assertNoMissingTags(descMap);
    return descMap;
}
exports.extractSchema = extractSchema;
function assertNoMissingTags(descMap) {
    var extractedTags = [];
    Array.from(descMap.keys()).forEach(function (key) {
        extractedTags.push.apply(extractedTags, key.split('|')[0].split('^')[0].split(','));
    });
    var missingTags = ALL_HTML_TAGS.split(',').filter(function (tag) { return extractedTags.indexOf(tag) == -1; });
    if (missingTags.length) {
        throw new Error("DOM schema misses tags: " + missingTags.join(','));
    }
}
function extractRecursiveProperties(visited, descMap, type) {
    var name = extractName(type);
    if (visited[name]) {
        return name;
    }
    var superName;
    switch (name) {
        case ELEMENT_IF:
            // ELEMENT_IF is the top most interface (Element | Node)
            superName = '';
            break;
        case HTMLELEMENT_IF:
            superName = ELEMENT_IF;
            break;
        default:
            superName =
                extractRecursiveProperties(visited, descMap, type.prototype.__proto__.constructor);
    }
    var instance = null;
    name.split(',').forEach(function (tagName) {
        instance = type['name'].startsWith('SVG') ?
            document.createElementNS('http://www.w3.org/2000/svg', tagName.replace(SVG_PREFIX, '')) :
            document.createElement(tagName);
        var htmlType;
        switch (tagName) {
            case 'cite':
                // <cite> interface is `HTMLQuoteElement`
                htmlType = HTMLElement;
                break;
            default:
                htmlType = type;
        }
        if (!(instance instanceof htmlType)) {
            throw new Error("Tag <" + tagName + "> is not an instance of " + htmlType['name']);
        }
    });
    extractProperties(type, instance, visited, descMap, name, superName);
    return name;
}
function extractProperties(type, instance, visited, descMap, name, superName) {
    if (!type)
        return;
    visited[name] = true;
    var fullName = name + (superName ? '^' + superName : '');
    var props = descMap.has(fullName) ? descMap.get(fullName) : [];
    var prototype = type.prototype;
    var keys = Object.getOwnPropertyNames(prototype);
    keys.sort();
    keys.forEach(function (name) {
        if (name.startsWith('on')) {
            props.push('*' + name.substr(2));
        }
        else {
            var typeCh = _TYPE_MNEMONICS[typeof instance[name]];
            var descriptor = Object.getOwnPropertyDescriptor(prototype, name);
            var isSetter = descriptor && descriptor.set;
            if (typeCh !== void 0 && !name.startsWith('webkit') && isSetter) {
                props.push(typeCh + name);
            }
        }
    });
    // There is no point in using `Node.nodeValue`, filter it out
    descMap.set(fullName, type === Node ? props.filter(function (p) { return p != '%nodeValue'; }) : props);
}
function extractName(type) {
    var name = type['name'];
    switch (name) {
        // see https://www.w3.org/TR/html5/index.html
        // TODO(vicb): generate this map from all the element types
        case 'Element':
            return ELEMENT_IF;
        case 'HTMLElement':
            return HTMLELEMENT_IF;
        case 'HTMLImageElement':
            return 'img';
        case 'HTMLAnchorElement':
            return 'a';
        case 'HTMLDListElement':
            return 'dl';
        case 'HTMLDirectoryElement':
            return 'dir';
        case 'HTMLHeadingElement':
            return 'h1,h2,h3,h4,h5,h6';
        case 'HTMLModElement':
            return 'ins,del';
        case 'HTMLOListElement':
            return 'ol';
        case 'HTMLParagraphElement':
            return 'p';
        case 'HTMLQuoteElement':
            return 'q,blockquote,cite';
        case 'HTMLTableCaptionElement':
            return 'caption';
        case 'HTMLTableCellElement':
            return 'th,td';
        case 'HTMLTableColElement':
            return 'col,colgroup';
        case 'HTMLTableRowElement':
            return 'tr';
        case 'HTMLTableSectionElement':
            return 'tfoot,thead,tbody';
        case 'HTMLUListElement':
            return 'ul';
        case 'SVGGraphicsElement':
            return SVG_PREFIX + 'graphics';
        case 'SVGMPathElement':
            return SVG_PREFIX + 'mpath';
        case 'SVGSVGElement':
            return SVG_PREFIX + 'svg';
        case 'SVGTSpanElement':
            return SVG_PREFIX + 'tspan';
        default:
            var isSVG = name.startsWith('SVG');
            if (name.startsWith('HTML') || isSVG) {
                name = name.replace('HTML', '').replace('SVG', '').replace('Element', '');
                if (isSVG && name.startsWith('FE')) {
                    name = 'fe' + name.substring(2);
                }
                else if (name) {
                    name = name.charAt(0).toLowerCase() + name.substring(1);
                }
                return isSVG ? SVG_PREFIX + name : name.toLowerCase();
            }
    }
    return null;
}
var _TYPE_MNEMONICS = {
    'string': '',
    'number': '#',
    'boolean': '!',
    'object': '%',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hX2V4dHJhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvc2NoZW1hL3NjaGVtYV9leHRyYWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFFM0IsNEJBQTRCO0FBQzVCLCtEQUErRDtBQUMvRCw0REFBNEQ7QUFDNUQsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQy9CLHdCQUF3QjtBQUN4QixtRUFBbUU7QUFDbkUsSUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBRXZDLElBQU0sZ0JBQWdCLEdBQ2xCLDBMQUEwTCxDQUFDO0FBRS9MLElBQU0sYUFBYTtBQUNmLHlDQUF5QztBQUN6QyxvakJBQW9qQjtJQUNwakIsZ0NBQWdDO0lBQ2hDLCtCQUErQixDQUFDO0FBRXBDLDBFQUEwRTtBQUMxRSxJQUFNLG1CQUFtQixHQUE2QjtJQUNwRCxvQkFBb0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUMvQixzQkFBc0IsRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDO0lBQzNGLHlFQUF5RTtJQUN6RSwyQ0FBMkM7SUFDM0Msd0JBQXdCLEVBQ3BCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDO0lBQ2hGLHVCQUF1QixFQUFFLEVBQUU7SUFDM0Isb0JBQW9CLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEMsbUJBQW1CLEVBQUUsRUFBRTtDQUN4QixDQUFDO0FBRUYsSUFBTSxFQUFFLEdBQVEsTUFBTSxDQUFDO0FBQ3ZCLElBQU0sUUFBUSxHQUFRLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsR0FB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