/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { stringify } from '../util';
import { resolveForwardRef } from './forward_ref';
import { Inject, Optional, Self, SkipSelf } from './metadata';
const /** @type {?} */ _THROW_IF_NOT_FOUND = new Object();
export const /** @type {?} */ THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
class _NullInjector {
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    get(token, notFoundValue = _THROW_IF_NOT_FOUND) {
        if (notFoundValue === _THROW_IF_NOT_FOUND) {
            throw new Error(`NullInjectorError: No provider for ${stringify(token)}!`);
        }
        return notFoundValue;
    }
}
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
export class Injector {
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
    static create(providers, parent) {
        return new StaticInjector(providers, parent);
    }
}
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
const /** @type {?} */ IDENT = function (value) {
    return value;
};
const /** @type {?} */ EMPTY = ([]);
const /** @type {?} */ CIRCULAR = IDENT;
const /** @type {?} */ MULTI_PROVIDER_FN = function () {
    return Array.prototype.slice.call(arguments);
};
const /** @type {?} */ GET_PROPERTY_NAME = ({});
const /** @type {?} */ USE_VALUE = getClosureSafeProperty({ provide: String, useValue: GET_PROPERTY_NAME });
const /** @type {?} */ NG_TOKEN_PATH = 'ngTokenPath';
const /** @type {?} */ NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
const /** @type {?} */ NULL_INJECTOR = Injector.NULL;
const /** @type {?} */ NEW_LINE = /\n/gm;
const /** @type {?} */ NO_NEW_LINE = 'ɵ';
export class StaticInjector {
    /**
     * @param {?} providers
     * @param {?=} parent
     */
    constructor(providers, parent = NULL_INJECTOR) {
        this.parent = parent;
        const /** @type {?} */ records = this._records = new Map();
        records.set(Injector, /** @type {?} */ ({ token: Injector, fn: IDENT, deps: EMPTY, value: this, useNew: false }));
        recursivelyProcessProviders(records, providers);
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    get(token, notFoundValue) {
        const /** @type {?} */ record = this._records.get(token);
        try {
            return tryResolveToken(token, record, this._records, this.parent, notFoundValue);
        }
        catch (e) {
            const /** @type {?} */ tokenPath = e[NG_TEMP_TOKEN_PATH];
            e.message = formatError('\n' + e.message, tokenPath);
            e[NG_TOKEN_PATH] = tokenPath;
            e[NG_TEMP_TOKEN_PATH] = null;
            throw e;
        }
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ tokens = ([]), /** @type {?} */ records = this._records;
        records.forEach((v, token) => tokens.push(stringify(token)));
        return `StaticInjector[${tokens.join(', ')}]`;
    }
}
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
    const /** @type {?} */ deps = computeDeps(provider);
    let /** @type {?} */ fn = IDENT;
    let /** @type {?} */ value = EMPTY;
    let /** @type {?} */ useNew = false;
    let /** @type {?} */ provide = resolveForwardRef(provider.provide);
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
    return { deps, fn, useNew, value };
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
            for (let /** @type {?} */ i = 0; i < provider.length; i++) {
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
            let /** @type {?} */ token = resolveForwardRef(provider.provide);
            const /** @type {?} */ resolvedProvider = resolveProvider(provider);
            if (provider.multi === true) {
                // This is a multi provider.
                let /** @type {?} */ multiProvider = records.get(token);
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
                multiProvider.deps.push({ token, options: 6 /* Default */ });
            }
            const /** @type {?} */ record = records.get(token);
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
        const /** @type {?} */ path = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
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
    let /** @type {?} */ value;
    if (record) {
        // If we don't have a record, this implies that we don't own the provider hence don't know how
        // to resolve it.
        value = record.value;
        if (value == CIRCULAR) {
            throw Error(NO_NEW_LINE + 'Circular dependency');
        }
        else if (value === EMPTY) {
            record.value = CIRCULAR;
            let /** @type {?} */ obj = undefined;
            let /** @type {?} */ useNew = record.useNew;
            let /** @type {?} */ fn = record.fn;
            let /** @type {?} */ depRecords = record.deps;
            let /** @type {?} */ deps = EMPTY;
            if (depRecords.length) {
                deps = [];
                for (let /** @type {?} */ i = 0; i < depRecords.length; i++) {
                    const /** @type {?} */ depRecord = depRecords[i];
                    const /** @type {?} */ options = depRecord.options;
                    const /** @type {?} */ childRecord = options & 2 /* CheckSelf */ ? records.get(depRecord.token) : undefined;
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
            record.value = value = useNew ? new ((fn))(...deps) : fn.apply(obj, deps);
        }
    }
    else {
        value = parent.get(token, notFoundValue);
    }
    return value;
}
/**
 * @param {?} provider
 * @return {?}
 */
function computeDeps(provider) {
    let /** @type {?} */ deps = EMPTY;
    const /** @type {?} */ providerDeps = ((provider)).deps;
    if (providerDeps && providerDeps.length) {
        deps = [];
        for (let /** @type {?} */ i = 0; i < providerDeps.length; i++) {
            let /** @type {?} */ options = 6 /* Default */;
            let /** @type {?} */ token = resolveForwardRef(providerDeps[i]);
            if (token instanceof Array) {
                for (let /** @type {?} */ j = 0, /** @type {?} */ annotations = token; j < annotations.length; j++) {
                    const /** @type {?} */ annotation = annotations[j];
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
            deps.push({ token, options });
        }
    }
    else if (((provider)).useExisting) {
        const /** @type {?} */ token = resolveForwardRef(((provider)).useExisting);
        deps = [{ token, options: 6 /* Default */ }];
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
    let /** @type {?} */ context = stringify(obj);
    if (obj instanceof Array) {
        context = obj.map(stringify).join(' -> ');
    }
    else if (typeof obj === 'object') {
        let /** @type {?} */ parts = ([]);
        for (let /** @type {?} */ key in obj) {
            if (obj.hasOwnProperty(key)) {
                let /** @type {?} */ value = obj[key];
                parts.push(key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
            }
        }
        context = `{${parts.join(', ')}}`;
    }
    return `StaticInjectorError[${context}]: ${text.replace(NEW_LINE, '\n  ')}`;
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
    for (let /** @type {?} */ key in objWithPropertyToExtract) {
        if (objWithPropertyToExtract[key] === GET_PROPERTY_NAME) {
            return key;
        }
    }
    throw Error('!prop');
}
//# sourceMappingURL=injector.js.map