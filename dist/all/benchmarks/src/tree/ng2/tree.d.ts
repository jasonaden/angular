import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TreeNode } from '../util';
export declare class TreeComponent {
    data: TreeNode;
    readonly bgColor: SafeStyle;
}
export declare class AppModule {
    constructor(sanitizer: DomSanitizer);
}
