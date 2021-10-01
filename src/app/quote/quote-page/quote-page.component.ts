import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { QuoteModel } from './quoteModel';
import { getLocaleTimeFormat } from '@angular/common';
import Swal from 'sweetalert2';
import { addQuoteModel } from './addQuoteModel';
@Component({
  selector: 'app-quote-page',
  templateUrl: './quote-page.component.html',
  styleUrls: ['./quote-page.component.css'],
})
export class QuotePageComponent implements OnInit {
  test: any;
  item: any;
  unit: number = 0;
  rate: number = 0;
  amount: any;
  required!: Boolean;

  quotes: any;
  viewQte: any;
  clients: any;
  vehicle: any;
  clientVehicles: any;
  isQuoteCreated: boolean = false;
  quoteData: any;
  row: any;
  quoteModelObj: QuoteModel = new QuoteModel();
  addQuoteTypeForm!: FormGroup;
  sum: number = 0;
  editID: any;
  api: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  hidden: boolean = false;
  isPending: any;
  quoteHistory: [] | undefined;
  buttonText: String = 'Add service';
  totalAmount: number = 0;
  selectedClient: any;
  selectedVehicle: any;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addQuoteTypeForm = this.fb.group({
      clientId: new FormControl('', [Validators.required]),

      vehicleId: new FormControl('', [Validators.required]),

      items: this.fb.array([
        this.fb.group({
          item: new FormControl('', Validators.required),
          unit: new FormControl('', Validators.required),
          rate: new FormControl('', Validators.required),
        }),
      ]),
    });

    this.getQuote();
    this.getAllClients();
    this.getAllVehicles();
    this.getAllServices();

    // this.getAllQuote();

    this.addQuoteTypeForm.statusChanges.subscribe((data: any) => {
      // console.log(data);
    });

