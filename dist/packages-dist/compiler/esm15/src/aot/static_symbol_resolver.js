/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ValueTransformer, visitValue } from '../util';
import { StaticSymbol } from './static_symbol';
import { isGeneratedFile, stripSummaryForJitFileSuffix, stripSummaryForJitNameSuffix, summaryForJitFileName, summaryForJitName } from './util';
export class ResolvedStaticSymbol {
    /**
     * @param {?} symbol
     * @param {?} metadata
     */
    constructor(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
    }
}
function ResolvedStaticSymbol_tsickle_Closure_declarations() {
    /** @type {?} */
    ResolvedStaticSymbol.prototype.symbol;
    /** @type {?} */
    ResolvedStaticSymbol.prototype.metadata;
}
/**
 * The host of the SymbolResolverHost disconnects the implementation from TypeScript / other
 * language
 * services and from underlying file systems.
 * @record
 */
export function StaticSymbolResolverHost() { }
function StaticSymbolResolverHost_tsickle_Closure_declarations() {
    /**
     * Return a ModuleMetadata for the given module.
     * Angular CLI will produce this metadata for a module whenever a .d.ts files is
     * produced and the module has exported variables or classes with decorators. Module metadata can
     * also be produced directly from TypeScript sources by using MetadataCollector in tools/metadata.
     *
     * \@param modulePath is a string identifier for a module as an absolute path.
     * \@return the metadata for the given module.
     * @type {?}
     */
    StaticSymbolResolverHost.prototype.getMetadataFor;
    /**
     * Converts a module name that is used in an `import` to a file path.
     * I.e.
     * `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
     * @type {?}
     */
    StaticSymbolResolverHost.prototype.moduleNameToFileName;
    /**
     * Converts a file path to a module name that can be used as an `import.
     * I.e. `path/to/importedFile.ts` should be imported by `path/to/containingFile.ts`.
     *
     * See ImportResolver.
     * @type {?}
     */
    StaticSymbolResolverHost.prototype.fileNameToModuleName;
}
const /** @type {?} */ SUPPORTED_SCHEMA_VERSION = 3;
/**
 * This class is responsible for loading metadata per symbol,
 * and normalizing references between symbols.
 *
 * Internally, it only uses symbols without members,
 * and deduces the values for symbols with members based
 * on these symbols.
 */
