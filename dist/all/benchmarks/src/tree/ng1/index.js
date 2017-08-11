"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var util_2 = require("../util");
var tree_1 = require("./tree");
function init() {
    var detectChangesRuns = 0;
    var numberOfChecksEl = document.getElementById('numberOfChecks');
    tree_1.addTreeToModule(angular.module('app', [])).run([
        '$rootScope',
        function ($rootScope) {
            function detectChanges() {
                for (var i = 0; i < 10; i++) {
                    $rootScope.$digest();
                }
                detectChangesRuns += 10;
                numberOfChecksEl.textContent = "" + detectChangesRuns;
            }
            function noop() { }
            function destroyDom() {
                $rootScope.$apply(function () { $rootScope.initData = util_2.emptyTree; });
            }
            function createDom() {
                $rootScope.$apply(function () { $rootScope.initData = util_2.buildTree(); });
            }
            util_1.bindAction('#destroyDom', destroyDom);
            util_1.bindAction('#createDom', createDom);
            util_1.bindAction('#detectChanges', detectChanges);
            util_1.bindAction('#detectChangesProfile', util_1.profile(detectChanges, noop, 'detectChanges'));
            util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
            util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
        }
    ]);
    angular.bootstrap(document.querySelector('tree'), ['app']);
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvbmcxL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQStDO0FBQy9DLGdDQUE2QztBQUU3QywrQkFBdUM7QUFJdkM7SUFDRSxJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztJQUMxQixJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUcsQ0FBQztJQUVyRSxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzdDLFlBQVk7UUFDWixVQUFDLFVBQWU7WUFDZDtnQkFDRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM1QixVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBQ0QsaUJBQWlCLElBQUksRUFBRSxDQUFDO2dCQUN4QixnQkFBZ0IsQ0FBQyxXQUFXLEdBQUcsS0FBRyxpQkFBbUIsQ0FBQztZQUN4RCxDQUFDO1lBRUQsa0JBQWlCLENBQUM7WUFFbEI7Z0JBQ0UsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFRLFVBQVUsQ0FBQyxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFFRDtnQkFDRSxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQVEsVUFBVSxDQUFDLFFBQVEsR0FBRyxnQkFBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBRUQsaUJBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdEMsaUJBQVUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEMsaUJBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM1QyxpQkFBVSxDQUFDLHVCQUF1QixFQUFFLGNBQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbkYsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLGlCQUFVLENBQUMsbUJBQW1CLEVBQUUsY0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMifQ==