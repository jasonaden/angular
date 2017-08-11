import { FormArray, FormGroup } from '@angular/forms';
export declare class NestedFormArray {
    form: FormGroup;
    readonly cities: FormArray;
    addCity(): void;
    onSubmit(): void;
    setPreset(): void;
}
