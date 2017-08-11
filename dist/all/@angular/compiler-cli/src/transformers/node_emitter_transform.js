"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var node_emitter_1 = require("./node_emitter");
function getAngularEmitterTransformFactory(generatedFiles) {
    return function () {
        var map = new Map(generatedFiles.filter(function (g) { return g.stmts && g.stmts.length; })
            .map(function (g) { return [g.genFileUrl, g]; }));
        var emitter = new node_emitter_1.TypeScriptNodeEmitter();
        return function (sourceFile) {
            var g = map.get(sourceFile.fileName);
            if (g && g.stmts) {
                var newSourceFile = emitter.updateSourceFile(sourceFile, g.stmts)[0];
                return newSourceFile;
            }
            return sourceFile;
        };
    };
}
exports.getAngularEmitterTransformFactory = getAngularEmitterTransformFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9lbWl0dGVyX3RyYW5zZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL25vZGVfZW1pdHRlcl90cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFLSCwrQ0FBcUQ7QUFFckQsMkNBQWtELGNBQStCO0lBRS9FLE1BQU0sQ0FBQztRQUNMLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUF6QixDQUF5QixDQUFDO2FBQ2hELEdBQUcsQ0FBMEIsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQU0sT0FBTyxHQUFHLElBQUksb0NBQXFCLEVBQUUsQ0FBQztRQUM1QyxNQUFNLENBQUMsVUFBUyxVQUF5QjtZQUN2QyxJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBQSxnRUFBYSxDQUFrRDtnQkFDdEUsTUFBTSxDQUFDLGFBQWEsQ0FBQztZQUN2QixDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBZkQsOEVBZUMifQ==