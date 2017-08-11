/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var q = require('q');
var FirefoxProfile = require('firefox-profile');
var jpm = require('jpm/lib/xpi');
var pathUtil = require('path');
var PERF_ADDON_PACKAGE_JSON_DIR = '..';
exports.getAbsolutePath = function (path) {
    var normalizedPath = pathUtil.normalize(path);
    if (pathUtil.resolve(normalizedPath) == normalizedPath) {
        // Already absolute path
        return normalizedPath;
    }
    else {
        return pathUtil.join(__dirname, normalizedPath);
    }
};
exports.getFirefoxProfile = function (extensionPath) {
    var deferred = q.defer();
    var firefoxProfile = new FirefoxProfile();
    firefoxProfile.addExtensions([extensionPath], function () {
        firefoxProfile.encoded(function (encodedProfile) {
            var multiCapabilities = [{ browserName: 'firefox', firefox_profile: encodedProfile }];
            deferred.resolve(multiCapabilities);
        });
    });
    return deferred.promise;
};
exports.getFirefoxProfileWithExtension = function () {
    var absPackageJsonDir = pathUtil.join(__dirname, PERF_ADDON_PACKAGE_JSON_DIR);
    var packageJson = require(pathUtil.join(absPackageJsonDir, 'package.json'));
    var savedCwd = process.cwd();
    process.chdir(absPackageJsonDir);
    return jpm(packageJson).then(function (xpiPath) {
        process.chdir(savedCwd);
        return exports.getFirefoxProfile(xpiPath);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9maXJlZm94X2V4dGVuc2lvbi9saWIvdGVzdF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFakMsSUFBTSwyQkFBMkIsR0FBRyxJQUFJLENBQUM7QUFFekMsT0FBTyxDQUFDLGVBQWUsR0FBRyxVQUFTLElBQVk7SUFDN0MsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsd0JBQXdCO1FBQ3hCLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDeEIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7QUFDSCxDQUFDLENBQUM7QUFFRixPQUFPLENBQUMsaUJBQWlCLEdBQUcsVUFBUyxhQUFxQjtJQUN4RCxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFM0IsSUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztJQUM1QyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFDNUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGNBQW1CO1lBQ3pDLElBQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7WUFDdEYsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRixPQUFPLENBQUMsOEJBQThCLEdBQUc7SUFDdkMsSUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ2hGLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFOUUsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUVqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQWU7UUFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=