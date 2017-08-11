"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var compile_reflector_1 = require("./compile_reflector");
var injectable_1 = require("./injectable");
var util_1 = require("./util");
/*
 * Resolve a `Type` for {@link Directive}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {@link Compiler}
 */
var DirectiveResolver = (function () {
    function DirectiveResolver(_reflector) {
        this._reflector = _reflector;
    }
    DirectiveResolver.prototype.isDirective = function (type) {
        var typeMetadata = this._reflector.annotations(core_1.resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var typeMetadata = this._reflector.annotations(core_1.resolveForwardRef(type));
        if (typeMetadata) {
            var metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                var propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + core_1.ɵstringify(type));
        }
        return null;
    };
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
        var inputs = [];
        var outputs = [];
        var host = {};
        var queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            var input = findLast(propertyMetadata[propName], function (a) { return a instanceof core_1.Input; });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            var output = findLast(propertyMetadata[propName], function (a) { return a instanceof core_1.Output; });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            var hostBindings = propertyMetadata[propName].filter(function (a) { return a && a instanceof core_1.HostBinding; });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
                    var startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                    }
                    else if (startWith === '[') {
                        throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                    }
                    host["[" + hostBinding.hostPropertyName + "]"] = propName;
                }
                else {
                    host["[" + propName + "]"] = propName;
                }
            });
            var hostListeners = propertyMetadata[propName].filter(function (a) { return a && a instanceof core_1.HostListener; });
            hostListeners.forEach(function (hostListener) {
                var args = hostListener.args || [];
                host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
            });
            var query = findLast(propertyMetadata[propName], function (a) { return a instanceof core_1.Query; });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    };
    DirectiveResolver.prototype._extractPublicName = function (def) { return util_1.splitAtColon(def, [null, def])[1].trim(); };
    DirectiveResolver.prototype._dedupeBindings = function (bindings) {
        var names = new Set();
        var reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var i = bindings.length - 1; i >= 0; i--) {
            var binding = bindings[i];
            var name_1 = this._extractPublicName(binding);
            if (!names.has(name_1)) {
                names.add(name_1);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, directiveType) {
        var mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var mergedHost = directive.host ? __assign({}, directive.host, host) : host;
        var mergedQueries = directive.queries ? __assign({}, directive.queries, queries) : queries;
        if (directive instanceof core_1.Component) {
            return new core_1.Component({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                moduleId: directive.moduleId,
                queries: mergedQueries,
                changeDetection: directive.changeDetection,
                providers: directive.providers,
                viewProviders: directive.viewProviders,
                entryComponents: directive.entryComponents,
                template: directive.template,
                templateUrl: directive.templateUrl,
                styles: directive.styles,
                styleUrls: directive.styleUrls,
                encapsulation: directive.encapsulation,
                animations: directive.animations,
                interpolation: directive.interpolation
            });
        }
        else {
            return new core_1.Directive({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                queries: mergedQueries,
                providers: directive.providers
            });
        }
    };
    return DirectiveResolver;
}());
DirectiveResolver = __decorate([
    injectable_1.CompilerInjectable(),
    __metadata("design:paramtypes", [compile_reflector_1.CompileReflector])
], DirectiveResolver);
exports.DirectiveResolver = DirectiveResolver;
function isDirectiveMetadata(type) {
    return type instanceof core_1.Directive;
}
function findLast(arr, condition) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
exports.findLast = findLast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2RpcmVjdGl2ZV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNKO0FBRXRKLHlEQUFxRDtBQUNyRCwyQ0FBZ0Q7QUFDaEQsK0JBQW9DO0FBSXBDOzs7Ozs7R0FNRztBQUVILElBQWEsaUJBQWlCO0lBQzVCLDJCQUFvQixVQUE0QjtRQUE1QixlQUFVLEdBQVYsVUFBVSxDQUFrQjtJQUFHLENBQUM7SUFFcEQsdUNBQVcsR0FBWCxVQUFZLElBQWU7UUFDekIsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsd0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsWUFBWSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBUUQsbUNBQU8sR0FBUCxVQUFRLElBQWUsRUFBRSxlQUFzQjtRQUF0QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUM3QyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFFLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0UsQ0FBQztRQUNILENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQW9DLGlCQUFTLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQztRQUN6RSxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxzREFBMEIsR0FBbEMsVUFDSSxFQUFhLEVBQUUsZ0JBQXdDLEVBQ3ZELGFBQXdCO1FBQzFCLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBTSxJQUFJLEdBQTRCLEVBQUUsQ0FBQztRQUN6QyxJQUFNLE9BQU8sR0FBeUIsRUFBRSxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFnQjtZQUNyRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLFlBQVksWUFBSyxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDOUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLENBQUMsSUFBSSxDQUFJLFFBQVEsVUFBSyxLQUFLLENBQUMsbUJBQXFCLENBQUMsQ0FBQztnQkFDM0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQztZQUNELElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsWUFBWSxhQUFNLEVBQW5CLENBQW1CLENBQUMsQ0FBQztZQUNoRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUksUUFBUSxVQUFLLE1BQU0sQ0FBQyxtQkFBcUIsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3pCLENBQUM7WUFDSCxDQUFDO1lBQ0QsSUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLENBQUMsWUFBWSxrQkFBVyxFQUE3QixDQUE2QixDQUFDLENBQUM7WUFDM0YsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztvQkFDckYsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQ1gscUZBQXFGLENBQUMsQ0FBQztvQkFDN0YsQ0FBQztvQkFDRCxJQUFJLENBQUMsTUFBSSxXQUFXLENBQUMsZ0JBQWdCLE1BQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDdkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsTUFBSSxRQUFRLE1BQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDbkMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxJQUFJLENBQUMsWUFBWSxtQkFBWSxFQUE5QixDQUE4QixDQUFDLENBQUM7WUFDN0YsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFlBQVk7Z0JBQ2hDLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsTUFBSSxZQUFZLENBQUMsU0FBUyxNQUFHLENBQUMsR0FBTSxRQUFRLFNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBRyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxZQUFZLFlBQUssRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO1lBQzlFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTyw4Q0FBa0IsR0FBMUIsVUFBMkIsR0FBVyxJQUFJLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV0RiwyQ0FBZSxHQUF2QixVQUF3QixRQUFrQjtRQUN4QyxJQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ2hDLElBQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUNwQyx3RUFBd0U7UUFDeEUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFNLE1BQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFJLENBQUMsQ0FBQztnQkFDaEIsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVPLGtDQUFNLEdBQWQsVUFDSSxTQUFvQixFQUFFLE1BQWdCLEVBQUUsT0FBaUIsRUFBRSxJQUE2QixFQUN4RixPQUE2QixFQUFFLGFBQXdCO1FBQ3pELElBQU0sWUFBWSxHQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN0RixJQUFNLGFBQWEsR0FDZixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFDMUYsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksZ0JBQU8sU0FBUyxDQUFDLElBQUksRUFBSyxJQUFJLElBQUksSUFBSSxDQUFDO1FBQ3hFLElBQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLGdCQUFPLFNBQVMsQ0FBQyxPQUFPLEVBQUssT0FBTyxJQUFJLE9BQU8sQ0FBQztRQUV2RixFQUFFLENBQUMsQ0FBQyxTQUFTLFlBQVksZ0JBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQztnQkFDbkIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO2dCQUM1QixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLElBQUksRUFBRSxVQUFVO2dCQUNoQixRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVE7Z0JBQzVCLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtnQkFDNUIsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLGVBQWUsRUFBRSxTQUFTLENBQUMsZUFBZTtnQkFDMUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO2dCQUM5QixhQUFhLEVBQUUsU0FBUyxDQUFDLGFBQWE7Z0JBQ3RDLGVBQWUsRUFBRSxTQUFTLENBQUMsZUFBZTtnQkFDMUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO2dCQUM1QixXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7Z0JBQ2xDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDeEIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO2dCQUM5QixhQUFhLEVBQUUsU0FBUyxDQUFDLGFBQWE7Z0JBQ3RDLFVBQVUsRUFBRSxTQUFTLENBQUMsVUFBVTtnQkFDaEMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxhQUFhO2FBQ3ZDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLGdCQUFTLENBQUM7Z0JBQ25CLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtnQkFDNUIsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxRQUFRO2dCQUM1QixPQUFPLEVBQUUsYUFBYTtnQkFDdEIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO2FBQy9CLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBaEpELElBZ0pDO0FBaEpZLGlCQUFpQjtJQUQ3QiwrQkFBa0IsRUFBRTtxQ0FFYSxvQ0FBZ0I7R0FEckMsaUJBQWlCLENBZ0o3QjtBQWhKWSw4Q0FBaUI7QUFrSjlCLDZCQUE2QixJQUFTO0lBQ3BDLE1BQU0sQ0FBQyxJQUFJLFlBQVksZ0JBQVMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsa0JBQTRCLEdBQVEsRUFBRSxTQUFnQztJQUNwRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDekMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFQRCw0QkFPQyJ9