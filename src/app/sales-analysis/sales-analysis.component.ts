import { Component, OnInit } from '@angular/core';
import {IOption} from 'ng-select';
import * as moment from 'moment';
import * as numeral from 'numeral';

@Component({
  selector: 'app-sales-analysis',
  templateUrl: './sales-analysis.component.html',
  styleUrls: ['./sales-analysis.component.scss']
})
export class SalesAnalysisComponent implements OnInit {

  rows = [];
  initialData = [];
  columns = [];
  productOptions = [];
  Infinity = "Infinity";
  totalAmountSelect = 0;

  constructor() {
    this.getData();
  }

  ngOnInit(): void {

  }

  getData = async () => {
    const {data} = await fetch('http://localhost:3001/api/retrieve-sales').then(rs => rs.json());
    data.forEach(item => {
      item.order_date = moment(item.order_date).format("DD-MMM-YYYY");
      item.totalAmount = this.formatAmountCurrency(item.total_amount);
    })
    this.rows = data;

    // Cache Data list for other used
    this.initialData = data;
    this.handleCalculateTotalAmount(data);

    //  Set Table columns
    this.columns = [
      {name: 'Category', prop: 'category'},
      {name: 'Order Date',prop: 'order_date'},
      {name: 'Order No', prop: 'order_no'},
      {name: 'Product', prop: 'product'},
      {name: 'Status', prop: 'status'},
      {name: "Total Amount", prop: 'totalAmount'},
      {name: 'Total Qty', prop: 'total_qty'}
    ];

    // Transform data for Select Options
    const productIds = [...new Set(data.map(item => item.product))];
    this.productOptions = productIds.map((proCode:any) => {
      let uniquePro = data.find((i:any) => i.product === proCode);
      return {
        label: uniquePro.category + '-' + uniquePro.product,
        value: uniquePro.product
      }
    })
  }

  // Handle set new Table Data on Selected change
  handleSelectChange(selected) {
    const listFilterData = this.initialData.filter((i: any) => i.product === selected.value);
    if (listFilterData.length > 0) {
      this.rows = listFilterData;
      this.totalAmountSelect = this.formatAmountCurrency(listFilterData.reduce((prev, curr) => {
        return prev + curr.total_amount;
      }, 0))
    }
  }

  formatAmountCurrency(money) {
    if (!money) return 0;
    return numeral(money).format('$0,0.00');
  }

  handleCalculateTotalAmount(arr) {
    if (arr && arr.length > 0) {
      this.totalAmountSelect = this.formatAmountCurrency(arr.reduce((prev, curr) => {
        return prev + curr.total_amount;
      }, 0))
    }
  }

}
