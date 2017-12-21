/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

const globals = {};

module.exports = {
  entry: '../../../dist/packages-dist/common/esm5/router.js',
  dest: '../../../dist/packages-dist/common/bundles/common-router.umd.js',
  format: 'umd',
  exports: 'named',
  amd: {id: '@angular/common/router'},
  moduleName: 'ng.common.router',
  external: Object.keys(globals),
  globals: globals
};
