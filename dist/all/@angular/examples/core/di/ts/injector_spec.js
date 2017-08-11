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
function main() {
    describe('injector metadata examples', function () {
        it('works', function () {
            // #docregion Injector
            var injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: 'validToken', useValue: 'Value' }]);
            expect(injector.get('validToken')).toEqual('Value');
            expect(function () { return injector.get('invalidToken'); }).toThrowError();
            expect(injector.get('invalidToken', 'notFound')).toEqual('notFound');
            // #enddocregion
        });
        it('injects injector', function () {
            // #docregion injectInjector
            var injector = core_1.ReflectiveInjector.resolveAndCreate([]);
            expect(injector.get(core_1.Injector)).toBe(injector);
            // #enddocregion
        });
        it('should infer type', function () {
            // #docregion InjectionToken
            var BASE_URL = new core_1.InjectionToken('BaseUrl');
            var injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: BASE_URL, useValue: 'http://localhost' }]);
            var url = injector.get(BASE_URL);
            // here `url` is inferred to be `string` because `BASE_URL` is `InjectionToken<string>`.
            expect(url).toBe('http://localhost');
            // #enddocregion
        });
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvaW5qZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEyRTtBQUUzRTtJQUNFLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtRQUNyQyxFQUFFLENBQUMsT0FBTyxFQUFFO1lBQ1Ysc0JBQXNCO1lBQ3RCLElBQU0sUUFBUSxHQUNWLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLGdCQUFnQjtRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNyQiw0QkFBNEI7WUFDNUIsSUFBTSxRQUFRLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsZ0JBQWdCO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1CQUFtQixFQUFFO1lBQ3RCLDRCQUE0QjtZQUM1QixJQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFjLENBQVMsU0FBUyxDQUFDLENBQUM7WUFDdkQsSUFBTSxRQUFRLEdBQ1YseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsd0ZBQXdGO1lBQ3hGLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNyQyxnQkFBZ0I7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE5QkQsb0JBOEJDIn0=