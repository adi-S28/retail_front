import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges,OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PromotionService } from '../../services/promotion.service';
import { MessageService } from 'primeng/api';
import {Promotion} from '../../models/promotion.model'



@Component({
  selector: 'app-promotion-form',
  imports: [CommonModule, CardModule, ButtonModule, ReactiveFormsModule, InputTextModule, DatePickerModule, SelectModule, InputNumberModule],
  providers: [MessageService],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.css',
})
export class PromotionForm implements OnChanges{
@Input() promotion:any;
@Output() saved = new EventEmitter<void>();

  promotionForm!:FormGroup;
  isEditMode=false;

  constructor(private fb:FormBuilder, private promotionService:PromotionService, private messageService:MessageService){


  this.promotionForm = this.fb.group({
    name:['',Validators.required],
    discountType:['',Validators.required],
    discountValue:[0,Validators.required],
    applicationScope:['',Validators.required],
    startDate:[null,Validators.required],
    endDate:[null,Validators.required],
    promotionStatus:['',Validators.required]
  });

  }

  discountTypes=[
    {label:'Percentage',value:'PERCENTAGE'},
    {label:'Fixed Amount',value:'FIXED_AMOUNT'},
    {label:'BOGO',value:'BOGO'}
  ];
  
  applicationScopes=[
    {label:'Product',value:'PRODUCT'},
    {label:'Category',value:'CATEGORY'},
    {label:'Cart',value:'CART'}
  ];

  statuses=[
    {label:'Active',value:'ACTIVE'},
    {label:'Expired',value:'EXPIRED'},
    {label:'Scheduled',value:'SCHEDULED'}
  ];

  save() {
  if (this.promotionForm.invalid) {
    return;
  }
  const promotion = this.promotionForm.value as Promotion;
  const request = this.isEditMode
    ? this.promotionService.update(
        this.promotion!.promotionId,
        promotion
      )
    : this.promotionService.create(promotion);
  request.subscribe({
    next: (response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.isEditMode
          ? 'Promotion updated successfully'
          : 'Promotion created successfully'
      });
      this.promotionForm.reset();
      this.isEditMode = false;
      this.saved.emit();
    },
    error: (err) => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Operation failed'
      });
    }
  });
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promotion']){
      if(this.promotion){
      this.isEditMode=true;
      this.promotionForm.patchValue(this.promotion);
      }else{
      this.isEditMode=false;
      this.promotionForm.reset({
        name:'',
        discountType:'',
        discountValue:0,
        applicationScope:'',
        startDate:null,
        endDate:null,
        promotionStatus:''
      })
      }
    }
  }

    loadPromotions(){
      this.promotionService.getAll().subscribe(data=>{
        this.promotion.data;
      });
    }
}
