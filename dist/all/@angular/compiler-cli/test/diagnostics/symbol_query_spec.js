"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_cli_1 = require("@angular/compiler-cli");
var ts = require("typescript");
var typescript_symbols_1 = require("../../src/diagnostics/typescript_symbols");
var mocks_1 = require("./mocks");
function emptyPipes() {
    return {
        size: 0,
        get: function (key) { return undefined; },
        has: function (key) { return false; },
        values: function () { return []; }
    };
}
describe('symbol query', function () {
    var program;
    var checker;
    var sourceFile;
    var query;
    var context;
    beforeEach(function () {
        var registry = ts.createDocumentRegistry(false, '/src');
        var host = new mocks_1.MockLanguageServiceHost(['/quickstart/app/app.component.ts'], QUICKSTART, '/quickstart');
        var service = ts.createLanguageService(host, registry);
        program = service.getProgram();
        checker = program.getTypeChecker();
        sourceFile = program.getSourceFile('/quickstart/app/app.component.ts');
        var options = Object.create(host.getCompilationSettings());
        options.genDir = '/dist';
        options.basePath = '/quickstart';
        var aotHost = new compiler_cli_1.CompilerHost(program, options, host, { verboseInvalidExpression: true });
        context = new mocks_1.DiagnosticContext(service, program, checker, aotHost);
        query = typescript_symbols_1.getSymbolQuery(program, checker, sourceFile, emptyPipes);
    });
    it('should be able to get undefined for an unknown symbol', function () {
        var unknownType = context.getStaticSymbol('/unkonwn/file.ts', 'UnknownType');
        var symbol = query.getTypeSymbol(unknownType);
        expect(symbol).toBeUndefined();
    });
});
function appComponentSource(template) {
    return "\n    import {Component} from '@angular/core';\n\n    export interface Person {\n      name: string;\n      address: Address;\n    }\n\n    export interface Address {\n      street: string;\n      city: string;\n      state: string;\n      zip: string;\n    }\n\n    @Component({\n      template: '" + template + "'\n    })\n    export class AppComponent {\n      name = 'Angular';\n      person: Person;\n      people: Person[];\n      maybePerson?: Person;\n\n      getName(): string { return this.name; }\n      getPerson(): Person { return this.person; }\n      getMaybePerson(): Person | undefined { this.maybePerson; }\n    }\n  ";
}
var QUICKSTART = {
    quickstart: {
        app: {
            'app.component.ts': appComponentSource('<h1>Hello {{name}}</h1>'),
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { toString }      from './utils';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sX3F1ZXJ5X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9kaWFnbm9zdGljcy9zeW1ib2xfcXVlcnlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHNEQUEyRTtBQUUzRSwrQkFBaUM7QUFHakMsK0VBQXdFO0FBR3hFLGlDQUFtRTtBQUVuRTtJQUNFLE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRSxDQUFDO1FBQ1AsR0FBRyxZQUFDLEdBQVcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN0QyxHQUFHLFlBQUMsR0FBVyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sRUFBTixjQUFtQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztLQUMvQixDQUFDO0FBQ0osQ0FBQztBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkIsSUFBSSxPQUFtQixDQUFDO0lBQ3hCLElBQUksT0FBdUIsQ0FBQztJQUM1QixJQUFJLFVBQXlCLENBQUM7SUFDOUIsSUFBSSxLQUFrQixDQUFDO0lBQ3ZCLElBQUksT0FBMEIsQ0FBQztJQUMvQixVQUFVLENBQUM7UUFDVCxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFELElBQU0sSUFBSSxHQUFHLElBQUksK0JBQXVCLENBQ3BDLENBQUMsa0NBQWtDLENBQUMsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckUsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9CLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUN2RSxJQUFNLE9BQU8sR0FBMkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDO1FBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksMkJBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFDLHdCQUF3QixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDM0YsT0FBTyxHQUFHLElBQUkseUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEUsS0FBSyxHQUFHLG1DQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUU7UUFDMUQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvRSxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsNEJBQTRCLFFBQWdCO0lBQzFDLE1BQU0sQ0FBQywrU0FnQlUsUUFBUSxzVUFZeEIsQ0FBQztBQUNKLENBQUM7QUFFRCxJQUFNLFVBQVUsR0FBYztJQUM1QixVQUFVLEVBQUU7UUFDVixHQUFHLEVBQUU7WUFDSCxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUNqRSxlQUFlLEVBQUUsNFVBV2hCO1NBQ0Y7S0FDRjtDQUNGLENBQUMifQ==