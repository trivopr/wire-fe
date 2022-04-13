import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart-category',
  templateUrl: './pie-chart-category.component.html',
  styleUrls: ['./pie-chart-category.component.scss']
})
export class PieChartCategoryComponent implements OnInit {
  pieChartLabels = [];
  pieChartDataDraw = [];

  groupOrderByCategory: {};
  totalAmountVenue: any = 0;


  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor() {
    this.getData();
  }

  ngOnInit(): void {
  }

  getData = async () => {
    const {data} = await fetch('http://localhost:3001/api/retrieve-sales').then(rs => rs.json());

    // Transform Data group by Category
    this.groupOrderByCategory = data.reduce((groups, item) => {
      const group = groups[item.category] || [];
      group.push(item);
      groups[item.category] = group;
      return groups;
    }, {});

    // Total Amount of Data Per Category Name
    this.totalAmountVenue = this.handleCalculateTotalAmount(data);


    const pieChartDataGroup = Object.keys(this.groupOrderByCategory).map(k => {
      const totalAmountTmp = this.groupOrderByCategory[k].reduce((acc, cur) => {return acc + cur.total_amount}, 0);
      const percenTageAmountCate: any = this.calculatePercentagePerTotalVenue(totalAmountTmp);
      return {cateName: k, totalAmountPerCateName: percenTageAmountCate};
    })

    this.pieChartDataDraw = pieChartDataGroup.map(i => +i.totalAmountPerCateName.toFixed(2));
    this.pieChartLabels = pieChartDataGroup.map(i => i.cateName);

    // Set Chart Data and Update
    if (this.chart) {
      // Set data to Chart
      this.pieChartData.datasets[0].data = this.pieChartDataDraw;
      this.pieChartData.labels = this.pieChartLabels;

      // Redraw Update chart
      this.chart.update();
    }
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
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: []
      }
    ]
  };
  public pieChartType: ChartType = 'pie';

}
