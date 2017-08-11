"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// We have to do a little dance to get the ng1 injector into the module injector.
// We store the ng1 injector so that the provider in the module injector can access it
// Then we "get" the ng1 injector from the module injector, which triggers the provider to read
// the stored injector and release the reference to it.
var tempInjectorRef;
function setTempInjectorRef(injector) {
    tempInjectorRef = injector;
}
exports.setTempInjectorRef = setTempInjectorRef;
function injectorFactory() {
    if (!tempInjectorRef) {
        throw new Error('Trying to get the AngularJS injector before it being set.');
    }
    var injector = tempInjectorRef;
    tempInjectorRef = null; // clear the value to prevent memory leaks
    return injector;
}
exports.injectorFactory = injectorFactory;
function rootScopeFactory(i) {
    return i.get('$rootScope');
}
exports.rootScopeFactory = rootScopeFactory;
function compileFactory(i) {
    return i.get('$compile');
}
exports.compileFactory = compileFactory;
function parseFactory(i) {
    return i.get('$parse');
}
exports.parseFactory = parseFactory;
exports.angular1Providers = [
    // We must use exported named functions for the ng2 factories to keep the compiler happy:
    // > Metadata collected contains an error that will be reported at runtime:
    // >   Function calls are not supported.
    // >   Consider replacing the function or lambda with a reference to an exported function
    { provide: '$injector', useFactory: injectorFactory, deps: [] },
    { provide: '$rootScope', useFactory: rootScopeFactory, deps: ['$injector'] },
    { provide: '$compile', useFactory: compileFactory, deps: ['$injector'] },
    { provide: '$parse', useFactory: parseFactory, deps: ['$injector'] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjFfcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zcmMvc3RhdGljL2FuZ3VsYXIxX3Byb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILGlGQUFpRjtBQUNqRixzRkFBc0Y7QUFDdEYsK0ZBQStGO0FBQy9GLHVEQUF1RDtBQUN2RCxJQUFJLGVBQThDLENBQUM7QUFDbkQsNEJBQW1DLFFBQWtDO0lBQ25FLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFDN0IsQ0FBQztBQUZELGdEQUVDO0FBQ0Q7SUFDRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxJQUFNLFFBQVEsR0FBa0MsZUFBZSxDQUFDO0lBQ2hFLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBRSwwQ0FBMEM7SUFDbkUsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBUkQsMENBUUM7QUFFRCwwQkFBaUMsQ0FBMkI7SUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUZELDRDQUVDO0FBRUQsd0JBQStCLENBQTJCO0lBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFGRCx3Q0FFQztBQUVELHNCQUE2QixDQUEyQjtJQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsb0NBRUM7QUFFWSxRQUFBLGlCQUFpQixHQUFHO0lBQy9CLHlGQUF5RjtJQUN6RiwyRUFBMkU7SUFDM0Usd0NBQXdDO0lBQ3hDLHlGQUF5RjtJQUN6RixFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQzdELEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7SUFDMUUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7SUFDdEUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7Q0FDbkUsQ0FBQyJ9