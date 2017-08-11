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
import { ɵstringify as stringify } from '@angular/core';
var /** @type {?} */ _nextReferenceId = 0;
var MetadataOverrider = (function () {
    function MetadataOverrider() {
        this._references = new Map();
    }
    /**
     * Creates a new instance for the given metadata class
     * based on an old instance and overrides.
     * @template C, T
     * @param {?} metadataClass
     * @param {?} oldMetadata
     * @param {?} override
     * @return {?}
     */
    MetadataOverrider.prototype.overrideMetadata = function (metadataClass, oldMetadata, override) {
        var /** @type {?} */ props = {};
        if (oldMetadata) {
            _valueProps(oldMetadata).forEach(function (prop) { return props[prop] = ((oldMetadata))[prop]; });
        }
        if (override.set) {
            if (override.remove || override.add) {
                throw new Error("Cannot set and add/remove " + stringify(metadataClass) + " at the same time!");
            }
            setMetadata(props, override.set);
        }
        if (override.remove) {
            removeMetadata(props, override.remove, this._references);
        }
        if (override.add) {
            addMetadata(props, override.add);
        }
        return new metadataClass(/** @type {?} */ (props));
    };
    return MetadataOverrider;
}());
export { MetadataOverrider };
function MetadataOverrider_tsickle_Closure_declarations() {
    /** @type {?} */
    MetadataOverrider.prototype._references;
}
/**
 * @param {?} metadata
 * @param {?} remove
 * @param {?} references
 * @return {?}
 */
function removeMetadata(metadata, remove, references) {
    var /** @type {?} */ removeObjects = new Set();
    var _loop_1 = function (prop) {
        var /** @type {?} */ removeValue = remove[prop];
        if (removeValue instanceof Array) {
            removeValue.forEach(function (value) { removeObjects.add(_propHashKey(prop, value, references)); });
        }
        else {
            removeObjects.add(_propHashKey(prop, removeValue, references));
        }
    };
    for (var /** @type {?} */ prop in remove) {
        _loop_1(/** @type {?} */ prop);
    }
    var _loop_2 = function (prop) {
        var /** @type {?} */ propValue = metadata[prop];
        if (propValue instanceof Array) {
            metadata[prop] = propValue.filter(function (value) { return !removeObjects.has(_propHashKey(prop, value, references)); });
        }
        else {
            if (removeObjects.has(_propHashKey(prop, propValue, references))) {
                metadata[prop] = undefined;
            }
        }
    };
    for (var /** @type {?} */ prop in metadata) {
        _loop_2(/** @type {?} */ prop);
    }
}
/**
 * @param {?} metadata
 * @param {?} add
 * @return {?}
 */
function addMetadata(metadata, add) {
    for (var /** @type {?} */ prop in add) {
        var /** @type {?} */ addValue = add[prop];
        var /** @type {?} */ propValue = metadata[prop];
        if (propValue != null && propValue instanceof Array) {
            metadata[prop] = propValue.concat(addValue);
        }
        else {
            metadata[prop] = addValue;
        }
    }
}
/**
 * @param {?} metadata
 * @param {?} set
 * @return {?}
 */
function setMetadata(metadata, set) {
    for (var /** @type {?} */ prop in set) {
        metadata[prop] = set[prop];
    }
}
/**
 * @param {?} propName
 * @param {?} propValue
 * @param {?} references
 * @return {?}
 */
function _propHashKey(propName, propValue, references) {
    var /** @type {?} */ replacer = function (key, value) {
        if (typeof value === 'function') {
            value = _serializeReference(value, references);
        }
        return value;
    };
    return propName + ":" + JSON.stringify(propValue, replacer);
}
/**
 * @param {?} ref
 * @param {?} references
 * @return {?}
 */
function _serializeReference(ref, references) {
    var /** @type {?} */ id = references.get(ref);
    if (!id) {
        id = "" + stringify(ref) + _nextReferenceId++;
        references.set(ref, id);
    }
    return id;
}
/**
 * @param {?} obj
 * @return {?}
 */
function _valueProps(obj) {
    var /** @type {?} */ props = [];
    // regular public props
    Object.keys(obj).forEach(function (prop) {
        if (!prop.startsWith('_')) {
            props.push(prop);
        }
    });
    // getters
    var /** @type {?} */ proto = obj;
    while (proto = Object.getPrototypeOf(proto)) {
        Object.keys(proto).forEach(function (protoProp) {
            var /** @type {?} */ desc = Object.getOwnPropertyDescriptor(proto, protoProp);
            if (!protoProp.startsWith('_') && desc && 'get' in desc) {
                props.push(protoProp);
            }
        });
    }
    return props;
}
//# sourceMappingURL=metadata_overrider.js.map