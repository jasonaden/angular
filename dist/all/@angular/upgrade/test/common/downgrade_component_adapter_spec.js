"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var downgrade_component_adapter_1 = require("@angular/upgrade/src/common/downgrade_component_adapter");
var test_helpers_1 = require("./test_helpers");
function main() {
    describe('DowngradeComponentAdapter', function () {
        describe('groupNodesBySelector', function () {
            it('should return an array of node collections for each selector', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var selectors = ['input[type=date]', 'span', '.x'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, contentNodes);
                expect(projectableNodes[0]).toEqual(test_helpers_1.nodes('<input type="date" name="myDate">'));
                expect(projectableNodes[1]).toEqual(test_helpers_1.nodes('<span>span content</span>'));
                expect(projectableNodes[2])
                    .toEqual(test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<div class="x"><span>div-2 content</span></div>'));
            });
            it('should collect up unmatched nodes for the wildcard selector', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var selectors = ['.x', '*', 'input[type=date]'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, contentNodes);
                expect(projectableNodes[0])
                    .toEqual(test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<div class="x"><span>div-2 content</span></div>'));
                expect(projectableNodes[1])
                    .toEqual(test_helpers_1.nodes('<input type="number" name="myNum">' +
                    '<span>span content</span>'));
                expect(projectableNodes[2]).toEqual(test_helpers_1.nodes('<input type="date" name="myDate">'));
            });
            it('should return an array of empty arrays if there are no nodes passed in', function () {
                var selectors = ['.x', '*', 'input[type=date]'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, []);
                expect(projectableNodes).toEqual([[], [], []]);
            });
            it('should return an empty array for each selector that does not match', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector([], contentNodes);
                expect(projectableNodes).toEqual([]);
                var noMatchSelectorNodes = downgrade_component_adapter_1.groupNodesBySelector(['.not-there'], contentNodes);
                expect(noMatchSelectorNodes).toEqual([[]]);
            });
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9hZGFwdGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3QvY29tbW9uL2Rvd25ncmFkZV9jb21wb25lbnRfYWRhcHRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsdUdBQTZGO0FBQzdGLCtDQUFxQztBQUdyQztJQUNFLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtRQUNwQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO2dCQUNqRSxJQUFNLFlBQVksR0FBRyxvQkFBSyxDQUN0QixpREFBaUQ7b0JBQ2pELG9DQUFvQztvQkFDcEMsbUNBQW1DO29CQUNuQywyQkFBMkI7b0JBQzNCLGlEQUFpRCxDQUFDLENBQUM7Z0JBRXZELElBQU0sU0FBUyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyRCxJQUFNLGdCQUFnQixHQUFHLGtEQUFvQixDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFdkUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDO2dCQUNoRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdEIsT0FBTyxDQUFDLG9CQUFLLENBQ1YsaURBQWlEO29CQUNqRCxpREFBaUQsQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7Z0JBQ2hFLElBQU0sWUFBWSxHQUFHLG9CQUFLLENBQ3RCLGlEQUFpRDtvQkFDakQsb0NBQW9DO29CQUNwQyxtQ0FBbUM7b0JBQ25DLDJCQUEyQjtvQkFDM0IsaURBQWlELENBQUMsQ0FBQztnQkFFdkQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2xELElBQU0sZ0JBQWdCLEdBQUcsa0RBQW9CLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUV2RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RCLE9BQU8sQ0FBQyxvQkFBSyxDQUNWLGlEQUFpRDtvQkFDakQsaURBQWlELENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RCLE9BQU8sQ0FBQyxvQkFBSyxDQUNWLG9DQUFvQztvQkFDcEMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0VBQXdFLEVBQUU7Z0JBQzNFLElBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNsRCxJQUFNLGdCQUFnQixHQUFHLGtEQUFvQixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO2dCQUN2RSxJQUFNLFlBQVksR0FBRyxvQkFBSyxDQUN0QixpREFBaUQ7b0JBQ2pELG9DQUFvQztvQkFDcEMsbUNBQW1DO29CQUNuQywyQkFBMkI7b0JBQzNCLGlEQUFpRCxDQUFDLENBQUM7Z0JBRXZELElBQU0sZ0JBQWdCLEdBQUcsa0RBQW9CLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRXJDLElBQU0sb0JBQW9CLEdBQUcsa0RBQW9CLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBbEVELG9CQWtFQyJ9