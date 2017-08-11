"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
 * serialize and parse URL parameter keys and values.
 *
 * @experimental
 */
var HttpUrlEncodingCodec = (function () {
    function HttpUrlEncodingCodec() {
    }
    HttpUrlEncodingCodec.prototype.encodeKey = function (k) { return standardEncoding(k); };
    HttpUrlEncodingCodec.prototype.encodeValue = function (v) { return standardEncoding(v); };
    HttpUrlEncodingCodec.prototype.decodeKey = function (k) { return decodeURIComponent(k); };
    HttpUrlEncodingCodec.prototype.decodeValue = function (v) { return decodeURIComponent(v); };
    return HttpUrlEncodingCodec;
}());
exports.HttpUrlEncodingCodec = HttpUrlEncodingCodec;
function paramParser(rawParams, codec) {
    var map = new Map();
    if (rawParams.length > 0) {
        var params = rawParams.split('&');
        params.forEach(function (param) {
            var eqIdx = param.indexOf('=');
            var _a = eqIdx == -1 ?
                [codec.decodeKey(param), ''] :
                [codec.decodeKey(param.slice(0, eqIdx)), codec.decodeValue(param.slice(eqIdx + 1))], key = _a[0], val = _a[1];
            var list = map.get(key) || [];
            list.push(val);
            map.set(key, list);
        });
    }
    return map;
}
function standardEncoding(v) {
    return encodeURIComponent(v)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/gi, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace(/%2B/gi, '+')
        .replace(/%3D/gi, '=')
        .replace(/%3F/gi, '?')
        .replace(/%2F/gi, '/');
}
/**
 * An HTTP request/response body that represents serialized parameters,
 * per the MIME type `application/x-www-form-urlencoded`.
 *
 * This class is immuatable - all mutation operations return a new instance.
 *
 * @experimental
 */
var HttpParams = (function () {
    function HttpParams(options) {
        if (options === void 0) { options = {}; }
        this.updates = null;
        this.cloneFrom = null;
        this.encoder = options.encoder || new HttpUrlEncodingCodec();
        this.map = !!options.fromString ? paramParser(options.fromString, this.encoder) : null;
    }
    /**
     * Check whether the body has one or more values for the given parameter name.
     */
    HttpParams.prototype.has = function (param) {
        this.init();
        return this.map.has(param);
    };
    /**
     * Get the first value for the given parameter name, or `null` if it's not present.
     */
    HttpParams.prototype.get = function (param) {
        this.init();
        var res = this.map.get(param);
        return !!res ? res[0] : null;
    };
    /**
     * Get all values for the given parameter name, or `null` if it's not present.
     */
    HttpParams.prototype.getAll = function (param) {
        this.init();
        return this.map.get(param) || null;
    };
    /**
     * Get all the parameter names for this body.
     */
    HttpParams.prototype.keys = function () {
        this.init();
        return Array.from(this.map.keys());
    };
    /**
     * Construct a new body with an appended value for the given parameter name.
     */
    HttpParams.prototype.append = function (param, value) { return this.clone({ param: param, value: value, op: 'a' }); };
    /**
     * Construct a new body with a new value for the given parameter name.
     */
    HttpParams.prototype.set = function (param, value) { return this.clone({ param: param, value: value, op: 's' }); };
    /**
     * Construct a new body with either the given value for the given parameter
     * removed, if a value is given, or all values for the given parameter removed
     * if not.
     */
    HttpParams.prototype.delete = function (param, value) { return this.clone({ param: param, value: value, op: 'd' }); };
    /**
     * Serialize the body to an encoded string, where key-value pairs (separated by `=`) are
     * separated by `&`s.
     */
    HttpParams.prototype.toString = function () {
        var _this = this;
        this.init();
        return this.keys()
            .map(function (key) {
            var eKey = _this.encoder.encodeKey(key);
            return _this.map.get(key).map(function (value) { return eKey + '=' + _this.encoder.encodeValue(value); })
                .join('&');
        })
            .join('&');
    };
    HttpParams.prototype.clone = function (update) {
        var clone = new HttpParams({ encoder: this.encoder });
        clone.cloneFrom = this.cloneFrom || this;
        clone.updates = (this.updates || []).concat([update]);
        return clone;
    };
    HttpParams.prototype.init = function () {
        var _this = this;
        if (this.map === null) {
            this.map = new Map();
        }
        if (this.cloneFrom !== null) {
            this.cloneFrom.init();
            this.cloneFrom.keys().forEach(function (key) { return _this.map.set(key, _this.cloneFrom.map.get(key)); });
            this.updates.forEach(function (update) {
                switch (update.op) {
                    case 'a':
                    case 's':
                        var base = (update.op === 'a' ? _this.map.get(update.param) : undefined) || [];
                        base.push(update.value);
                        _this.map.set(update.param, base);
                        break;
                    case 'd':
                        if (update.value !== undefined) {
                            var base_1 = _this.map.get(update.param) || [];
                            var idx = base_1.indexOf(update.value);
                            if (idx !== -1) {
                                base_1.splice(idx, 1);
                            }
                            if (base_1.length > 0) {
                                _this.map.set(update.param, base_1);
                            }
                            else {
                                _this.map.delete(update.param);
                            }
                        }
                        else {
                            _this.map.delete(update.param);
                            break;
                        }
                }
            });
            this.cloneFrom = null;
        }
    };
    return HttpParams;
}());
exports.HttpParams = HttpParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL3BhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQWlCSDs7Ozs7R0FLRztBQUNIO0lBQUE7SUFRQSxDQUFDO0lBUEMsd0NBQVMsR0FBVCxVQUFVLENBQVMsSUFBWSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVELDBDQUFXLEdBQVgsVUFBWSxDQUFTLElBQVksTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RCx3Q0FBUyxHQUFULFVBQVUsQ0FBUyxJQUFZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUQsMENBQVcsR0FBWCxVQUFZLENBQVMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELDJCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxvREFBb0I7QUFXakMscUJBQXFCLFNBQWlCLEVBQUUsS0FBeUI7SUFDL0QsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sTUFBTSxHQUFhLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWE7WUFDM0IsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixJQUFBOzttR0FFaUYsRUFGaEYsV0FBRyxFQUFFLFdBQUcsQ0FFeUU7WUFDeEYsSUFBTSxJQUFJLEdBQUcsR0FB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