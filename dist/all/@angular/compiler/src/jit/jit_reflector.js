"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var url_resolver_1 = require("../url_resolver");
var util_1 = require("../util");
var JitReflector = (function () {
    function JitReflector() {
        this.reflectionCapabilities = new core_1.ɵReflectionCapabilities();
    }
    JitReflector.prototype.componentModuleUrl = function (type, cmpMetadata) {
        var moduleId = cmpMetadata.moduleId;
        if (typeof moduleId === 'string') {
            var scheme = url_resolver_1.getUrlScheme(moduleId);
            return scheme ? moduleId : "package:" + moduleId + util_1.MODULE_SUFFIX;
        }
        else if (moduleId !== null && moduleId !== void 0) {
            throw util_1.syntaxError("moduleId should be a string in \"" + core_1.ɵstringify(type) + "\". See https://goo.gl/wIDDiL for more information.\n" +
                "If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.");
        }
        return "./" + core_1.ɵstringify(type);
    };
    JitReflector.prototype.parameters = function (typeOrFunc) {
        return this.reflectionCapabilities.parameters(typeOrFunc);
    };
    JitReflector.prototype.annotations = function (typeOrFunc) {
        return this.reflectionCapabilities.annotations(typeOrFunc);
    };
    JitReflector.prototype.propMetadata = function (typeOrFunc) {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
    };
    JitReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
    };
    JitReflector.prototype.resolveExternalReference = function (ref) { return ref.runtime; };
    return JitReflector;
}());
exports.JitReflector = JitReflector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9qaXQvaml0X3JlZmxlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFvSDtBQUlwSCxnREFBNkM7QUFDN0MsZ0NBQThGO0FBRTlGO0lBRUU7UUFBZ0IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksOEJBQXNCLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFDN0UseUNBQWtCLEdBQWxCLFVBQW1CLElBQVMsRUFBRSxXQUFzQjtRQUNsRCxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBRXRDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBTSxNQUFNLEdBQUcsMkJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxhQUFXLFFBQVEsR0FBRyxvQkFBZSxDQUFDO1FBQ25FLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sa0JBQVcsQ0FDYixzQ0FBbUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsMERBQXNEO2dCQUN4RyxtR0FBbUcsQ0FBQyxDQUFDO1FBQzNHLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBSyxpQkFBUyxDQUFDLElBQUksQ0FBRyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxpQ0FBVSxHQUFWLFVBQVcsVUFBd0I7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNELGtDQUFXLEdBQVgsVUFBWSxVQUF3QjtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsbUNBQVksR0FBWixVQUFhLFVBQXdCO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsSUFBUyxFQUFFLFVBQWtCO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCwrQ0FBd0IsR0FBeEIsVUFBeUIsR0FBd0IsSUFBUyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDakYsbUJBQUM7QUFBRCxDQUFDLEFBOUJELElBOEJDO0FBOUJZLG9DQUFZIn0=