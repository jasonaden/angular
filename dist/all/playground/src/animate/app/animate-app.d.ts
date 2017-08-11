export declare class AnimateApp {
    items: number[];
    private _state;
    bgStatus: string;
    remove(item: number): void;
    reorderAndRemove(): void;
    bgStatusChanged(data: {
        [key: string]: string;
    }, phase: string): void;
    state: "start" | "active" | "void" | "default";
}
