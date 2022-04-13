import { environment } from 'src/environments/environment';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  chartLabels = [];
  chartDataDraw = [];

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
        },
    },

    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;


  groupOrderByDate: {};

  constructor() {
    this.getData();
  }

  ngOnInit() {
  }

  getData = async () => {
    const {data} = await fetch(`${environment.serverUrl}/api/retrieve-sales`).then(rs => rs.json());

    // Transform data group by Date
    this.groupOrderByDate = data.reduce((groups, item) => {
      const group = groups[item.order_date] || [];
      group.push(item);
      groups[item.order_date] = group;
      return groups;
    }, {});

    // Calculate total amount of data Per Date
    const chartData = Object.keys(this.groupOrderByDate).map(k => {
      const totalAmountTmp = this.groupOrderByDate[k].reduce((acc, cur) => {return acc + cur.total_amount}, 0);
      return {orderDate: k, totalAmountPerdate: totalAmountTmp};
    })

    // Handle Sort List by OrderDate ASC
    let chartDataSorted = this.handleSortArrayByDate(chartData);

    // Prepare Data for drawing Line chart
    this.chartDataDraw = chartDataSorted.map(i => i.totalAmountPerdate);
    this.chartLabels = this.handleFormatDate(chartDataSorted.map(i => i.orderDate));


    // Set Chart Data and Update
    if (this.chart) {
      // Line Chart
      this.lineChartData.datasets[0].data = this.chartDataDraw;
      this.lineChartData.labels = this.chartLabels;

      // Redraw Update chart
      this.chart.update();
    }
  }

  // Handle Sort Array By Order Date
  handleSortArrayByDate(listData) {
    if (listData.length > 0) {
      listData.sort(function(x, y) {
        var firstDate = new Date(x.orderDate),
          SecondDate = new Date(y.orderDate);

        if (firstDate < SecondDate) return -1;
        if (firstDate > SecondDate) return 1;
        return 0;
      });
      return listData;
    }
    return null;
  }

  // Format Date of Order
  handleFormatDate(inputData) {
    let rs = inputData.map(item => {
      return moment(item).format("DD-MMM-YY");
    })
    return rs;
  }

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.chartDataDraw,
        label: 'Total Amount Per Date',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: this.chartLabels
  };

}
