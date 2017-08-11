"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var ts = require("typescript");
function toMap(items, select) {
    return new Map(items.map(function (i) { return [select(i), i]; }));
}
// We will never lower expressions in a nested lexical scope so avoid entering them.
// This also avoids a bug in TypeScript 2.3 where the lexical scopes get out of sync
// when using visitEachChild.
function isLexicalScope(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.TypeLiteral:
        case ts.SyntaxKind.ArrayType:
            return true;
    }
    return false;
}
function transformSourceFile(sourceFile, requests, context) {
    var inserts = [];
    // Calculate the range of interesting locations. The transform will only visit nodes in this
    // range to improve the performance on large files.
    var locations = Array.from(requests.keys());
    var min = Math.min.apply(Math, locations);
    var max = Math.max.apply(Math, locations);
    // Visit nodes matching the request and synthetic nodes added by tsickle
    function shouldVisit(pos, end) {
        return (pos <= max && end >= min) || pos == -1;
    }
    function visitSourceFile(sourceFile) {
        function topLevelStatement(node) {
            var declarations = [];
            function visitNode(node) {
                // Get the original node before tsickle
                var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end, kind = _a.kind;
                var nodeRequest = requests.get(pos);
                if (nodeRequest && nodeRequest.kind == kind && nodeRequest.end == end) {
                    // This node is requested to be rewritten as a reference to the exported name.
                    // Record that the node needs to be moved to an exported variable with the given name
                    var name_1 = nodeRequest.name;
                    declarations.push({ name: name_1, node: node });
                    return ts.createIdentifier(name_1);
                }
                var result = node;
                if (shouldVisit(pos, end) && !isLexicalScope(node)) {
                    result = ts.visitEachChild(node, visitNode, context);
                }
                return result;
            }
            // Get the original node before tsickle
            var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end;
            var result = shouldVisit(pos, end) ? ts.visitEachChild(node, visitNode, context) : node;
            if (declarations.length) {
                inserts.push({ priorTo: result, declarations: declarations });
            }
            return result;
        }
        var traversedSource = ts.visitEachChild(sourceFile, topLevelStatement, context);
        if (inserts.length) {
            // Insert the declarations before the rewritten statement that references them.
            var insertMap = toMap(inserts, function (i) { return i.priorTo; });
            var newStatements = traversedSource.statements.slice();
            for (var i = newStatements.length; i >= 0; i--) {
                var statement = newStatements[i];
                var insert = insertMap.get(statement);
                if (insert) {
                    var declarations = insert.declarations.map(function (i) { return ts.createVariableDeclaration(i.name, /* type */ undefined, i.node); });
                    var statement_1 = ts.createVariableStatement(
                    /* modifiers */ undefined, ts.createVariableDeclarationList(declarations, ts.NodeFlags.Const));
                    newStatements.splice(i, 0, statement_1);
                }
            }
            // Insert an exports clause to export the declarations
            newStatements.push(ts.createExportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, ts.createNamedExports(inserts
                .reduce(function (accumulator, insert) { return accumulator.concat(insert.declarations); }, [])
                .map(function (declaration) { return ts.createExportSpecifier(
            /* propertyName */ undefined, declaration.name); }))));
            return ts.updateSourceFileNode(traversedSource, newStatements);
        }
        return traversedSource;
    }
    return visitSourceFile(sourceFile);
}
function getExpressionLoweringTransformFactory(requestsMap) {
    // Return the factory
    return function (context) { return function (sourceFile) {
        var requests = requestsMap.getRequests(sourceFile);
        if (requests && requests.size) {
            return transformSourceFile(sourceFile, requests, context);
        }
        return sourceFile;
    }; };
}
exports.getExpressionLoweringTransformFactory = getExpressionLoweringTransformFactory;
function shouldLower(node) {
    if (node) {
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.Decorator:
                // Lower expressions that are local to the module scope or
                // in a decorator.
                return true;
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
                // Don't lower expressions in a declaration.
                return false;
            case ts.SyntaxKind.VariableDeclaration:
                // Avoid lowering expressions already in an exported variable declaration
                return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) == 0;
        }
        return shouldLower(node.parent);
    }
    return true;
}
var LowerMetadataCache = (function () {
    function LowerMetadataCache(options, strict) {
        this.strict = strict;
        this.metadataCache = new Map();
        this.collector = new tsc_wrapped_1.MetadataCollector(options);
    }
    LowerMetadataCache.prototype.getMetadata = function (sourceFile) {
        return this.ensureMetadataAndRequests(sourceFile).metadata;
    };
    LowerMetadataCache.prototype.getRequests = function (sourceFile) {
        return this.ensureMetadataAndRequests(sourceFile).requests;
    };
    LowerMetadataCache.prototype.ensureMetadataAndRequests = function (sourceFile) {
        var result = this.metadataCache.get(sourceFile.fileName);
        if (!result) {
            result = this.getMetadataAndRequests(sourceFile);
            this.metadataCache.set(sourceFile.fileName, result);
        }
        return result;
    };
    LowerMetadataCache.prototype.getMetadataAndRequests = function (sourceFile) {
        var identNumber = 0;
        var freshIdent = function () { return '\u0275' + identNumber++; };
        var requests = new Map();
        var replaceNode = function (node) {
            var name = freshIdent();
            requests.set(node.pos, { name: name, kind: node.kind, location: node.pos, end: node.end });
            return { __symbolic: 'reference', name: name };
        };
        var substituteExpression = function (value, node) {
            if ((node.kind === ts.SyntaxKind.ArrowFunction ||
                node.kind === ts.SyntaxKind.FunctionExpression) &&
                shouldLower(node)) {
                return replaceNode(node);
            }
            return value;
        };
        var metadata = this.collector.getMetadata(sourceFile, this.strict, substituteExpression);
        return { metadata: metadata, requests: requests };
    };
    return LowerMetadataCache;
}());
exports.LowerMetadataCache = LowerMetadataCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfZXhwcmVzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL3RyYW5zZm9ybWVycy9sb3dlcl9leHByZXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG9EQUF3RztBQUN4RywrQkFBaUM7QUFxQmpDLGVBQXFCLEtBQVUsRUFBRSxNQUFzQjtJQUNyRCxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBUyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUVELG9GQUFvRjtBQUNwRixvRkFBb0Y7QUFDcEYsNkJBQTZCO0FBQzdCLHdCQUF3QixJQUFhO0lBQ25DLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDakMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO1FBQ3RDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ25DLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNwQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2hDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDL0IsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7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