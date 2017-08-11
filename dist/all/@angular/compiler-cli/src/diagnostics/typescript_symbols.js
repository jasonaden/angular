"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var symbols_1 = require("./symbols");
// In TypeScript 2.1 these flags moved
// These helpers work for both 2.0 and 2.1.
var isPrivate = ts.ModifierFlags ?
    (function (node) {
        return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private);
    }) :
    (function (node) { return !!(node.flags & ts.NodeFlags.Private); });
var isReferenceType = ts.ObjectFlags ?
    (function (type) {
        return !!(type.flags & ts.TypeFlags.Object &&
            type.objectFlags & ts.ObjectFlags.Reference);
    }) :
    (function (type) { return !!(type.flags & ts.TypeFlags.Reference); });
function getSymbolQuery(program, checker, source, fetchPipes) {
    return new TypeScriptSymbolQuery(program, checker, source, fetchPipes);
}
exports.getSymbolQuery = getSymbolQuery;
function getClassMembers(program, checker, staticSymbol) {
    var declaration = getClassFromStaticSymbol(program, staticSymbol);
    if (declaration) {
        var type = checker.getTypeAtLocation(declaration);
        var node = program.getSourceFile(staticSymbol.filePath);
        return new TypeWrapper(type, { node: node, program: program, checker: checker }).members();
    }
}
exports.getClassMembers = getClassMembers;
function getClassMembersFromDeclaration(program, checker, source, declaration) {
    var type = checker.getTypeAtLocation(declaration);
    return new TypeWrapper(type, { node: source, program: program, checker: checker }).members();
}
exports.getClassMembersFromDeclaration = getClassMembersFromDeclaration;
function getClassFromStaticSymbol(program, type) {
    var source = program.getSourceFile(type.filePath);
    if (source) {
        return ts.forEachChild(source, function (child) {
            if (child.kind === ts.SyntaxKind.ClassDeclaration) {
                var classDeclaration = child;
                if (classDeclaration.name != null && classDeclaration.name.text === type.name) {
                    return classDeclaration;
                }
            }
        });
    }
    return undefined;
}
exports.getClassFromStaticSymbol = getClassFromStaticSymbol;
function getPipesTable(source, program, checker, pipes) {
    return new PipesTable(pipes, { program: program, checker: checker, node: source });
}
exports.getPipesTable = getPipesTable;
var TypeScriptSymbolQuery = (function () {
    function TypeScriptSymbolQuery(program, checker, source, fetchPipes) {
        this.program = program;
        this.checker = checker;
        this.source = source;
        this.fetchPipes = fetchPipes;
        this.typeCache = new Map();
    }
    TypeScriptSymbolQuery.prototype.getTypeKind = function (symbol) { return typeKindOf(this.getTsTypeOf(symbol)); };
    TypeScriptSymbolQuery.prototype.getBuiltinType = function (kind) {
        var result = this.typeCache.get(kind);
        if (!result) {
            var type = getBuiltinTypeFromTs(kind, { checker: this.checker, node: this.source, program: this.program });
            result =
                new TypeWrapper(type, { program: this.program, checker: this.checker, node: this.source });
            this.typeCache.set(kind, result);
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getTypeUnion = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        // No API exists so return any if the types are not all the same type.
        var result = undefined;
        if (types.length) {
            result = types[0];
            for (var i = 1; i < types.length; i++) {
                if (types[i] != result) {
                    result = undefined;
                    break;
                }
            }
        }
        return result || this.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    TypeScriptSymbolQuery.prototype.getArrayType = function (type) { return this.getBuiltinType(symbols_1.BuiltinType.Any); };
    TypeScriptSymbolQuery.prototype.getElementType = function (type) {
        if (type instanceof TypeWrapper) {
            var elementType = getTypeParameterOf(type.tsType, 'Array');
            if (elementType) {
                return new TypeWrapper(elementType, type.context);
            }
        }
    };
    TypeScriptSymbolQuery.prototype.getNonNullableType = function (symbol) {
        if (symbol instanceof TypeWrapper && (typeof this.checker.getNonNullableType == 'function')) {
            var tsType = symbol.tsType;
            var nonNullableType = this.checker.getNonNullableType(tsType);
            if (nonNullableType != tsType) {
                return new TypeWrapper(nonNullableType, symbol.context);
            }
            else if (nonNullableType == tsType) {
                return symbol;
            }
        }
        return this.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    TypeScriptSymbolQuery.prototype.getPipes = function () {
        var result = this.pipesCache;
        if (!result) {
            result = this.pipesCache = this.fetchPipes();
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getTemplateContext = function (type) {
        var context = { node: this.source, program: this.program, checker: this.checker };
        var typeSymbol = findClassSymbolInContext(type, context);
        if (typeSymbol) {
            var contextType = this.getTemplateRefContextType(typeSymbol);
            if (contextType)
                return new SymbolWrapper(contextType, context).members();
        }
    };
    TypeScriptSymbolQuery.prototype.getTypeSymbol = function (type) {
        var context = { node: this.source, program: this.program, checker: this.checker };
        var typeSymbol = findClassSymbolInContext(type, context);
        return typeSymbol && new SymbolWrapper(typeSymbol, context);
    };
    TypeScriptSymbolQuery.prototype.createSymbolTable = function (symbols) {
        var result = new MapSymbolTable();
        result.addAll(symbols.map(function (s) { return new DeclaredSymbol(s); }));
        return result;
    };
    TypeScriptSymbolQuery.prototype.mergeSymbolTable = function (symbolTables) {
        var result = new MapSymbolTable();
        for (var _i = 0, symbolTables_1 = symbolTables; _i < symbolTables_1.length; _i++) {
            var symbolTable = symbolTables_1[_i];
            result.addAll(symbolTable.values());
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getSpanAt = function (line, column) {
        return spanAt(this.source, line, column);
    };
    TypeScriptSymbolQuery.prototype.getTemplateRefContextType = function (typeSymbol) {
        var type = this.checker.getTypeOfSymbolAtLocation(typeSymbol, this.source);
        var constructor = type.symbol && type.symbol.members &&
            getFromSymbolTable(type.symbol.members, '__constructor');
        if (constructor) {
            var constructorDeclaration = constructor.declarations[0];
            for (var _i = 0, _a = constructorDeclaration.parameters; _i < _a.length; _i++) {
                var parameter = _a[_i];
                var type_1 = this.checker.getTypeAtLocation(parameter.type);
                if (type_1.symbol.name == 'TemplateRef' && isReferenceType(type_1)) {
                    var typeReference = type_1;
                    if (typeReference.typeArguments.length === 1) {
                        return typeReference.typeArguments[0].symbol;
                    }
                }
            }
        }
    };
    TypeScriptSymbolQuery.prototype.getTsTypeOf = function (symbol) {
        var type = this.getTypeWrapper(symbol);
        return type && type.tsType;
    };
    TypeScriptSymbolQuery.prototype.getTypeWrapper = function (symbol) {
        var type = undefined;
        if (symbol instanceof TypeWrapper) {
            type = symbol;
        }
        else if (symbol.type instanceof TypeWrapper) {
            type = symbol.type;
        }
        return type;
    };
    return TypeScriptSymbolQuery;
}());
function typeCallable(type) {
    var signatures = type.getCallSignatures();
    return signatures && signatures.length != 0;
}
function signaturesOf(type, context) {
    return type.getCallSignatures().map(function (s) { return new SignatureWrapper(s, context); });
}
function selectSignature(type, context, types) {
    // TODO: Do a better job of selecting the right signature.
    var signatures = type.getCallSignatures();
    return signatures.length ? new SignatureWrapper(signatures[0], context) : undefined;
}
var TypeWrapper = (function () {
    function TypeWrapper(tsType, context) {
        this.tsType = tsType;
        this.context = context;
        if (!tsType) {
            throw Error('Internal: null type');
        }
    }
    Object.defineProperty(TypeWrapper.prototype, "name", {
        get: function () {
            var symbol = this.tsType.symbol;
            return (symbol && symbol.name) || '<anonymous>';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "kind", {
        get: function () { return 'type'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "language", {
        get: function () { return 'typescript'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "type", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "container", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "public", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "callable", {
        get: function () { return typeCallable(this.tsType); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "nullable", {
        get: function () {
            return this.context.checker.getNonNullableType(this.tsType) != this.tsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "definition", {
        get: function () { return definitionFromTsSymbol(this.tsType.getSymbol()); },
        enumerable: true,
        configurable: true
    });
    TypeWrapper.prototype.members = function () {
        return new SymbolTableWrapper(this.tsType.getProperties(), this.context);
    };
    TypeWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    TypeWrapper.prototype.selectSignature = function (types) {
        return selectSignature(this.tsType, this.context, types);
    };
    TypeWrapper.prototype.indexed = function (argument) { return undefined; };
    return TypeWrapper;
}());
var SymbolWrapper = (function () {
    function SymbolWrapper(symbol, context) {
        this.context = context;
        this.symbol = symbol && context && (symbol.flags & ts.SymbolFlags.Alias) ?
            context.checker.getAliasedSymbol(symbol) :
            symbol;
    }
    Object.defineProperty(SymbolWrapper.prototype, "name", {
        get: function () { return this.symbol.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "kind", {
        get: function () { return this.callable ? 'method' : 'property'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "language", {
        get: function () { return 'typescript'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "type", {
        get: function () { return new TypeWrapper(this.tsType, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "container", {
        get: function () { return getContainerOf(this.symbol, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "public", {
        get: function () {
            // Symbols that are not explicitly made private are public.
            return !isSymbolPrivate(this.symbol);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "callable", {
        get: function () { return typeCallable(this.tsType); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "nullable", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "definition", {
        get: function () { return definitionFromTsSymbol(this.symbol); },
        enumerable: true,
        configurable: true
    });
    SymbolWrapper.prototype.members = function () {
        if (!this._members) {
            if ((this.symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) != 0) {
                var declaredType = this.context.checker.getDeclaredTypeOfSymbol(this.symbol);
                var typeWrapper = new TypeWrapper(declaredType, this.context);
                this._members = typeWrapper.members();
            }
            else {
                this._members = new SymbolTableWrapper(this.symbol.members, this.context);
            }
        }
        return this._members;
    };
    SymbolWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    SymbolWrapper.prototype.selectSignature = function (types) {
        return selectSignature(this.tsType, this.context, types);
    };
    SymbolWrapper.prototype.indexed = function (argument) { return undefined; };
    Object.defineProperty(SymbolWrapper.prototype, "tsType", {
        get: function () {
            var type = this._tsType;
            if (!type) {
                type = this._tsType =
                    this.context.checker.getTypeOfSymbolAtLocation(this.symbol, this.context.node);
            }
            return type;
        },
        enumerable: true,
        configurable: true
    });
    return SymbolWrapper;
}());
var DeclaredSymbol = (function () {
    function DeclaredSymbol(declaration) {
        this.declaration = declaration;
    }
    Object.defineProperty(DeclaredSymbol.prototype, "name", {
        get: function () { return this.declaration.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "kind", {
        get: function () { return this.declaration.kind; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "language", {
        get: function () { return 'ng-template'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "container", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "type", {
        get: function () { return this.declaration.type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "callable", {
        get: function () { return this.declaration.type.callable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "nullable", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "public", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "definition", {
        get: function () { return this.declaration.definition; },
        enumerable: true,
        configurable: true
    });
    DeclaredSymbol.prototype.members = function () { return this.declaration.type.members(); };
    DeclaredSymbol.prototype.signatures = function () { return this.declaration.type.signatures(); };
    DeclaredSymbol.prototype.selectSignature = function (types) {
        return this.declaration.type.selectSignature(types);
    };
    DeclaredSymbol.prototype.indexed = function (argument) { return undefined; };
    return DeclaredSymbol;
}());
var SignatureWrapper = (function () {
    function SignatureWrapper(signature, context) {
        this.signature = signature;
        this.context = context;
    }
    Object.defineProperty(SignatureWrapper.prototype, "arguments", {
        get: function () {
            return new SymbolTableWrapper(this.signature.getParameters(), this.context);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureWrapper.prototype, "result", {
        get: function () { return new TypeWrapper(this.signature.getReturnType(), this.context); },
        enumerable: true,
        configurable: true
    });
    return SignatureWrapper;
}());
var SignatureResultOverride = (function () {
    function SignatureResultOverride(signature, resultType) {
        this.signature = signature;
        this.resultType = resultType;
    }
    Object.defineProperty(SignatureResultOverride.prototype, "arguments", {
        get: function () { return this.signature.arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureResultOverride.prototype, "result", {
        get: function () { return this.resultType; },
        enumerable: true,
        configurable: true
    });
    return SignatureResultOverride;
}());
var toSymbolTable = isTypescriptVersion('2.2') ?
    (function (symbols) {
        var result = new Map();
        for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
            var symbol = symbols_2[_i];
            result.set(symbol.name, symbol);
        }
        return result;
    }) :
    (function (symbols) {
        var result = {};
        for (var _i = 0, symbols_3 = symbols; _i < symbols_3.length; _i++) {
            var symbol = symbols_3[_i];
            result[symbol.name] = symbol;
        }
        return result;
    });
function toSymbols(symbolTable) {
    if (!symbolTable)
        return [];
    var table = symbolTable;
    if (typeof table.values === 'function') {
        return Array.from(table.values());
    }
    var result = [];
    var own = typeof table.hasOwnProperty === 'function' ?
        function (name) { return table.hasOwnProperty(name); } :
        function (name) { return !!table[name]; };
    for (var name_1 in table) {
        if (own(name_1)) {
            result.push(table[name_1]);
        }
    }
    return result;
}
var SymbolTableWrapper = (function () {
    function SymbolTableWrapper(symbols, context) {
        this.context = context;
        symbols = symbols || [];
        if (Array.isArray(symbols)) {
            this.symbols = symbols;
            this.symbolTable = toSymbolTable(symbols);
        }
        else {
            this.symbols = toSymbols(symbols);
            this.symbolTable = symbols;
        }
    }
    Object.defineProperty(SymbolTableWrapper.prototype, "size", {
        get: function () { return this.symbols.length; },
        enumerable: true,
        configurable: true
    });
    SymbolTableWrapper.prototype.get = function (key) {
        var symbol = getFromSymbolTable(this.symbolTable, key);
        return symbol ? new SymbolWrapper(symbol, this.context) : undefined;
    };
    SymbolTableWrapper.prototype.has = function (key) {
        var table = this.symbolTable;
        return (typeof table.has === 'function') ? table.has(key) : table[key] != null;
    };
    SymbolTableWrapper.prototype.values = function () {
        var _this = this;
        return this.symbols.map(function (s) { return new SymbolWrapper(s, _this.context); });
    };
    return SymbolTableWrapper;
}());
var MapSymbolTable = (function () {
    function MapSymbolTable() {
        this.map = new Map();
        this._values = [];
    }
    Object.defineProperty(MapSymbolTable.prototype, "size", {
        get: function () { return this.map.size; },
        enumerable: true,
        configurable: true
    });
    MapSymbolTable.prototype.get = function (key) { return this.map.get(key); };
    MapSymbolTable.prototype.add = function (symbol) {
        if (this.map.has(symbol.name)) {
            var previous = this.map.get(symbol.name);
            this._values[this._values.indexOf(previous)] = symbol;
        }
        this.map.set(symbol.name, symbol);
        this._values.push(symbol);
    };
    MapSymbolTable.prototype.addAll = function (symbols) {
        for (var _i = 0, symbols_4 = symbols; _i < symbols_4.length; _i++) {
            var symbol = symbols_4[_i];
            this.add(symbol);
        }
    };
    MapSymbolTable.prototype.has = function (key) { return this.map.has(key); };
    MapSymbolTable.prototype.values = function () {
        // Switch to this.map.values once iterables are supported by the target language.
        return this._values;
    };
    return MapSymbolTable;
}());
var PipesTable = (function () {
    function PipesTable(pipes, context) {
        this.pipes = pipes;
        this.context = context;
    }
    Object.defineProperty(PipesTable.prototype, "size", {
        get: function () { return this.pipes.length; },
        enumerable: true,
        configurable: true
    });
    PipesTable.prototype.get = function (key) {
        var pipe = this.pipes.find(function (pipe) { return pipe.name == key; });
        if (pipe) {
            return new PipeSymbol(pipe, this.context);
        }
    };
    PipesTable.prototype.has = function (key) { return this.pipes.find(function (pipe) { return pipe.name == key; }) != null; };
    PipesTable.prototype.values = function () {
        var _this = this;
        return this.pipes.map(function (pipe) { return new PipeSymbol(pipe, _this.context); });
    };
    return PipesTable;
}());
var PipeSymbol = (function () {
    function PipeSymbol(pipe, context) {
        this.pipe = pipe;
        this.context = context;
    }
    Object.defineProperty(PipeSymbol.prototype, "name", {
        get: function () { return this.pipe.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "kind", {
        get: function () { return 'pipe'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "language", {
        get: function () { return 'typescript'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "type", {
        get: function () { return new TypeWrapper(this.tsType, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "container", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "callable", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "nullable", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "public", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "definition", {
        get: function () { return definitionFromTsSymbol(this.tsType.getSymbol()); },
        enumerable: true,
        configurable: true
    });
    PipeSymbol.prototype.members = function () { return EmptyTable.instance; };
    PipeSymbol.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    PipeSymbol.prototype.selectSignature = function (types) {
        var signature = selectSignature(this.tsType, this.context, types);
        if (types.length == 1) {
            var parameterType = types[0];
            if (parameterType instanceof TypeWrapper) {
                var resultType = undefined;
                switch (this.name) {
                    case 'async':
                        switch (parameterType.name) {
                            case 'Observable':
                            case 'Promise':
                            case 'EventEmitter':
                                resultType = getTypeParameterOf(parameterType.tsType, parameterType.name);
                                break;
                            default:
                                resultType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                                break;
                        }
                        break;
                    case 'slice':
                        resultType = getTypeParameterOf(parameterType.tsType, 'Array');
                        break;
                }
                if (resultType) {
                    signature = new SignatureResultOverride(signature, new TypeWrapper(resultType, parameterType.context));
                }
            }
        }
        return signature;
    };
    PipeSymbol.prototype.indexed = function (argument) { return undefined; };
    Object.defineProperty(PipeSymbol.prototype, "tsType", {
        get: function () {
            var type = this._tsType;
            if (!type) {
                var classSymbol = this.findClassSymbol(this.pipe.type.reference);
                if (classSymbol) {
                    type = this._tsType = this.findTransformMethodType(classSymbol);
                }
                if (!type) {
                    type = this._tsType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                }
            }
            return type;
        },
        enumerable: true,
        configurable: true
    });
    PipeSymbol.prototype.findClassSymbol = function (type) {
        return findClassSymbolInContext(type, this.context);
    };
    PipeSymbol.prototype.findTransformMethodType = function (classSymbol) {
        var classType = this.context.checker.getDeclaredTypeOfSymbol(classSymbol);
        if (classType) {
            var transform = classType.getProperty('transform');
            if (transform) {
                return this.context.checker.getTypeOfSymbolAtLocation(transform, this.context.node);
            }
        }
    };
    return PipeSymbol;
}());
function findClassSymbolInContext(type, context) {
    var sourceFile = context.program.getSourceFile(type.filePath);
    if (sourceFile) {
        var moduleSymbol = sourceFile.module || sourceFile.symbol;
        var exports_1 = context.checker.getExportsOfModule(moduleSymbol);
        return (exports_1 || []).find(function (symbol) { return symbol.name == type.name; });
    }
}
var EmptyTable = (function () {
    function EmptyTable() {
    }
    Object.defineProperty(EmptyTable.prototype, "size", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    EmptyTable.prototype.get = function (key) { return undefined; };
    EmptyTable.prototype.has = function (key) { return false; };
    EmptyTable.prototype.values = function () { return []; };
    return EmptyTable;
}());
EmptyTable.instance = new EmptyTable();
function findTsConfig(fileName) {
    var dir = path.dirname(fileName);
    while (fs.existsSync(dir)) {
        var candidate = path.join(dir, 'tsconfig.json');
        if (fs.existsSync(candidate))
            return candidate;
        var parentDir = path.dirname(dir);
        if (parentDir === dir)
            break;
        dir = parentDir;
    }
}
function isBindingPattern(node) {
    return !!node && (node.kind === ts.SyntaxKind.ArrayBindingPattern ||
        node.kind === ts.SyntaxKind.ObjectBindingPattern);
}
function walkUpBindingElementsAndPatterns(node) {
    while (node && (node.kind === ts.SyntaxKind.BindingElement || isBindingPattern(node))) {
        node = node.parent;
    }
    return node;
}
function getCombinedNodeFlags(node) {
    node = walkUpBindingElementsAndPatterns(node);
    var flags = node.flags;
    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
        node = node.parent;
    }
    if (node && node.kind === ts.SyntaxKind.VariableDeclarationList) {
        flags |= node.flags;
        node = node.parent;
    }
    if (node && node.kind === ts.SyntaxKind.VariableStatement) {
        flags |= node.flags;
    }
    return flags;
}
function isSymbolPrivate(s) {
    return !!s.valueDeclaration && isPrivate(s.valueDeclaration);
}
function getBuiltinTypeFromTs(kind, context) {
    var type;
    var checker = context.checker;
    var node = context.node;
    switch (kind) {
        case symbols_1.BuiltinType.Any:
            type = checker.getTypeAtLocation(setParents({
                kind: ts.SyntaxKind.AsExpression,
                expression: { kind: ts.SyntaxKind.TrueKeyword },
                type: { kind: ts.SyntaxKind.AnyKeyword }
            }, node));
            break;
        case symbols_1.BuiltinType.Boolean:
            type =
                checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.TrueKeyword }, node));
            break;
        case symbols_1.BuiltinType.Null:
            type =
                checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.NullKeyword }, node));
            break;
        case symbols_1.BuiltinType.Number:
            var numeric = { kind: ts.SyntaxKind.NumericLiteral };
            setParents({ kind: ts.SyntaxKind.ExpressionStatement, expression: numeric }, node);
            type = checker.getTypeAtLocation(numeric);
            break;
        case symbols_1.BuiltinType.String:
            type = checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral }, node));
            break;
        case symbols_1.BuiltinType.Undefined:
            type = checker.getTypeAtLocation(setParents({
                kind: ts.SyntaxKind.VoidExpression,
                expression: { kind: ts.SyntaxKind.NumericLiteral }
            }, node));
            break;
        default:
            throw new Error("Internal error, unhandled literal kind " + kind + ":" + symbols_1.BuiltinType[kind]);
    }
    return type;
}
function setParents(node, parent) {
    node.parent = parent;
    ts.forEachChild(node, function (child) { return setParents(child, node); });
    return node;
}
function spanOf(node) {
    return { start: node.getStart(), end: node.getEnd() };
}
function shrink(span, offset) {
    if (offset == null)
        offset = 1;
    return { start: span.start + offset, end: span.end - offset };
}
function spanAt(sourceFile, line, column) {
    if (line != null && column != null) {
        var position_1 = ts.getPositionOfLineAndCharacter(sourceFile, line, column);
        var findChild = function findChild(node) {
            if (node.kind > ts.SyntaxKind.LastToken && node.pos <= position_1 && node.end > position_1) {
                var betterNode = ts.forEachChild(node, findChild);
                return betterNode || node;
            }
        };
        var node = ts.forEachChild(sourceFile, findChild);
        if (node) {
            return { start: node.getStart(), end: node.getEnd() };
        }
    }
}
function definitionFromTsSymbol(symbol) {
    var declarations = symbol.declarations;
    if (declarations) {
        return declarations.map(function (declaration) {
            var sourceFile = declaration.getSourceFile();
            return {
                fileName: sourceFile.fileName,
                span: { start: declaration.getStart(), end: declaration.getEnd() }
            };
        });
    }
}
function parentDeclarationOf(node) {
    while (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                return node;
            case ts.SyntaxKind.SourceFile:
                return undefined;
        }
        node = node.parent;
    }
}
function getContainerOf(symbol, context) {
    if (symbol.getFlags() & ts.SymbolFlags.ClassMember && symbol.declarations) {
        for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            var parent_1 = parentDeclarationOf(declaration);
            if (parent_1) {
                var type = context.checker.getTypeAtLocation(parent_1);
                if (type) {
                    return new TypeWrapper(type, context);
                }
            }
        }
    }
}
function getTypeParameterOf(type, name) {
    if (type && type.symbol && type.symbol.name == name) {
        var typeArguments = type.typeArguments;
        if (typeArguments && typeArguments.length <= 1) {
            return typeArguments[0];
        }
    }
}
function typeKindOf(type) {
    if (type) {
        if (type.flags & ts.TypeFlags.Any) {
            return symbols_1.BuiltinType.Any;
        }
        else if (type.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral)) {
            return symbols_1.BuiltinType.String;
        }
        else if (type.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike)) {
            return symbols_1.BuiltinType.Number;
        }
        else if (type.flags & (ts.TypeFlags.Undefined)) {
            return symbols_1.BuiltinType.Undefined;
        }
        else if (type.flags & (ts.TypeFlags.Null)) {
            return symbols_1.BuiltinType.Null;
        }
        else if (type.flags & ts.TypeFlags.Union) {
            // If all the constituent types of a union are the same kind, it is also that kind.
            var candidate = null;
            var unionType = type;
            if (unionType.types.length > 0) {
                candidate = typeKindOf(unionType.types[0]);
                for (var _i = 0, _a = unionType.types; _i < _a.length; _i++) {
                    var subType = _a[_i];
                    if (candidate != typeKindOf(subType)) {
                        return symbols_1.BuiltinType.Other;
                    }
                }
            }
            if (candidate != null) {
                return candidate;
            }
        }
        else if (type.flags & ts.TypeFlags.TypeParameter) {
            return symbols_1.BuiltinType.Unbound;
        }
    }
    return symbols_1.BuiltinType.Other;
}
function getFromSymbolTable(symbolTable, key) {
    var table = symbolTable;
    var symbol;
    if (typeof table.get === 'function') {
        // TS 2.2 uses a Map
        symbol = table.get(key);
    }
    else {
        // TS pre-2.2 uses an object
        symbol = table[key];
    }
    return symbol;
}
function toNumbers(value) {
    return value ? value.split('.').map(function (v) { return +v; }) : [];
}
function compareNumbers(a, b) {
    for (var i = 0; i < a.length && i < b.length; i++) {
        if (a[i] > b[i])
            return 1;
        if (a[i] < b[i])
            return -1;
    }
    return 0;
}
function isTypescriptVersion(low, high) {
    var tsNumbers = toNumbers(ts.version);
    return compareNumbers(toNumbers(low), tsNumbers) <= 0 &&
        compareNumbers(toNumbers(high), tsNumbers) >= 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9zeW1ib2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy90eXBlc2NyaXB0X3N5bWJvbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCx1QkFBeUI7QUFDekIsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxxQ0FBMEo7QUFHMUosc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUMzQyxJQUFNLFNBQVMsR0FBSSxFQUFVLENBQUMsYUFBYTtJQUN2QyxDQUFDLFVBQUMsSUFBYTtRQUNWLE9BQUEsQ0FBQyxDQUFDLENBQUUsRUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxHQUFJLEVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBQWxGLENBQWtGLENBQUM7SUFDeEYsQ0FBQyxVQUFDLElBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUksRUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO0FBRXhFLElBQU0sZUFBZSxHQUFJLEVBQVUsQ0FBQyxXQUFXO0lBQzNDLENBQUMsVUFBQyxJQUFhO1FBQ1YsT0FBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFJLEVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTTtZQUN4QyxJQUFZLENBQUMsV0FBVyxHQUFJLEVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBRGpFLENBQ2lFLENBQUM7SUFDdkUsQ0FBQyxVQUFDLElBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUksRUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBaEQsQ0FBZ0QsQ0FBQyxDQUFDO0FBUTFFLHdCQUNJLE9BQW1CLEVBQUUsT0FBdUIs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