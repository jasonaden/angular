/**
 * @license Angular v5.0.0-beta.3-14502f5b34
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/compiler'), require('@angular/core/testing')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/compiler', '@angular/core/testing'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.compiler = global.ng.compiler || {}, global.ng.compiler.testing = global.ng.compiler.testing || {}),global.ng.core,global.ng.compiler,global.ng.core.testing));
}(this, (function (exports,_angular_core,_angular_compiler,_angular_core_testing) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MockSchemaRegistry = (function () {
    /**
     * @param {?} existingProperties
     * @param {?} attrPropMapping
     * @param {?} existingElements
     * @param {?} invalidProperties
     * @param {?} invalidAttributes
     */
    function MockSchemaRegistry(existingProperties, attrPropMapping, existingElements, invalidProperties, invalidAttributes) {
        this.existingProperties = existingProperties;
        this.attrPropMapping = attrPropMapping;
        this.existingElements = existingElements;
        this.invalidProperties = invalidProperties;
        this.invalidAttributes = invalidAttributes;
    }
    /**
     * @param {?} tagName
     * @param {?} property
     * @param {?} schemas
     * @return {?}
     */
    MockSchemaRegistry.prototype.hasProperty = function (tagName, property, schemas) {
        var /** @type {?} */ value = this.existingProperties[property];
        return value === void 0 ? true : value;
    };
    /**
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    MockSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        var /** @type {?} */ value = this.existingElements[tagName.toLowerCase()];
        return value === void 0 ? true : value;
    };
    /**
     * @return {?}
     */
    MockSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this.existingElements); };
    /**
     * @param {?} selector
     * @param {?} property
     * @param {?} isAttribute
     * @return {?}
     */
    MockSchemaRegistry.prototype.securityContext = function (selector, property, isAttribute) {
        return _angular_core.SecurityContext.NONE;
    };
    /**
     * @param {?} attrName
     * @return {?}
     */
    MockSchemaRegistry.prototype.getMappedPropName = function (attrName) { return this.attrPropMapping[attrName] || attrName; };
    /**
     * @return {?}
     */
    MockSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    /**
     * @param {?} name
     * @return {?}
     */
    MockSchemaRegistry.prototype.validateProperty = function (name) {
        if (this.invalidProperties.indexOf(name) > -1) {
            return { error: true, msg: "Binding to property '" + name + "' is disallowed for security reasons" };
        }
        else {
            return { error: false };
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    MockSchemaRegistry.prototype.validateAttribute = function (name) {
        if (this.invalidAttributes.indexOf(name) > -1) {
            return {
                error: true,
                msg: "Binding to attribute '" + name + "' is disallowed for security reasons"
            };
        }
        else {
            return { error: false };
        }
    };
    /**
     * @param {?} propName
     * @return {?}
     */
    MockSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { return propName; };
    /**
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    MockSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        return { error: /** @type {?} */ ((null)), value: val.toString() };
    };
    return MockSchemaRegistry;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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
