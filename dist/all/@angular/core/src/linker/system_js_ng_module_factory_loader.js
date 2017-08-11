"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../di");
var compiler_1 = require("./compiler");
var _SEPARATOR = '#';
var FACTORY_CLASS_SUFFIX = 'NgFactory';
/**
 * Configuration for SystemJsNgModuleLoader.
 * token.
 *
 * @experimental
 */
var SystemJsNgModuleLoaderConfig = (function () {
    function SystemJsNgModuleLoaderConfig() {
    }
    return SystemJsNgModuleLoaderConfig;
}());
exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
var DEFAULT_CONFIG = {
    factoryPathPrefix: '',
    factoryPathSuffix: '.ngfactory',
};
/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 * @experimental
 */
var SystemJsNgModuleLoader = (function () {
    function SystemJsNgModuleLoader(_compiler, config) {
        this._compiler = _compiler;
        this._config = config || DEFAULT_CONFIG;
    }
    SystemJsNgModuleLoader.prototype.load = function (path) {
        var offlineMode = this._compiler instanceof compiler_1.Compiler;
        return offlineMode ? this.loadFactory(path) : this.loadAndCompile(path);
    };
    SystemJsNgModuleLoader.prototype.loadAndCompile = function (path) {
        var _this = this;
        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
        if (exportName === undefined) {
            exportName = 'default';
        }
        return System.import(module)
            .then(function (module) { return module[exportName]; })
            .then(function (type) { return checkNotEmpty(type, module, exportName); })
            .then(function (type) { return _this._compiler.compileModuleAsync(type); });
    };
    SystemJsNgModuleLoader.prototype.loadFactory = function (path) {
        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
        var factoryClassSuffix = FACTORY_CLASS_SUFFIX;
        if (exportName === undefined) {
            exportName = 'default';
            factoryClassSuffix = '';
        }
        return System.import(this._config.factoryPathPrefix + module + this._config.factoryPathSuffix)
            .then(function (module) { return module[exportName + factoryClassSuffix]; })
            .then(function (factory) { return checkNotEmpty(factory, module, exportName); });
    };
    return SystemJsNgModuleLoader;
}());
SystemJsNgModuleLoader = __decorate([
    di_1.Injectable(),
    __param(1, di_1.Optional()),
    __metadata("design:paramtypes", [compiler_1.Compiler, SystemJsNgModuleLoaderConfig])
], SystemJsNgModuleLoader);
exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
function checkNotEmpty(value, modulePath, exportName) {
    if (!value) {
        throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtX2pzX25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2xpbmtlci9zeXN0ZW1fanNfbmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBR0gsNEJBQTJDO0FBRTNDLHVDQUFvQztBQUlwQyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFFdkIsSUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUM7QUFHekM7Ozs7O0dBS0c7QUFDSDtJQUFBO0lBVUEsQ0FBQztJQUFELG1DQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWcUIsb0VBQTRCO0FBWWxELElBQU0sY0FBYyxHQUFpQztJQUNuRCxpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLGlCQUFpQixFQUFFLFlBQVk7Q0FDaEMsQ0FBQztBQUVGOzs7R0FHRztBQUVILElBQWEsc0JBQXNCO0lBR2pDLGdDQUFvQixTQUFtQixFQUFjLE1BQXFDO1FBQXRFLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFRCxxQ0FBSSxHQUFKLFVBQUssSUFBWTtRQUNmLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLFlBQVksbUJBQVEsQ0FBQztRQUN2RCxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRU8sK0NBQWMsR0FBdEIsVUFBdUIsSUFBWTtRQUFuQyxpQkFVQztRQVRLLElBQUEsMkJBQTZDLEVBQTVDLGNBQU0sRUFBRSxrQkFBVSxDQUEyQjtRQUNsRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM3QixVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDdkIsSUFBSSxDQUFDLFVBQUMsTUFBVyxJQUFLLE9BQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFsQixDQUFrQixDQUFDO2FBQ3pDLElBQUksQ0FBQyxVQUFDLElBQVMsSUFBSyxPQUFBLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDO2FBQzVELElBQUksQ0FBQyxVQUFDLElBQVMsSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU8sNENBQVcsR0FBbkIsVUFBb0IsSUFBWTtRQUMxQixJQUFBLDJCQUE2QyxFQUE1QyxjQUFNLEVBQUUsa0JBQVUsQ0FBMkI7UUFDbEQsSUFBSSxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUM3QixVQUFVLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQzthQUN6RixJQUFJLENBQUMsVUFBQyxNQUFXLElBQUssT0FBQSxNQUFNLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLEVBQXZDLENBQXVDLENBQUM7YUFDOUQsSUFBSSxDQUFDLFVBQUMsT0FBWSxJQUFLLE9BQUEsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBcENELElBb0NDO0FBcENZLHNCQUFzQjtJQURsQyxlQUFVLEVBQUU7SUFJK0IsV0FBQSxhQUFRLEVBQUUsQ0FBQTtxQ0FBckIsbUJBQVEsRUFBdUIsNEJBQTRCO0dBSC9FLHNCQUFzQixDQW9DbEM7QUFwQ1ksd0RBQXNCO0FBc0NuQyx1QkFBdUIsS0FBVSxFQUFFLFVBQWtCLEVBQUUsVUFBa0I7SUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBZ0IsVUFBVSxjQUFTLFVBQVUsTUFBRyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDIn0=