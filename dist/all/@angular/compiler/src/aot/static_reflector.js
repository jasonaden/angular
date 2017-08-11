"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var compile_metadata_1 = require("../compile_metadata");
var util_1 = require("../util");
var static_symbol_1 = require("./static_symbol");
var ANGULAR_CORE = '@angular/core';
var ANGULAR_ROUTER = '@angular/router';
var HIDDEN_KEY = /^\$.*\$$/;
var IGNORE = {
    __symbolic: 'ignore'
};
var USE_VALUE = 'useValue';
var PROVIDE = 'provide';
var REFERENCE_SET = new Set([USE_VALUE, 'useFactory', 'data']);
function shouldIgnore(value) {
    return value && value.__symbolic == 'ignore';
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
var StaticReflector = (function () {
    function StaticReflector(summaryResolver, symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
        if (knownMetadataClasses === void 0) { knownMetadataClasses = []; }
        if (knownMetadataFunctions === void 0) { knownMetadataFunctions = []; }
        var _this = this;
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
        knownMetadataClasses.forEach(function (kc) { return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor); });
        knownMetadataFunctions.forEach(function (kf) { return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn); });
        this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Directive, [core_1.Directive, core_1.Component]);
        this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Pipe, [core_1.Pipe]);
        this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.NgModule, [core_1.NgModule]);
        this.annotationForParentClassWithSummaryKind.set(compile_metadata_1.CompileSummaryKind.Injectable, [core_1.Injectable, core_1.Pipe, core_1.Directive, core_1.Component, core_1.NgModule]);
        this.annotationNames.set(core_1.Directive, 'Directive');
        this.annotationNames.set(core_1.Component, 'Component');
        this.annotationNames.set(core_1.Pipe, 'Pipe');
        this.annotationNames.set(core_1.NgModule, 'NgModule');
        this.annotationNames.set(core_1.Injectable, 'Injectable');
    }
    StaticReflector.prototype.componentModuleUrl = function (typeOrFunc) {
        var staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
    };
    StaticReflector.prototype.resolveExternalReference = function (ref) {
        var importSymbol = this.getStaticSymbol(ref.moduleName, ref.name);
        var rootSymbol = this.findDeclaration(ref.moduleName, ref.name);
        if (importSymbol != rootSymbol) {
            this.symbolResolver.recordImportAs(rootSymbol, importSymbol);
        }
        return rootSymbol;
    };
    StaticReflector.prototype.findDeclaration = function (moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
    };
    StaticReflector.prototype.tryFindDeclaration = function (moduleUrl, name) {
        var _this = this;
        return this.symbolResolver.ignoreErrorsFor(function () { return _this.findDeclaration(moduleUrl, name); });
    };
    StaticReflector.prototype.findSymbolDeclaration = function (symbol) {
        var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol && resolvedSymbol.metadata instanceof static_symbol_1.StaticSymbol) {
            return this.findSymbolDeclaration(resolvedSymbol.metadata);
        }
        else {
            return symbol;
        }
    };
    StaticReflector.prototype.annotations = function (type) {
        var _this = this;
        var annotations = this.annotationCache.get(type);
        if (!annotations) {
            annotations = [];
            var classMetadata = this.getTypeMetadata(type);
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var parentAnnotations = this.annotations(parentType);
                annotations.push.apply(annotations, parentAnnotations);
            }
            var ownAnnotations_1 = [];
            if (classMetadata['decorators']) {
                ownAnnotations_1 = this.simplify(type, classMetadata['decorators']);
                annotations.push.apply(annotations, ownAnnotations_1);
            }
            if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                this.summaryResolver.isLibraryFile(parentType.filePath)) {
                var summary = this.summaryResolver.resolveSummary(parentType);
                if (summary && summary.type) {
                    var requiredAnnotationTypes = this.annotationForParentClassWithSummaryKind.get(summary.type.summaryKind);
                    var typeHasRequiredAnnotation = requiredAnnotationTypes.some(function (requiredType) { return ownAnnotations_1.some(function (ann) { return ann instanceof requiredType; }); });
                    if (!typeHasRequiredAnnotation) {
                        this.reportError(util_1.syntaxError("Class " + type.name + " in " + type.filePath + " extends from a " + compile_metadata_1.CompileSummaryKind[summary.type.summaryKind] + " in another compilation unit without duplicating the decorator. " +
                            ("Please add a " + requiredAnnotationTypes.map(function (type) { return _this.annotationNames.get(type); }).join(' or ') + " decorator to the class.")), type);
                    }
                }
            }
            this.annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
        }
        return annotations;
    };
    StaticReflector.prototype.propMetadata = function (type) {
        var _this = this;
        var propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            var classMetadata = this.getTypeMetadata(type);
            propMetadata = {};
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var parentPropMetadata_1 = this.propMetadata(parentType);
                Object.keys(parentPropMetadata_1).forEach(function (parentProp) {
                    propMetadata[parentProp] = parentPropMetadata_1[parentProp];
                });
            }
            var members_1 = classMetadata['members'] || {};
            Object.keys(members_1).forEach(function (propName) {
                var propData = members_1[propName];
                var prop = propData
                    .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                var decorators = [];
                if (propMetadata[propName]) {
                    decorators.push.apply(decorators, propMetadata[propName]);
                }
                propMetadata[propName] = decorators;
                if (prop && prop['decorators']) {
                    decorators.push.apply(decorators, _this.simplify(type, prop['decorators']));
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    };
    StaticReflector.prototype.parameters = function (type) {
        var _this = this;
        if (!(type instanceof static_symbol_1.StaticSymbol)) {
            this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
            return [];
        }
        try {
            var parameters_1 = this.parameterCache.get(type);
            if (!parameters_1) {
                var classMetadata = this.getTypeMetadata(type);
                var parentType = this.findParentType(type, classMetadata);
                var members = classMetadata ? classMetadata['members'] : null;
                var ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    var ctor = ctorData.find(function (a) { return a['__symbolic'] == 'constructor'; });
                    var rawParameterTypes = ctor['parameters'] || [];
                    var parameterDecorators_1 = this.simplify(type, ctor['parameterDecorators'] || []);
                    parameters_1 = [];
                    rawParameterTypes.forEach(function (rawParamType, index) {
                        var nestedResult = [];
                        var paramType = _this.trySimplify(type, rawParamType);
                        if (paramType)
                            nestedResult.push(paramType);
                        var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                        if (decorators) {
                            nestedResult.push.apply(nestedResult, decorators);
                        }
                        parameters_1.push(nestedResult);
                    });
                }
                else if (parentType) {
                    parameters_1 = this.parameters(parentType);
                }
                if (!parameters_1) {
                    parameters_1 = [];
                }
                this.parameterCache.set(type, parameters_1);
            }
            return parameters_1;
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    StaticReflector.prototype._methodNames = function (type) {
        var methodNames = this.methodCache.get(type);
        if (!methodNames) {
            var classMetadata = this.getTypeMetadata(type);
            methodNames = {};
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var parentMethodNames_1 = this._methodNames(parentType);
                Object.keys(parentMethodNames_1).forEach(function (parentProp) {
                    methodNames[parentProp] = parentMethodNames_1[parentProp];
                });
            }
            var members_2 = classMetadata['members'] || {};
            Object.keys(members_2).forEach(function (propName) {
                var propData = members_2[propName];
                var isMethod = propData.some(function (a) { return a['__symbolic'] == 'method'; });
                methodNames[propName] = methodNames[propName] || isMethod;
            });
            this.methodCache.set(type, methodNames);
        }
        return methodNames;
    };
    StaticReflector.prototype.findParentType = function (type, classMetadata) {
        var parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof static_symbol_1.StaticSymbol) {
            return parentType;
        }
    };
    StaticReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
        if (!(type instanceof static_symbol_1.StaticSymbol)) {
            this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
        }
        try {
            return !!this._methodNames(type)[lcProperty];
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    StaticReflector.prototype._registerDecoratorOrConstructor = function (type, ctor) {
        this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, [void 0].concat(args)))(); });
    };
    StaticReflector.prototype._registerFunction = function (type, fn) {
        this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
    };
    StaticReflector.prototype.initializeConversionMap = function () {
        this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
        this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
        this.ROUTES = this.tryFindDeclaration(ANGULAR_ROUTER, 'ROUTES');
        this.ANALYZE_FOR_ENTRY_COMPONENTS =
            this.findDeclaration(ANGULAR_CORE, 'ANALYZE_FOR_ENTRY_COMPONENTS');
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), core_1.Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), core_1.Injectable);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), core_1.Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), core_1.SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), core_1.Inject);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), core_1.Optional);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), core_1.Attribute);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), core_1.ContentChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), core_1.ContentChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), core_1.ViewChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), core_1.ViewChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), core_1.Input);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), core_1.Output);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), core_1.Pipe);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), core_1.HostBinding);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), core_1.HostListener);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), core_1.Directive);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), core_1.Component);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), core_1.NgModule);
        // Note: Some metadata classes can be used directly with Provider.deps.
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), core_1.Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), core_1.Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), core_1.SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), core_1.Optional);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'trigger'), core_1.trigger);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'state'), core_1.state);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'transition'), core_1.transition);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'style'), core_1.style);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'animate'), core_1.animate);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'keyframes'), core_1.keyframes);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'sequence'), core_1.sequence);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'group'), core_1.group);
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    StaticReflector.prototype.getStaticSymbol = function (declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
    };
    StaticReflector.prototype.reportError = function (error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    };
    /**
     * Simplify but discard any errors
     */
    StaticReflector.prototype.trySimplify = function (context, value) {
        var originalRecorder = this.errorRecorder;
        this.errorRecorder = function (error, fileName) { };
        var result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
    };
    /** @internal */
    StaticReflector.prototype.simplify = function (context, value) {
        var _this = this;
        var self = this;
        var scope = BindingScope.empty;
        var calling = new Map();
        function simplifyInContext(context, value, depth, references) {
            function resolveReferenceValue(staticSymbol) {
                var resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                return resolvedSymbol ? resolvedSymbol.metadata : null;
            }
            function simplifyCall(functionSymbol, targetFunction, args) {
                if (targetFunction && targetFunction['__symbolic'] == 'function') {
                    if (calling.get(functionSymbol)) {
                        throw new Error('Recursion not supported');
                    }
                    try {
                        var value_1 = targetFunction['value'];
                        if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                            var parameters = targetFunction['parameters'];
                            var defaults = targetFunction.defaults;
                            args = args.map(function (arg) { return simplifyInContext(context, arg, depth + 1, references); })
                                .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                            if (defaults && defaults.length > args.length) {
                                args.push.apply(args, defaults.slice(args.length).map(function (value) { return simplify(value); }));
                            }
                            calling.set(functionSymbol, true);
                            var functionScope = BindingScope.build();
                            for (var i = 0; i < parameters.length; i++) {
                                functionScope.define(parameters[i], args[i]);
                            }
                            var oldScope = scope;
                            var result_1;
                            try {
                                scope = functionScope.done();
                                result_1 = simplifyInContext(functionSymbol, value_1, depth + 1, references);
                            }
                            finally {
                                scope = oldScope;
                            }
                            return result_1;
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
            function simplify(expression) {
                if (isPrimitive(expression)) {
                    return expression;
                }
                if (expression instanceof Array) {
                    var result_2 = [];
                    for (var _i = 0, _a = expression; _i < _a.length; _i++) {
                        var item = _a[_i];
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            var spreadArray = simplify(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (var _b = 0, spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                                    var spreadItem = spreadArray_1[_b];
                                    result_2.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        var value_2 = simplify(item);
                        if (shouldIgnore(value_2)) {
                            continue;
                        }
                        result_2.push(value_2);
                    }
                    return result_2;
                }
                if (expression instanceof static_symbol_1.StaticSymbol) {
                    // Stop simplification at builtin symbols or if we are in a reference context
                    if (expression === self.injectionToken || expression === self.opaqueToken ||
                        self.conversionMap.has(expression) || references > 0) {
                        return expression;
                    }
                    else {
                        var staticSymbol = expression;
                        var declarationValue = resolveReferenceValue(staticSymbol);
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
                        var staticSymbol = void 0;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                var left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                var right = simplify(expression['right']);
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
                                var condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                var operand = simplify(expression['operand']);
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
                                var indexTarget = simplify(expression['expression']);
                                var index = simplify(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                var member = expression['member'];
                                var selectContext = context;
                                var selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof static_symbol_1.StaticSymbol) {
                                    var members = selectTarget.members.concat(member);
                                    selectContext =
                                        self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    var declarationValue = resolveReferenceValue(selectContext);
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
                                var name_1 = expression['name'];
                                var localValue = scope.resolve(name_1);
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
                                if (staticSymbol instanceof static_symbol_1.StaticSymbol) {
                                    if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                        // if somebody calls new InjectionToken, don't create an InjectionToken,
                                        // but rather return the symbol to which the InjectionToken is assigned to.
                                        return context;
                                    }
                                    var argExpressions = expression['arguments'] || [];
                                    var converter = self.conversionMap.get(staticSymbol);
                                    if (converter) {
                                        var args = argExpressions
                                            .map(function (arg) { return simplifyInContext(context, arg, depth + 1, references); })
                                            .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                        return converter(context, args);
                                    }
                                    else {
                                        // Determine if the function is one we can simplify.
                                        var targetFunction = resolveReferenceValue(staticSymbol);
                                        return simplifyCall(staticSymbol, targetFunction, argExpressions);
                                    }
                                }
                                return IGNORE;
                            case 'error':
                                var message = produceErrorMessage(expression);
                                if (expression['line']) {
                                    message =
                                        message + " (position " + (expression['line'] + 1) + ":" + (expression['character'] + 1) + " in the original .ts file)";
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
                    return mapStringMap(expression, function (value, name) {
                        if (REFERENCE_SET.has(name)) {
                            if (name === USE_VALUE && PROVIDE in expression) {
                                // If this is a provider expression, check for special tokens that need the value
                                // during analysis.
                                var provide = simplify(expression.provide);
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
                var members = context.members.length ? "." + context.members.join('.') : '';
                var message = e.message + ", resolving symbol " + context.name + members + " in " + context.filePath;
                if (e.fileName) {
                    throw positionalError(message, e.fileName, e.line, e.column);
                }
                throw util_1.syntaxError(message);
            }
        }
        var recordedSimplifyInContext = function (context, value) {
            try {
                return simplifyInContext(context, value, 0, 0);
            }
            catch (e) {
                _this.reportError(e, context);
            }
        };
        var result = this.errorRecorder ? recordedSimplifyInContext(context, value) :
            simplifyInContext(context, value, 0, 0);
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    };
    StaticReflector.prototype.getTypeMetadata = function (type) {
        var resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
            { __symbolic: 'class' };
    };
    return StaticReflector;
}());
exports.StaticReflector = StaticReflector;
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return "Reference to a non-exported class " + error.context.className + ". Consider exporting the class";
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return "Could not resolve type " + error.context.typeName;
            }
            break;
        case 'Function call not supported':
            var prefix = error.context && error.context.name ? "Calling function '" + error.context.name + "', f" : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return "Reference to a local (non-exported) symbol '" + error.context.name + "'. Consider exporting the symbol";
            }
            break;
    }
    return error.message;
}
function produceErrorMessage(error) {
    return "Error encountered resolving symbol values statically. " + expandedMessage(error);
}
function mapStringMap(input, transform) {
    if (!input)
        return {};
    var result = {};
    Object.keys(input).forEach(function (key) {
        var value = transform(input[key], key);
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
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
var BindingScope = (function () {
    function BindingScope() {
    }
    BindingScope.build = function () {
        var current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    };
    return BindingScope;
}());
BindingScope.missing = {};
BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
var PopulatedScope = (function (_super) {
    __extends(PopulatedScope, _super);
    function PopulatedScope(bindings) {
        var _this = _super.call(this) || this;
        _this.bindings = bindings;
        return _this;
    }
    PopulatedScope.prototype.resolve = function (name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    };
    return PopulatedScope;
}(BindingScope));
function positionalError(message, fileName, line, column) {
    var result = new Error(message);
    result.fileName = fileName;
    result.line = line;
    result.column = column;
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3Qvc3RhdGljX3JlZmxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBNFM7QUFFNVMsd0RBQXVEO0FBSXZELGdDQUFvQztBQUVwQyxpREFBNkM7QUFHN0MsSUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDO0FBQ3JDLElBQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDO0FBRXpDLElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUU5QixJQUFNLE1BQU0sR0FBRztJQUNiLFVBQVUsRUFBRSxRQUFRO0NBQ3JCLENBQUM7QUFFRixJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzFCLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBRWpFLHNCQUFzQixLQUFVO0lBQzlCLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUM7QUFDL0MsQ0FBQztBQUVEOzs7R0FHRztBQUNIO0lBYUUseUJBQ1ksZUFBOEMsRUFDOUMsY0FBb0MsRUFDNUMsb0JBQXdFLEVBQ3hFLHNCQUF3RSxFQUNoRSxhQUF1RDtRQUYvRCxxQ0FBQSxFQUFBLHlCQUF3RTtRQUN4RSx1Q0FBQSxFQUFBLDJCQUF3RTtRQUo1RSxpQkF1QkM7UUF0Qlcsb0JBQWUsR0FBZixlQUFlLENBQStCO1FBQzlDLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQUdwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBMEM7UUFqQjNELG9CQUFlLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFDakQsa0JBQWEsR0FBRyxJQUFJ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