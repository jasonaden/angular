/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { stringify } from '../util';
import { resolveForwardRef } from './forward_ref';
import { Inject, Optional, Self, SkipSelf } from './metadata';
var /** @type {?} */ _THROW_IF_NOT_FOUND = new Object();
export var /** @type {?} */ THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
var _NullInjector = (function () {
    function _NullInjector() {
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    _NullInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = _THROW_IF_NOT_FOUND; }
        if (notFoundValue === _THROW_IF_NOT_FOUND) {
            throw new Error("NullInjectorError: No provider for " + stringify(token) + "!");
        }
        return notFoundValue;
    };
    return _NullInjector;
}());
/**
 * \@whatItDoes Injector interface
 * \@howToUse
 * ```
 * const injector: Injector = ...;
 * injector.get(...);
 * ```
 *
 * \@description
 * For more details, see the {\@linkDocs guide/dependency-injection "Dependency Injection Guide"}.
 *
 * ### Example
 *
 * {\@example core/di/ts/injector_spec.ts region='Injector'}
 *
 * `Injector` returns itself when given `Injector` as a token:
 * {\@example core/di/ts/injector_spec.ts region='injectInjector'}
 *
 * \@stable
 * @abstract
 */
var Injector = (function () {
    function Injector() {
    }
    /**
     * Create a new Injector which is configure using `StaticProvider`s.
     *
     * ### Example
     *
     * {\@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
     * @param {?} providers
     * @param {?=} parent
     * @return {?}
     */
    Injector.create = function (providers, parent) {
        return new StaticInjector(providers, parent);
    };
    return Injector;
}());
export { Injector };
Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
Injector.NULL = new _NullInjector();
function Injector_tsickle_Closure_declarations() {
    /** @type {?} */
    Injector.THROW_IF_NOT_FOUND;
    /** @type {?} */
    Injector.NULL;
    /**
     * Retrieves an instance from the injector based on the provided token.
     * If not found:
     * - Throws an error if no `notFoundValue` that is not equal to
     * Injector.THROW_IF_NOT_FOUND is given
     * - Returns the `notFoundValue` otherwise
     * @abstract
     * @template T
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    Injector.prototype.get = function (token, notFoundValue) { };
    /**
     * @deprecated from v4.0.0 use Type<T> or InjectionToken<T>
     * @suppress {duplicate}
     * @abstract
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    Injector.prototype.get = function (token, notFoundValue) { };
}
var /** @type {?} */ IDENT = function (value) {
    return value;
};
var /** @type {?} */ EMPTY = ([]);
var /** @type {?} */ CIRCULAR = IDENT;
var /** @type {?} */ MULTI_PROVIDER_FN = function () {
    return Array.prototype.slice.call(arguments);
};
var /** @type {?} */ GET_PROPERTY_NAME = ({});
var /** @type {?} */ USE_VALUE = getClosureSafeProperty({ provide: String, useValue: GET_PROPERTY_NAME });
var /** @type {?} */ NG_TOKEN_PATH = 'ngTokenPath';
var /** @type {?} */ NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
var /** @type {?} */ NULL_INJECTOR = Injector.NULL;
var /** @type {?} */ NEW_LINE = /\n/gm;
var /** @type {?} */ NO_NEW_LINE = 'ɵ';
var StaticInjector = (function () {
    /**
     * @param {?} providers
     * @param {?=} parent
     */
    function StaticInjector(providers, parent) {
        if (parent === void 0) { parent = NULL_INJECTOR; }
        this.parent = parent;
        var /** @type {?} */ records = this._records = new Map();
        records.set(Injector, /** @type {?} */ ({ token: Injector, fn: IDENT, deps: EMPTY, value: this, useNew: false }));
        recursivelyProcessProviders(records, providers);
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    StaticInjector.prototype.get = function (token, notFoundValue) {
        var /** @type {?} */ record = this._records.get(token);
        try {
            return tryResolveToken(token, record, this._records, this.parent, notFoundValue);
        }
        catch (e) {
            var /** @type {?} */ tokenPath = e[NG_TEMP_TOKEN_PATH];
            e.message = formatError('\n' + e.message, tokenPath);
            e[NG_TOKEN_PATH] = tokenPath;
            e[NG_TEMP_TOKEN_PATH] = null;
            throw e;
        }
    };
    /**
     * @return {?}
     */
    StaticInjector.prototype.toString = function () {
        var /** @type {?} */ tokens = ([]), /** @type {?} */ records = this._records;
        records.forEach(function (v, token) { return tokens.push(stringify(token)); });
        return "StaticInjector[" + tokens.join(', ') + "]";
    };
    return StaticInjector;
}());
export { StaticInjector };
function StaticInjector_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticInjector.prototype.parent;
    /** @type {?} */
    StaticInjector.prototype._records;
}
/**
 * @record
 */
function Record() { }
function Record_tsickle_Closure_declarations() {
    /** @type {?} */
    Record.prototype.fn;
    /** @type {?} */
    Record.prototype.useNew;
    /** @type {?} */
    Record.prototype.deps;
    /** @type {?} */
    Record.prototype.value;
}
/**
 * @record
 */
function DependencyRecord() { }
function DependencyRecord_tsickle_Closure_declarations() {
    /** @type {?} */
    DependencyRecord.prototype.token;
    /** @type {?} */
    DependencyRecord.prototype.options;
}
/**
 * @param {?} provider
 * @return {?}
 */
function resolveProvider(provider) {
    var /** @type {?} */ deps = computeDeps(provider);
    var /** @type {?} */ fn = IDENT;
    var /** @type {?} */ value = EMPTY;
    var /** @type {?} */ useNew = false;
    var /** @type {?} */ provide = resolveForwardRef(provider.provide);
    if (USE_VALUE in provider) {
        // We need to use USE_VALUE in provider since provider.useValue could be defined as undefined.
        value = ((provider)).useValue;
    }
    else if (((provider)).useFactory) {
        fn = ((provider)).useFactory;
    }
    else if (((provider)).useExisting) {
        // Just use IDENT
    }
    else if (((provider)).useClass) {
        useNew = true;
        fn = resolveForwardRef(((provider)).useClass);
    }
    else if (typeof provide == 'function') {
        useNew = true;
        fn = provide;
    }
    else {
        throw staticError('StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable', provider);
    }
    return { deps: deps, fn: fn, useNew: useNew, value: value };
}
/**
 * @param {?} token
 * @return {?}
 */
function multiProviderMixError(token) {
    return staticError('Cannot mix multi providers and regular providers', token);
}
/**
 * @param {?} records
 * @param {?} provider
 * @return {?}
 */
function recursivelyProcessProviders(records, provider) {
    if (provider) {
        provider = resolveForwardRef(provider);
        if (provider instanceof Array) {
            // if we have an array recurse into the array
            for (var /** @type {?} */ i = 0; i < provider.length; i++) {
                recursivelyProcessProviders(records, provider[i]);
            }
        }
        else if (typeof provider === 'function') {
            // Functions were supported in ReflectiveInjector, but are not here. For safety give useful
            // error messages
            throw staticError('Function/Class not supported', provider);
        }
        else if (provider && typeof provider === 'object' && provider.provide) {
            // At this point we have what looks like a provider: {provide: ?, ....}
            var /** @type {?} */ token = resolveForwardRef(provider.provide);
            var /** @type {?} */ resolvedProvider = resolveProvider(provider);
            if (provider.multi === true) {
                // This is a multi provider.
                var /** @type {?} */ multiProvider = records.get(token);
                if (multiProvider) {
                    if (multiProvider.fn !== MULTI_PROVIDER_FN) {
                        throw multiProviderMixError(token);
                    }
                }
                else {
                    // Create a placeholder factory which will look up the constituents of the multi provider.
                    records.set(token, multiProvider = ({
                        token: provider.provide,
                        deps: [],
                        useNew: false,
                        fn: MULTI_PROVIDER_FN,
                        value: EMPTY
                    }));
                }
                // Treat the provider as the token.
                token = provider;
                multiProvider.deps.push({ token: token, options: 6 /* Default */ });
            }
            var /** @type {?} */ record = records.get(token);
            if (record && record.fn == MULTI_PROVIDER_FN) {
                throw multiProviderMixError(token);
            }
            records.set(token, resolvedProvider);
        }
        else {
            throw staticError('Unexpected provider', provider);
        }
    }
}
/**
 * @param {?} token
 * @param {?} record
 * @param {?} records
 * @param {?} parent
 * @param {?} notFoundValue
 * @return {?}
 */
function tryResolveToken(token, record, records, parent, notFoundValue) {
    try {
        return resolveToken(token, record, records, parent, notFoundValue);
    }
    catch (e) {
        // ensure that 'e' is of type Error.
        if (!(e instanceof Error)) {
            e = new Error(e);
        }
        var /** @type {?} */ path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
        path.unshift(token);
        if (record && record.value == CIRCULAR) {
            // Reset the Circular flag.
            record.value = EMPTY;
        }
        throw e;
    }
}
/**
 * @param {?} token
 * @param {?} record
 * @param {?} records
 * @param {?} parent
 * @param {?} notFoundValue
 * @return {?}
 */
function resolveToken(token, record, records, parent, notFoundValue) {
    var /** @type {?} */ value;
    if (record) {
        // If we don't have a record, this implies that we don't own the provider hence don't know how
        // to resolve it.
        value = record.value;
        if (value == CIRCULAR) {
            throw Error(NO_NEW_LINE + 'Circular dependency');
        }
        else if (value === EMPTY) {
            record.value = CIRCULAR;
            var /** @type {?} */ obj = undefined;
            var /** @type {?} */ useNew = record.useNew;
            var /** @type {?} */ fn = record.fn;
            var /** @type {?} */ depRecords = record.deps;
            var /** @type {?} */ deps = EMPTY;
            if (depRecords.length) {
                deps = [];
                for (var /** @type {?} */ i = 0; i < depRecords.length; i++) {
                    var /** @type {?} */ depRecord = depRecords[i];
                    var /** @type {?} */ options = depRecord.options;
                    var /** @type {?} */ childRecord = options & 2 /* CheckSelf */ ? records.get(depRecord.token) : undefined;
                    deps.push(tryResolveToken(
                    // Current Token to resolve
                    depRecord.token, 
                    // A record which describes how to resolve the token.
                    // If undefined, this means we don't have such a record
                    childRecord, 
                    // Other records we know about.
                    records, 
                    // If we don't know how to resolve dependency and we should not check parent for it,
                    // than pass in Null injector.
                    !childRecord && !(options & 4 /* CheckParent */) ? NULL_INJECTOR : parent, options & 1 /* Optional */ ? null : Injector.THROW_IF_NOT_FOUND));
                }
            }
            record.value = value = useNew ? new ((_a = ((fn))).bind.apply(_a, [void 0].concat(deps)))() : fn.apply(obj, deps);
        }
    }
    else {
        value = parent.get(token, notFoundValue);
    }
    return value;
    var _a;
}
/**
 * @param {?} provider
 * @return {?}
 */
function computeDeps(provider) {
    var /** @type {?} */ deps = EMPTY;
    var /** @type {?} */ providerDeps = ((provider)).deps;
    if (providerDeps && providerDeps.length) {
        deps = [];
        for (var /** @type {?} */ i = 0; i < providerDeps.length; i++) {
            var /** @type {?} */ options = 6 /* Default */;
            var /** @type {?} */ token = resolveForwardRef(providerDeps[i]);
            if (token instanceof Array) {
                for (var /** @type {?} */ j = 0, /** @type {?} */ annotations = token; j < annotations.length; j++) {
                    var /** @type {?} */ annotation = annotations[j];
                    if (annotation instanceof Optional || annotation == Optional) {
                        options = options | 1 /* Optional */;
                    }
                    else if (annotation instanceof SkipSelf || annotation == SkipSelf) {
                        options = options & ~2 /* CheckSelf */;
                    }
                    else if (annotation instanceof Self || annotation == Self) {
                        options = options & ~4 /* CheckParent */;
                    }
                    else if (annotation instanceof Inject) {
                        token = ((annotation)).token;
                    }
                    else {
                        token = resolveForwardRef(annotation);
                    }
                }
            }
            deps.push({ token: token, options: options });
        }
    }
    else if (((provider)).useExisting) {
        var /** @type {?} */ token = resolveForwardRef(((provider)).useExisting);
        deps = [{ token: token, options: 6 /* Default */ }];
    }
    else if (!providerDeps && !(USE_VALUE in provider)) {
        // useValue & useExisting are the only ones which are exempt from deps all others need it.
        throw staticError('\'deps\' required', provider);
    }
    return deps;
}
/**
 * @param {?} text
 * @param {?} obj
 * @return {?}
 */
function formatError(text, obj) {
    text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
    var /** @type {?} */ context = stringify(obj);
    if (obj instanceof Array) {
        context = obj.map(stringify).join(' -> ');
    }
    else if (typeof obj === 'object') {
        var /** @type {?} */ parts = ([]);
        for (var /** @type {?} */ key in obj) {
            if (obj.hasOwnProperty(key)) {
                var /** @type {?} */ value = obj[key];
                parts.push(key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
            }
        }
        context = "{" + parts.join(', ') + "}";
    }
    return "StaticInjectorError[" + context + "]: " + text.replace(NEW_LINE, '\n  ');
}
/**
 * @param {?} text
 * @param {?} obj
 * @return {?}
 */
function staticError(text, obj) {
    return new Error(formatError(text, obj));
}
/**
 * @template T
 * @param {?} objWithPropertyToExtract
 * @return {?}
 */
function getClosureSafeProperty(objWithPropertyToExtract) {
    for (var /** @type {?} */ key in objWithPropertyToExtract) {
        if (objWithPropertyToExtract[key] === GET_PROPERTY_NAME) {
            return key;
        }
    }
    throw Error('!prop');
}
//# sourceMappingURL=injector.js.map