/**
 * An implementation of {\@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
var MockDirectiveResolver = (function (_super) {
    __extends(MockDirectiveResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
    function MockDirectiveResolver(_injector, reflector) {
        var _this = _super.call(this, reflector) || this;
        _this._injector = _injector;
        _this._directives = new Map();
        _this._providerOverrides = new Map();
        _this._viewProviderOverrides = new Map();
        _this._views = new Map();
        _this._inlineTemplates = new Map();
        return _this;
    }
    Object.defineProperty(MockDirectiveResolver.prototype, "_compiler", {
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} component
     * @return {?}
     */
    MockDirectiveResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockDirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metadata = this._directives.get(type) || null;
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        if (!metadata) {
            return null;
        }
        var /** @type {?} */ providerOverrides = this._providerOverrides.get(type);
        var /** @type {?} */ viewProviderOverrides = this._viewProviderOverrides.get(type);
        var /** @type {?} */ providers = metadata.providers;
        if (providerOverrides != null) {
            var /** @type {?} */ originalViewProviders = metadata.providers || [];
            providers = originalViewProviders.concat(providerOverrides);
        }
        if (metadata instanceof _angular_core.Component) {
            var /** @type {?} */ viewProviders = metadata.viewProviders;
            if (viewProviderOverrides != null) {
                var /** @type {?} */ originalViewProviders = metadata.viewProviders || [];
                viewProviders = originalViewProviders.concat(viewProviderOverrides);
            }
            var /** @type {?} */ view = this._views.get(type) || metadata;
            var /** @type {?} */ animations = view.animations;
            var /** @type {?} */ templateUrl = view.templateUrl;
            var /** @type {?} */ inlineTemplate = this._inlineTemplates.get(type);
            if (inlineTemplate) {
                templateUrl = undefined;
            }
            else {
                inlineTemplate = view.template;
            }
            return new _angular_core.Component({
                selector: metadata.selector,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                host: metadata.host,
                exportAs: metadata.exportAs,
                moduleId: metadata.moduleId,
                queries: metadata.queries,
                changeDetection: metadata.changeDetection,
                providers: providers,
                viewProviders: viewProviders,
                entryComponents: metadata.entryComponents,
                template: inlineTemplate,
                templateUrl: templateUrl,
                animations: animations,
                styles: view.styles,
                styleUrls: view.styleUrls,
                encapsulation: view.encapsulation,
                interpolation: view.interpolation
            });
        }
        return new _angular_core.Directive({
            selector: metadata.selector,
            inputs: metadata.inputs,
            outputs: metadata.outputs,
            host: metadata.host,
            providers: providers,
            exportAs: metadata.exportAs,
            queries: metadata.queries
        });
    };
    /**
     * Overrides the {\@link Directive} for a directive.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockDirectiveResolver.prototype.setDirective = function (type, metadata) {
        this._directives.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * @param {?} type
     * @param {?} providers
     * @return {?}
     */
    MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
        this._providerOverrides.set(type, providers);
        this._clearCacheFor(type);
    };
    /**
     * @param {?} type
     * @param {?} viewProviders
     * @return {?}
     */
    MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
        this._viewProviderOverrides.set(type, viewProviders);
        this._clearCacheFor(type);
    };
    /**
     * Overrides the {\@link ViewMetadata} for a component.
     * @param {?} component
     * @param {?} view
     * @return {?}
     */
    MockDirectiveResolver.prototype.setView = function (component, view) {
        this._views.set(component, view);
        this._clearCacheFor(component);
    };
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     * @param {?} component
     * @param {?} template
     * @return {?}
     */
    MockDirectiveResolver.prototype.setInlineTemplate = function (component, template) {
        this._inlineTemplates.set(component, template);
        this._clearCacheFor(component);
    };
    return MockDirectiveResolver;
}(_angular_compiler.DirectiveResolver));
MockDirectiveResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockDirectiveResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
    { type: _angular_compiler.CompileReflector, },
]; };

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
var MockNgModuleResolver = (function (_super) {
    __extends(MockNgModuleResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} reflector
     */
    function MockNgModuleResolver(_injector, reflector) {
        var _this = _super.call(this, reflector) || this;
        _this._injector = _injector;
        _this._ngModules = new Map();
        return _this;
    }
    /**
     * Overrides the {\@link NgModule} for a module.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockNgModuleResolver.prototype.setNgModule = function (type, metadata) {
        this._ngModules.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {\@link NgModule} for a module:
     * - Set the {\@link NgModule} to the overridden view when it exists or fallback to the
     * default
     * `NgModuleResolver`, see `setNgModule`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockNgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        return this._ngModules.get(type) || ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
    };
    Object.defineProperty(MockNgModuleResolver.prototype, "_compiler", {
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} component
     * @return {?}
     */
    MockNgModuleResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    return MockNgModuleResolver;
}(_angular_compiler.NgModuleResolver));
MockNgModuleResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockNgModuleResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
    { type: _angular_compiler.CompileReflector, },
]; };

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
var MockPipeResolver = (function (_super) {
    __extends(MockPipeResolver, _super);
    /**
     * @param {?} _injector
     * @param {?} refector
     */
    function MockPipeResolver(_injector, refector) {
        var _this = _super.call(this, refector) || this;
        _this._injector = _injector;
        _this._pipes = new Map();
        return _this;
    }
    Object.defineProperty(MockPipeResolver.prototype, "_compiler", {
        /**
         * @return {?}
         */
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} pipe
     * @return {?}
     */
    MockPipeResolver.prototype._clearCacheFor = function (pipe) { this._compiler.clearCacheFor(pipe); };
    /**
     * Overrides the {\@link Pipe} for a pipe.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    MockPipeResolver.prototype.setPipe = function (type, metadata) {
        this._pipes.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {\@link Pipe} for a pipe:
     * - Set the {\@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    MockPipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = ((_super.prototype.resolve.call(this, type, throwIfNotFound)));
        }
        return metadata;
    };
    return MockPipeResolver;
}(_angular_compiler.PipeResolver));
MockPipeResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockPipeResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
    { type: _angular_compiler.CompileReflector, },
]; };

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
var _nextReferenceId = 0;
var MetadataOverrider = (function () {
    function MetadataOverrider() {
        this._references = new Map();
    }
    /**
     * Creates a new instance for the given metadata class
     * based on an old instance and overrides.
     * @template C, T
     * @param {?} metadataClass
     * @param {?} oldMetadata
     * @param {?} override
     * @return {?}
     */
    MetadataOverrider.prototype.overrideMetadata = function (metadataClass, oldMetadata, override) {
        var /** @type {?} */ props = {};
        if (oldMetadata) {
            _valueProps(oldMetadata).forEach(function (prop) { return props[prop] = ((oldMetadata))[prop]; });
        }
        if (override.set) {
            if (override.remove || override.add) {
                throw new Error("Cannot set and add/remove " + _angular_core.ɵstringify(metadataClass) + " at the same time!");
            }
            setMetadata(props, override.set);
        }
        if (override.remove) {
            removeMetadata(props, override.remove, this._references);
        }
        if (override.add) {
            addMetadata(props, override.add);
        }
        return new metadataClass(/** @type {?} */ (props));
    };
    return MetadataOverrider;
}());
/**
 * @param {?} metadata
 * @param {?} remove
 * @param {?} references
 * @return {?}
 */
function removeMetadata(metadata, remove, references) {
    var /** @type {?} */ removeObjects = new Set();
    var _loop_1 = function (prop) {
        var /** @type {?} */ removeValue = remove[prop];
        if (removeValue instanceof Array) {
            removeValue.forEach(function (value) { removeObjects.add(_propHashKey(prop, value, references)); });
        }
        else {
            removeObjects.add(_propHashKey(prop, removeValue, references));
        }
    };
    for (var /** @type {?} */ prop in remove) {
        _loop_1(/** @type {?} */ prop);
    }
    var _loop_2 = function (prop) {
        var /** @type {?} */ propValue = metadata[prop];
        if (propValue instanceof Array) {
            metadata[prop] = propValue.filter(function (value) { return !removeObjects.has(_propHashKey(prop, value, references)); });
        }
        else {
            if (removeObjects.has(_propHashKey(prop, propValue, references))) {
                metadata[prop] = undefined;
            }
        }
    };
    for (var /** @type {?} */ prop in metadata) {
        _loop_2(/** @type {?} */ prop);
    }
}
/**
 * @param {?} metadata
 * @param {?} add
 * @return {?}
 */
function addMetadata(metadata, add) {
    for (var /** @type {?} */ prop in add) {
        var /** @type {?} */ addValue = add[prop];
        var /** @type {?} */ propValue = metadata[prop];
        if (propValue != null && propValue instanceof Array) {
            metadata[prop] = propValue.concat(addValue);
        }
        else {
            metadata[prop] = addValue;
        }
    }
}
/**
 * @param {?} metadata
 * @param {?} set
 * @return {?}
 */
function setMetadata(metadata, set) {
    for (var /** @type {?} */ prop in set) {
        metadata[prop] = set[prop];
    }
}
/**
 * @param {?} propName
 * @param {?} propValue
 * @param {?} references
 * @return {?}
 */
function _propHashKey(propName, propValue, references) {
    var /** @type {?} */ replacer = function (key, value) {
        if (typeof value === 'function') {
            value = _serializeReference(value, references);
        }
        return value;
    };
    return propName + ":" + JSON.stringify(propValue, replacer);
}
/**
 * @param {?} ref
 * @param {?} references
 * @return {?}
 */
function _serializeReference(ref, references) {
    var /** @type {?} */ id = references.get(ref);
    if (!id) {
        id = "" + _angular_core.ɵstringify(ref) + _nextReferenceId++;
        references.set(ref, id);
    }
    return id;
}
/**
 * @param {?} obj
 * @return {?}
 */
function _valueProps(obj) {
    var /** @type {?} */ props = [];
    // regular public props
    Object.keys(obj).forEach(function (prop) {
        if (!prop.startsWith('_')) {
            props.push(prop);
        }
    });
    // getters
    var /** @type {?} */ proto = obj;
    while (proto = Object.getPrototypeOf(proto)) {
        Object.keys(proto).forEach(function (protoProp) {
            var /** @type {?} */ desc = Object.getOwnPropertyDescriptor(proto, protoProp);
            if (!protoProp.startsWith('_') && desc && 'get' in desc) {
                props.push(protoProp);
            }
        });
    }
    return props;
}

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
/**
 * @module
 * @description
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */
var TestingCompilerFactoryImpl = (function () {
    /**
     * @param {?} _compilerFactory
     */
    function TestingCompilerFactoryImpl(_compilerFactory) {
        this._compilerFactory = _compilerFactory;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    TestingCompilerFactoryImpl.prototype.createTestingCompiler = function (options) {
        var /** @type {?} */ compiler = (this._compilerFactory.createCompiler(options));
        return new TestingCompilerImpl(compiler, compiler.injector.get(MockDirectiveResolver), compiler.injector.get(MockPipeResolver), compiler.injector.get(MockNgModuleResolver), compiler.injector.get(_angular_compiler.CompileMetadataResolver));
    };
    return TestingCompilerFactoryImpl;
}());
TestingCompilerFactoryImpl.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
TestingCompilerFactoryImpl.ctorParameters = function () { return [
    { type: _angular_core.CompilerFactory, },
]; };
var TestingCompilerImpl = (function () {
    /**
     * @param {?} _compiler
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _moduleResolver
     * @param {?} _metadataResolver
     */
    function TestingCompilerImpl(_compiler, _directiveResolver, _pipeResolver, _moduleResolver, _metadataResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._metadataResolver = _metadataResolver;
        this._overrider = new MetadataOverrider();
    }
    Object.defineProperty(TestingCompilerImpl.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return this._compiler.injector; },
        enumerable: true,
        configurable: true
    });
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    };
    /**
     * @param {?} component
     * @return {?}
     */
    TestingCompilerImpl.prototype.getNgContentSelectors = function (component) {
        return this._compiler.getNgContentSelectors(component);
    };
    /**
     * @template T
     * @param {?} component
     * @return {?}
     */
    TestingCompilerImpl.prototype.getComponentFactory = function (component) {
        return this._compiler.getComponentFactory(component);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    TestingCompilerImpl.prototype.checkOverrideAllowed = function (type) {
        if (this._compiler.hasAotSummary(type)) {
            throw new Error(_angular_core.ɵstringify(type) + " was AOT compiled, so its metadata cannot be changed.");
        }
    };
    /**
     * @param {?} ngModule
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideModule = function (ngModule, override) {
        this.checkOverrideAllowed(ngModule);
        var /** @type {?} */ oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(_angular_core.NgModule, oldMetadata, override));
    };
    /**
     * @param {?} directive
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideDirective = function (directive, override) {
        this.checkOverrideAllowed(directive);
        var /** @type {?} */ oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(_angular_core.Directive, /** @type {?} */ ((oldMetadata)), override));
    };
    /**
     * @param {?} component
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overrideComponent = function (component, override) {
        this.checkOverrideAllowed(component);
        var /** @type {?} */ oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(_angular_core.Component, /** @type {?} */ ((oldMetadata)), override));
    };
    /**
     * @param {?} pipe
     * @param {?} override
     * @return {?}
     */
    TestingCompilerImpl.prototype.overridePipe = function (pipe, override) {
        this.checkOverrideAllowed(pipe);
        var /** @type {?} */ oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(_angular_core.Pipe, oldMetadata, override));
    };
    /**
     * @param {?} summaries
     * @return {?}
     */
    TestingCompilerImpl.prototype.loadAotSummaries = function (summaries) { this._compiler.loadAotSummaries(summaries); };
    /**
     * @return {?}
     */
    TestingCompilerImpl.prototype.clearCache = function () { this._compiler.clearCache(); };
    /**
     * @param {?} type
     * @return {?}
     */
    TestingCompilerImpl.prototype.clearCacheFor = function (type) { this._compiler.clearCacheFor(type); };
    return TestingCompilerImpl;
}());
/**
 * Platform for dynamic tests
 *
 * \@experimental
 */
