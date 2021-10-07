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
import { updateQuoteModel } from './updateQuoteModel';
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
  isApproved: any;
  quoteHistory: [] | undefined;
  buttonText: String = 'Add service';
  totalAmount: number = 0;
  selectedClient: any;
  selectedVehicle: any;
  alertInstance: string = '';
  createQuoteAlert!: boolean;
  updatedQuoteAlert!: boolean;
  alert!: boolean;
  page: number = 1;
  count = 0;
  tableSize = 10;
  userDetails = JSON.parse(
    JSON.parse(JSON.stringify(localStorage.getItem('userDetails')))
  );

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
    this.router.navigate(['/create-invoice'], {
      state: { data: row },
    });
  }

  viewQuote(row: any) {
    this.router.navigate([`/view-quote/${row.id}`], {
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

  // getAllQuote() {
  //   this.apiServices.getQuotes().subscribe((res) => {
  //     this.quoteData = res;
  //     console.log({ res });
  //   });
  // }

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
        this.createQuoteAlert = true;
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

  //getting values from Items Array
  get itemsFormArray(): FormArray {
    return this.addQuoteTypeForm.get('items') as FormArray;
  }

  get vehicleIDControl(): FormControl {
    return this.addQuoteTypeForm.get('vehicleId') as FormControl;
  }

  //tracking client ID
  trackClientId(event: any) {
    console.log(222, event.id);
    this.selectedClient = event;
    this.getAllVehiclesAttachedToClient(event.id);
  }

  trackVehicle(event: any) {
    console.log(event);
    this.selectedVehicle = event;
  }

  addNewQuote() {
    this.addQuoteTypeForm.reset();
    this.addQuoteTypeForm.controls['clientId'].enable();
    this.addQuoteTypeForm.controls['vehicleId'].enable();
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
      console.log('.....', res.payload);
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

  removeItems(index: number) {
    let arr = this.addQuoteTypeForm.get('items') as FormArray;

    for (let i = arr.length - 1; i >= 0; i--) {
      arr.removeAt(i);
    }
    //  arr.removeAt(index);

    this.checkAddButton();
    this.calculateTotalAmount();
  }

  onEdit(row: any) {
    this.removeItems(0);

    this.test = row.id;
    this.quoteModelObj.id = row.id;
    this.addQuoteTypeForm.controls['clientId'].setValue(row.clientId);

    this.addQuoteTypeForm.controls['vehicleId'].setValue(row.vehicleId);
    //this.selectedVehicle
    // const [vehicle] = this.clientVehicles.filter(
    //   (value: any) => value.id === row.VehicleId
    // );

    this.getAllVehiclesAttachedToClient(row.clientId);

    //this.itemsFormArray.reset();

    console.log(this.itemsFormArray);
    console.log('edit', row);
    row.items.forEach((element: any) => {
      this.itemsFormArray.push(
        this.fb.group({
          item: element.item,
          unit: element.unit,
          rate: element.rate,
          amount: element.amount,
        })
      );
    });

    this.calculateTotalAmount();

    let ref = document.getElementById('cancel');
    ref?.click();
    this.editID = true;
    this.showAdd = false;
    this.showUpdate = true;
    this.addQuoteTypeForm.controls['clientId'].disable();
    this.addQuoteTypeForm.controls['vehicleId'].disable();

    console.log(this.addQuoteTypeForm.value);
  }

  updateQuote(id: any) {
    const payload = {
      ...this.addQuoteTypeForm.getRawValue(),
      totalAmount: this.totalAmount,
    };
    console.log('upQ', payload);

    this.apiServices
      .updateQuote(payload, this.quoteModelObj.id)
      .subscribe((res: any) => {
        1;
        console.log(res);
        this.updatedQuoteAlert = true;
        let ref = document.getElementById('cancel');
        ref?.click();
        this.addQuoteTypeForm.reset();
        this.getQuote();
      });
  }

  processCalculation(index: number) {
    // console.log(index);

    let totalAmount =
      this.addQuoteTypeForm.value.items[index].rate *
      this.addQuoteTypeForm.value.items[index].unit;

    this.addQuoteTypeForm.value.items[index].amount = totalAmount;

    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let amount = 0;
    this.addQuoteTypeForm.value.items.forEach((data: any, i: any) => {
      amount +=
        this.addQuoteTypeForm.value.items[i].rate *
        this.addQuoteTypeForm.value.items[i].unit;
    });
    this.totalAmount = amount;
  }

  deleteQuote(row: any) {
    this.apiServices.deleteQuote(row.id).subscribe(
      (res: any) => {
        this.alert = true;
        this.getQuote();
      },
      (err: any) => {
        console.log('Unable to delete the Quote' + err);
        this.addQuoteTypeForm.reset();
      }
    );
  }

  onViewClick(row: any) {
    console.log({ row });
    this.viewQte = row;
    let ref = document.getElementById('cancel');
    ref?.click();
  }

  closeAlert() {
    this.alert = false;
  }

  confirmBox(row: any) {
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
        row.isApproved = true;
        row.isPending = false;
        console.log(row);
        /*        
        delete row.isActive;
        delete row.isDeleted;
        delete row._id;
        delete row.createdByName;
        delete row.createdById;
        delete row.createdOn;
        delete row.__v;
        delete row.timeStamp;
        delete row.updatedOn;
        delete row.quoteId;
        delete row.quoteHistory;
        delete row.vehicleName;
        delete row.clientName;
        let idd = row.id;
        delete row.id;
        delete row.billingAddress;
*/

        let newPayload: addQuoteModel = {
          clientId: row.clientId,
          vehicleId: row.vehicleId,
          items: row.items,
          totalAmount: row.totalAmount,
          //   isApproved: row.isApproved,
          //   isPending: row.isPending,
        };

        let updatePayload: updateQuoteModel = {
          clientId: row.clientId,
          vehicleId: row.vehicleId,
          items: row.items,
          totalAmount: row.totalAmount,
          isApproved: row.isApproved,
          isPending: row.isPending,
        };

        console.log('NEW PAYLOAD');

        console.log(updatePayload);

        this.apiServices
          .updateQuote(updatePayload, row.id)
          .subscribe((res: any) => {
            console.log('RESPONSE');
            console.log(res);
            if (res.status == 200) {
              this.hidden = true;
              Swal.fire(
                'Approved!',
                'This quote has been approved.',
                'success'
              );
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

  tabSize(index: number) {
    this.page = index;
    this.getQuote();
  }

  hideInvoiceList() {
    if (
      this.userDetails.role == 'admin' ||
      this.userDetails.role == 'approver'
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeArt() {}
}
