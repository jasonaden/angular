"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var collection_1 = require("./utils/collection");
function createEmptyUrlTree() {
    return new UrlTree(new UrlSegmentGroup([], {}), {}, null);
}
exports.createEmptyUrlTree = createEmptyUrlTree;
function containsTree(container, containee, exact) {
    if (exact) {
        return equalQueryParams(container.queryParams, containee.queryParams) &&
            equalSegmentGroups(container.root, containee.root);
    }
    return containsQueryParams(container.queryParams, containee.queryParams) &&
        containsSegmentGroup(container.root, containee.root);
}
exports.containsTree = containsTree;
function equalQueryParams(container, containee) {
    return collection_1.shallowEqual(container, containee);
}
function equalSegmentGroups(container, containee) {
    if (!equalPath(container.segments, containee.segments))
        return false;
    if (container.numberOfChildren !== containee.numberOfChildren)
        return false;
    for (var c in containee.children) {
        if (!container.children[c])
            return false;
        if (!equalSegmentGroups(container.children[c], containee.children[c]))
            return false;
    }
    return true;
}
function containsQueryParams(container, containee) {
    return Object.keys(containee).length <= Object.keys(container).length &&
        Object.keys(containee).every(function (key) { return containee[key] === container[key]; });
}
function containsSegmentGroup(container, containee) {
    return containsSegmentGroupHelper(container, containee, containee.segments);
}
function containsSegmentGroupHelper(container, containee, containeePaths) {
    if (container.segments.length > containeePaths.length) {
        var current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (containee.hasChildren())
            return false;
        return true;
    }
    else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths))
            return false;
        for (var c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegmentGroup(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    else {
        var current = containeePaths.slice(0, container.segments.length);
        var next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current))
            return false;
        if (!container.children[shared_1.PRIMARY_OUTLET])
            return false;
        return containsSegmentGroupHelper(container.children[shared_1.PRIMARY_OUTLET], containee, next);
    }
}
/**
 * @whatItDoes Represents the parsed URL.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree =
 *       router.parseUrl('/team/33/(user/victor//support:help)?debug=true#fragment');
 *     const f = tree.fragment; // return 'fragment'
 *     const q = tree.queryParams; // returns {debug: 'true'}
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments; // returns 2 segments 'team' and '33'
 *     g.children[PRIMARY_OUTLET].segments; // returns 2 segments 'user' and 'victor'
 *     g.children['support'].segments; // return 1 segment 'help'
 *   }
 * }
 * ```
 *
 * @description
 *
 * Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
 * serialized tree.
 * UrlTree is a data structure that provides a lot of affordances in dealing with URLs
 *
 * @stable
 */