    this.quoteData = [];
    this.checkAddButton();
  }

  goToInvoice(row: any) {
    this.router.navigate(['/invoice'], {
      state: { data: row },
    });
  }

  viewQuote(row: any) {
    this.router.navigate(['/view-quote'], {
      state: { data: row },
    });
  }

  onUnitChange(event: any) {
    this.sum = event.target.value;
    // console.log(event.target.value)
  }

  getQuote() {
    this.apiServices.getQuotes().subscribe(
      (data: any) => {
        let response = data.payload;
        let responses = response.sort((a: any, b: any) => b.id - a.id);
        this.quoteData = responses;
        console.log({ response });

        // this.addQuoteTypeForm.reset();
      },
      (err: any) => {
        // console.log('Unable to get data from URL + err');
      }
    );
  }

  getAllQuote() {
    this.apiServices.getQuotes().subscribe((res) => {
      this.quoteData = res;
      console.log({ res });
    });
  }

  addQuoteType() {
    //console.log(this.addQuoteTypeForm.value.items);
    let payload: addQuoteModel = {
      totalAmount: this.totalAmount,
      clientId: this.selectedClient.id,
      vehicleId: this.selectedVehicle.id,
      items: this.addQuoteTypeForm.value.items,
    };
    this.apiServices.postQuote(payload).subscribe(
      (data) => {
        console.log(data);
        this.getQuote();
        // this.getAllQuote();
        let ref = document.getElementById('cancel');
        ref?.click();
        this.showAdd = true;
        this.showUpdate = false;
        this.addQuoteTypeForm.reset();
      },
      (err) => {
        console.log('Unable to add Quote + err');
      }
    );
  }

  // items: this.fb.array([
  // newItemsFormArray(): FormGroup {
  //   return this.fb.group({
  //     item: '',
  //     rate: '',
  //     unit: ''
  //   })
  // }

  //getting values from Items Array
  get itemsFormArray(): FormArray {
    return this.addQuoteTypeForm.get('items') as FormArray;
  }

  get vehicleIDControl(): FormControl {
    return this.addQuoteTypeForm.get('vehicleId') as FormControl;
  }

  //tracking client ID
  trackClientId(event: any) {
    console.log(event);
    this.selectedClient = event;
    this.getAllVehiclesAttachedToClient(event.id);
  }

  trackVehicle(event: any) {
    console.log('event');
    this.selectedVehicle = event;
  }

  getAllClients() {
    this.apiServices.getAllClients().subscribe((res: any) => {
      this.clients = res.payload;
    });
  }

  getAllVehicles() {
    this.apiServices.getVehicle().subscribe((res: any) => {
      this.vehicle = res.payload;
    });
  }

  getAllVehiclesAttachedToClient(id: any) {
    this.apiServices.getClientVehicles(id).subscribe((res: any) => {
      this.clientVehicles = res.payload;
    });
  }

  getAllServices() {
    this.apiServices.getAllService().subscribe((res: any) => {
      this.item = res.payload;
    });
  }

  addItems() {
    this.itemsFormArray.push(
      this.fb.group({
        item: '',
        unit: '',
        rate: '',
        amount: '',
      })
    );
    this.checkAddButton();
  }

  checkAddButton() {
    if (this.itemsFormArray.controls.length > 0) {
      this.buttonText = 'Add more Services';
    } else {
      this.buttonText = 'Add Service';
    }
  }

  // addItems(){
  //   this.itemsFormArray.push(this.newItemsFormArray())
  // }

  subAmount() {
    this.totalAmount -
      this.addQuoteTypeForm.value.items.rate *
        this.addQuoteTypeForm.value.items.unit;
  }

  removeItems(index: number) {
    let arr = this.addQuoteTypeForm.get('items') as FormArray;
    arr.removeAt(index);
    this.subAmount();
    // this.processCalculation(index)
    this.checkAddButton();
  }

  updateQuote() {
    this.quoteModelObj.clientId = this.addQuoteTypeForm.value.clientId;
    this.quoteModelObj.vehicleId = this.addQuoteTypeForm.value.vehicleId;
    this.quoteModelObj.items[0].item = this.addQuoteTypeForm.value.items[0].item;
    this.quoteModelObj.items[0].unit = this.addQuoteTypeForm.value.items[0].unit;
    this.quoteModelObj.items[0].rate = this.addQuoteTypeForm.value.items[0].rate;
    this.quoteModelObj.items[0].amount = this.addQuoteTypeForm.value.items[0].amount;

    this.apiServices.updateQuote(this.quoteModelObj, this.quoteModelObj.id).subscribe((res: any) => {
      console.log(res);

      alert('Updated Successfully');
      let ref = document.getElementById('cancel');
      ref?.click();
      // this.addQuoteTypeForm.reset();
      this.getQuote();
    });
  }

  processCalculation(index: number) {
    // console.log(index);

    let totalAmount =
      this.addQuoteTypeForm.value.items[index].rate *
      this.addQuoteTypeForm.value.items[index].unit;

    this.addQuoteTypeForm.value.items[index].amount = totalAmount;

    let amount = 0;
    this.addQuoteTypeForm.value.items.forEach((data: any, i: any) => {
      amount +=
        this.addQuoteTypeForm.value.items[i].rate *
        this.addQuoteTypeForm.value.items[i].unit;
    });
    this.totalAmount = amount;
  }

  //for subtracting added services

  deleteQuote(row: any) {
    this.apiServices.deleteQuote(row.id).subscribe(
      (res: any) => {
        alert('Quote deleted successfully');
      },
      (err: any) => {
        console.log('Unable to delete the Quote' + err);
        this.addQuoteTypeForm.reset();
      }
    );
  }

  onEdit(row: any) {
    this.test = row.id;
    this.quoteModelObj.id = row.id;
    this.addQuoteTypeForm.controls['clientId'].setValue(row.clientId);
    this.addQuoteTypeForm.controls['vehicleId'].setValue(row.vehicleId);
    console.log(this.itemsFormArray, 'controls');
    this.addQuoteTypeForm.patchValue({
      clientId: row.clientId,
      totalAmount: row.totalAmount,
      vehicleId: row.vehicleId,
      items: [...row.items],
    });
    let ref = document.getElementById('cancel');
    ref?.click();
    this.editID = true;
    this.showAdd = false;
    this.showUpdate = true;
  }

  onViewClick(row: any) {
    console.log({ row });
    this.viewQte = row;

    let ref = document.getElementById('cancel');
    ref?.click();
  }

  confirmBox(row: any) {
    // this.quoteModelObj.id = row.id;
    // this.quoteModelObj.clientId = row.clientId;
    // this.quoteModelObj.isApproved = true;
    // this.quoteModelObj.isPending = false;
    // this.quoteModelObj.vehicleId = row.vehicleId;

    Swal.fire({
      title: 'Are you sure want to Approve this quote?',
      text: 'You will not be able to undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, Cancel it',
    }).then((result: any) => {
      if (result.value) {
        console.log('BEFORE');
        console.log(row);
        console.log('AFTER');
        row.isApproved = true;
        row.isPending = false;
        row.quoteHistory = null;
        console.log(row);

        this.apiServices.updateQuote(row, row.id).subscribe((res: any) => {
          console.log('RESPONSE');
          console.log(res);
          if (res.status == 200) {
            this.hidden = true;
            Swal.fire('Approved!', 'This quote has been approved.', 'success');
          } else {
            Swal.fire('Error!', res.error, 'error');
          }
          let ref = document.getElementById('cancel');
          ref?.click();
          this.addQuoteTypeForm.reset();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your quote file is safe :)', 'error');
      }
    });
  }
}
