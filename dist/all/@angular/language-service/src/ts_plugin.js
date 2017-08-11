"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var language_service_1 = require("./language_service");
var typescript_host_1 = require("./typescript_host");
var projectHostMap = new WeakMap();
function getExternalFiles(project) {
    var host = projectHostMap.get(project);
    if (host) {
        return host.getTemplateReferences();
    }
}
exports.getExternalFiles = getExternalFiles;
var angularOnlyResults = process.argv.indexOf('--angularOnlyResults') >= 0;
function angularOnlyFilter(ls) {
    return {
        cleanupSemanticCache: function () { return ls.cleanupSemanticCache(); },
        getSyntacticDiagnostics: function (fileName) { return []; },
        getSemanticDiagnostics: function (fileName) { return []; },
        getCompilerOptionsDiagnostics: function () { return []; },
        getSyntacticClassifications: function (fileName, span) { return []; },
        getSemanticClassifications: function (fileName, span) { return []; },
        getEncodedSyntacticClassifications: function (fileName, span) { return ({ undefined: undefined }); },
        getEncodedSemanticClassifications: function (fileName, span) { return undefined; },
        getCompletionsAtPosition: function (fileName, position) { return undefined; },
        getCompletionEntryDetails: function (fileName, position, entryName) {
            return undefined;
        },
        getCompletionEntrySymbol: function (fileName, position, entryName) { return undefined; },
        getQuickInfoAtPosition: function (fileName, position) { return undefined; },
        getNameOrDottedNameSpan: function (fileName, startPos, endPos) { return undefined; },
        getBreakpointStatementAtPosition: function (fileName, position) { return undefined; },
        getSignatureHelpItems: function (fileName, position) { return undefined; },
        getRenameInfo: function (fileName, position) { return undefined; },
        findRenameLocations: function (fileName, position, findInStrings, findInComments) {
            return [];
        },
        getDefinitionAtPosition: function (fileName, position) { return []; },
        getTypeDefinitionAtPosition: function (fileName, position) { return []; },
        getImplementationAtPosition: function (fileName, position) { return []; },
        getReferencesAtPosition: function (fileName, position) { return []; },
        findReferences: function (fileName, position) { return []; },
        getDocumentHighlights: function (fileName, position, filesToSearch) { return []; },
        /** @deprecated */
        getOccurrencesAtPosition: function (fileName, position) { return []; },
        getNavigateToItems: function (searchValue) { return []; },
        getNavigationBarItems: function (fileName) { return []; },
        getNavigationTree: function (fileName) { return undefined; },
        getOutliningSpans: function (fileName) { return []; },
        getTodoComments: function (fileName, descriptors) { return []; },
        getBraceMatchingAtPosition: function (fileName, position) { return []; },
        getIndentationAtPosition: function (fileName, position, options) { return undefined; },
        getFormattingEditsForRange: function (fileName, start, end, options) { return []; },
        getFormattingEditsForDocument: function (fileName, options) { return []; },
        getFormattingEditsAfterKeystroke: function (fileName, position, key, options) { return []; },
        getDocCommentTemplateAtPosition: function (fileName, position) { return undefined; },
        isValidBraceCompletionAtPosition: function (fileName, position, openingBrace) { return undefined; },
        getCodeFixesAtPosition: function (fileName, start, end, errorCodes) { return []; },
        getEmitOutput: function (fileName) { return undefined; },
        getProgram: function () { return ls.getProgram(); },
        dispose: function () { return ls.dispose(); }
    };
}
function create(info /* ts.server.PluginCreateInfo */) {
    // Create the proxy
    var proxy = Object.create(null);
    var oldLS = info.languageService;
    if (angularOnlyResults) {
        oldLS = angularOnlyFilter(oldLS);
    }
    function tryCall(fileName, callback) {
        if (fileName && !oldLS.getProgram().getSourceFile(fileName)) {
            return undefined;
        }
        try {
            return callback();
        }
        catch (e) {
            return undefined;
        }
    }
    function tryFilenameCall(m) {
        return function (fileName) { return tryCall(fileName, function () { return (m.call(ls, fileName)); }); };
    }
    function tryFilenameOneCall(m) {
        return function (fileName, p) { return tryCall(fileName, function () { return (m.call(ls, fileName, p)); }); };
    }
    function tryFilenameTwoCall(m) {
        return function (fileName, p1, p2) { return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2)); }); };
    }
    function tryFilenameThreeCall(m) {
        return function (fileName, p1, p2, p3) { return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2, p3)); }); };
    }
    function tryFilenameFourCall(m) {
        return function (fileName, p1, p2, p3, p4) {
            return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2, p3, p4)); });
        };
    }
    function typescriptOnly(ls) {
        return {
            cleanupSemanticCache: function () { return ls.cleanupSemanticCache(); },
            getSyntacticDiagnostics: tryFilenameCall(ls.getSyntacticDiagnostics),
            getSemanticDiagnostics: tryFilenameCall(ls.getSemanticDiagnostics),
            getCompilerOptionsDiagnostics: function () { return ls.getCompilerOptionsDiagnostics(); },
            getSyntacticClassifications: tryFilenameOneCall(ls.getSemanticClassifications),
            getSemanticClassifications: tryFilenameOneCall(ls.getSemanticClassifications),
            getEncodedSyntacticClassifications: tryFilenameOneCall(ls.getEncodedSyntacticClassifications),
            getEncodedSemanticClassifications: tryFilenameOneCall(ls.getEncodedSemanticClassifications),
            getCompletionsAtPosition: tryFilenameOneCall(ls.getCompletionsAtPosition),
            getCompletionEntryDetails: tryFilenameTwoCall(ls.getCompletionEntryDetails),
            getCompletionEntrySymbol: tryFilenameTwoCall(ls.getCompletionEntrySymbol),
            getQuickInfoAtPosition: tryFilenameOneCall(ls.getQuickInfoAtPosition),
            getNameOrDottedNameSpan: tryFilenameTwoCall(ls.getNameOrDottedNameSpan),
            getBreakpointStatementAtPosition: tryFilenameOneCall(ls.getBreakpointStatementAtPosition),
            getSignatureHelpItems: tryFilenameOneCall(ls.getSignatureHelpItems),
            getRenameInfo: tryFilenameOneCall(ls.getRenameInfo),
            findRenameLocations: tryFilenameThreeCall(ls.findRenameLocations),
            getDefinitionAtPosition: tryFilenameOneCall(ls.getDefinitionAtPosition),
            getTypeDefinitionAtPosition: tryFilenameOneCall(ls.getTypeDefinitionAtPosition),
            getImplementationAtPosition: tryFilenameOneCall(ls.getImplementationAtPosition),
            getReferencesAtPosition: tryFilenameOneCall(ls.getReferencesAtPosition),
            findReferences: tryFilenameOneCall(ls.findReferences),
            getDocumentHighlights: tryFilenameTwoCall(ls.getDocumentHighlights),
            /** @deprecated */
            getOccurrencesAtPosition: tryFilenameOneCall(ls.getOccurrencesAtPosition),
            getNavigateToItems: function (searchValue, maxResultCount, fileName, excludeDtsFiles) { return tryCall(fileName, function () { return ls.getNavigateToItems(searchValue, maxResultCount, fileName, excludeDtsFiles); }); },
            getNavigationBarItems: tryFilenameCall(ls.getNavigationBarItems),
            getNavigationTree: tryFilenameCall(ls.getNavigationTree),
            getOutliningSpans: tryFilenameCall(ls.getOutliningSpans),
            getTodoComments: tryFilenameOneCall(ls.getTodoComments),
            getBraceMatchingAtPosition: tryFilenameOneCall(ls.getBraceMatchingAtPosition),
            getIndentationAtPosition: tryFilenameTwoCall(ls.getIndentationAtPosition),
            getFormattingEditsForRange: tryFilenameThreeCall(ls.getFormattingEditsForRange),
            getFormattingEditsForDocument: tryFilenameOneCall(ls.getFormattingEditsForDocument),
            getFormattingEditsAfterKeystroke: tryFilenameThreeCall(ls.getFormattingEditsAfterKeystroke),
            getDocCommentTemplateAtPosition: tryFilenameOneCall(ls.getDocCommentTemplateAtPosition),
            isValidBraceCompletionAtPosition: tryFilenameTwoCall(ls.isValidBraceCompletionAtPosition),
            getCodeFixesAtPosition: tryFilenameFourCall(ls.getCodeFixesAtPosition),
            getEmitOutput: tryFilenameCall(ls.getEmitOutput),
            getProgram: function () { return ls.getProgram(); },
            dispose: function () { return ls.dispose(); }
        };
    }
    oldLS = typescriptOnly(oldLS);
    var _loop_1 = function (k) {
        proxy[k] = function () { return oldLS[k].apply(oldLS, arguments); };
    };
    for (var k in oldLS) {
        _loop_1(k);
    }
    function completionToEntry(c) {
        return { kind: c.kind, name: c.name, sortText: c.sort, kindModifiers: '' };
    }
    function diagnosticToDiagnostic(d, file) {
        var result = {
            file: file,
            start: d.span.start,
            length: d.span.end - d.span.start,
            messageText: d.message,
            category: ts.DiagnosticCategory.Error,
            code: 0,
            source: 'ng'
        };
        return result;
    }
    function tryOperation(attempting, callback) {
        try {
            return callback();
        }
        catch (e) {
            info.project.projectService.logger.info("Failed to " + attempting + ": " + e.toString());
            info.project.projectService.logger.info("Stack trace: " + e.stack);
            return null;
        }
    }
    var serviceHost = new typescript_host_1.TypeScriptServiceHost(info.languageServiceHost, info.languageService);
    var ls = language_service_1.createLanguageService(serviceHost);
    serviceHost.setSite(ls);
    projectHostMap.set(info.project, serviceHost);
    proxy.getCompletionsAtPosition = function (fileName, position) {
        var base = oldLS.getCompletionsAtPosition(fileName, position) || {
            isGlobalCompletion: false,
            isMemberCompletion: false,
            isNewIdentifierLocation: false,
            entries: []
        };
        tryOperation('get completions', function () {
            var results = ls.getCompletionsAt(fileName, position);
            if (results && results.length) {
                if (base === undefined) {
                    base = {
                        isGlobalCompletion: false,
                        isMemberCompletion: false,
                        isNewIdentifierLocation: false,
                        entries: []
                    };
                }
                for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                    var entry = results_1[_i];
                    base.entries.push(completionToEntry(entry));
                }
            }
        });
        return base;
    };
    proxy.getQuickInfoAtPosition = function (fileName, position) {
        var base = oldLS.getQuickInfoAtPosition(fileName, position);
        // TODO(vicb): the tags property has been removed in TS 2.2
        tryOperation('get quick info', function () {
            var ours = ls.getHoverAt(fileName, position);
            if (ours) {
                var displayParts = [];
                for (var _i = 0, _a = ours.text; _i < _a.length; _i++) {
                    var part = _a[_i];
                    displayParts.push({ kind: part.language || 'angular', text: part.text });
                }
                var tags = base && base.tags;
                base = {
                    displayParts: displayParts,
                    documentation: [],
                    kind: 'angular',
                    kindModifiers: 'what does this do?',
                    textSpan: { start: ours.span.start, length: ours.span.end - ours.span.start },
                };
                if (tags) {
                    base.tags = tags;
                }
            }
        });
        return base;
    };
    proxy.getSemanticDiagnostics = function (fileName) {
        var result = oldLS.getSemanticDiagnostics(fileName);
        var base = result || [];
        tryOperation('get diagnostics', function () {
            info.project.projectService.logger.info("Computing Angular semantic diagnostics...");
            var ours = ls.getDiagnostics(fileName);
            if (ours && ours.length) {
                var file_1 = oldLS.getProgram().getSourceFile(fileName);
                base.push.apply(base, ours.map(function (d) { return diagnosticToDiagnostic(d, file_1); }));
            }
        });
        return base;
    };
    proxy.getDefinitionAtPosition = function (fileName, position) {
        var base = oldLS.getDefinitionAtPosition(fileName, position);
        if (base && base.length) {
            return base;
        }
        return tryOperation('get definition', function () {
            var ours = ls.getDefinitionAt(fileName, position);
            if (ours && ours.length) {
                base = base || [];
                for (var _i = 0, ours_1 = ours; _i < ours_1.length; _i++) {
                    var loc = ours_1[_i];
                    base.push({
                        fileName: loc.fileName,
                        textSpan: { start: loc.span.start, length: loc.span.end - loc.span.start },
                        name: '',
                        kind: 'definition',
                        containerName: loc.fileName,
                        containerKind: 'file'
                    });
                }
            }
            return base;
        }) || [];
    };
    return proxy;
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS9zcmMvdHNfcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLHVEQUF5RDtBQUV6RCxxREFBd0Q7QUFFeEQsSUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQThCLENBQUM7QUFFakUsMEJBQWlDLE9BQVk7SUFDM0MsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7QUFDSCxDQUFDO0FBTEQsNENBS0M7QUFFRCxJQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTdFLDJCQUEyQixFQUFzQjtJQUMvQyxNQUFNLENBQUM7UUFDTCxvQkFBb0IsRUFBRSxjQUFNLE9BQUEsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEVBQXpCLENBQXlCO1FBQ3JELHVCQUF1QixFQUFFLFVBQUEsUUFBUSxJQUFJLE9BQWlCLEVBQUUsRUFBbkIsQ0FBbUI7UUFDeEQsc0JBQXNCLEVBQUUsVUFBQSxRQUFRLElBQUksT0FBaUIsRUFBRSxFQUFuQixDQUFtQjtRQUN2RCw2QkFBNkIsRUFBRSxjQUFNLE9BQWlCLEVBQUUsRUFBbkIsQ0FBbUI7UUFDeEQsMkJBQTJCLEVBQUUsVUFBQyxRQUFRLEVBQUUsSUFBSSxJQUFLLE9BQUEsRUFBRSxFQUFGLENBQUU7UUFDbkQsMEJBQTBCLEVBQUUsVUFBQyxRQUFRLEVBQUUsSUFBSSxJQUFLLE9BQUEsRUFBRSxFQUFGLENBQUU7UUFDbEQsa0NB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