var UrlTree = (function () {
    /** @internal */
    function UrlTree(
        /** The root segment group of the URL tree */
        root, 
        /** The query params of the URL */
        queryParams, 
        /** The fragment of the URL */
        fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    Object.defineProperty(UrlTree.prototype, "queryParamMap", {
        get: function () {
            if (!this._queryParamMap) {
                this._queryParamMap = shared_1.convertToParamMap(this.queryParams);
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    UrlTree.prototype.toString = function () { return DEFAULT_SERIALIZER.serialize(this); };
    return UrlTree;
}());
exports.UrlTree = UrlTree;
/**
 * @whatItDoes Represents the parsed URL segment group.
 *
 * See {@link UrlTree} for more information.
 *
 * @stable
 */
var UrlSegmentGroup = (function () {
    function UrlSegmentGroup(
        /** The URL segments of this group. See {@link UrlSegment} for more information */
        segments, 
        /** The list of children of this group */
        children) {
        var _this = this;
        this.segments = segments;
        this.children = children;
        /** The parent node in the url tree */
        this.parent = null;
        collection_1.forEach(children, function (v, k) { return v.parent = _this; });
    }
    /** Whether the segment has child segments */
    UrlSegmentGroup.prototype.hasChildren = function () { return this.numberOfChildren > 0; };
    Object.defineProperty(UrlSegmentGroup.prototype, "numberOfChildren", {
        /** Number of child segments */
        get: function () { return Object.keys(this.children).length; },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    UrlSegmentGroup.prototype.toString = function () { return serializePaths(this); };
    return UrlSegmentGroup;
}());
exports.UrlSegmentGroup = UrlSegmentGroup;
/**
 * @whatItDoes Represents a single URL segment.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree = router.parseUrl('/team;id=33');
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments;
 *     s[0].path; // returns 'team'
 *     s[0].parameters; // returns {id: 33}
 *   }
 * }
 * ```
 *
 * @description
 *
 * A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
 * parameters associated with the segment.
 *
 * @stable
 */
var UrlSegment = (function () {
    function UrlSegment(
        /** The path part of a URL segment */
        path, 
        /** The matrix parameters associated with a segment */
        parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    Object.defineProperty(UrlSegment.prototype, "parameterMap", {
        get: function () {
            if (!this._parameterMap) {
                this._parameterMap = shared_1.convertToParamMap(this.parameters);
            }
            return this._parameterMap;
        },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    UrlSegment.prototype.toString = function () { return serializePath(this); };
    return UrlSegment;
}());
exports.UrlSegment = UrlSegment;
function equalSegments(as, bs) {
    return equalPath(as, bs) && as.every(function (a, i) { return collection_1.shallowEqual(a.parameters, bs[i].parameters); });
}
exports.equalSegments = equalSegments;
function equalPath(as, bs) {
    if (as.length !== bs.length)
        return false;
    return as.every(function (a, i) { return a.path === bs[i].path; });
}
exports.equalPath = equalPath;
function mapChildrenIntoArray(segment, fn) {
    var res = [];
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet === shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    collection_1.forEach(segment.children, function (child, childOutlet) {
        if (childOutlet !== shared_1.PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    return res;
}
exports.mapChildrenIntoArray = mapChildrenIntoArray;
/**
 * @whatItDoes Serializes and deserializes a URL string into a URL tree.
 *
 * @description The url serialization strategy is customizable. You can
 * make all URLs case insensitive by providing a custom UrlSerializer.
 *
 * See {@link DefaultUrlSerializer} for an example of a URL serializer.
 *
 * @stable
 */
var UrlSerializer = (function () {
    function UrlSerializer() {
    }
    return UrlSerializer;
}());
exports.UrlSerializer = UrlSerializer;
/**
 * @whatItDoes A default implementation of the {@link UrlSerializer}.
 *
 * @description
 *
 * Example URLs:
 *
 * ```
 * /inbox/33(popup:compose)
 * /inbox/33;open=true/messages/44
 * ```
 *
 * DefaultUrlSerializer uses parentheses to serialize secondary segments (e.g., popup:compose), the
 * colon syntax to specify the outlet, and the ';parameter=value' syntax (e.g., open=true) to
 * specify route specific parameters.
 *
 * @stable
 */
var DefaultUrlSerializer = (function () {
    function DefaultUrlSerializer() {
    }
    /** Parses a url into a {@link UrlTree} */
    DefaultUrlSerializer.prototype.parse = function (url) {
        var p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    };
    /** Converts a {@link UrlTree} into a url */
    DefaultUrlSerializer.prototype.serialize = function (tree) {
        var segment = "/" + serializeSegment(tree.root, true);
        var query = serializeQueryParams(tree.queryParams);
        var fragment = typeof tree.fragment === "string" ? "#" + encodeURI(tree.fragment) : '';
        return "" + segment + query + fragment;
    };
    return DefaultUrlSerializer;
}());
exports.DefaultUrlSerializer = DefaultUrlSerializer;
var DEFAULT_SERIALIZER = new DefaultUrlSerializer();
function serializePaths(segment) {
    return segment.segments.map(function (p) { return serializePath(p); }).join('/');
}
exports.serializePaths = serializePaths;
function serializeSegment(segment, root) {
    if (!segment.hasChildren()) {
        return serializePaths(segment);
    }
    if (root) {
        var primary = segment.children[shared_1.PRIMARY_OUTLET] ?
            serializeSegment(segment.children[shared_1.PRIMARY_OUTLET], false) :
            '';
        var children_1 = [];
        collection_1.forEach(segment.children, function (v, k) {
            if (k !== shared_1.PRIMARY_OUTLET) {
                children_1.push(k + ":" + serializeSegment(v, false));
            }
        });
        return children_1.length > 0 ? primary + "(" + children_1.join('//') + ")" : primary;
    }
    else {
        var children = mapChildrenIntoArray(segment, function (v, k) {
            if (k === shared_1.PRIMARY_OUTLET) {
                return [serializeSegment(segment.children[shared_1.PRIMARY_OUTLET], false)];
            }
            return [k + ":" + serializeSegment(v, false)];
        });
        return serializePaths(segment) + "/(" + children.join('//') + ")";
    }
}
/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encode(s) {
    return encodeURIComponent(s)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';');
}
exports.encode = encode;
function decode(s) {
    return decodeURIComponent(s);
}
exports.decode = decode;
function serializePath(path) {
    return "" + encode(path.path) + serializeParams(path.parameters);
}
exports.serializePath = serializePath;
function serializeParams(params) {
    return Object.keys(params).map(function (key) { return ";" + encode(key) + "=" + encode(params[key]); }).join('');
}
function serializeQueryParams(params) {
    var strParams = Object.keys(params).map(function (name) {
        var value = params[name];
        return Array.isArray(value) ? value.map(function (v) { return encode(name) + "=" + encode(v); }).join('&') :
            encode(name) + "=" + encode(value);
    });
    return strParams.length ? "?" + strParams.join("&") : '';
}
var SEGMENT_RE = /^[^\/()?;=&#]+/;
function matchSegments(str) {
    var match = str.match(SEGMENT_RE);
    return match ? match[0] : '';
}
var QUERY_PARAM_RE = /^[^=?&#]+/;
// Return the name of the query param at the start of the string or an empty string
function matchQueryParams(str) {
    var match = str.match(QUERY_PARAM_RE);
    return match ? match[0] : '';
}
var QUERY_PARAM_VALUE_RE = /^[^?&#]+/;
// Return the value of the query param at the start of the string or an empty string
function matchUrlQueryParamValue(str) {
    var match = str.match(QUERY_PARAM_VALUE_RE);
    return match ? match[0] : '';
}
var UrlParser = (function () {
    function UrlParser(url) {
        this.url = url;
        this.remaining = url;
    }
    UrlParser.prototype.parseRootSegment = function () {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
            return new UrlSegmentGroup([], {});
        }
        // The root segment group never has segments
        return new UrlSegmentGroup([], this.parseChildren());
    };
    UrlParser.prototype.parseQueryParams = function () {
        var params = {};
        if (this.consumeOptional('?')) {
            do {
                this.parseQueryParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    };
    UrlParser.prototype.parseFragment = function () {
        return this.consumeOptional('#') ? decodeURI(this.remaining) : null;
    };
    UrlParser.prototype.parseChildren = function () {
        if (this.remaining === '') {
            return {};
        }
        this.consumeOptional('/');
        var segments = [];
        if (!this.peekStartsWith('(')) {
            segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            segments.push(this.parseSegment());
        }
        var children = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        var res = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
            res[shared_1.PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
    };
    // parse a segment with its matrix parameters
    // ie `name;k1=v1;k2`
    UrlParser.prototype.parseSegment = function () {
        var path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error("Empty path url segment cannot have parameters: '" + this.remaining + "'.");
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
    };
    UrlParser.prototype.parseMatrixParams = function () {
        var params = {};
        while (this.consumeOptional(';')) {
            this.parseParam(params);
        }
        return params;
    };
    UrlParser.prototype.parseParam = function (params) {
        var key = matchSegments(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var value = '';
        if (this.consumeOptional('=')) {
            var valueMatch = matchSegments(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decode(key)] = decode(value);
    };
    // Parse a single query parameter `name[=value]`
    UrlParser.prototype.parseQueryParam = function (params) {
        var key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var value = '';
        if (this.consumeOptional('=')) {
            var valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        var decodedKey = decode(key);
        var decodedVal = decode(value);
        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            var currentVal = params[decodedKey];
            if (!Array.isArray(currentVal)) {
                currentVal = [currentVal];
                params[decodedKey] = currentVal;
            }
            currentVal.push(decodedVal);
        }
        else {
            // Create a new value
            params[decodedKey] = decodedVal;
        }
    };
    // parse `(a/b//outlet_name:c/d)`
    UrlParser.prototype.parseParens = function (allowPrimary) {
        var segments = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
            var path = matchSegments(this.remaining);
            var next = this.remaining[path.length];
            // if is is not one of these characters, then the segment was unescaped
            // or the group was not closed
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error("Cannot parse url '" + this.url + "'");
            }
            var outletName = undefined;
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            }
            else if (allowPrimary) {
                outletName = shared_1.PRIMARY_OUTLET;
            }
            var children = this.parseChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[shared_1.PRIMARY_OUTLET] :
                new UrlSegmentGroup([], children);
            this.consumeOptional('//');
        }
        return segments;
    };
    UrlParser.prototype.peekStartsWith = function (str) { return this.remaining.startsWith(str); };
    // Consumes the prefix when it is present and returns whether it has been consumed
    UrlParser.prototype.consumeOptional = function (str) {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    };
    UrlParser.prototype.capture = function (str) {
        if (!this.consumeOptional(str)) {
            throw new Error("Expected \"" + str + "\".");
        }
    };
    return UrlParser;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL3VybF90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQXFFO0FBQ3JFLGlEQUF5RDtBQUV6RDtJQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFGRCxnREFFQztBQUVELHNCQUE2QixTQUFrQixFQUFFLFNBQWtCLEVBQUUsS0FBYztJQUNqRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQztZQUNqRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNwRSxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBUkQsb0NBUUM7QUFFRCwwQkFDSSxTQUFnQyxFQUFFLFNBQWdDO0lBQ3BFLE1BQU0sQ0FBQyx5QkFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsNEJBQTRCLFNBQTBCLEVBQUUsU0FBMEI7SUFDaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lB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