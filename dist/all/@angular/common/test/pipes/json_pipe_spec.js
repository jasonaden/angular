"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function main() {
    describe('JsonPipe', function () {
        var regNewLine = '\n';
        var inceptionObj;
        var inceptionObjString;
        var pipe;
        function normalize(obj) { return obj.replace(regNewLine, ''); }
        beforeEach(function () {
            inceptionObj = { dream: { dream: { dream: 'Limbo' } } };
            inceptionObjString = '{\n' +
                '  "dream": {\n' +
                '    "dream": {\n' +
                '      "dream": "Limbo"\n' +
                '    }\n' +
                '  }\n' +
                '}';
            pipe = new common_1.JsonPipe();
        });
        describe('transform', function () {
            it('should return JSON-formatted string', function () { matchers_1.expect(pipe.transform(inceptionObj)).toEqual(inceptionObjString); });
            it('should return JSON-formatted string even when normalized', function () {
                var dream1 = normalize(pipe.transform(inceptionObj));
                var dream2 = normalize(inceptionObjString);
                matchers_1.expect(dream1).toEqual(dream2);
            });
            it('should return JSON-formatted string similar to Json.stringify', function () {
                var dream1 = normalize(pipe.transform(inceptionObj));
                var dream2 = normalize(JSON.stringify(inceptionObj, null, 2));
                matchers_1.expect(dream1).toEqual(dream2);
            });
        });
        describe('integration', function () {
            var TestComp = (function () {
                function TestComp() {
                }
                return TestComp;
            }());
            TestComp = __decorate([
                core_1.Component({ selector: 'test-comp', template: '{{data | json}}' })
            ], TestComp);
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [TestComp], imports: [common_1.CommonModule] });
            });
            it('should work with mutable objects', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(TestComp);
                var mutable = [1];
                fixture.componentInstance.data = mutable;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('[\n  1\n]');
                mutable.push(2);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('[\n  1,\n  2\n]');
            }));
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9waXBlcy9qc29uX3BpcGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUF1RDtBQUN2RCxzQ0FBd0M7QUFDeEMsaURBQXFEO0FBQ3JELDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksWUFBaUIsQ0FBQztRQUN0QixJQUFJLGtCQUEwQixDQUFDO1FBQy9CLElBQUksSUFBYyxDQUFDO1FBRW5CLG1CQUFtQixHQUFXLElBQVksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRSxVQUFVLENBQUM7WUFDVCxZQUFZLEdBQUcsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsRUFBQyxDQUFDO1lBQ2xELGtCQUFrQixHQUFHLEtBQUs7Z0JBQ3RCLGdCQUFnQjtnQkFDaEIsa0JBQWtCO2dCQUNsQiwwQkFBMEI7Z0JBQzFCLFNBQVM7Z0JBQ1QsT0FBTztnQkFDUCxHQUFHLENBQUM7WUFHUixJQUFJLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFDckMsY0FBUSxpQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhGLEVBQUUsQ0FBQywwREFBMEQsRUFBRTtnQkFDN0QsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzdDLGlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO2dCQUNsRSxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLGlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBR3RCLElBQU0sUUFBUTtnQkFBZDtnQkFFQSxDQUFDO2dCQUFELGVBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUZLLFFBQVE7Z0JBRGIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFDLENBQUM7ZUFDMUQsUUFBUSxDQUViO1lBRUQsVUFBVSxDQUFDO2dCQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3RGLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLGVBQUssQ0FBQztnQkFDeEMsSUFBTSxPQUFPLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELElBQU0sT0FBTyxHQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUN6QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixpQkFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoRUQsb0JBZ0VDIn0=