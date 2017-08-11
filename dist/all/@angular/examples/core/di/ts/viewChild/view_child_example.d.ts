export declare class Pane {
    id: string;
}
export declare class ViewChildComp {
    pane: Pane;
    selectedPane: string;
    shouldShow: boolean;
    toggle(): void;
}
