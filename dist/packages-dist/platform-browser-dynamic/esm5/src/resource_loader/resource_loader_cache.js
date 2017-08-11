/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler';
import { ɵglobal as global } from '@angular/core';
/**
 * An implementation of ResourceLoader that uses a template cache to avoid doing an actual
 * ResourceLoader.
 *
 * The template cache needs to be built and loaded into window.$templateCache
 * via a separate mechanism.
 */
var CachedResourceLoader = (function (_super) {
    tslib_1.__extends(CachedResourceLoader, _super);
    function CachedResourceLoader() {
        var _this = _super.call(this) || this;
        _this._cache = ((global)).$templateCache;
        if (_this._cache == null) {
            throw new Error('CachedResourceLoader: Template cache was not found in $templateCache.');
        }
        return _this;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    CachedResourceLoader.prototype.get = function (url) {
        if (this._cache.hasOwnProperty(url)) {
            return Promise.resolve(this._cache[url]);
        }
        else {
            return (Promise.reject('CachedResourceLoader: Did not find cached template for ' + url));
        }
    };
    return CachedResourceLoader;
}(ResourceLoader));
export { CachedResourceLoader };
function CachedResourceLoader_tsickle_Closure_declarations() {
    /** @type {?} */
    CachedResourceLoader.prototype._cache;
}
//# sourceMappingURL=resource_loader_cache.js.map