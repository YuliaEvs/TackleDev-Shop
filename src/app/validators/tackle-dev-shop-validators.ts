import { FormControl, ValidationErrors } from "@angular/forms";

export class TackleDevShopValidators {

    // Whitespace Validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null {
        
        // Check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {
            
            // Invalid return error object
            return { 'notOnlyWhitespace' : true };
        }
        else {
            return null;
        }
        
    }
}
