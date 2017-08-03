/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export default {
  entry: '../../../dist/packages-dist/common/esm5/http/index.js',
  dest: '../../../dist/packages-dist/common/bundles/common-http.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ng.commmon.http',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/common': 'ng.common',
    '@angular/common/http': 'ng.common.http',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx'
  }
};
