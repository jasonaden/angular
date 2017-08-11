import { Message } from '@angular/compiler/src/i18n/i18n_ast';
export declare function main(): void;
export declare function _humanizeMessages(html: string, implicitTags?: string[], implicitAttrs?: {
    [k: string]: string[];
}): [string[], string, string][];
export declare function _extractMessages(html: string, implicitTags?: string[], implicitAttrs?: {
    [k: string]: string[];
}): Message[];