var platformCoreDynamicTesting = _angular_core.createPlatformFactory(_angular_compiler.platformCoreDynamic, 'coreDynamicTesting', [
    {
        provide: _angular_core.COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: MockPipeResolver, deps: [_angular_core.Injector, _angular_compiler.CompileReflector] },
                { provide: _angular_compiler.PipeResolver, useExisting: MockPipeResolver },
                { provide: MockDirectiveResolver, deps: [_angular_core.Injector, _angular_compiler.CompileReflector] },
                { provide: _angular_compiler.DirectiveResolver, useExisting: MockDirectiveResolver },
                { provide: MockNgModuleResolver, deps: [_angular_core.Injector, _angular_compiler.CompileReflector] },
                { provide: _angular_compiler.NgModuleResolver, useExisting: MockNgModuleResolver },
            ]
        },
        multi: true
    },
    {
        provide: _angular_core_testing.ɵTestingCompilerFactory,
        useClass: TestingCompilerFactoryImpl,
        deps: [_angular_core.CompilerFactory]
    }
]);

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
/**
 * @module
 * @description
 * Entry point for all public APIs of this package.
 */

// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

exports.TestingCompilerFactoryImpl = TestingCompilerFactoryImpl;
exports.TestingCompilerImpl = TestingCompilerImpl;
exports.platformCoreDynamicTesting = platformCoreDynamicTesting;
exports.MockSchemaRegistry = MockSchemaRegistry;
exports.MockDirectiveResolver = MockDirectiveResolver;
exports.MockNgModuleResolver = MockNgModuleResolver;
exports.MockPipeResolver = MockPipeResolver;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=compiler-testing.umd.js.map
