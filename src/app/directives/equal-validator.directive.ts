import { Directive, Attribute  } from '@angular/core';
import { Validator,  NG_VALIDATORS ,  AbstractControl} from '@angular/forms';

@Directive({
  selector: '[advs-compare]',
  providers: [{provide: NG_VALIDATORS, useExisting: EqualValidatorDirective, multi: true}]
})
export class EqualValidatorDirective implements Validator {

  constructor(@Attribute('advs-compare') public comparer: string,
              @Attribute('parent') public parent: string){}

  validate(c: AbstractControl): {[key: string]: any} {
    let e = c.root.get(this.comparer);

    // value not equal in verify control
    if (e && c.value !== e.value && !this.isParent) {
      return {"compare": true};
    }

    // user typing in password and match
    if (e && c.value === e.value && this.isParent) {
        delete e.errors['compare'];
        if (!Object.keys(e.errors).length) e.setErrors(null);
    }

    // user typing in password and mismatch
    if (e && c.value !== e.value && this.isParent) {
        e.setErrors({ "compare": true });
    }
  }

  private get isParent() {
    if (!this.parent) 
      return false;

    return this.parent === 'true' ? true: false;
  }
}  