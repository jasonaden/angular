/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { createLanguageService } from './language_service';
import { TypeScriptServiceHost } from './typescript_host';
const projectHostMap = new WeakMap();
export function getExternalFiles(project) {
    const host = projectHostMap.get(project);
    if (host) {
        return host.getTemplateReferences();
    }
}
const angularOnlyResults = process.argv.indexOf('--angularOnlyResults') >= 0;
function angularOnlyFilter(ls) {
    return {
        cleanupSemanticCache: () => ls.cleanupSemanticCache(),
        getSyntacticDiagnostics: fileName => [],
        getSemanticDiagnostics: fileName => [],
        getCompilerOptionsDiagnostics: () => [],
        getSyntacticClassifications: (fileName, span) => [],
        getSemanticClassifications: (fileName, span) => [],
        getEncodedSyntacticClassifications: (fileName, span) => ({ undefined }),
        getEncodedSemanticClassifications: (fileName, span) => undefined,
        getCompletionsAtPosition: (fileName, position) => undefined,
        getCompletionEntryDetails: (fileName, position, entryName) => undefined,
        getCompletionEntrySymbol: (fileName, position, entryName) => undefined,
        getQuickInfoAtPosition: (fileName, position) => undefined,
        getNameOrDottedNameSpan: (fileName, startPos, endPos) => undefined,
        getBreakpointStatementAtPosition: (fileName, position) => undefined,
        getSignatureHelpItems: (fileName, position) => undefined,
        getRenameInfo: (fileName, position) => undefined,
        findRenameLocations: (fileName, position, findInStrings, findInComments) => [],
        getDefinitionAtPosition: (fileName, position) => [],
        getTypeDefinitionAtPosition: (fileName, position) => [],
        getImplementationAtPosition: (fileName, position) => [],
        getReferencesAtPosition: (fileName, position) => [],
        findReferences: (fileName, position) => [],
        getDocumentHighlights: (fileName, position, filesToSearch) => [],
        /** @deprecated */
        getOccurrencesAtPosition: (fileName, position) => [],
        getNavigateToItems: searchValue => [],
        getNavigationBarItems: fileName => [],
        getNavigationTree: fileName => undefined,
        getOutliningSpans: fileName => [],
        getTodoComments: (fileName, descriptors) => [],
        getBraceMatchingAtPosition: (fileName, position) => [],
        getIndentationAtPosition: (fileName, position, options) => undefined,
        getFormattingEditsForRange: (fileName, start, end, options) => [],
        getFormattingEditsForDocument: (fileName, options) => [],
        getFormattingEditsAfterKeystroke: (fileName, position, key, options) => [],
        getDocCommentTemplateAtPosition: (fileName, position) => undefined,
        isValidBraceCompletionAtPosition: (fileName, position, openingBrace) => undefined,
        getCodeFixesAtPosition: (fileName, start, end, errorCodes) => [],
        getEmitOutput: fileName => undefined,
        getProgram: () => ls.getProgram(),
        dispose: () => ls.dispose()
    };
}
export function create(info /* ts.server.PluginCreateInfo */) {
    // Create the proxy
    const proxy = Object.create(null);
    let oldLS = info.languageService;
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
        return fileName => tryCall(fileName, () => (m.call(ls, fileName)));
    }
    function tryFilenameOneCall(m) {
        return (fileName, p) => tryCall(fileName, () => (m.call(ls, fileName, p)));
    }
    function tryFilenameTwoCall(m) {
        return (fileName, p1, p2) => tryCall(fileName, () => (m.call(ls, fileName, p1, p2)));
    }
    function tryFilenameThreeCall(m) {
        return (fileName, p1, p2, p3) => tryCall(fileName, () => (m.call(ls, fileName, p1, p2, p3)));
    }
    function tryFilenameFourCall(m) {
        return (fileName, p1, p2, p3, p4) => tryCall(fileName, () => (m.call(ls, fileName, p1, p2, p3, p4)));
    }
    function typescriptOnly(ls) {
        return {
            cleanupSemanticCache: () => ls.cleanupSemanticCache(),
            getSyntacticDiagnostics: tryFilenameCall(ls.getSyntacticDiagnostics),
            getSemanticDiagnostics: tryFilenameCall(ls.getSemanticDiagnostics),
            getCompilerOptionsDiagnostics: () => ls.getCompilerOptionsDiagnostics(),
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
            getNavigateToItems: (searchValue, maxResultCount, fileName, excludeDtsFiles) => tryCall(fileName, () => ls.getNavigateToItems(searchValue, maxResultCount, fileName, excludeDtsFiles)),
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
            getProgram: () => ls.getProgram(),
            dispose: () => ls.dispose()
        };
    }
    oldLS = typescriptOnly(oldLS);
    for (const k in oldLS) {
        proxy[k] = function () { return oldLS[k].apply(oldLS, arguments); };
    }
    function completionToEntry(c) {
        return { kind: c.kind, name: c.name, sortText: c.sort, kindModifiers: '' };
    }
    function diagnosticToDiagnostic(d, file) {
        const result = {
            file,
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
            info.project.projectService.logger.info(`Failed to ${attempting}: ${e.toString()}`);
            info.project.projectService.logger.info(`Stack trace: ${e.stack}`);
            return null;
        }
    }
    const serviceHost = new TypeScriptServiceHost(info.languageServiceHost, info.languageService);
    const ls = createLanguageService(serviceHost);
    serviceHost.setSite(ls);
    projectHostMap.set(info.project, serviceHost);
    proxy.getCompletionsAtPosition = function (fileName, position) {
        let base = oldLS.getCompletionsAtPosition(fileName, position) || {
            isGlobalCompletion: false,
            isMemberCompletion: false,
            isNewIdentifierLocation: false,
            entries: []
        };
        tryOperation('get completions', () => {
            const results = ls.getCompletionsAt(fileName, position);
            if (results && results.length) {
                if (base === undefined) {
                    base = {
                        isGlobalCompletion: false,
                        isMemberCompletion: false,
                        isNewIdentifierLocation: false,
                        entries: []
                    };
                }
                for (const entry of results) {
                    base.entries.push(completionToEntry(entry));
                }
            }
        });
        return base;
    };
    proxy.getQuickInfoAtPosition = function (fileName, position) {
        let base = oldLS.getQuickInfoAtPosition(fileName, position);
        // TODO(vicb): the tags property has been removed in TS 2.2
        tryOperation('get quick info', () => {
            const ours = ls.getHoverAt(fileName, position);
            if (ours) {
                const displayParts = [];
                for (const part of ours.text) {
                    displayParts.push({ kind: part.language || 'angular', text: part.text });
                }
                const tags = base && base.tags;
                base = {
                    displayParts,
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
        let result = oldLS.getSemanticDiagnostics(fileName);
        const base = result || [];
        tryOperation('get diagnostics', () => {
            info.project.projectService.logger.info(`Computing Angular semantic diagnostics...`);
            const ours = ls.getDiagnostics(fileName);
            if (ours && ours.length) {
                const file = oldLS.getProgram().getSourceFile(fileName);
                base.push.apply(base, ours.map(d => diagnosticToDiagnostic(d, file)));
            }
        });
        return base;
    };
    proxy.getDefinitionAtPosition = function (fileName, position) {
        let base = oldLS.getDefinitionAtPosition(fileName, position);
        if (base && base.length) {
            return base;
        }
        return tryOperation('get definition', () => {
            const ours = ls.getDefinitionAt(fileName, position);
            if (ours && ours.length) {
                base = base || [];
                for (const loc of ours) {
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
//# sourceMappingURL=ts_plugin.js.map