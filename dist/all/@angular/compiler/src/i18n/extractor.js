"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extract i18n messages from source code
 */
var core_1 = require("@angular/core");
var compiler_1 = require("../aot/compiler");
var static_reflector_1 = require("../aot/static_reflector");
var static_symbol_1 = require("../aot/static_symbol");
var static_symbol_resolver_1 = require("../aot/static_symbol_resolver");
var summary_resolver_1 = require("../aot/summary_resolver");
var config_1 = require("../config");
var directive_normalizer_1 = require("../directive_normalizer");
var directive_resolver_1 = require("../directive_resolver");
var metadata_resolver_1 = require("../metadata_resolver");
var html_parser_1 = require("../ml_parser/html_parser");
var interpolation_config_1 = require("../ml_parser/interpolation_config");
var ng_module_resolver_1 = require("../ng_module_resolver");
var pipe_resolver_1 = require("../pipe_resolver");
var dom_element_schema_registry_1 = require("../schema/dom_element_schema_registry");
var url_resolver_1 = require("../url_resolver");
var message_bundle_1 = require("./message_bundle");
var Extractor = (function () {
    function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    Extractor.prototype.extract = function (rootFiles) {
        var _this = this;
        var programSymbols = compiler_1.extractProgramSymbols(this.staticSymbolResolver, rootFiles, this.host);
        var _a = compiler_1.analyzeAndValidateNgModules(programSymbols, this.host, this.metadataResolver), files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var errors = [];
            files.forEach(function (file) {
                var compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var html = compMeta.template.template;
                    var interpolationConfig = interpolation_config_1.InterpolationConfig.fromArray(compMeta.template.interpolation);
                    errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    Extractor.create = function (host, locale) {
        var htmlParser = new html_parser_1.HtmlParser();
        var urlResolver = url_resolver_1.createOfflineCompileUrlResolver();
        var symbolCache = new static_symbol_1.StaticSymbolCache();
        var summaryResolver = new summary_resolver_1.AotSummaryResolver(host, symbolCache);
        var staticSymbolResolver = new static_symbol_resolver_1.StaticSymbolResolver(host, symbolCache, summaryResolver);
        var staticReflector = new static_reflector_1.StaticReflector(summaryResolver, staticSymbolResolver);
        var config = new config_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
        var normalizer = new directive_normalizer_1.DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        var elementSchemaRegistry = new dom_element_schema_registry_1.DomElementSchemaRegistry();
        var resolver = new metadata_resolver_1.CompileMetadataResolver(config, new ng_module_resolver_1.NgModuleResolver(staticReflector), new directive_resolver_1.DirectiveResolver(staticReflector), new pipe_resolver_1.PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, new core_1.ɵConsole(), symbolCache, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var messageBundle = new message_bundle_1.MessageBundle(htmlParser, [], {}, locale);
        var extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vZXh0cmFjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0g7O0dBRUc7QUFDSCxzQ0FBcUU7QUFFckUsNENBQW1GO0FBQ25GLDREQUF3RDtBQUN4RCxzREFBdUQ7QUFDdkQsd0VBQTZGO0FBQzdGLDREQUFtRjtBQUVuRixvQ0FBeUM7QUFDekMsZ0VBQTREO0FBQzVELDREQUF3RDtBQUN4RCwwREFBNkQ7QUFDN0Qsd0RBQW9EO0FBQ3BELDBFQUFzRTtBQUN0RSw0REFBdUQ7QUFFdkQsa0RBQThDO0FBQzlDLHFGQUErRTtBQUMvRSxnREFBZ0U7QUFDaEUsbURBQStDO0FBYS9DO0lBQ0UsbUJBQ1csSUFBbUIsRUFBVSxvQkFBMEMsRUFDdEUsYUFBNEIsRUFBVSxnQkFBeUM7UUFEaEYsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFVLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDdEUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO0lBQUcsQ0FBQztJQUUvRiwyQkFBTyxHQUFQLFVBQVEsU0FBbUI7UUFBM0IsaUJBa0NDO1FBakNDLElBQU0sY0FBYyxHQUFHLGdDQUFxQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hGLElBQUEsNkZBQzJFLEVBRDFFLGdCQUFLLEVBQUUsd0JBQVMsQ0FDMkQ7UUFDbEYsTUFBTSxDQUFDLE9BQU87YUFDVCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDZCxVQUFBLFFBQVEsSUFBSSxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsQ0FDbEUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FB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