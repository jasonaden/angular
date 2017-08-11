"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addTreeToModule(mod) {
    return mod
        .directive('tree', function () {
        return {
            scope: { data: '=' },
            template: "<span ng-style=\"{'background-color': data.depth % 2 ? '' : 'grey'}\"> {{data.value}} </span><tree-if data='data.right'></tree-if><tree-if data='data.left'></tree-if>"
        };
    })
        .directive('treeIf', [
        '$compile', '$animate',
        function ($compile, $animate) {
            var transcludeFn;
            return {
                transclude: 'element',
                priority: 600,
                terminal: true,
                $$tlb: true,
                link: function ($scope, $element, $attr, ctrl) {
                    if (!transcludeFn) {
                        var template = '<tree data="' + $attr.data + '"></tree>';
                        transcludeFn = $compile(template);
                    }
                    var childElement, childScope;
                    $scope.$watch($attr.data, function ngIfWatchAction(value) {
                        if (value) {
                            if (!childScope) {
                                childScope = $scope.$new();
                                transcludeFn(childScope, function (clone) {
                                    childElement = clone;
                                    $animate.enter(clone, $element.parent(), $element);
                                });
                            }
                        }
                        else {
                            if (childScope) {
                                childScope.$destroy();
                                childScope = null;
                            }
                            if (childElement) {
                                $animate.leave(childElement);
                                childElement = null;
                            }
                        }
                    });
                }
            };
        }
    ])
        .config([
        '$compileProvider',
        function ($compileProvider) { $compileProvider.debugInfoEnabled(false); }
    ]);
}
exports.addTreeToModule = addTreeToModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzEvdHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLHlCQUFnQyxHQUFRO0lBQ3RDLE1BQU0sQ0FBQyxHQUFHO1NBQ0wsU0FBUyxDQUNOLE1BQU0sRUFDTjtRQUNFLE1BQU0sQ0FBQztZQUNMLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUM7WUFDbEIsUUFBUSxFQUNKLHdLQUFzSztTQUMzSyxDQUFDO0lBQ0osQ0FBQyxDQUFDO1NBSUwsU0FBUyxDQUNOLFFBQVEsRUFDUjtRQUNFLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFVBQVMsUUFBYSxFQUFFLFFBQWE7WUFDbkMsSUFBSSxZQUFpQixDQUFDO1lBQ3RCLE1BQU0sQ0FBQztnQkFDTCxVQUFVLEVBQUUsU0FBUztnQkFDckIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFVBQVMsTUFBVyxFQUFFLFFBQWEsRUFBRSxLQUFVLEVBQUUsSUFBUztvQkFDOUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixJQUFNLFFBQVEsR0FBRyxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7d0JBQzNELFlBQVksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BDLENBQUM7b0JBQ0QsSUFBSSxZQUFpQixFQUFFLFVBQWUsQ0FBQztvQkFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHlCQUF5QixLQUFVO3dCQUUzRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQ0FDaEIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQ0FDM0IsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQVU7b0NBQzFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0NBQ3JCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDckQsQ0FBQyxDQUFDLENBQUM7NEJBQ0wsQ0FBQzt3QkFDSCxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNOLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0NBQ2YsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dDQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDOzRCQUNwQixDQUFDOzRCQUNELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0NBQ2pCLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0NBQzdCLFlBQVksR0FBRyxJQUFJLENBQUM7NEJBQ3RCLENBQUM7d0JBQ0gsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2FBQ0YsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO1NBQ0wsTUFBTSxDQUFDO1FBQ04sa0JBQWtCO1FBQ2xCLFVBQVMsZ0JBQXFCLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlFLENBQUMsQ0FBQztBQUNULENBQUM7QUE1REQsMENBNERDIn0=