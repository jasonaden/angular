/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {\@link Request}.
 *
 * \@experimental
 * @abstract
 */
var ConnectionBackend = (function () {
    function ConnectionBackend() {
    }
    return ConnectionBackend;
}());
export { ConnectionBackend };
function ConnectionBackend_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} request
     * @return {?}
     */
    ConnectionBackend.prototype.createConnection = function (request) { };
}
/**
 * Abstract class from which real connections are derived.
 *
 * \@experimental
 * @abstract
 */
var Connection = (function () {
    function Connection() {
    }
    return Connection;
}());
export { Connection };
function Connection_tsickle_Closure_declarations() {
    /** @type {?} */
    Connection.prototype.readyState;
    /** @type {?} */
    Connection.prototype.request;
    /** @type {?} */
    Connection.prototype.response;
}
/**
 * An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
 *
 * \@experimental
 * @abstract
 */
var XSRFStrategy = (function () {
    function XSRFStrategy() {
    }
    return XSRFStrategy;
}());
export { XSRFStrategy };
function XSRFStrategy_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} req
     * @return {?}
     */
    XSRFStrategy.prototype.configureRequest = function (req) { };
}
/**
 * Interface for options to construct a RequestOptions, based on
 * [RequestInit](https://fetch.spec.whatwg.org/#requestinit) from the Fetch spec.
 *
 * \@experimental
 * @record
 */
export function RequestOptionsArgs() { }
function RequestOptionsArgs_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.url;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.method;
    /**
     * @deprecated from 4.0.0. Use params instead.
     * @type {?|undefined}
     */
    RequestOptionsArgs.prototype.search;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.params;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.headers;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.body;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.withCredentials;
    /** @type {?|undefined} */
    RequestOptionsArgs.prototype.responseType;
}
/**
 * Required structure when constructing new Request();
 * @record
 */
export function RequestArgs() { }
function RequestArgs_tsickle_Closure_declarations() {
    /** @type {?} */
    RequestArgs.prototype.url;
}
/**
 * Interface for options to construct a Response, based on
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) from the Fetch spec.
 *
 * \@experimental
 * @record
 */
export function ResponseOptionsArgs() { }
function ResponseOptionsArgs_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.body;
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.status;
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.statusText;
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.headers;
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.type;
    /** @type {?|undefined} */
    ResponseOptionsArgs.prototype.url;
}
//# sourceMappingURL=interfaces.js.map