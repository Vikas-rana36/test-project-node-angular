import { FormGroup } from '@angular/forms';

export class CustomValidators {

  static passwordMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
       
        if(matchingControl.value){
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ notMatched: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }
  }

}