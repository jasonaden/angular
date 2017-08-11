"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("../compile_metadata");
var ts_emitter_1 = require("../output/ts_emitter");
var GeneratedFile = (function () {
    function GeneratedFile(srcFileUrl, genFileUrl, sourceOrStmts) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        if (typeof sourceOrStmts === 'string') {
            this.source = sourceOrStmts;
            this.stmts = null;
        }
        else {
            this.source = null;
            this.stmts = sourceOrStmts;
        }
    }
    return GeneratedFile;
}());
exports.GeneratedFile = GeneratedFile;
function toTypeScript(file, preamble) {
    if (preamble === void 0) { preamble = ''; }
    if (!file.stmts) {
        throw new Error("Illegal state: No stmts present on GeneratedFile " + file.genFileUrl);
    }
    return new ts_emitter_1.TypeScriptEmitter().emitStatements(compile_metadata_1.sourceUrl(file.srcFileUrl), file.genFileUrl, file.stmts, preamble);
}
exports.toTypeScript = toTypeScript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkX2ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvYW90L2dlbmVyYXRlZF9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsd0RBQThDO0FBRTlDLG1EQUF1RDtBQUV2RDtJQUlFLHVCQUNXLFVBQWtCLEVBQVMsVUFBa0IsRUFBRSxhQUFpQztRQUFoRixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUN0RCxFQUFFLENBQUMsQ0FBQyxPQUFPLGFBQWEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLHNDQUFhO0FBZ0IxQixzQkFBNkIsSUFBbUIsRUFBRSxRQUFxQjtJQUFyQix5QkFBQSxFQUFBLGFBQXFCO0lBQ3JFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBb0QsSUFBSSxDQUFDLFVBQVksQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSw4QkFBaUIsRUFBRSxDQUFDLGNBQWMsQ0FDekMsNEJBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFORCxvQ0FNQyJ9