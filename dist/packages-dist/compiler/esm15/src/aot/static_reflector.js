/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, Component, ContentChild, ContentChildren, Directive, Host, HostBinding, HostListener, Inject, Injectable, Input, NgModule, Optional, Output, Pipe, Self, SkipSelf, ViewChild, ViewChildren, animate, group, keyframes, sequence, state, style, transition, trigger } from '@angular/core';
import { CompileSummaryKind } from '../compile_metadata';
import { syntaxError } from '../util';
import { StaticSymbol } from './static_symbol';
const /** @type {?} */ ANGULAR_CORE = '@angular/core';
const /** @type {?} */ ANGULAR_ROUTER = '@angular/router';
const /** @type {?} */ HIDDEN_KEY = /^\$.*\$$/;
const /** @type {?} */ IGNORE = {
    __symbolic: 'ignore'
};
const /** @type {?} */ USE_VALUE = 'useValue';
const /** @type {?} */ PROVIDE = 'provide';
const /** @type {?} */ REFERENCE_SET = new Set([USE_VALUE, 'useFactory', 'data']);
/**
 * @param {?} value
 * @return {?}
 */
function shouldIgnore(value) {
    return value && value.__symbolic == 'ignore';
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export class StaticReflector {
    /**
     * @param {?} summaryResolver
     * @param {?} symbolResolver
     * @param {?=} knownMetadataClasses
     * @param {?=} knownMetadataFunctions
     * @param {?=} errorRecorder
     */
    constructor(summaryResolver, symbolResolver, knownMetadataClasses = [], knownMetadataFunctions = [], errorRecorder) {
        this.summaryResolver = summaryResolver;
        this.symbolResolver = symbolResolver;
        this.errorRecorder = errorRecorder;
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.methodCache = new Map();
        this.conversionMap = new Map();
        this.annotationForParentClassWithSummaryKind = new Map();
        this.annotationNames = new Map();
        this.initializeConversionMap();
        knownMetadataClasses.forEach((kc) => this._registerDecoratorOrConstructor(this.getStaticSymbol(kc.filePath, kc.name), kc.ctor));
        knownMetadataFunctions.forEach((kf) => this._registerFunction(this.getStaticSymbol(kf.filePath, kf.name), kf.fn));
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Directive, [Directive, Component]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Pipe, [Pipe]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.NgModule, [NgModule]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Injectable, [Injectable, Pipe, Directive, Component, NgModule]);
        this.annotationNames.set(Directive, 'Directive');
        this.annotationNames.set(Component, 'Component');
        this.annotationNames.set(Pipe, 'Pipe');
        this.annotationNames.set(NgModule, 'NgModule');
        this.annotationNames.set(Injectable, 'Injectable');
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    componentModuleUrl(typeOrFunc) {
        const /** @type {?} */ staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    resolveExternalReference(ref) {
        const /** @type {?} */ importSymbol = this.getStaticSymbol(/** @type {?} */ ((ref.moduleName)), /** @type {?} */ ((ref.name)));
        const /** @type {?} */ rootSymbol = this.findDeclaration(/** @type {?} */ ((ref.moduleName)), /** @type {?} */ ((ref.name)));
        if (importSymbol != rootSymbol) {
            this.symbolResolver.recordImportAs(rootSymbol, importSymbol);
        }
        return rootSymbol;
    }
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    findDeclaration(moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
    }
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @return {?}
     */
    tryFindDeclaration(moduleUrl, name) {
        return this.symbolResolver.ignoreErrorsFor(() => this.findDeclaration(moduleUrl, name));
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    findSymbolDeclaration(symbol) {
        const /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            return this.findSymbolDeclaration(resolvedSymbol.metadata);
        }
        else {
            return symbol;
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    annotations(type) {
        let /** @type {?} */ annotations = this.annotationCache.get(type);
        if (!annotations) {
            annotations = [];
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentAnnotations = this.annotations(parentType);
                annotations.push(...parentAnnotations);
            }
            let /** @type {?} */ ownAnnotations = [];
            if (classMetadata['decorators']) {
                ownAnnotations = this.simplify(type, classMetadata['decorators']);
                annotations.push(...ownAnnotations);
            }
            if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                this.summaryResolver.isLibraryFile(parentType.filePath)) {
                const /** @type {?} */ summary = this.summaryResolver.resolveSummary(parentType);
                if (summary && summary.type) {
                    const /** @type {?} */ requiredAnnotationTypes = ((this.annotationForParentClassWithSummaryKind.get(/** @type {?} */ ((summary.type.summaryKind)))));
                    const /** @type {?} */ typeHasRequiredAnnotation = requiredAnnotationTypes.some((requiredType) => ownAnnotations.some(ann => ann instanceof requiredType));
                    if (!typeHasRequiredAnnotation) {
                        this.reportError(syntaxError(`Class ${type.name} in ${type.filePath} extends from a ${CompileSummaryKind[(((summary.type.summaryKind)))]} in another compilation unit without duplicating the decorator. ` +
                            `Please add a ${requiredAnnotationTypes.map((type) => this.annotationNames.get(type)).join(' or ')} decorator to the class.`), type);
                    }
                }
            }
            this.annotationCache.set(type, annotations.filter(ann => !!ann));
        }
        return annotations;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    propMetadata(type) {
        let /** @type {?} */ propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            propMetadata = {};
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentPropMetadata = this.propMetadata(parentType);
                Object.keys(parentPropMetadata).forEach((parentProp) => {
                    ((propMetadata))[parentProp] = parentPropMetadata[parentProp];
                });
            }
            const /** @type {?} */ members = classMetadata['members'] || {};
            Object.keys(members).forEach((propName) => {
                const /** @type {?} */ propData = members[propName];
                const /** @type {?} */ prop = ((propData))
                    .find(a => a['__symbolic'] == 'property' || a['__symbolic'] == 'method');
                const /** @type {?} */ decorators = [];
                if (((propMetadata))[propName]) {
                    decorators.push(...((propMetadata))[propName]);
                } /** @type {?} */
                ((propMetadata))[propName] = decorators;
                if (prop && prop['decorators']) {
                    decorators.push(...this.simplify(type, prop['decorators']));
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    parameters(type) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error(`parameters received ${JSON.stringify(type)} which is not a StaticSymbol`), type);
            return [];
        }
        try {
            let /** @type {?} */ parameters = this.parameterCache.get(type);
            if (!parameters) {
                const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
                const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
                const /** @type {?} */ members = classMetadata ? classMetadata['members'] : null;
                const /** @type {?} */ ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    const /** @type {?} */ ctor = ((ctorData)).find(a => a['__symbolic'] == 'constructor');
                    const /** @type {?} */ rawParameterTypes = (ctor['parameters']) || [];
                    const /** @type {?} */ parameterDecorators = (this.simplify(type, ctor['parameterDecorators'] || []));
                    parameters = [];
                    rawParameterTypes.forEach((rawParamType, index) => {
                        const /** @type {?} */ nestedResult = [];
                        const /** @type {?} */ paramType = this.trySimplify(type, rawParamType);
                        if (paramType)
                            nestedResult.push(paramType);
                        const /** @type {?} */ decorators = parameterDecorators ? parameterDecorators[index] : null;
                        if (decorators) {
                            nestedResult.push(...decorators);
                        } /** @type {?} */
                        ((parameters)).push(nestedResult);
                    });
                }
                else if (parentType) {
                    parameters = this.parameters(parentType);
                }
                if (!parameters) {
                    parameters = [];
                }
                this.parameterCache.set(type, parameters);
            }
            return parameters;
        }
        catch (e) {
            console.error(`Failed on type ${JSON.stringify(type)} with error ${e}`);
            throw e;
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _methodNames(type) {
        let /** @type {?} */ methodNames = this.methodCache.get(type);
        if (!methodNames) {
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            methodNames = {};
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentMethodNames = this._methodNames(parentType);
                Object.keys(parentMethodNames).forEach((parentProp) => {
                    ((methodNames))[parentProp] = parentMethodNames[parentProp];
                });
            }
            const /** @type {?} */ members = classMetadata['members'] || {};
            Object.keys(members).forEach((propName) => {
                const /** @type {?} */ propData = members[propName];
                const /** @type {?} */ isMethod = ((propData)).some(a => a['__symbolic'] == 'method'); /** @type {?} */
                ((methodNames))[propName] = ((methodNames))[propName] || isMethod;
            });
            this.methodCache.set(type, methodNames);
        }
        return methodNames;
    }
    /**
     * @param {?} type
     * @param {?} classMetadata
     * @return {?}
     */
    findParentType(type, classMetadata) {
        const /** @type {?} */ parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof StaticSymbol) {
            return parentType;
        }
    }
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    hasLifecycleHook(type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error(`hasLifecycleHook received ${JSON.stringify(type)} which is not a StaticSymbol`), type);
        }
        try {
            return !!this._methodNames(type)[lcProperty];
        }
        catch (e) {
            console.error(`Failed on type ${JSON.stringify(type)} with error ${e}`);
            throw e;
        }
    }
    /**
     * @param {?} type
     * @param {?} ctor
     * @return {?}
     */
    _registerDecoratorOrConstructor(type, ctor) {
        this.conversionMap.set(type, (context, args) => new ctor(...args));
    }
    /**
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    _registerFunction(type, fn) {
        this.conversionMap.set(type, (context, args) => fn.apply(undefined, args));
    }
    /**
     * @return {?}
     */
    initializeConversionMap() {
        this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
        this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
        this.ROUTES = this.tryFindDeclaration(ANGULAR_ROUTER, 'ROUTES');
        this.ANALYZE_FOR_ENTRY_COMPONENTS =
            this.findDeclaration(ANGULAR_CORE, 'ANALYZE_FOR_ENTRY_COMPONENTS');
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), Injectable);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), Inject);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), Optional);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), Attribute);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), ContentChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), ContentChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), ViewChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), ViewChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), Input);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), Output);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), Pipe);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), HostBinding);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), HostListener);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), Directive);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), Component);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), NgModule);
        // Note: Some metadata classes can be used directly with Provider.deps.
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), Optional);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'trigger'), trigger);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'state'), state);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'transition'), transition);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'style'), style);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'animate'), animate);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'keyframes'), keyframes);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'sequence'), sequence);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'group'), group);
    }
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    getStaticSymbol(declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
    }
    /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    reportError(error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    }
    /**
     * Simplify but discard any errors
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    trySimplify(context, value) {
        const /** @type {?} */ originalRecorder = this.errorRecorder;
        this.errorRecorder = (error, fileName) => { };
        const /** @type {?} */ result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
    }
    /**
     * \@internal
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    simplify(context, value) {
        const /** @type {?} */ self = this;
        let /** @type {?} */ scope = BindingScope.empty;
        const /** @type {?} */ calling = new Map();
        /**
         * @param {?} context
         * @param {?} value
         * @param {?} depth
         * @param {?} references
         * @return {?}
         */
        function simplifyInContext(context, value, depth, references) {
            /**
             * @param {?} staticSymbol
             * @return {?}
             */
            function resolveReferenceValue(staticSymbol) {
                const /** @type {?} */ resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                return resolvedSymbol ? resolvedSymbol.metadata : null;
            }
            /**
             * @param {?} functionSymbol
             * @param {?} targetFunction
             * @param {?} args
             * @return {?}
             */
            function simplifyCall(functionSymbol, targetFunction, args) {
                if (targetFunction && targetFunction['__symbolic'] == 'function') {
                    if (calling.get(functionSymbol)) {
                        throw new Error('Recursion not supported');
                    }
                    try {
                        const /** @type {?} */ value = targetFunction['value'];
                        if (value && (depth != 0 || value.__symbolic != 'error')) {
                            const /** @type {?} */ parameters = targetFunction['parameters'];
                            const /** @type {?} */ defaults = targetFunction.defaults;
                            args = args.map(arg => simplifyInContext(context, arg, depth + 1, references))
                                .map(arg => shouldIgnore(arg) ? undefined : arg);
                            if (defaults && defaults.length > args.length) {
                                args.push(...defaults.slice(args.length).map((value) => simplify(value)));
                            }
                            calling.set(functionSymbol, true);
                            const /** @type {?} */ functionScope = BindingScope.build();
                            for (let /** @type {?} */ i = 0; i < parameters.length; i++) {
                                functionScope.define(parameters[i], args[i]);
                            }
                            const /** @type {?} */ oldScope = scope;
                            let /** @type {?} */ result;
                            try {
                                scope = functionScope.done();
                                result = simplifyInContext(functionSymbol, value, depth + 1, references);
                            }
                            finally {
                                scope = oldScope;
                            }
                            return result;
                        }
                    }
                    finally {
                        calling.delete(functionSymbol);
                    }
                }
                if (depth === 0) {
                    // If depth is 0 we are evaluating the top level expression that is describing element
                    // decorator. In this case, it is a decorator we don't understand, such as a custom
                    // non-angular decorator, and we should just ignore it.
                    return IGNORE;
                }
                return simplify({ __symbolic: 'error', message: 'Function call not supported', context: functionSymbol });
            }
            /**
             * @param {?} expression
             * @return {?}
             */
            function simplify(expression) {
                if (isPrimitive(expression)) {
                    return expression;
                }
                if (expression instanceof Array) {
                    const /** @type {?} */ result = [];
                    for (const /** @type {?} */ item of ((expression))) {
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            const /** @type {?} */ spreadArray = simplify(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (const /** @type {?} */ spreadItem of spreadArray) {
                                    result.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        const /** @type {?} */ value = simplify(item);
                        if (shouldIgnore(value)) {
                            continue;
                        }
                        result.push(value);
                    }
                    return result;
                }
                if (expression instanceof StaticSymbol) {
                    // Stop simplification at builtin symbols or if we are in a reference context
                    if (expression === self.injectionToken || expression === self.opaqueToken ||
                        self.conversionMap.has(expression) || references > 0) {
                        return expression;
                    }
                    else {
                        const /** @type {?} */ staticSymbol = expression;
                        const /** @type {?} */ declarationValue = resolveReferenceValue(staticSymbol);
                        if (declarationValue) {
                            return simplifyInContext(staticSymbol, declarationValue, depth + 1, references);
                        }
                        else {
                            return staticSymbol;
                        }
                    }
                }
                if (expression) {
                    if (expression['__symbolic']) {
                        let /** @type {?} */ staticSymbol;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                let /** @type {?} */ left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                let /** @type {?} */ right = simplify(expression['right']);
                                if (shouldIgnore(right))
                                    return right;
                                switch (expression['operator']) {
                                    case '&&':
                                        return left && right;
                                    case '||':
                                        return left || right;
                                    case '|':
                                        return left | right;
                                    case '^':
                                        return left ^ right;
                                    case '&':
                                        return left & right;
                                    case '==':
                                        return left == right;
                                    case '!=':
                                        return left != right;
                                    case '===':
                                        return left === right;
                                    case '!==':
                                        return left !== right;
                                    case '<':
                                        return left < right;
                                    case '>':
                                        return left > right;
                                    case '<=':
                                        return left <= right;
                                    case '>=':
                                        return left >= right;
                                    case '<<':
                                        return left << right;
                                    case '>>':
                                        return left >> right;
                                    case '+':
                                        return left + right;
                                    case '-':
                                        return left - right;
                                    case '*':
                                        return left * right;
                                    case '/':
                                        return left / right;
                                    case '%':
                                        return left % right;
                                }
                                return null;
                            case 'if':
                                let /** @type {?} */ condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                let /** @type {?} */ operand = simplify(expression['operand']);
                                if (shouldIgnore(operand))
                                    return operand;
                                switch (expression['operator']) {
                                    case '+':
                                        return operand;
                                    case '-':
                                        return -operand;
                                    case '!':
                                        return !operand;
                                    case '~':
                                        return ~operand;
                                }
                                return null;
                            case 'index':
                                let /** @type {?} */ indexTarget = simplify(expression['expression']);
                                let /** @type {?} */ index = simplify(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                const /** @type {?} */ member = expression['member'];
                                let /** @type {?} */ selectContext = context;
                                let /** @type {?} */ selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof StaticSymbol) {
                                    const /** @type {?} */ members = selectTarget.members.concat(member);
                                    selectContext =
                                        self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    const /** @type {?} */ declarationValue = resolveReferenceValue(selectContext);
                                    if (declarationValue) {
                                        return simplifyInContext(selectContext, declarationValue, depth + 1, references);
                                    }
                                    else {
                                        return selectContext;
                                    }
                                }
                                if (selectTarget && isPrimitive(member))
                                    return simplifyInContext(selectContext, selectTarget[member], depth + 1, references);
                                return null;
                            case 'reference':
                                // Note: This only has to deal with variable references,
                                // as symbol references have been converted into StaticSymbols already
                                // in the StaticSymbolResolver!
                                const /** @type {?} */ name = expression['name'];
                                const /** @type {?} */ localValue = scope.resolve(name);
                                if (localValue != BindingScope.missing) {
                                    return localValue;
                                }
                                break;
                            case 'class':
                                return context;
                            case 'function':
                                return context;
                            case 'new':
                            case 'call':
                                // Determine if the function is a built-in conversion
                                staticSymbol = simplifyInContext(context, expression['expression'], depth + 1, /* references */ 0);
                                if (staticSymbol instanceof StaticSymbol) {
                                    if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                        // if somebody calls new InjectionToken, don't create an InjectionToken,
                                        // but rather return the symbol to which the InjectionToken is assigned to.
                                        return context;
                                    }
                                    const /** @type {?} */ argExpressions = expression['arguments'] || [];
                                    let /** @type {?} */ converter = self.conversionMap.get(staticSymbol);
                                    if (converter) {
                                        const /** @type {?} */ args = argExpressions
                                            .map(arg => simplifyInContext(context, arg, depth + 1, references))
                                            .map(arg => shouldIgnore(arg) ? undefined : arg);
                                        return converter(context, args);
                                    }
                                    else {
                                        // Determine if the function is one we can simplify.
                                        const /** @type {?} */ targetFunction = resolveReferenceValue(staticSymbol);
                                        return simplifyCall(staticSymbol, targetFunction, argExpressions);
                                    }
                                }
                                return IGNORE;
                            case 'error':
                                let /** @type {?} */ message = produceErrorMessage(expression);
                                if (expression['line']) {
                                    message =
                                        `${message} (position ${expression['line'] + 1}:${expression['character'] + 1} in the original .ts file)`;
                                    self.reportError(positionalError(message, context.filePath, expression['line'], expression['character']), context);
                                }
                                else {
                                    self.reportError(new Error(message), context);
                                }
                                return IGNORE;
                            case 'ignore':
                                return expression;
                        }
                        return null;
                    }
                    return mapStringMap(expression, (value, name) => {
                        if (REFERENCE_SET.has(name)) {
                            if (name === USE_VALUE && PROVIDE in expression) {
                                // If this is a provider expression, check for special tokens that need the value
                                // during analysis.
                                const /** @type {?} */ provide = simplify(expression.provide);
                                if (provide === self.ROUTES || provide == self.ANALYZE_FOR_ENTRY_COMPONENTS) {
                                    return simplify(value);
                                }
                            }
                            return simplifyInContext(context, value, depth, references + 1);
                        }
                        return simplify(value);
                    });
                }
                return IGNORE;
            }
            try {
                return simplify(value);
            }
            catch (e) {
                const /** @type {?} */ members = context.members.length ? `.${context.members.join('.')}` : '';
                const /** @type {?} */ message = `${e.message}, resolving symbol ${context.name}${members} in ${context.filePath}`;
                if (e.fileName) {
                    throw positionalError(message, e.fileName, e.line, e.column);
                }
                throw syntaxError(message);
            }
        }
        const /** @type {?} */ recordedSimplifyInContext = (context, value) => {
            try {
                return simplifyInContext(context, value, 0, 0);
            }
            catch (e) {
                this.reportError(e, context);
            }
        };
        const /** @type {?} */ result = this.errorRecorder ? recordedSimplifyInContext(context, value) :
            simplifyInContext(context, value, 0, 0);
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    getTypeMetadata(type) {
        const /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
            { __symbolic: 'class' };
    }
}
function StaticReflector_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticReflector.prototype.annotationCache;
    /** @type {?} */
    StaticReflector.prototype.propertyCache;
    /** @type {?} */
    StaticReflector.prototype.parameterCache;
    /** @type {?} */
    StaticReflector.prototype.methodCache;
    /** @type {?} */
    StaticReflector.prototype.conversionMap;
    /** @type {?} */
    StaticReflector.prototype.injectionToken;
    /** @type {?} */
    StaticReflector.prototype.opaqueToken;
    /** @type {?} */
    StaticReflector.prototype.ROUTES;
    /** @type {?} */
    StaticReflector.prototype.ANALYZE_FOR_ENTRY_COMPONENTS;
    /** @type {?} */
    StaticReflector.prototype.annotationForParentClassWithSummaryKind;
    /** @type {?} */
    StaticReflector.prototype.annotationNames;
    /** @type {?} */
    StaticReflector.prototype.summaryResolver;
    /** @type {?} */
    StaticReflector.prototype.symbolResolver;
    /** @type {?} */
    StaticReflector.prototype.errorRecorder;
}
/**
 * @param {?} error
 * @return {?}
 */
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return `Reference to a non-exported class ${error.context.className}. Consider exporting the class`;
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return `Could not resolve type ${error.context.typeName}`;
            }
            break;
        case 'Function call not supported':
            let /** @type {?} */ prefix = error.context && error.context.name ? `Calling function '${error.context.name}', f` : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return `Reference to a local (non-exported) symbol '${error.context.name}'. Consider exporting the symbol`;
            }
            break;
    }
    return error.message;
}
/**
 * @param {?} error
 * @return {?}
 */
