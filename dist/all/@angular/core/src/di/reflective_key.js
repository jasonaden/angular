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
var forward_ref_1 = require("./forward_ref");
/**
 * A unique object used for retrieving items from the {@link ReflectiveInjector}.
 *
 * Keys have:
 * - a system-wide unique `id`.
 * - a `token`.
 *
 * `Key` is used internally by {@link ReflectiveInjector} because its system-wide unique `id` allows
 * the
 * injector to store created objects in a more efficient way.
 *
 * `Key` should not be created directly. {@link ReflectiveInjector} creates keys automatically when
 * resolving
 * providers.
 * @deprecated No replacement
 */
var ReflectiveKey = (function () {
    /**
     * Private
     */
    function ReflectiveKey(token, id) {
        this.token = token;
        this.id = id;
        if (!token) {
            throw new Error('Token must be defined!');
        }
    }
    Object.defineProperty(ReflectiveKey.prototype, "displayName", {
        /**
         * Returns a stringified token.
         */
        get: function () { return util_1.stringify(this.token); },
        enumerable: true,
        configurable: true
    });
    /**
     * Retrieves a `Key` for a token.
     */
    ReflectiveKey.get = function (token) {
        return _globalKeyRegistry.get(forward_ref_1.resolveForwardRef(token));
    };
    Object.defineProperty(ReflectiveKey, "numberOfKeys", {
        /**
         * @returns the number of keys registered in the system.
         */
        get: function () { return _globalKeyRegistry.numberOfKeys; },
        enumerable: true,
        configurable: true
    });
    return ReflectiveKey;
}());
exports.ReflectiveKey = ReflectiveKey;
/**
 * @internal
 */
var KeyRegistry = (function () {
    function KeyRegistry() {
        this._allKeys = new Map();
    }
    KeyRegistry.prototype.get = function (token) {
        if (token instanceof ReflectiveKey)
            return token;
        if (this._allKeys.has(token)) {
            return this._allKeys.get(token);
        }
        var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
        this._allKeys.set(token, newKey);
        return newKey;
    };
    Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
        get: function () { return this._allKeys.size; },
        enumerable: true,
        configurable: true
    });
    return KeyRegistry;
}());
exports.KeyRegistry = KeyRegistry;
var _globalKeyRegistry = new KeyRegistry();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9rZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9yZWZsZWN0aXZlX2tleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdDQUFrQztBQUNsQyw2Q0FBZ0Q7QUFHaEQ7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0g7SUFDRTs7T0FFRztJQUNILHVCQUFtQixLQUFhLEVBQVMsRUFBVTtRQUFoQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFLRCxzQkFBSSxzQ0FBVztRQUhmOztXQUVHO2FBQ0gsY0FBNEIsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFM0Q7O09BRUc7SUFDSSxpQkFBRyxHQUFWLFVBQVcsS0FBYTtRQUN0QixNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLCtCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUtELHNCQUFXLDZCQUFZO1FBSHZCOztXQUVHO2FBQ0gsY0FBb0MsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9FLG9CQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQTFCWSxzQ0FBYTtBQTRCMUI7O0dBRUc7QUFDSDtJQUFBO1FBQ1UsYUFBUSxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBZXRELENBQUM7SUFiQyx5QkFBRyxHQUFILFVBQUksS0FBYTtRQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxhQUFhLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFHLENBQUM7UUFDcEMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELHNCQUFJLHFDQUFZO2FBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzNELGtCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQWhCWSxrQ0FBVztBQWtCeEIsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDIn0=