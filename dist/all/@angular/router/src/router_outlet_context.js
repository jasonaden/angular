"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Store contextual information about a {@link RouterOutlet}
 *
 * @stable
 */
var OutletContext = (function () {
    function OutletContext() {
        this.outlet = null;
        this.route = null;
        this.resolver = null;
        this.children = new ChildrenOutletContexts();
        this.attachRef = null;
    }
    return OutletContext;
}());
exports.OutletContext = OutletContext;
/**
 * Store contextual information about the children (= nested) {@link RouterOutlet}
 *
 * @stable
 */
var ChildrenOutletContexts = (function () {
    function ChildrenOutletContexts() {
        // contexts for child outlets, by name.
        this.contexts = new Map();
    }
    /** Called when a `RouterOutlet` directive is instantiated */
    ChildrenOutletContexts.prototype.onChildOutletCreated = function (childName, outlet) {
        var context = this.getOrCreateContext(childName);
        context.outlet = outlet;
        this.contexts.set(childName, context);
    };
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     */
    ChildrenOutletContexts.prototype.onChildOutletDestroyed = function (childName) {
        var context = this.getContext(childName);
        if (context) {
            context.outlet = null;
        }
    };
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     */
    ChildrenOutletContexts.prototype.onOutletDeactivated = function () {
        var contexts = this.contexts;
        this.contexts = new Map();
        return contexts;
    };
    ChildrenOutletContexts.prototype.onOutletReAttached = function (contexts) { this.contexts = contexts; };
    ChildrenOutletContexts.prototype.getOrCreateContext = function (childName) {
        var context = this.getContext(childName);
        if (!context) {
            context = new OutletContext();
            this.contexts.set(childName, context);
        }
        return context;
    };
    ChildrenOutletContexts.prototype.getContext = function (childName) { return this.contexts.get(childName) || null; };
    return ChildrenOutletContexts;
}());
exports.ChildrenOutletContexts = ChildrenOutletContexts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldF9jb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9yb3V0ZXJfb3V0bGV0X2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFRSDs7OztHQUlHO0FBQ0g7SUFBQTtRQUNFLFdBQU0sR0FBc0IsSUFBSSxDQUFDO1FBQ2pDLFVBQUssR0FBd0IsSUFBSSxDQUFDO1FBQ2xDLGFBQVEsR0FBa0MsSUFBSSxDQUFDO1FBQy9DLGFBQVEsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7UUFDeEMsY0FBUyxHQUEyQixJQUFJLENBQUM7SUFDM0MsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFOWSxzQ0FBYTtBQVExQjs7OztHQUlHO0FBQ0g7SUFBQTtRQUNFLHVDQUF1QztRQUMvQixhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENBQUM7SUE2Q3RELENBQUM7SUEzQ0MsNkRBQTZEO0lBQzdELHFEQUFvQixHQUFwQixVQUFxQixTQUFpQixFQUFFLE1BQW9CO1FBQzFELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx1REFBc0IsR0FBdEIsVUFBdUIsU0FBaUI7UUFDdEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxvREFBbUIsR0FBbkI7UUFDRSxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxtREFBa0IsR0FBbEIsVUFBbUIsUUFBb0MsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFdEYsbURBQWtCLEdBQWxCLFVBQW1CLFNBQWlCO1FBQ2xDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCwyQ0FBVSxHQUFWLFVBQVcsU0FBaUIsSUFBd0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEcsNkJBQUM7QUFBRCxDQUFDLEFBL0NELElBK0NDO0FBL0NZLHdEQUFzQiJ9