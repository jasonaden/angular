/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/vendor/zone.js');
    writeScriptTag('/vendor/system.js');
    writeScriptTag('/vendor/Reflect.js');
    writeScriptTag('/_common/system-config.js');
    if (location.pathname.indexOf('/upgrade/') != -1) {
        writeScriptTag('/vendor/angular.js');
    }
    function writeScriptTag(scriptUrl, onload) {
        if (onload === void 0) { onload = ''; }
        document.write('<script src="' + scriptUrl + '" onload="' + onload + '"></script>');
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvX2NvbW1vbi9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsQ0FBQyxVQUFTLE1BQVc7SUFDbkIsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDcEMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDckMsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCx3QkFBd0IsU0FBaUIsRUFBRSxNQUFtQjtRQUFuQix1QkFBQSxFQUFBLFdBQW1CO1FBQzVELFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsR0FBRyxZQUFZLEdBQUcsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7QUFDSCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyJ9