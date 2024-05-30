import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../registration.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

export class RegistrationComponent implements OnInit {
  governates: any[] = []
  form: FormGroup;
  addresses: FormArray;
  cities: any[][] = []
  formHasErrors = false;
  submitted = false;

  constructor(private registrationService: RegistrationService, private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]*$/)]],
      middleName: ['', [Validators.maxLength(40), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]*$/)]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]*$/)]],
      birthDate: ['', [Validators.required, this.ageValidator(20)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+\d{12}$/)]],
      email: ['', [Validators.required, Validators.email]],
      addresses: this.fb.array([this.createAddress()])
    });
    this.addresses = this.form.get('addresses') as FormArray
  }

  ngOnInit(): void {
    this.registrationService.getGovernates().subscribe({
      next: (data) => {
        this.governates = data;
        console.log(this.governates);
      }
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      governate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      buildingNumber: ['', [Validators.required]],
      flatNumber: ['', [Validators.required]]
    });
  }
  
  removeAddress(index: number): void {
    if (this.addresses.length == 1) {
      alert("must be at least one address")
    }
    else {
      this.addresses.removeAt(index);
    }
  }

  addAddress(): void {
    this.addresses.push(this.createAddress());
  }
  
  get Form(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.formHasErrors = true;
      this.form.markAllAsTouched();
    }
    else {
      this.registrationService.createUser(this.form.value).subscribe({
        next: (data) => {
          console.log(data)
        }
      })
      this.submitted = true;
    }
  }

  onGovChange(e: any, i: number) {
    this.registrationService.getCities(e.target.value).subscribe({
      next: (data) => {
        this.cities[i] = data;
      }
    })

  }
  ageValidator(minAge: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // handled by Required Validator
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= minAge ? null : { ageInvalid: true };
    };
  }
}




