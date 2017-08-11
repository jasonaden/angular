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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjFfcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS9zdGF0aWMvc3JjL3N0YXRpYy9hbmd1bGFyMV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxpRkFBaUY7QUFDakYsc0ZBQXNGO0FBQ3RGLCtGQUErRjtBQUMvRix1REFBdUQ7QUFDdkQsSUFBSSxlQUE4QyxDQUFDO0FBQ25ELDRCQUFtQyxRQUFrQztJQUNuRSxlQUFlLEdBQUcsUUFBUSxDQUFDO0FBQzdCLENBQUM7QUFGRCxnREFFQztBQUNEO0lBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsSUFBTSxRQUFRLEdBQWtDLGVBQWUsQ0FBQztJQUNoRSxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUUsMENBQTBDO0lBQ25FLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQVJELDBDQVFDO0FBRUQsMEJBQWlDLENBQTJCO0lBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFGRCw0Q0FFQztBQUVELHdCQUErQixDQUEyQjtJQUN4RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRkQsd0NBRUM7QUFFRCxzQkFBNkIsQ0FBMkI7SUFDdEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUZELG9DQUVDO0FBRVksUUFBQSxpQkFBaUIsR0FBRztJQUMvQix5RkFBeUY7SUFDekYsMkVBQTJFO0lBQzNFLHdDQUF3QztJQUN4Qyx5RkFBeUY7SUFDekYsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUM3RCxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0lBQzFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0lBQ3RFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFDO0NBQ25FLENBQUMifQ==