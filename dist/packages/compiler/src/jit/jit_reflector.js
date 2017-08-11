/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵReflectionCapabilities as ReflectionCapabilities, ɵstringify as stringify } from '@angular/core';
import { getUrlScheme } from '../url_resolver';
import { MODULE_SUFFIX, syntaxError } from '../util';
export class JitReflector {
    constructor() { this.reflectionCapabilities = new ReflectionCapabilities(); }
    /**
     * @param {?} type
     * @param {?} cmpMetadata
     * @return {?}
     */
    componentModuleUrl(type, cmpMetadata) {
        const /** @type {?} */ moduleId = cmpMetadata.moduleId;
        if (typeof moduleId === 'string') {
            const /** @type {?} */ scheme = getUrlScheme(moduleId);
            return scheme ? moduleId : `package:${moduleId}${MODULE_SUFFIX}`;
        }
        else if (moduleId !== null && moduleId !== void 0) {
            throw syntaxError(`moduleId should be a string in "${stringify(type)}". See https://goo.gl/wIDDiL for more information.\n` +
                `If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.`);
        }
        return `./${stringify(type)}`;
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    parameters(typeOrFunc) {
        return this.reflectionCapabilities.parameters(typeOrFunc);
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    annotations(typeOrFunc) {
        return this.reflectionCapabilities.annotations(typeOrFunc);
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    propMetadata(typeOrFunc) {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
    }
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    hasLifecycleHook(type, lcProperty) {
        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    resolveExternalReference(ref) { return ref.runtime; }
}
function JitReflector_tsickle_Closure_declarations() {
    /** @type {?} */
    JitReflector.prototype.reflectionCapabilities;
}
//# sourceMappingURL=jit_reflector.js.map