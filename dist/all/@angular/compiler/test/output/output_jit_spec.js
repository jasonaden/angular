"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_emitter_1 = require("@angular/compiler/src/output/abstract_emitter");
var o = require("@angular/compiler/src/output/output_ast");
var output_jit_1 = require("@angular/compiler/src/output/output_jit");
var anotherModuleUrl = 'somePackage/someOtherPath';
function main() {
    describe('Output JIT', function () {
        describe('regression', function () {
            it('should generate unique argument names', function () {
                var externalIds = new Array(10).fill(1).map(function (_, index) {
                    return new o.ExternalReference(anotherModuleUrl, "id_" + index + "_", { name: "id_" + index + "_" });
                });
                var externalIds1 = new Array(10).fill(1).map(function (_, index) { return new o.ExternalReference(anotherModuleUrl, "id_" + index + "_1", { name: "id_" + index + "_1" }); });
                var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
                var converter = new output_jit_1.JitEmitterVisitor();
                converter.visitAllStatements([o.literalArr(externalIds1.concat(externalIds).map(function (id) { return o.importExpr(id); })).toStmt()], ctx);
                var args = converter.getArgs();
                expect(Object.keys(args).length).toBe(20);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2ppdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvb3V0cHV0X2ppdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0ZBQW9GO0FBQ3BGLDJEQUE2RDtBQUM3RCxzRUFBMEU7QUFFMUUsSUFBTSxnQkFBZ0IsR0FBRywyQkFBMkIsQ0FBQztBQUVyRDtJQUNFLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7Z0JBQzFDLElBQU0sV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ3pDLFVBQUMsQ0FBQyxFQUFFLEtBQUs7b0JBQ0wsT0FBQSxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFNLEtBQUssTUFBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQU0sS0FBSyxNQUFHLEVBQUMsQ0FBQztnQkFBakYsQ0FBaUYsQ0FBQyxDQUFDO2dCQUMzRixJQUFNLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUMxQyxVQUFDLENBQUMsRUFBRSxLQUFLLElBQUssT0FBQSxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FDakMsZ0JBQWdCLEVBQUUsUUFBTSxLQUFLLE9BQUksRUFBRSxFQUFDLElBQUksRUFBRSxRQUFNLEtBQUssT0FBSSxFQUFDLENBQUMsRUFEakQsQ0FDaUQsQ0FBQyxDQUFDO2dCQUNyRSxJQUFNLEdBQUcsR0FBRyx3Q0FBcUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDL0MsSUFBTSxTQUFTLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO2dCQUMxQyxTQUFTLENBQUMsa0JBQWtCLENBQ3hCLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBSyxZQUFZLFFBQUssV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQ3RGLEdBQUcsQ0FBQyxDQUFDO2dCQUNULElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFwQkQsb0JBb0JDIn0=