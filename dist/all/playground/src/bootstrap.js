/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/all/playground/vendor/core.js');
    writeScriptTag('/all/playground/vendor/zone.js');
    writeScriptTag('/all/playground/vendor/long-stack-trace-zone.js');
    writeScriptTag('/all/playground/vendor/system.src.js');
    writeScriptTag('/all/playground/vendor/Reflect.js', 'playgroundBootstrap()');
    global.playgroundBootstrap = playgroundBootstrap;
    function playgroundBootstrap() {
        // check query param
        var useBundles = location.search.indexOf('bundles=false') == -1;
        if (useBundles) {
            System.config({
                map: {
                    'index': 'index.js',
                    '@angular/common': '/packages-dist/common/bundles/common.umd.js',
                    '@angular/animations': '/packages-dist/animation/bundles/animations.umd.js',
                    '@angular/platform-browser/animations': '/packages-dist/platform-browser/animations/bundles/platform-browser-animations.umd.js',
                    '@angular/compiler': '/packages-dist/compiler/bundles/compiler.umd.js',
                    '@angular/core': '/packages-dist/core/bundles/core.umd.js',
                    '@angular/forms': '/packages-dist/forms/bundles/forms.umd.js',
                    '@angular/http': '/packages-dist/http/bundles/http.umd.js',
                    '@angular/platform-browser': '/packages-dist/platform-browser/bundles/platform-browser.umd.js',
                    '@angular/platform-browser-dynamic': '/packages-dist/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                    '@angular/platform-webworker': '/packages-dist/platform-webworker/bundles/platform-webworker.umd.js',
                    '@angular/platform-webworker-dynamic': '/packages-dist/platform-webworker-dynamic/bundles/platform-webworker-dynamic.umd.js',
                    '@angular/router': '/packages-dist/router/bundles/router.umd.js',
                    '@angular/upgrade': '/packages-dist/upgrade/bundles/upgrade.umd.js',
                    '@angular/upgrade/static': '/packages-dist/upgrade/bundles/upgrade-static.umd.js',
                    'rxjs': '/all/playground/vendor/rxjs',
                },
                packages: {
                    'app': { defaultExtension: 'js' },
                    'rxjs': { defaultExtension: 'js' },
                }
            });
        }
        else {
            console.warn('Not using the Angular bundles. Don\'t use this configuration for e2e/performance tests!');
            System.config({
                map: {
                    'index': 'index.js',
                    '@angular': '/all/@angular',
                    'rxjs': '/all/playground/vendor/rxjs'
                },
                packages: {
                    'app': { defaultExtension: 'js' },
                    '@angular/common': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/animations': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/core': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/forms': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/http': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-webworker': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-webworker-dynamic': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/router': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/upgrade': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs': { defaultExtension: 'js' }
                }
            });
        }
        // BOOTSTRAP the app!
        System.import('index').then(function (m) {
            m.main();
        }, console.error.bind(console));
    }
    function writeScriptTag(scriptUrl, onload) {
        document.write("<script src=\"" + scriptUrl + "\" onload=\"" + onload + "\"></script>");
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsQ0FBQyxVQUFTLE1BQVc7SUFDbkIsY0FBYyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDakQsY0FBYyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDakQsY0FBYyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDbEUsY0FBYyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDdkQsY0FBYyxDQUFDLG1DQUFtQyxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFFN0UsTUFBTSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBRWpEO1FBQ0Usb0JBQW9CO1FBQ3BCLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWxFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsaUJBQWlCLEVBQUUsNkNBQTZDO29CQUNoRSxxQkFBcUIsRUFBRSxvREFBb0Q7b0JBQzNFLHNDQUFzQyxFQUNsQyx1RkFBdUY7b0JBQzNGLG1CQUFtQixFQUFFLGlEQUFpRDtvQkFDdEUsZUFBZSxFQUFFLHlDQUF5QztvQkFDMUQsZ0JBQWdCLEVBQUUsMkNBQTJDO29CQUM3RCxlQUFlLEVBQUUseUNBQXlDO29CQUMxRCwyQkFBMkIsRUFDdkIsaUVBQWlFO29CQUNyRSxtQ0FBbUMsRUFDL0IsaUZBQWlGO29CQUNyRiw2QkFBNkIsRUFDekIscUVBQXFFO29CQUN6RSxxQ0FBcUMsRUFDakMscUZBQXFGO29CQUN6RixpQkFBaUIsRUFBRSw2Q0FB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