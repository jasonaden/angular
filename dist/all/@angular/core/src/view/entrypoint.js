"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = require("../di/injector");
var ng_module_factory_1 = require("../linker/ng_module_factory");
var services_1 = require("./services");
var types_1 = require("./types");
var util_1 = require("./util");
function overrideProvider(override) {
    services_1.initServicesIfNeeded();
    return types_1.Services.overrideProvider(override);
}
exports.overrideProvider = overrideProvider;
function clearProviderOverrides() {
    services_1.initServicesIfNeeded();
    return types_1.Services.clearProviderOverrides();
}
exports.clearProviderOverrides = clearProviderOverrides;
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
function createNgModuleFactory(ngModuleType, bootstrapComponents, defFactory) {
    return new NgModuleFactory_(ngModuleType, bootstrapComponents, defFactory);
}
exports.createNgModuleFactory = createNgModuleFactory;
var NgModuleFactory_ = (function (_super) {
    __extends(NgModuleFactory_, _super);
    function NgModuleFactory_(moduleType, _bootstrapComponents, _ngModuleDefFactory) {
        var _this = 
        // Attention: this ctor is called as top level function.
        // Putting any logic in here will destroy closure tree shaking!
        _super.call(this) || this;
        _this.moduleType = moduleType;
        _this._bootstrapComponents = _bootstrapComponents;
        _this._ngModuleDefFactory = _ngModuleDefFactory;
        return _this;
    }
    NgModuleFactory_.prototype.create = function (parentInjector) {
        services_1.initServicesIfNeeded();
        var def = util_1.resolveDefinition(this._ngModuleDefFactory);
        return types_1.Services.createNgModuleRef(this.moduleType, parentInjector || injector_1.Injector.NULL, this._bootstrapComponents, def);
    };
    return NgModuleFactory_;
}(ng_module_factory_1.NgModuleFactory));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvZW50cnlwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwyQ0FBd0M7QUFDeEMsaUVBQXlFO0FBR3pFLHVDQUFnRDtBQUNoRCxpQ0FBOEU7QUFDOUUsK0JBQXlDO0FBRXpDLDBCQUFpQyxRQUEwQjtJQUN6RCwrQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFIRCw0Q0FHQztBQUVEO0lBQ0UsK0JBQW9CLEVBQUUsQ0FBQztJQUN2QixNQUFNLENBQUMsZ0JBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0FBQzNDLENBQUM7QUFIRCx3REFHQztBQUVELDREQUE0RDtBQUM1RCwrREFBK0Q7QUFDL0QsK0JBQ0ksWUFBdUIsRUFBRSxtQkFBZ0MsRUFDekQsVUFBcUM7SUFDdkMsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsWUFBWSxFQUFFLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFKRCxzREFJQztBQUVEO0lBQStCLG9DQUFvQjtJQUNqRCwwQkFDb0IsVUFBcUIsRUFBVSxvQkFBaUMsRUFDeEUsbUJBQThDO1FBRjFEO1FBR0Usd0RBQXdEO1FBQ3hELCtEQUErRDtRQUMvRCxpQkFBTyxTQUNSO1FBTG1CLGdCQUFVLEdBQVYsVUFBVSxDQUFXO1FBQVUsMEJBQW9CLEdBQXBCLG9CQUFvQixDQUFhO1FBQ3hFLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBMkI7O0lBSTFELENBQUM7SUFFRCxpQ0FBTSxHQUFOLFVBQU8sY0FBNkI7UUFDbEMsK0JBQW9CLEVBQUUsQ0FBQztRQUN2QixJQUFNLEdBQUcsR0FBRyx3QkFBaUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsZ0JBQVEsQ0FBQyxpQkFBaUIsQ0FDN0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLElBQUksbUJBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFmRCxDQUErQixtQ0FBZSxHQWU3QyJ9