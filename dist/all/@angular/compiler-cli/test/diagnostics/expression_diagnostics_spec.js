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
var expression_diagnostics_1 = require("../../src/diagnostics/expression_diagnostics");
var mocks_1 = require("./mocks");
describe('expression diagnostics', function () {
    var registry;
    var host;
    var service;
    var context;
    var aotHost;
    var type;
    beforeAll(function () {
        registry = ts.createDocumentRegistry(false, '/src');
        host = new mocks_1.MockLanguageServiceHost(['app/app.component.ts'], FILES, '/src');
        service = ts.createLanguageService(host, registry);
        var program = service.getProgram();
        var checker = program.getTypeChecker();
        var options = Object.create(host.getCompilationSettings());
        options.genDir = '/dist';
        options.basePath = '/src';
        aotHost = new compiler_cli_1.CompilerHost(program, options, host, { verboseInvalidExpression: true });
        context = new mocks_1.DiagnosticContext(service, program, checker, aotHost);
        type = context.getStaticSymbol('app/app.component.ts', 'AppComponent');
    });
    it('should have no diagnostics in default app', function () {
        function messageToString(messageText) {
            if (typeof messageText == 'string') {
                return messageText;
            }
            else {
                if (messageText.next)
                    return messageText.messageText + messageToString(messageText.next);
                return messageText.messageText;
            }
        }
        function expectNoDiagnostics(diagnostics) {
            if (diagnostics && diagnostics.length) {
                var message = 'messags: ' + diagnostics.map(function (d) { return messageToString(d.messageText); }).join('\n');
                expect(message).toEqual('');
            }
        }
        expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        expectNoDiagnostics(service.getSyntacticDiagnostics('app/app.component.ts'));
        expectNoDiagnostics(service.getSemanticDiagnostics('app/app.component.ts'));
    });
    function accept(template) {
        var info = mocks_1.getDiagnosticTemplateInfo(context, type, 'app/app.component.html', template);
        if (info) {
            var diagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics(info);
            if (diagnostics && diagnostics.length) {
                var message = diagnostics.map(function (d) { return d.message; }).join('\n  ');
                throw new Error("Unexpected diagnostics: " + message);
            }
        }
        else {
            expect(info).toBeDefined();
        }
    }
    function reject(template, expected) {
        var info = mocks_1.getDiagnosticTemplateInfo(context, type, 'app/app.component.html', template);
        if (info) {
            var diagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics(info);
            if (diagnostics && diagnostics.length) {
                var messages = diagnostics.map(function (d) { return d.message; }).join('\n  ');
                expect(messages).toContain(expected);
            }
            else {
                throw new Error("Expected an error containing \"" + expected + " in template \"" + template + "\"");
            }
        }
        else {
            expect(info).toBeDefined();
        }
    }
    it('should accept a simple template', function () { return accept('App works!'); });
    it('should accept an interpolation', function () { return accept('App works: {{person.name.first}}'); });
    it('should reject misspelled access', function () { return reject('{{persson}}', 'Identifier \'persson\' is not defined'); });
    it('should reject access to private', function () {
        return reject('{{private_person}}', 'Identifier \'private_person\' refers to a private member');
    });
    it('should accept an *ngIf', function () { return accept('<div *ngIf="person">{{person.name.first}}</div>'); });
    it('should reject *ngIf of misspelled identifier', function () { return reject('<div *ngIf="persson">{{person.name.first}}</div>', 'Identifier \'persson\' is not defined'); });
    it('should accept an *ngFor', function () { return accept("\n      <div *ngFor=\"let p of people\">\n        {{p.name.first}} {{p.name.last}}\n      </div>\n    "); });
    it('should reject misspelled field in *ngFor', function () { return reject("\n      <div *ngFor=\"let p of people\">\n        {{p.names.first}} {{p.name.last}}\n      </div>\n    ", 'Identifier \'names\' is not defined'); });
    it('should accept an async expression', function () { return accept('{{(promised_person | async)?.name.first || ""}}'); });
    it('should reject an async misspelled field', function () { return reject('{{(promised_person | async)?.nume.first || ""}}', 'Identifier \'nume\' is not defined'); });
    it('should accept an async *ngFor', function () { return accept("\n      <div *ngFor=\"let p of promised_people | async\">\n        {{p.name.first}} {{p.name.last}}\n      </div>\n    "); });
    it('should reject misspelled field an async *ngFor', function () { return reject("\n      <div *ngFor=\"let p of promised_people | async\">\n        {{p.name.first}} {{p.nume.last}}\n      </div>\n    ", 'Identifier \'nume\' is not defined'); });
    it('should reject access to potentially undefined field', function () { return reject("<div>{{maybe_person.name.first}}", 'The expression might be null'); });
    it('should accept a safe accss to an undefined field', function () { return accept("<div>{{maybe_person?.name.first}}</div>"); });
    it('should accept a type assert to an undefined field', function () { return accept("<div>{{maybe_person!.name.first}}</div>"); });
    it('should accept a # reference', function () { return accept("\n          <form #f=\"ngForm\" novalidate>\n            <input name=\"first\" ngModel required #first=\"ngModel\">\n            <input name=\"last\" ngModel>\n            <button>Submit</button>\n          </form>\n          <p>First name value: {{ first.value }}</p>\n          <p>First name valid: {{ first.valid }}</p>\n          <p>Form value: {{ f.value | json }}</p>\n          <p>Form valid: {{ f.valid }}</p>\n    "); });
    it('should reject a misspelled field of a # reference', function () { return reject("\n          <form #f=\"ngForm\" novalidate>\n            <input name=\"first\" ngModel required #first=\"ngModel\">\n            <input name=\"last\" ngModel>\n            <button>Submit</button>\n          </form>\n          <p>First name value: {{ first.valwe }}</p>\n          <p>First name valid: {{ first.valid }}</p>\n          <p>Form value: {{ f.value | json }}</p>\n          <p>Form valid: {{ f.valid }}</p>\n    ", 'Identifier \'valwe\' is not defined'); });
    it('should accept a call to a method', function () { return accept('{{getPerson().name.first}}'); });
    it('should reject a misspelled field of a method result', function () { return reject('{{getPerson().nume.first}}', 'Identifier \'nume\' is not defined'); });
    it('should reject calling a uncallable member', function () { return reject('{{person().name.first}}', 'Member \'person\' is not callable'); });
    it('should accept an event handler', function () { return accept('<div (click)="click($event)">{{person.name.first}}</div>'); });
    it('should reject a misspelled event handler', function () { return reject('<div (click)="clack($event)">{{person.name.first}}</div>', 'Unknown method \'clack\''); });
    it('should reject an uncalled event handler', function () { return reject('<div (click)="click">{{person.name.first}}</div>', 'Unexpected callable expression'); });
    describe('with comparisions between nullable and non-nullable', function () {
        it('should accept ==', function () { return accept("<div>{{e == 1 ? 'a' : 'b'}}</div>"); });
        it('should accept ===', function () { return accept("<div>{{e === 1 ? 'a' : 'b'}}</div>"); });
        it('should accept !=', function () { return accept("<div>{{e != 1 ? 'a' : 'b'}}</div>"); });
        it('should accept !==', function () { return accept("<div>{{e !== 1 ? 'a' : 'b'}}</div>"); });
        it('should accept &&', function () { return accept("<div>{{e && 1 ? 'a' : 'b'}}</div>"); });
        it('should accept ||', function () { return accept("<div>{{e || 1 ? 'a' : 'b'}}</div>"); });
        it('should reject >', function () { return reject("<div>{{e > 1 ? 'a' : 'b'}}</div>", 'The expression might be null'); });
    });
});
var FILES = {
    'src': {
        'app': {
            'app.component.ts': "\n        import { Component, NgModule } from '@angular/core';\n        import { CommonModule } from '@angular/common';\n        import { FormsModule } from '@angular/forms';\n\n        export interface Person {\n          name: Name;\n          address: Address;\n        }\n\n        export interface Name {\n          first: string;\n          middle: string;\n          last: string;\n        }\n\n        export interface Address {\n          street: string;\n          city: string;\n          state: string;\n          zip: string;\n        }\n\n        @Component({\n          selector: 'my-app',\n          templateUrl: './app.component.html'\n        })\n        export class AppComponent {\n          person: Person;\n          people: Person[];\n          maybe_person?: Person;\n          promised_person: Promise<Person>;\n          promised_people: Promise<Person[]>;\n          private private_person: Person;\n          private private_people: Person[];\n          e?: number;\n\n          getPerson(): Person { return this.person; }\n          click() {}\n        }\n\n        @NgModule({\n          imports: [CommonModule, FormsModule],\n          declarations: [AppComponent]\n        })\n        export class AppModule {}\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9kaWFnbm9zdGljc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvZGlhZ25vc3RpY3MvZXhwcmVzc2lvbl9kaWFnbm9zdGljc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsc0RBQTJFO0FBQzNFLCtCQUFpQztBQUVqQyx1RkFBd0g7QUFHeEgsaUNBQThGO0FBRTlGLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtJQUNqQyxJQUFJLFFBQTZCLENBQUM7SUFDbEMsSUFBSSxJQUE2QixDQUFDO0lBQ2xDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLE9BQTBCLENBQUM7SUFDL0IsSUFBSSxPQUFxQixDQUFDO0lBQzFCLElBQUksSUFBa0IsQ0FBQztJQUV2QixTQUFTLENBQUM7UUFDUixRQUFRLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLEdBQUcsSUFBSSwrQkFBdUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsSUFBTSxPQUFPLEdBQTJCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUNyRixPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN6QixPQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMxQixPQUFPLEdBQUcsSUFB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