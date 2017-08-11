"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../../di");
/**
 * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
 * @stable
 */
var IterableDiffers = (function () {
    function IterableDiffers(factories) {
        this.factories = factories;
    }
    IterableDiffers.create = function (factories, parent) {
        if (parent != null) {
            var copied = parent.factories.slice();
            factories = factories.concat(copied);
            return new IterableDiffers(factories);
        }
        else {
            return new IterableDiffers(factories);
        }
    };
    /**
     * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
     * inherited {@link IterableDiffers} instance with the provided factories and return a new
     * {@link IterableDiffers} instance.
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link IterableDiffer} available.
     *
     * ### Example
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     IterableDiffers.extend([new ImmutableListDiffer()])
     *   ]
     * })
     * ```
     */
    IterableDiffers.extend = function (factories) {
        return {
            provide: IterableDiffers,
            useFactory: function (parent) {
                if (!parent) {
                    // Typically would occur when calling IterableDiffers.extend inside of dependencies passed
                    // to
                    // bootstrap(), which would override default pipes instead of extending them.
                    throw new Error('Cannot extend IterableDiffers without a parent injector');
                }
                return IterableDiffers.create(factories, parent);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[IterableDiffers, new di_1.SkipSelf(), new di_1.Optional()]]
        };
    };
    IterableDiffers.prototype.find = function (iterable) {
        var factory = this.factories.find(function (f) { return f.supports(iterable); });
        if (factory != null) {
            return factory;
        }
        else {
            throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
        }
    };
    return IterableDiffers;
}());
exports.IterableDiffers = IterableDiffers;
function getTypeNameForDebugging(type) {
    return type['name'] || typeof type;
}
exports.getTypeNameForDebugging = getTypeNameForDebugging;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQTREO0FBd0k1RDs7O0dBR0c7QUFDSDtJQUtFLHlCQUFZLFNBQWtDO1FBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFBQyxDQUFDO0lBRXhFLHNCQUFNLEdBQWIsVUFBYyxTQUFrQyxFQUFFLE1BQXdCO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSSxzQkFBTSxHQUFiLFVBQWMsU0FBa0M7UUFDOUMsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLGVBQWU7WUFDeEIsVUFBVSxFQUFFLFVBQUMsTUFBdUI7Z0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDWiwwRkFBMEY7b0JBQzFGLEtBQUs7b0JBQ0wsNkVBQTZFO29CQUM3RSxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7Z0JBQzdFLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxhQUFRLEVBQUUsRUFBRSxJQUFJLGFBQVEsRUFBRSxDQUFDLENBQUM7U0FDMUQsQ0FBQztJQUNKLENBQUM7SUFFRCw4QkFBSSxHQUFKLFVBQUssUUFBYTtRQUNoQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sSUFBSSxLQUFLLENBQ1gsNkNBQTJDLFFBQVEsbUJBQWMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1FBQzdHLENBQUM7SUFDSCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBOURELElBOERDO0FBOURZLDBDQUFlO0FBZ0U1QixpQ0FBd0MsSUFBUztJQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ3JDLENBQUM7QUFGRCwwREFFQyJ9