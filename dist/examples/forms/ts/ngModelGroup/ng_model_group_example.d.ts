import { NgForm } from '@angular/forms';
export declare class NgModelGroupComp {
    name: {
        first: string;
        last: string;
    };
    onSubmit(f: NgForm): void;
    setValue(): void;
}
