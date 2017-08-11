/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/all/benchmarks/vendor/core.js');
    writeScriptTag('/all/benchmarks/vendor/zone.js');
    writeScriptTag('/all/benchmarks/vendor/long-stack-trace-zone.js');
    writeScriptTag('/all/benchmarks/vendor/system.src.js');
    writeScriptTag('/all/benchmarks/vendor/Reflect.js', 'benchmarksBootstrap()');
    global.benchmarksBootstrap = benchmarksBootstrap;
    function benchmarksBootstrap() {
        // check query param
        var useBundles = location.search.indexOf('bundles=false') == -1;
        if (useBundles) {
            System.config({
                defaultJSExtensions: true,
                map: {
                    '@angular/core': '/packages-dist/core/bundles/core.umd.js',
                    '@angular/animations': '/packages-dist/common/bundles/animations.umd.js',
                    '@angular/platform-browser/animations': '/packages-dist/platform-browser/bundles/platform-browser-animations.umd.js',
                    '@angular/common': '/packages-dist/common/bundles/common.umd.js',
                    '@angular/forms': '/packages-dist/forms/bundles/forms.umd.js',
                    '@angular/compiler': '/packages-dist/compiler/bundles/compiler.umd.js',
                    '@angular/platform-browser': '/packages-dist/platform-browser/bundles/platform-browser.umd.js',
                    '@angular/platform-browser-dynamic': '/packages-dist/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                    '@angular/http': '/packages-dist/http/bundles/http.umd.js',
                    '@angular/upgrade': '/packages-dist/upgrade/bundles/upgrade.umd.js',
                    '@angular/router': '/packages-dist/router/bundles/router.umd.js',
                    '@angular/core/src/facade': '/all/@angular/core/src/facade',
                    'rxjs': '/all/benchmarks/vendor/rxjs'
                },
                packages: {
                    '@angular/core/src/facade': { defaultExtension: 'js' },
                    'rxjs': { defaultExtension: 'js' }
                }
            });
        }
        else {
            console.warn('Not using the Angular bundles. Don\'t use this configuration for e2e/performance tests!');
            System.config({
                defaultJSExtensions: true,
                map: { '@angular': '/all/@angular', 'rxjs': '/all/benchmarks/vendor/rxjs' },
                packages: {
                    '@angular/core': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/animations': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser/animations': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/router': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/common': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/forms': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/upgrade': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs': { defaultExtension: 'js' }
                }
            });
        }
        // BOOTSTRAP the app!
        System.import('index').then(function (m) { m.main(); }, console.error.bind(console));
    }
    function writeScriptTag(scriptUrl, onload) {
        document.write("<script src=\"" + scriptUrl + "\" onload=\"" + onload + "\"></script>");
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwX25nMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvYm9vdHN0cmFwX25nMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxDQUFDLFVBQVMsTUFBVztJQUVuQixjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNqRCxjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNqRCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUNsRSxjQUFjLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUN2RCxjQUFjLENBQUMsbUNBQW1DLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUV2RSxNQUFPLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFFeEQ7UUFDRSxvQkFBb0I7UUFDcEIsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ1osbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsR0FBRyxFQUFFO29CQUNILGVBQWUsRUFBRSx5Q0FBeUM7b0JBQzFELHFCQUFxQixFQUFFLGlEQUFpRDtvQkFDeEUsc0NBQXNDLEVBQ2xDLDRFQUE0RTtvQkFDaEYsaUJBQWlCLEVBQUUsNkNBQTZDO29CQUNoRSxnQkFBZ0IsRUFBRSwyQ0FBMkM7b0JBQzdELG1CQUFtQixFQUFFLGlEQUFpRDtvQkFDdEUsMkJBQTJCLEVBQ3ZCLGlFQUFpRTtvQkFDckUsbUNBQW1DLEVBQy9CLGlGQUFpRjtvQkFDckYsZUFBZSxFQUFFLHlDQUF5QztvQkFDMUQsa0JBQWtCLEVBQUUsK0NBQStDO29CQUNuRSxpQkFBaUIsRUFBRSw2Q0FBNkM7b0JBQ2hFLDBCQUEwQixFQUFFLCtCQUErQjtvQkFDM0QsTUFBTSxFQUFFLDZCQUE2QjtpQkFDdEM7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLDBCQUEwQixFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFDO29CQUNwRCxNQUFNLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUM7aUJBQ2pDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLElBQUksQ0FDUix5RkFBeUYsQ0FBQyxDQUFDO1lBRS9GLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ1osbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsNkJBQTZCLEVBQUM7Z0JBQ3pFLFFBQVEsRUFBRTtvQkFDUixlQUFlLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDM0QscUJBQXFCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDakUsc0NBQXNDLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDbEYsbUJBQW1CLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDL0QsaUJBQWlCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDN0QsaUJBQWlCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDN0QsZ0JBQWdCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDNUQsMkJBQTJCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDdkUsbUNBQW1DLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDL0Usa0JBQWtCLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBQztvQkFDOUQsTUFBTSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFDO2lCQUNqQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxxQkFBcUI7UUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFNLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVELHdCQUF3QixTQUFpQixFQUFFLE1BQWU7UUFDeEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxtQkFBZ0IsU0FBUyxvQkFBYSxNQUFNLGlCQUFhLENBQUMsQ0FBQztJQUM1RSxDQUFDO0FBQ0gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMifQ==