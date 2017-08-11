/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT, ɵgetDOM as getDOM } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import * as url from 'url';
import { INITIAL_CONFIG } from './tokens';
/**
 * @param {?} urlStr
 * @return {?}
 */
function parseUrl(urlStr) {
    const /** @type {?} */ parsedUrl = url.parse(urlStr);
    return {
        pathname: parsedUrl.pathname || '',
        search: parsedUrl.search || '',
        hash: parsedUrl.hash || '',
    };
}
/**
 * Server-side implementation of URL state. Implements `pathname`, `search`, and `hash`
 * but not the state stack.
 */
export class ServerPlatformLocation {
    /**
     * @param {?} _doc
     * @param {?} _config
     */
    constructor(_doc, _config) {
        this._doc = _doc;
        this._path = '/';
        this._search = '';
        this._hash = '';
        this._hashUpdate = new Subject();
        const /** @type {?} */ config = (_config);
        if (!!config && !!config.url) {
            const /** @type {?} */ parsedUrl = parseUrl(config.url);
            this._path = parsedUrl.pathname;
            this._search = parsedUrl.search;
            this._hash = parsedUrl.hash;
        }
    }
    /**
     * @return {?}
     */
    getBaseHrefFromDOM() { return ((getDOM().getBaseHref(this._doc))); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onPopState(fn) {
        // No-op: a state stack is not implemented, so
        // no events will ever come.
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onHashChange(fn) { this._hashUpdate.subscribe(fn); }
    /**
     * @return {?}
     */
    get pathname() { return this._path; }
    /**
     * @return {?}
     */
    get search() { return this._search; }
    /**
     * @return {?}
     */
    get hash() { return this._hash; }
    /**
     * @return {?}
     */
    get url() { return `${this.pathname}${this.search}${this.hash}`; }
    /**
     * @param {?} value
     * @param {?} oldUrl
     * @return {?}
     */
    setHash(value, oldUrl) {
        if (this._hash === value) {
            // Don't fire events if the hash has not changed.
            return;
        }
        this._hash = value;
        const /** @type {?} */ newUrl = this.url;
        scheduleMicroTask(() => this._hashUpdate.next(/** @type {?} */ ({ type: 'hashchange', oldUrl, newUrl })));
    }
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    replaceState(state, title, newUrl) {
        const /** @type {?} */ oldUrl = this.url;
        const /** @type {?} */ parsedUrl = parseUrl(newUrl);
        this._path = parsedUrl.pathname;
        this._search = parsedUrl.search;
        this.setHash(parsedUrl.hash, oldUrl);
    }
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    pushState(state, title, newUrl) {
        this.replaceState(state, title, newUrl);
    }
    /**
     * @return {?}
     */
    forward() { throw new Error('Not implemented'); }
    /**
     * @return {?}
     */
    back() { throw new Error('Not implemented'); }
}
ServerPlatformLocation.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ServerPlatformLocation.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [INITIAL_CONFIG,] },] },
];
function ServerPlatformLocation_tsickle_Closure_declarations() {
    /** @type {?} */
    ServerPlatformLocation.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ServerPlatformLocation.ctorParameters;
    /** @type {?} */
    ServerPlatformLocation.prototype._path;
    /** @type {?} */
    ServerPlatformLocation.prototype._search;
    /** @type {?} */
    ServerPlatformLocation.prototype._hash;
    /** @type {?} */
    ServerPlatformLocation.prototype._hashUpdate;
    /** @type {?} */
    ServerPlatformLocation.prototype._doc;
}
/**
 * @param {?} fn
 * @return {?}
 */
export function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
//# sourceMappingURL=location.js.map