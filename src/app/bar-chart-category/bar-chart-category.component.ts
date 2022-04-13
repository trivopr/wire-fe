import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bar-chart-category',
  templateUrl: './bar-chart-category.component.html',
  styleUrls: ['./bar-chart-category.component.scss']
})
export class BarChartCategoryComponent implements OnInit {
  barChartLabels = [];
  barChartDataDraw = [];

  groupOrderByCategory: {};
  totalAmountVenue: any = 0;


  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor() {
    this.getData();
  }

  ngOnInit(): void {
  }

  getData = async () => {
    const {data} = await fetch(`${environment.serverUrl}/api/retrieve-sales`).then(rs => rs.json());

    // Transform Data group by Category
    this.groupOrderByCategory = data.reduce((groups, item) => {
      const group = groups[item.category] || [];
      group.push(item);
      groups[item.category] = group;
      return groups;
    }, {});

    // Transform data return Category && Total Quantify
    const barChartDataGroup = Object.keys(this.groupOrderByCategory).map(k => {
      const totalQtyTmp = this.groupOrderByCategory[k].reduce((acc, cur) => {return acc + cur.total_qty}, 0);
      return {cateName: k, totalQtyCateName: totalQtyTmp};
    })

    let chartDataSorted = this.handleSortArrayByName(barChartDataGroup);
    this.barChartDataDraw = chartDataSorted.map(i => +i.totalQtyCateName);
    this.barChartLabels = chartDataSorted.map(i => i.cateName);

    // Set Chart Data and Update
    if (this.chart) {
      // Set data to Chart
      // this.barChartData.datasets[0].data = [65, 59, 80, 81, 56, 55, 40 ];
      // this.barChartData.labels = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ];
      this.barChartData.datasets[0].data = this.barChartDataDraw;
      this.barChartData.labels = this.barChartLabels;

      // Redraw Update chart
      this.chart.update();
    }
  }

    // Handle Sort Array By Order Date
    handleSortArrayByName(listData) {
      if (listData.length > 0) {
        listData.sort(function(x, y) {
          let firstCateName = x.cateName.toLowerCase(),
              SecondCateName = y.cateName.toLowerCase();

          if (firstCateName < SecondCateName) return -1;
          if (firstCateName > SecondCateName) return 1;
          return 0;
        });
        return listData;
      }
      return null;
    }

  // Calculate
  handleCalculateTotalAmount(arr) {
    if (arr && arr.length > 0) {
      return this.totalAmountVenue = arr.reduce((prev, curr) => {
        return parseInt(prev + curr.total_amount);
      }, 0)
    }
    return 0;
  }

  // Percentage Calculate
  calculatePercentagePerTotalVenue(itemValue) {
    if (parseInt(this.totalAmountVenue) > 0) {
      return ((itemValue * 100) / this.totalAmountVenue);
    }
    return 0;
  }

  // Setup drawing PIE chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 1
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Quantity'
      }
    ]
  };
}