export class StaticSymbolResolver {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     * @param {?} summaryResolver
     * @param {?=} errorRecorder
     */
    constructor(host, staticSymbolCache, summaryResolver, errorRecorder) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryResolver = summaryResolver;
        this.errorRecorder = errorRecorder;
        this.metadataCache = new Map();
        this.resolvedSymbols = new Map();
        this.resolvedFilePaths = new Set();
        this.importAs = new Map();
        this.symbolResourcePaths = new Map();
        this.symbolFromFile = new Map();
        this.knownFileNameToModuleNames = new Map();
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    resolveSymbol(staticSymbol) {
        if (staticSymbol.members.length > 0) {
            return ((this._resolveSymbolMembers(staticSymbol)));
        }
        let /** @type {?} */ result = this.resolvedSymbols.get(staticSymbol);
        if (result) {
            return result;
        }
        result = ((this._resolveSymbolFromSummary(staticSymbol)));
        if (result) {
            return result;
        }
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        this._createSymbolsOf(staticSymbol.filePath);
        result = ((this.resolvedSymbols.get(staticSymbol)));
        return result;
    }
    /**
     * getImportAs produces a symbol that can be used to import the given symbol.
     * The import might be different than the symbol if the symbol is exported from
     * a library with a summary; in which case we want to import the symbol from the
     * ngfactory re-export instead of directly to avoid introducing a direct dependency
     * on an otherwise indirect dependency.
     *
     * @param {?} staticSymbol the symbol for which to generate a import symbol
     * @return {?}
     */
    getImportAs(staticSymbol) {
        if (staticSymbol.members.length) {
            const /** @type {?} */ baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
            const /** @type {?} */ baseImportAs = this.getImportAs(baseSymbol);
            return baseImportAs ?
                this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) :
                null;
        }
        const /** @type {?} */ summarizedFileName = stripSummaryForJitFileSuffix(staticSymbol.filePath);
        if (summarizedFileName !== staticSymbol.filePath) {
            const /** @type {?} */ summarizedName = stripSummaryForJitNameSuffix(staticSymbol.name);
            const /** @type {?} */ baseSymbol = this.getStaticSymbol(summarizedFileName, summarizedName, staticSymbol.members);
            const /** @type {?} */ baseImportAs = this.getImportAs(baseSymbol);
            return baseImportAs ?
                this.getStaticSymbol(summaryForJitFileName(baseImportAs.filePath), summaryForJitName(baseImportAs.name), baseSymbol.members) :
                null;
        }
        let /** @type {?} */ result = this.summaryResolver.getImportAs(staticSymbol);
        if (!result) {
            result = ((this.importAs.get(staticSymbol)));
        }
        return result;
    }
    /**
     * getResourcePath produces the path to the original location of the symbol and should
     * be used to determine the relative location of resource references recorded in
     * symbol metadata.
     * @param {?} staticSymbol
     * @return {?}
     */
    getResourcePath(staticSymbol) {
        return this.symbolResourcePaths.get(staticSymbol) || staticSymbol.filePath;
    }
    /**
     * getTypeArity returns the number of generic type parameters the given symbol
     * has. If the symbol is not a type the result is null.
     * @param {?} staticSymbol
     * @return {?}
     */
    getTypeArity(staticSymbol) {
        // If the file is a factory/ngsummary file, don't resolve the symbol as doing so would
        // cause the metadata for an factory/ngsummary file to be loaded which doesn't exist.
        // All references to generated classes must include the correct arity whenever
        // generating code.
        if (isGeneratedFile(staticSymbol.filePath)) {
            return null;
        }
        let /** @type {?} */ resolvedSymbol = this.resolveSymbol(staticSymbol);
        while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            resolvedSymbol = this.resolveSymbol(resolvedSymbol.metadata);
        }
        return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
    }
    /**
     * Converts a file path to a module name that can be used as an `import`.
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    fileNameToModuleName(importedFilePath, containingFilePath) {
        return this.knownFileNameToModuleNames.get(importedFilePath) ||
            this.host.fileNameToModuleName(importedFilePath, containingFilePath);
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    recordImportAs(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        this.importAs.set(sourceSymbol, targetSymbol);
    }
    /**
     * Invalidate all information derived from the given file.
     *
     * @param {?} fileName the file to invalidate
     * @return {?}
     */
    invalidateFile(fileName) {
        this.metadataCache.delete(fileName);
        this.resolvedFilePaths.delete(fileName);
        const /** @type {?} */ symbols = this.symbolFromFile.get(fileName);
        if (symbols) {
            this.symbolFromFile.delete(fileName);
            for (const /** @type {?} */ symbol of symbols) {
                this.resolvedSymbols.delete(symbol);
                this.importAs.delete(symbol);
                this.symbolResourcePaths.delete(symbol);
            }
        }
    }
    /**
     * @template T
     * @param {?} cb
     * @return {?}
     */
    ignoreErrorsFor(cb) {
        const /** @type {?} */ recorder = this.errorRecorder;
        this.errorRecorder = () => { };
        try {
            return cb();
        }
        finally {
            this.errorRecorder = recorder;
        }
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolMembers(staticSymbol) {
        const /** @type {?} */ members = staticSymbol.members;
        const /** @type {?} */ baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
            return null;
        }
        const /** @type {?} */ baseMetadata = baseResolvedSymbol.metadata;
        if (baseMetadata instanceof StaticSymbol) {
            return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        }
        else if (baseMetadata && baseMetadata.__symbolic === 'class') {
            if (baseMetadata.statics && members.length === 1) {
                return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
            }
        }
        else {
            let /** @type {?} */ value = baseMetadata;
            for (let /** @type {?} */ i = 0; i < members.length && value; i++) {
                value = value[members[i]];
            }
            return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolFromSummary(staticSymbol) {
        const /** @type {?} */ summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
    }
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members a symbol for a static member of the named type
     * @return {?}
     */
    getStaticSymbol(declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) {
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        let /** @type {?} */ symbols = new Set(this.summaryResolver.getSymbolsOf(filePath));
        this._createSymbolsOf(filePath);
        this.resolvedSymbols.forEach((resolvedSymbol) => {
            if (resolvedSymbol.symbol.filePath === filePath) {
                symbols.add(resolvedSymbol.symbol);
            }
        });
        return Array.from(symbols);
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    _createSymbolsOf(filePath) {
        if (this.resolvedFilePaths.has(filePath)) {
            return;
        }
        this.resolvedFilePaths.add(filePath);
        const /** @type {?} */ resolvedSymbols = [];
        const /** @type {?} */ metadata = this.getModuleMetadata(filePath);
        if (metadata['importAs']) {
            // Index bundle indices should use the importAs module name defined
            // in the bundle.
            this.knownFileNameToModuleNames.set(filePath, metadata['importAs']);
        }
        if (metadata['metadata']) {
            // handle direct declarations of the symbol
            const /** @type {?} */ topLevelSymbolNames = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
            const /** @type {?} */ origins = metadata['origins'] || {};
            Object.keys(metadata['metadata']).forEach((metadataKey) => {
                const /** @type {?} */ symbolMeta = metadata['metadata'][metadataKey];
                const /** @type {?} */ name = unescapeIdentifier(metadataKey);
                const /** @type {?} */ symbol = this.getStaticSymbol(filePath, name);
                const /** @type {?} */ origin = origins.hasOwnProperty(metadataKey) && origins[metadataKey];
                if (origin) {
                    // If the symbol is from a bundled index, use the declaration location of the
                    // symbol so relative references (such as './my.html') will be calculated
                    // correctly.
                    const /** @type {?} */ originFilePath = this.resolveModule(origin, filePath);
                    if (!originFilePath) {
                        this.reportError(new Error(`Couldn't resolve original symbol for ${origin} from ${filePath}`));
                    }
                    else {
                        this.symbolResourcePaths.set(symbol, originFilePath);
                    }
                }
                resolvedSymbols.push(this.createResolvedSymbol(symbol, filePath, topLevelSymbolNames, symbolMeta));
            });
        }
        // handle the symbols in one of the re-export location
        if (metadata['exports']) {
            for (const /** @type {?} */ moduleExport of metadata['exports']) {
                // handle the symbols in the list of explicitly re-exported symbols.
                if (moduleExport.export) {
                    moduleExport.export.forEach((exportSymbol) => {
                        let /** @type {?} */ symbolName;
                        if (typeof exportSymbol === 'string') {
                            symbolName = exportSymbol;
                        }
                        else {
                            symbolName = exportSymbol.as;
                        }
                        symbolName = unescapeIdentifier(symbolName);
                        let /** @type {?} */ symName = symbolName;
                        if (typeof exportSymbol !== 'string') {
                            symName = unescapeIdentifier(exportSymbol.name);
                        }
                        const /** @type {?} */ resolvedModule = this.resolveModule(moduleExport.from, filePath);
                        if (resolvedModule) {
                            const /** @type {?} */ targetSymbol = this.getStaticSymbol(resolvedModule, symName);
                            const /** @type {?} */ sourceSymbol = this.getStaticSymbol(filePath, symbolName);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        }
                    });
                }
                else {
                    // handle the symbols via export * directives.
                    const /** @type {?} */ resolvedModule = this.resolveModule(moduleExport.from, filePath);
                    if (resolvedModule) {
                        const /** @type {?} */ nestedExports = this.getSymbolsOf(resolvedModule);
                        nestedExports.forEach((targetSymbol) => {
                            const /** @type {?} */ sourceSymbol = this.getStaticSymbol(filePath, targetSymbol.name);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        });
                    }
                }
            }
        }
        resolvedSymbols.forEach((resolvedSymbol) => this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol));
        this.symbolFromFile.set(filePath, resolvedSymbols.map(resolvedSymbol => resolvedSymbol.symbol));
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} topLevelPath
     * @param {?} topLevelSymbolNames
     * @param {?} metadata
     * @return {?}
     */
    createResolvedSymbol(sourceSymbol, topLevelPath, topLevelSymbolNames, metadata) {
        // For classes that don't have Angular summaries / metadata,
        // we only keep their arity, but nothing else
        // (e.g. their constructor parameters).
        // We do this to prevent introducing deep imports
        // as we didn't generate .ngfactory.ts files with proper reexports.
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && metadata &&
            metadata['__symbolic'] === 'class') {
            const /** @type {?} */ transformedMeta = { __symbolic: 'class', arity: metadata.arity };
            return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
        }
        const /** @type {?} */ self = this;
        class ReferenceTransformer extends ValueTransformer {
            /**
             * @param {?} map
             * @param {?} functionParams
             * @return {?}
             */
            visitStringMap(map, functionParams) {
                const /** @type {?} */ symbolic = map['__symbolic'];
                if (symbolic === 'function') {
                    const /** @type {?} */ oldLen = functionParams.length;
                    functionParams.push(...(map['parameters'] || []));
                    const /** @type {?} */ result = super.visitStringMap(map, functionParams);
                    functionParams.length = oldLen;
                    return result;
                }
                else if (symbolic === 'reference') {
                    const /** @type {?} */ module = map['module'];
                    const /** @type {?} */ name = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
                    if (!name) {
                        return null;
                    }
                    let /** @type {?} */ filePath;
                    if (module) {
                        filePath = ((self.resolveModule(module, sourceSymbol.filePath)));
                        if (!filePath) {
                            return {
                                __symbolic: 'error',
                                message: `Could not resolve ${module} relative to ${sourceSymbol.filePath}.`
                            };
                        }
                        return self.getStaticSymbol(filePath, name);
                    }
                    else if (functionParams.indexOf(name) >= 0) {
                        // reference to a function parameter
                        return { __symbolic: 'reference', name: name };
                    }
                    else {
                        if (topLevelSymbolNames.has(name)) {
                            return self.getStaticSymbol(topLevelPath, name);
                        }
                        // ambient value
                        null;
                    }
                }
                else {
                    return super.visitStringMap(map, functionParams);
                }
            }
        }
        const /** @type {?} */ transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        if (transformedMeta instanceof StaticSymbol) {
            return this.createExport(sourceSymbol, transformedMeta);
        }
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    createExport(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath)) {
            // This case is for an ng library importing symbols from a plain ts library
            // transitively.
            // Note: We rely on the fact that we discover symbols in the direction
            // from source files to library files
            this.importAs.set(targetSymbol, this.getImportAs(sourceSymbol) || sourceSymbol);
        }
        return new ResolvedStaticSymbol(sourceSymbol, targetSymbol);
    }
    /**
     * @param {?} error
     * @param {?=} context
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
     * @param {?} module an absolute path to a module file.
     * @return {?}
     */
    getModuleMetadata(module) {
        let /** @type {?} */ moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            const /** @type {?} */ moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                let /** @type {?} */ maxVersion = -1;
                moduleMetadatas.forEach((md) => {
                    if (md['version'] > maxVersion) {
                        maxVersion = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                const /** @type {?} */ errorMessage = moduleMetadata['version'] == 2 ?
                    `Unsupported metadata version ${moduleMetadata['version']} for module ${module}. This module should be compiled with a newer version of ngc` :
                    `Metadata version mismatch for module ${module}, found version ${moduleMetadata['version']}, expected ${SUPPORTED_SCHEMA_VERSION}`;
                this.reportError(new Error(errorMessage));
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    }
    /**
     * @param {?} module
     * @param {?} symbolName
     * @param {?=} containingFile
     * @return {?}
     */
    getSymbolByModule(module, symbolName, containingFile) {
        const /** @type {?} */ filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
            this.reportError(new Error(`Could not resolve module ${module}${containingFile ? ` relative to $ {
            containingFile
          } ` : ''}`));
            return this.getStaticSymbol(`ERROR:${module}`, symbolName);
        }
        return this.getStaticSymbol(filePath, symbolName);
    }
    /**
     * @param {?} module
     * @param {?=} containingFile
     * @return {?}
     */
    resolveModule(module, containingFile) {
        try {
            return this.host.moduleNameToFileName(module, containingFile);
        }
        catch (e) {
            console.error(`Could not resolve module '${module}' relative to file ${containingFile}`);
            this.reportError(e, undefined, containingFile);
        }
        return null;
    }
}
function StaticSymbolResolver_tsickle_Closure_declarations() {
    /** @type {?} */
    StaticSymbolResolver.prototype.metadataCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedSymbols;
    /** @type {?} */
    StaticSymbolResolver.prototype.resolvedFilePaths;
    /** @type {?} */
    StaticSymbolResolver.prototype.importAs;
    /** @type {?} */
    StaticSymbolResolver.prototype.symbolResourcePaths;
    /** @type {?} */
    StaticSymbolResolver.prototype.symbolFromFile;
    /** @type {?} */
    StaticSymbolResolver.prototype.knownFileNameToModuleNames;
    /** @type {?} */
    StaticSymbolResolver.prototype.host;
    /** @type {?} */
    StaticSymbolResolver.prototype.staticSymbolCache;
    /** @type {?} */
    StaticSymbolResolver.prototype.summaryResolver;
    /** @type {?} */
    StaticSymbolResolver.prototype.errorRecorder;
}
/**
 * @param {?} identifier
 * @return {?}
 */
export function unescapeIdentifier(identifier) {
    return identifier.startsWith('___') ? identifier.substr(1) : identifier;
}
//# sourceMappingURL=static_symbol_resolver.js.map