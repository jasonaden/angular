/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgLocalization } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
export declare class I18nComponent {
    count: number;
    sex: string;
    sexB: string;
    response: any;
}
export declare class FrLocalization extends NgLocalization {
    static PROVIDE: {
        provide: typeof NgLocalization;
        useClass: typeof FrLocalization;
        deps: never[];
    };
    getPluralCategory(value: number): string;
}
export declare function validateHtml(tb: ComponentFixture<I18nComponent>, cmp: I18nComponent, el: DebugElement): void;
export declare const HTML: string;
