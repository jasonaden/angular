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
var _nextReferenceId = 0;
var MetadataOverrider = (function () {
    function MetadataOverrider() {
        this._references = new Map();
    }
    /**
     * Creates a new instance for the given metadata class
     * based on an old instance and overrides.
     */
    MetadataOverrider.prototype.overrideMetadata = function (metadataClass, oldMetadata, override) {
        var props = {};
        if (oldMetadata) {
            _valueProps(oldMetadata).forEach(function (prop) { return props[prop] = oldMetadata[prop]; });
        }
        if (override.set) {
            if (override.remove || override.add) {
                throw new Error("Cannot set and add/remove " + core_1.ɵstringify(metadataClass) + " at the same time!");
            }
            setMetadata(props, override.set);
        }
        if (override.remove) {
            removeMetadata(props, override.remove, this._references);
        }
        if (override.add) {
            addMetadata(props, override.add);
        }
        return new metadataClass(props);
    };
    return MetadataOverrider;
}());
exports.MetadataOverrider = MetadataOverrider;
function removeMetadata(metadata, remove, references) {
    var removeObjects = new Set();
    var _loop_1 = function (prop) {
        var removeValue = remove[prop];
        if (removeValue instanceof Array) {
            removeValue.forEach(function (value) { removeObjects.add(_propHashKey(prop, value, references)); });
        }
        else {
            removeObjects.add(_propHashKey(prop, removeValue, references));
        }
    };
    for (var prop in remove) {
        _loop_1(prop);
    }
    var _loop_2 = function (prop) {
        var propValue = metadata[prop];
        if (propValue instanceof Array) {
            metadata[prop] = propValue.filter(function (value) { return !removeObjects.has(_propHashKey(prop, value, references)); });
        }
        else {
            if (removeObjects.has(_propHashKey(prop, propValue, references))) {
                metadata[prop] = undefined;
            }
        }
    };
    for (var prop in metadata) {
        _loop_2(prop);
    }
}
function addMetadata(metadata, add) {
    for (var prop in add) {
        var addValue = add[prop];
        var propValue = metadata[prop];
        if (propValue != null && propValue instanceof Array) {
            metadata[prop] = propValue.concat(addValue);
        }
        else {
            metadata[prop] = addValue;
        }
    }
}
function setMetadata(metadata, set) {
    for (var prop in set) {
        metadata[prop] = set[prop];
    }
}
function _propHashKey(propName, propValue, references) {
    var replacer = function (key, value) {
        if (typeof value === 'function') {
            value = _serializeReference(value, references);
        }
        return value;
    };
    return propName + ":" + JSON.stringify(propValue, replacer);
}
function _serializeReference(ref, references) {
    var id = references.get(ref);
    if (!id) {
        id = "" + core_1.ɵstringify(ref) + _nextReferenceId++;
        references.set(ref, id);
    }
    return id;
}
function _valueProps(obj) {
    var props = [];
    // regular public props
    Object.keys(obj).forEach(function (prop) {
        if (!prop.startsWith('_')) {
            props.push(prop);
        }
    });
    // getters
    var proto = obj;
    while (proto = Object.getPrototypeOf(proto)) {
        Object.keys(proto).forEach(function (protoProp) {
            var desc = Object.getOwnPropertyDescriptor(proto, protoProp);
            if (!protoProp.startsWith('_') && desc && 'get' in desc) {
                props.push(protoProp);
            }
        });
    }
    return props;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfb3ZlcnJpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdGluZy9zcmMvbWV0YWRhdGFfb3ZlcnJpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXNEO0FBT3RELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCO0lBQUE7UUFDVSxnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7SUEwQi9DLENBQUM7SUF6QkM7OztPQUdHO0lBQ0gsNENBQWdCLEdBQWhCLFVBQ0ksYUFBcUMsRUFBRSxXQUFjLEVBQUUsUUFBNkI7UUFDdEYsSUFBTSxLQUFLLEdBQWMsRUFBRSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBUyxXQUFZLENBQUMsSUFBSSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztRQUNyRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsaUJBQVMsQ0FBQyxhQUFhLENBQUMsdUJBQW9CLENBQUMsQ0FBQztZQUM3RixDQUFDO1lBQ0QsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxhQUFhLENBQU0sS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQztBQTNCWSw4Q0FBaUI7QUE2QjlCLHdCQUF3QixRQUFtQixFQUFFLE1BQVcsRUFBRSxVQUE0QjtJQUNwRixJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDOzRCQUM3QixJQUFJO1FBQ2IsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFdBQVcsQ0FBQyxPQUFPLENBQ2YsVUFBQyxLQUFVLElBQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7SUFDSCxDQUFDO0lBUkQsR0FBRyxDQUFDLENBQUMsSUFBTSxJQUFJLElBQUksTUFBTSxDQUFDO2dCQUFmLElBQUk7S0FRZDs0QkFFVSxJQUFJO1FBQ2IsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUM3QixVQUFDLEtBQVUsSUFBSyxPQUFBLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDLENBQUM7UUFDakYsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakUsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUM3QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFWRCxHQUFHLENBQUMsQ0FBQyxJQUFNLElBQUksSUFBSSxRQUFRLENBQUM7Z0JBQWpCLElBQUk7S0FVZDtBQUNILENBQUM7QUFFRCxxQkFBcUIsUUFBbUIsRUFBRSxHQUFRO0lBQ2hELEdBQUcsQ0FBQyxDQUFDLElBQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLFNBQVMsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQscUJBQXFCLFFBQW1CLEVBQUUsR0FBUTtJQUNoRCxHQUFHLENBQUMsQ0FBQyxJQUFNLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztBQUNILENBQUM7QUFFRCxzQkFBc0IsUUFBYSxFQUFFLFNBQWMsRUFBRSxVQUE0QjtJQUMvRSxJQUFNLFFBQVEsR0FBRyxVQUFDLEdBQVEsRUFBRSxLQUFVO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxHQUFHLG1CQUFtQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztJQUVGLE1BQU0sQ0FBSSxRQUFRLFNBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFHLENBQUM7QUFDOUQsQ0FBQztBQUVELDZCQUE2QixHQUFRLEVBQUUsVUFBNEI7SUFDakUsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDUixFQUFFLEdBQUcsS0FBRyxpQkFBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixFQUFJLENBQUM7UUFDOUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDWixDQUFDO0FBR0QscUJBQXFCLEdBQVE7SUFDM0IsSUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQzNCLHVCQUF1QjtJQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILFVBQVU7SUFDVixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDaEIsT0FBTyxLQUFLLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUztZQUNuQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDIn0=