function produceErrorMessage(error) {
    return `Error encountered resolving symbol values statically. ${expandedMessage(error)}`;
}
/**
 * @param {?} input
 * @param {?} transform
 * @return {?}
 */
function mapStringMap(input, transform) {
    if (!input)
        return {};
    const /** @type {?} */ result = {};
    Object.keys(input).forEach((key) => {
        const /** @type {?} */ value = transform(input[key], key);
        if (!shouldIgnore(value)) {
            if (HIDDEN_KEY.test(key)) {
                Object.defineProperty(result, key, { enumerable: false, configurable: true, value: value });
            }
            else {
                result[key] = value;
            }
        }
    });
    return result;
}
/**
 * @param {?} o
 * @return {?}
 */
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
/**
 * @record
 */
function BindingScopeBuilder() { }
function BindingScopeBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingScopeBuilder.prototype.define;
    /** @type {?} */
    BindingScopeBuilder.prototype.done;
}
/**
 * @abstract
 */
class BindingScope {
    /**
     * @return {?}
     */
    static build() {
        const /** @type {?} */ current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    }
}
BindingScope.missing = {};
BindingScope.empty = { resolve: name => BindingScope.missing };
function BindingScope_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingScope.missing;
    /** @type {?} */
    BindingScope.empty;
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    BindingScope.prototype.resolve = function (name) { };
}
class PopulatedScope extends BindingScope {
    /**
     * @param {?} bindings
     */
    constructor(bindings) {
        super();
        this.bindings = bindings;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    resolve(name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    }
}
function PopulatedScope_tsickle_Closure_declarations() {
    /** @type {?} */
    PopulatedScope.prototype.bindings;
}
/**
 * @param {?} message
 * @param {?} fileName
 * @param {?} line
 * @param {?} column
 * @return {?}
 */
function positionalError(message, fileName, line, column) {
    const /** @type {?} */ result = new Error(message);
    ((result)).fileName = fileName;
    ((result)).line = line;
    ((result)).column = column;
    return result;
}
//# sourceMappingURL=static_reflector.js.map