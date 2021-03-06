/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InterpolationConfig, ParseSourceFile} from '@angular/compiler';
import {ParseTemplateOptions} from '@angular/compiler/src/render3/view/template';
import * as ts from 'typescript';

/**
 * Describes the kind of identifier found in a template.
 */
export enum IdentifierKind {
  Property,
  Method,
}

/**
 * Describes the absolute byte offsets of a text anchor in a source code.
 */
export class AbsoluteSourceSpan {
  constructor(public start: number, public end: number) {}
}

/**
 * Describes a semantically-interesting identifier in a template, such as an interpolated variable
 * or selector.
 */
export interface TemplateIdentifier {
  name: string;
  span: AbsoluteSourceSpan;
  kind: IdentifierKind;
  file: ParseSourceFile;
}

/**
 * Describes an analyzed, indexed component and its template.
 */
export interface IndexedComponent {
  name: string;
  selector: string|null;
  sourceFile: string;
  content: string;
  template: {
    identifiers: Set<TemplateIdentifier>,
    usedComponents: Set<ts.ClassDeclaration>,
  };
}

/**
 * Options for restoring a parsed template. See `template.ts#restoreTemplate`.
 */
export interface RestoreTemplateOptions extends ParseTemplateOptions {
  /**
   * The interpolation configuration of the template is lost after it already
   * parsed, so it must be respecified.
   */
  interpolationConfig: InterpolationConfig;
}
