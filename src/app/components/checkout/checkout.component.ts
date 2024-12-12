import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TackleDevShopFromService } from '../../services/tackleDevShopFrom.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { TackleDevShopValidators } from '../../validators/tackle-dev-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  isBillingAddressSame = false; // Track if the billing address is the same as shipping

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tackleDevFormService: TackleDevShopFromService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        city: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        state: new FormControl ('', [Validators.required]),
        country: new FormControl ('', [Validators.required]),
        zipCode: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        city: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        state: new FormControl ('', [Validators.required]),
        country: new FormControl ('', [Validators.required]),
        zipCode: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace])
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl ('', [Validators.required]),
        nameOnCard: new FormControl ('', [Validators.required, Validators.minLength(2), TackleDevShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl ('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl ('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required]
      }),

    });

    // Populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);

    this.tackleDevFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // Populate credit card years

    this.tackleDevFormService.getCreditCardYears().subscribe(
      data => {
        // console.log("Retrived credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.tackleDevFormService.getCountries().subscribe(
      data => {
        // console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
 
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingToBillingAddress(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit(): void {

    if (this.checkoutFormGroup.invalid) {
      // console.log('Form Submitted!', this.checkoutFormGroup.value);
      this.checkoutFormGroup.markAllAsTouched();

    }

    // console.log("Handling the submit button");
    // console.log(this.checkoutFormGroup.get('customer')?.value);
    // console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
    // console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.shippingAddress);
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // If the current year equals the selected year, then start with the current month
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.tackleDevFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  setStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    // console.log(`${formGroupName} country code: ${countryCode}`);
    // console.log(`${formGroupName} country name: ${countryName}`);

    this.tackleDevFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.code;

    // console.log(`{formGroupName} counttry code: ${countryCode}`);
    // console.log(`{formGroupName} counttry name: ${countryName}`);

    this.tackleDevFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
      }
    );

  }

}
