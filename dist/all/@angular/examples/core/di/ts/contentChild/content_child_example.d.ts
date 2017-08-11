export declare class Pane {
    id: string;
}
export declare class Tab {
    pane: Pane;
}
export declare class ContentChildComp {
    shouldShow: boolean;
    toggle(): void;
}
