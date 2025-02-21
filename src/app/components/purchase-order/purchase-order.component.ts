import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-order',
  standalone: false,
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent implements OnInit {

    // inject() -> @Autowire
    private fb = inject(FormBuilder)

    protected poForm!: FormGroup

    get purchaseItems(): FormArray {
      return this.poForm.get('purchaseItems') as FormArray;
    }
    
  ngOnInit(): void {
    this.poForm=this.createForm()
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      deliveryDate: ['', Validators.required],
      availability: this.fb.array([]), 
      urgent: [false],
      purchaseItems: this.fb.array([])
    });
  }

  onAvailabilityChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const availabilityArray = this.poForm.get('availability') as FormArray;
  
    if (checkbox.checked) {
      availabilityArray.push(this.fb.control(checkbox.value));
    } else {
      const index = availabilityArray.controls.findIndex(ctrl => ctrl.value === checkbox.value);
      if (index !== -1) {
        availabilityArray.removeAt(index);
      }
    }
  }

  private createPurchaseItems(): FormGroup {
    return this.fb.group({
      itemName: this.fb.control<string>(''),
      quantity: this.fb.control<number>(0, [Validators.required,Validators.min(1)]),
      unitPrice: this.fb.control<number>(0.0, [Validators.min(0.01)])
    })
  }

  protected addPurchaseItems() {
    // Create the purchaseItems form group
    const col = this.createPurchaseItems()
    // Add to form array
    this.purchaseItems.push(col)
  }

  protected removePurchaseItems(idx: number) {
    this.purchaseItems.removeAt(idx)
  }

  protected invalid(): boolean {
    return this.poForm.invalid || this.purchaseItems.controls.length <= 0
  }

  protected isUrgent():boolean{     // check if urgent is true then disable the availiability checkboxes
    return this.poForm.get('urgent')?.value
  }

  protected processForm(): void {     // Used in submit button
    if (this.poForm.invalid) {
      this.poForm.markAllAsTouched();
      console.warn('Form is invalid');
      return;
    }
    console.info('>>> Form submitted:', this.poForm.value);
  }

}
