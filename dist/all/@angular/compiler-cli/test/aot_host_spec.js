"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var compiler_host_1 = require("../src/compiler_host");
var mocks_1 = require("./mocks");
describe('CompilerHost', function () {
    var context;
    var program;
    var hostNestedGenDir;
    var hostSiblingGenDir;
    beforeEach(function () {
        context = new mocks_1.MockAotContext('/tmp/src', clone(FILES));
        var host = new mocks_1.MockCompilerHost(context);
        program = ts.createProgram(['main.ts'], {
            module: ts.ModuleKind.CommonJS,
        }, host);
        // Force a typecheck
        var errors = program.getSemanticDiagnostics();
        if (errors && errors.length) {
            throw new Error('Expected no errors');
        }
        hostNestedGenDir = new compiler_host_1.CompilerHost(program, {
            genDir: '/tmp/project/src/gen/',
            basePath: '/tmp/project/src',
            skipMetadataEmit: false,
            strictMetadataEmit: false,
            skipTemplateCodegen: false,
            trace: false
        }, context);
        hostSiblingGenDir = new compiler_host_1.CompilerHost(program, {
            genDir: '/tmp/project/gen',
            basePath: '/tmp/project/src/',
            skipMetadataEmit: false,
            strictMetadataEmit: false,
            skipTemplateCodegen: false,
            trace: false
        }, context);
    });
    describe('nestedGenDir', function () {
        it('should import node_module from factory', function () {
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/node_modules/@angular/core.d.ts', '/tmp/project/src/gen/my.ngfactory.ts'))
                .toEqual('@angular/core');
        });
        it('should import factory from factory', function () {
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/my.other.ngfactory.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./my.other.ngfactory');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/my.other.css.ngstyle.ts', '/tmp/project/src/a/my.ngfactory.ts'))
                .toEqual('../my.other.css.ngstyle');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.shim.ngstyle.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./a/my.other.shim.ngstyle');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/my.other.sass.ngstyle.ts', '/tmp/project/src/a/my.ngfactory.ts'))
                .toEqual('../my.other.sass.ngstyle');
        });
        it('should import application from factory', function () {
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/my.other.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('../my.other');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/my.other.ts', '/tmp/project/src/a/my.ngfactory.ts'))
                .toEqual('../../my.other');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('../a/my.other');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.css.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('../a/my.other.css');
            expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.css.shim.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('../a/my.other.css.shim');
        });
    });
    describe('siblingGenDir', function () {
        it('should import node_module from factory', function () {
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/node_modules/@angular/core.d.ts', '/tmp/project/src/gen/my.ngfactory.ts'))
                .toEqual('@angular/core');
        });
        it('should import factory from factory', function () {
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/my.other.ngfactory.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./my.other.ngfactory');
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/my.other.css.ts', '/tmp/project/src/a/my.ngfactory.ts'))
                .toEqual('../my.other.css');
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.css.shim.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./a/my.other.css.shim');
        });
        it('should import application from factory', function () {
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/my.other.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./my.other');
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/my.other.ts', '/tmp/project/src/a/my.ngfactory.ts'))
                .toEqual('../my.other');
            expect(hostSiblingGenDir.fileNameToModuleName('/tmp/project/src/a/my.other.ts', '/tmp/project/src/my.ngfactory.ts'))
                .toEqual('./a/my.other');
        });
    });
    it('should be able to produce an import from main @angular/core', function () {
        expect(hostNestedGenDir.fileNameToModuleName('/tmp/project/node_modules/@angular/core.d.ts', '/tmp/project/src/main.ts'))
            .toEqual('@angular/core');
    });
    it('should be able to produce an import to a shallow import', function () {
        expect(hostNestedGenDir.fileNameToModuleName('@angular/core', '/tmp/project/src/main.ts'))
            .toEqual('@angular/core');
        expect(hostNestedGenDir.fileNameToModuleName('@angular/upgrade/static', '/tmp/project/src/main.ts'))
            .toEqual('@angular/upgrade/static');
        expect(hostNestedGenDir.fileNameToModuleName('myLibrary', '/tmp/project/src/main.ts'))
            .toEqual('myLibrary');
        expect(hostNestedGenDir.fileNameToModuleName('lib23-43', '/tmp/project/src/main.ts'))
            .toEqual('lib23-43');
    });
    it('should be able to produce an import from main to a sub-directory', function () {
        expect(hostNestedGenDir.fileNameToModuleName('lib/utils.ts', 'main.ts')).toEqual('./lib/utils');
    });
    it('should be able to produce an import from to a peer file', function () {
        expect(hostNestedGenDir.fileNameToModuleName('lib/collections.ts', 'lib/utils.ts'))
            .toEqual('./collections');
    });
    it('should be able to produce an import from to a sibling directory', function () {
        expect(hostNestedGenDir.fileNameToModuleName('lib/utils.ts', 'lib2/utils2.ts'))
            .toEqual('../lib/utils');
    });
    it('should be able to read a metadata file', function () {
        expect(hostNestedGenDir.getMetadataFor('node_modules/@angular/core.d.ts')).toEqual([
            { __symbolic: 'module', version: 3, metadata: { foo: { __symbolic: 'class' } } }
        ]);
    });
    it('should be able to read metadata from an otherwise unused .d.ts file ', function () {
        expect(hostNestedGenDir.getMetadataFor('node_modules/@angular/unused.d.ts')).toEqual([
            dummyMetadata
        ]);
    });
    it('should be able to read empty metadata ', function () {
        expect(hostNestedGenDir.getMetadataFor('node_modules/@angular/empty.d.ts')).toEqual([]);
    });
    it('should return undefined for missing modules', function () {
        expect(hostNestedGenDir.getMetadataFor('node_modules/@angular/missing.d.ts')).toBeUndefined();
    });
    it('should add missing v3 metadata from v1 metadata and .d.ts files', function () {
        expect(hostNestedGenDir.getMetadataFor('metadata_versions/v1.d.ts')).toEqual([
            { __symbolic: 'module', version: 1, metadata: { foo: { __symbolic: 'class' } } }, {
                __symbolic: 'module',
                version: 3,
                metadata: {
                    foo: { __symbolic: 'class' },
                    Bar: { __symbolic: 'class', members: { ngOnInit: [{ __symbolic: 'method' }] } },
                    BarChild: { __symbolic: 'class', extends: { __symbolic: 'reference', name: 'Bar' } },
                    ReExport: { __symbolic: 'reference', module: './lib/utils2', name: 'ReExport' },
                },
                exports: [{ from: './lib/utils2', export: ['Export'] }],
            }
        ]);
    });
    it('should upgrade a missing metadata file into v3', function () {
        expect(hostNestedGenDir.getMetadataFor('metadata_versions/v1_empty.d.ts')).toEqual([
            { __symbolic: 'module', version: 3, metadata: {}, exports: [{ from: './lib/utils' }] }
        ]);
    });
});
var dummyModule = 'export let foo: any[];';
var dummyMetadata = {
    __symbolic: 'module',
    version: 3,
    metadata: { foo: { __symbolic: 'error', message: 'Variable not initialized', line: 0, character: 11 } }
};
var FILES = {
    'tmp': {
        'src': {
            'main.ts': "\n        import * as c from '@angular/core';\n        import * as r from '@angular/router';\n        import * as u from './lib/utils';\n        import * as cs from './lib/collections';\n        import * as u2 from './lib2/utils2';\n      ",
            'lib': {
                'utils.ts': dummyModule,
                'collections.ts': dummyModule,
            },
            'lib2': { 'utils2.ts': dummyModule },
            'node_modules': {
                '@angular': {
                    'core.d.ts': dummyModule,
                    'core.metadata.json': "{\"__symbolic\":\"module\", \"version\": 3, \"metadata\": {\"foo\": {\"__symbolic\": \"class\"}}}",
                    'router': { 'index.d.ts': dummyModule, 'src': { 'providers.d.ts': dummyModule } },
                    'unused.d.ts': dummyModule,
                    'empty.d.ts': 'export declare var a: string;',
                    'empty.metadata.json': '[]',
                }
            },
            'metadata_versions': {
                'v1.d.ts': "\n          import {ReExport} from './lib/utils2';\n          export {ReExport};\n\n          export {Export} from './lib/utils2';\n\n          export declare class Bar {\n            ngOnInit() {}\n          }\n          export declare class BarChild extends Bar {}\n        ",
                'v1.metadata.json': "{\"__symbolic\":\"module\", \"version\": 1, \"metadata\": {\"foo\": {\"__symbolic\": \"class\"}}}",
                'v1_empty.d.ts': "\n          export * from './lib/utils';\n        "
            }
        }
    }
};
function clone(entry) {
    if (typeof entry === 'string') {
        return entry;
    }
    else {
        var result = {};
        for (var name_1 in entry) {
            result[name_1] = clone(entry[name_1]);
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW90X2hvc3Rfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L2FvdF9ob3N0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwrQkFBaUM7QUFFakMsc0RBQWtEO0FBRWxELGlDQUEyRTtBQUUzRSxRQUFRLENBQUMsY0FBYyxFQUFFO0lBQ3ZCLElBQUksT0FBdUIsQ0FBQztJQUM1QixJQUFJLE9BQW1CLENBQUM7SUFDeEIsSUFBSSxnQkFBOEIsQ0FBQztJQUNuQyxJQUFJLGlCQUErQixDQUFDO0lBRXBDLFVBQVUsQ0FBQztRQUNULE9BQU8sR0FBRyxJQUFJLHNCQUFjLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sSUFBSSxHQUFHLElBQUksd0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQ3RCLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDWCxNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1NBQy9CLEVBQ0QsSUFBSSxDQUFDLENBQUM7UUFDVixvQkFBb0I7UUFDcEIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsZ0JBQWdCLEdBQUcsSUFBSSw0QkFBWSxDQUMvQixPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixrQkFBa0IsRUFBRSxLQUFLO1lBQ3pC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