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
 * Describes within the change detector which strategy will be used the next time change
 * detection is triggered.
 * @stable
 */
var ChangeDetectionStrategy;
(function (ChangeDetectionStrategy) {
    /**
     * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 0] = "OnPush";
    /**
     * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
     */
    ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 1] = "Default";
})(ChangeDetectionStrategy = exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
/**
 * Describes the status of the detector.
 */
var ChangeDetectorStatus;
(function (ChangeDetectorStatus) {
    /**
     * `CheckOnce` means that after calling detectChanges the mode of the change detector
     * will become `Checked`.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["CheckOnce"] = 0] = "CheckOnce";
    /**
     * `Checked` means that the change detector should be skipped until its mode changes to
     * `CheckOnce`.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["Checked"] = 1] = "Checked";
    /**
     * `CheckAlways` means that after calling detectChanges the mode of the change detector
     * will remain `CheckAlways`.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["CheckAlways"] = 2] = "CheckAlways";
    /**
     * `Detached` means that the change detector sub tree is not a part of the main tree and
     * should be skipped.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["Detached"] = 3] = "Detached";
    /**
     * `Errored` means that the change detector encountered an error checking a binding
     * or calling a directive lifecycle method and is now in an inconsistent state. Change
     * detectors in this state will no longer detect changes.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["Errored"] = 4] = "Errored";
    /**
     * `Destroyed` means that the change detector is destroyed.
     */
    ChangeDetectorStatus[ChangeDetectorStatus["Destroyed"] = 5] = "Destroyed";
})(ChangeDetectorStatus = exports.ChangeDetectorStatus || (exports.ChangeDetectorStatus = {}));
function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
    return changeDetectionStrategy == null ||
        changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
exports.isDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvY2hhbmdlX2RldGVjdGlvbi9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSDs7OztHQUlHO0FBQ0gsSUFBWSx1QkFVWDtBQVZELFdBQVksdUJBQXVCO0lBQ2pDOztPQUVHO0lBQ0gseUVBQU0sQ0FBQTtJQUVOOztPQUVHO0lBQ0gsMkVBQU8sQ0FBQTtBQUNULENBQUMsRUFWVyx1QkFBdUIsR0FBdkIsK0JBQXVCLEtBQXZCLCtCQUF1QixRQVVsQztBQUVEOztHQUVHO0FBQ0gsSUFBWSxvQkFvQ1g7QUFwQ0QsV0FBWSxvQkFBb0I7SUFDOUI7OztPQUdHO0lBQ0gseUVBQVMsQ0FBQTtJQUVUOzs7T0FHRztJQUNILHFFQUFPLENBQUE7SUFFUDs7O09BR0c7SUFDSCw2RUFBVyxDQUFBO0lBRVg7OztPQUdHO0lBQ0gsdUVBQVEsQ0FBQTtJQUVSOzs7O09BSUc7SUFDSCxxRUFBTyxDQUFBO0lBRVA7O09BRUc7SUFDSCx5RUFBUyxDQUFBO0FBQ1gsQ0FBQyxFQXBDVyxvQkFBb0IsR0FBcEIsNEJBQW9CLEtBQXBCLDRCQUFvQixRQW9DL0I7QUFFRCwwQ0FBaUQsdUJBQWdEO0lBRS9GLE1BQU0sQ0FBQyx1QkFBdUIsSUFBSSxJQUFJO1FBQ2xDLHVCQUF1QixLQUFLLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztBQUNsRSxDQUFDO0FBSkQsNEVBSUMifQ==