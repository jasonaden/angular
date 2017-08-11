export declare class KeyModel {
    key: number;
    constructor(key: number);
}
export declare class Todo extends KeyModel {
    title: string;
    completed: boolean;
    editTitle: string;
    constructor(key: number, title: string, completed: boolean);
}
export declare class TodoFactory {
    private _uid;
    nextUid(): number;
    create(title: string, isCompleted: boolean): Todo;
}
export declare class Store<T extends KeyModel> {
    list: T[];
    add(record: T): void;
    remove(record: T): void;
    removeBy(callback: (record: T) => boolean): void;
}
