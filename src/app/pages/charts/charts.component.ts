import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { PagesService } from './../pages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ChartService } from './service/chart.service';
import {
  ChartObject,
  ActiveUsers,
  CardsModal,
  TempStorage,
} from './modal/charts-modal';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
// import { AllModules } from '@ag-grid-enterprise/all-modules';

export type ChartOptions = {
  series2: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

export type PieChartOptions = {
  series1: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
export type GuageChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

export type GuageUserChartTreeOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

export type ChartGrpOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  colors: string[];
};
export type ChartTreeOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Sales',
    children: [
      {
        name: 'Post sales',
        children: [
          { name: 'Chain nbr' },
          { name: 'Strore group nbr' },
          { name: 'Strore nbr' },
        ],
      },
    ],
  },
];
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
export interface PeriodicElement {
  name: string;
  Email: any;
  status: string;
  position: Number;
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChartsComponent implements OnInit, OnChanges, AfterViewInit {
  hidedashboard = true;
  @ViewChild('chart') chart: ChartComponent | any;
  public PiechartOptions: Partial<PieChartOptions> | any;
  public chartOptions: Partial<ChartOptions> | any;
  public ColumnChartOptions: Partial<ColumnChartOptions> | any;
  public ChartGrpOptions: Partial<ChartGrpOptions> | any;
  public ChartTreeOptions: Partial<ChartTreeOptions> | any;
  public GuageChartTreeOptions: Partial<GuageChartOptions> | any;
  public GuageUserChartTreeOptions: Partial<GuageUserChartTreeOptions> | any;
  piechartLabels: any[] = [];
  PiechartValues: any[] = [];
  piechart = false;
  chartVal = false;
  colChart = false;
  key: any;
  val: any;
  Grpchart = false;
  cardsData: any[] = [];
  cardsVal = false;
  chartdatavalues: any[] = [];
  admindashboard = false;
  userdashboard = false;
  showusertable = false;
  showemptytable = true;
  activeUsers: any[] = [];
  // tslint:disable-next-line: variable-name
  displayedColumns: any[] = [];
  datacards: any[] = [];
  showdatacards = false;
  userRole: any;
  jsonData: any;
  downloadJson: any;
  showdiagnostics = false;
  dataSource: any[] = [];

  chartObject: ChartObject = new ChartObject();

  rowData: any[] = [];
  salesrowData: any[] = [];
  servicerowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  salesgridApi: any;
  salesgridColumnApi: any;
  servicegridApi: any;
  servicegridColumnApi: any;
  // modules = AllModules;
  modules: any;
  columnDefs: any;
  salescolumnDefs: any;
  servicecolumnDefs: any;
  showgrid = false;
  vals: any[] = [];
  salesvals: any[] = [];
  servicevals: any[] = [];
  columns: any[] = [];
  salesColumns: any[] = [];
  servicecolumns: any[] = [];
  defaultColDef = {
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
  };
  salesdefaultColDef = {
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
  };
  servicedefaultColDef = {
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
  };
  sidebar = false;
  sortingOrder: any[] = [];
  autoGroupColumnDef: { width: number } | any;
  infoval: any;
  textval: string | any;
  paginationPageSize: any;
  pageSize = 25;
  rowGroupPanelShow: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  aggFuncs: any;
  preferenceOfUser: any;
  chatbotmode = 'normal';
  appType = 'chatbot';
  emptyPieChart = false;
  emptyColChart = false;
  emptyPreferences = false;
  showNavigateUrlLink = false;
  tableSearch: any;
  userNames: any;
  chartrowData: any;
  gaugeChart = false;
  gaugeUserChart = false;
  agentAnalyticsList: any[] = [];
  getContextMenuItems: any;
  footer: any;
  constructor(
    private pageservice: PagesService,
    public spinner: NgxSpinnerService,
    private gs: GeneralService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cs: ChartService,
    private error: ErrorService,
    private cdr: ChangeDetectorRef
  ) {
    this.getActiveUsers();
    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });

    this.pageservice.getDashboard().subscribe((info: any) => {
      if (info === 'hide') {
        this.hidedashboard = false;
      } else {
        this.hidedashboard = true;
      }
    });
    this.pageservice.getDiagnosticsData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.jsonData = info;
        this.showdiagnostics = true;
      }
    });
  }

  ngAfterViewInit() {}
  // localUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://dpl.cswg.com/dpl/#/application?type=data_viz&name=Service Level&search=ar_ship_date  = '12-03-2022'");
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {
    //this.getColumnChart();
    //this.showNavigateUrlLink = true;
    this.getPieChart();
    // this.getCommonPhrase();
    //this.getFeed();
    //this.getCards();
    this.changeColor();
    this.getAgentAnalytics();
    //this.getSuggestionsCount();
    this.cdr.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges): void {}
  cancel(): any {}
  getAgentAnalytics(): void {
    const body = {};
    this.cs.getAgentAnalyticsData(body).subscribe(
      (res: any) => {
        this.onSuccessAnalytics(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessAnalytics(res: any): void {
    if (res.res_status === true) {
      console.log(res);
      this.agentAnalyticsList = [
        {
          status: 'Available',
          user_name: 'sanupoju@cswg.com',
          name: 'Shankar Anupoju',
          agent_count: 0,
        },
        {
          status: 'Available',
          user_name: 'ngade@cswg.com',
          name: 'Nagarjuna Gade',
          agent_count: 2,
          agents_interacted_list: ['athummal@cswg.com', 'rardani@cswg.com'],
        },
        {
          status: 'Available',
          user_name: 'sanupoju@cswg.com',
          name: 'Shankar Anupoju',
          agent_count: 0,
        },
        {
          status: 'Available',
          user_name: 'ngade@cswg.com',
          name: 'Nagarjuna Gade',
          agent_count: 2,
          agents_interacted_list: ['athummal@cswg.com', 'rardani@cswg.com'],
        },
        {
          status: 'Available',
          user_name: 'sanupoju@cswg.com',
          name: 'Shankar Anupoju',
          agent_count: 0,
        },
        {
          status: 'Available',
          user_name: 'ngade@cswg.com',
          name: 'Nagarjuna Gade',
          agent_count: 2,
          agents_interacted_list: ['athummal@cswg.com', 'rardani@cswg.com'],
        },
        {
          status: 'Available',
          user_name: 'sanupoju@cswg.com',
          name: 'Shankar Anupoju',
          agent_count: 0,
        },
        {
          status: 'Available',
          user_name: 'ngade@cswg.com',
          name: 'Nagarjuna Gade',
          agent_count: 2,
          agents_interacted_list: ['athummal@cswg.com', 'rardani@cswg.com'],
        },
      ];
    }
  }
  changeColor(): any {
    // set new color here
    document.documentElement.style.setProperty(`--background-color`, '#fafafa');
    document.documentElement.style.setProperty(`--color`, '#2d2c2c');
  }
  getFeed(): any {
    this.spinner.show();
    const body = { bot_graph_type: 'feedback' };
    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccesssfeed(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssfeed(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.Grpchart = true;
      this.ChartGrpOptions = {
        series: data.data,
        chart: {
          type: 'bar',
          height: '400px',
          width: '100%',
        },
        plotOptions: {
          bar: {
            horizontal: true,

            barHeight: '100%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff'],
          },
        },
        colors: [
          'rgb(45, 110, 217)',
          'rgb(119, 93, 208)',
          'rgb(215, 172, 53)',
          'rgb(225, 73, 59)',
          'rgb(59, 217, 141)',
        ],
        stroke: {
          show: true,
          width: 4,
          colors: ['#fff'],
        },
        fill: {
          colors: [
            'rgb(45, 110, 217)',
            'rgb(119, 93, 208)',
            'rgb(215, 172, 53)',
            'rgb(225, 73, 59)',
            'rgb(59, 217, 141)',
          ],
        },
        xaxis: {
          categories: [''],
        },
      };
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  getCards(): any {
    this.spinner.show();
    const body = { bot_graph_type: 'fallback_msgs' };
    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccessscrd(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessscrd(data: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.cardsVal = true;
      this.chartObject.chartsModal = Array<CardsModal>();
      const colors = ['#7ea8ec', '#e88178', '#efca63', '#67e8aa'];
      const icons = [
        'fas fa-street-view',
        'fas fa-exclamation-triangle',
        'far fa-home-lg',
        'far fa-users',
      ];
      this.cardsData = [];
      this.cardsData.push({
        nameVal: Object.keys(data.data),
        percentageVal: Object.values(data.data),
        color: colors,
        icon: icons,
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  getCommonPhrase(): void {
    this.spinner.show();
    const body = { bot_graph_type: 'common_phrase' };

    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccessph(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessph(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.chartVal = true;
      this.chartdatavalues = [];
      this.chartdatavalues = data.data;

      const TreeMapKeys = Object.keys(data.data);
      const TreeMapValues = Object.values(data.data);
      const TreeMap = [];
      for (let i = 0; i < TreeMapKeys.length; i++) {
        const obj = { x: TreeMapKeys[i], y: TreeMapValues[i] };
        TreeMap.push(obj);
      }
      this.ChartTreeOptions = {
        series: [
          {
            data: TreeMap,
          },
        ],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '20px',
            // fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
          },
        },
        legend: {
          fontSize: '32px',
          show: false,
        },

        chart: {
          height: 250,
          type: 'treemap' as any,
        },
        plotOptions: {
          treemap: {
            distributed: true,
          } as any,
        } as any,
      };
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
  }
  getPieChart(): any {
    //this.spinner.show();
    const body = { bot_graph_type: 'user_datamessages' };
    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccessspie(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessspie(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      let height;
      let width;

      if (data.data !== undefined && data.data !== null) {
        if (Object.keys(data.data).length > 0) {
          this.piechart = true;
          this.preferenceOfUser = Object.keys(data.data)[0];
          this.piechartLabels = Object.keys(data.data);
          this.PiechartValues = Object.values(data.data);
          if (this.PiechartValues.length > 2) {
            width = '100%';
            height = 'auto';
          } else if (this.PiechartValues.length === 2) {
            width = 450;
            height = 450;
          } else if (this.PiechartValues.length === 0) {
            width = 389;
            height = 380;
          } else {
            width = 415;
            height = 415;
          }
        } else {
          width = 300;
          height = 300;
          this.piechart = true;
          this.emptyPieChart = true;
        }
      } else {
        width = 415;
        height = 415;
        this.piechart = true;
        this.emptyPieChart = true;
      }

      //this.PiechartOptions.chart.height =

      this.PiechartOptions = {
        series1: this.PiechartValues,
        chart: {
          width: '100%',
          height: '400px',
          type: 'pie',
          events: {
            dataPointSelection: (
              event: any,
              chartContext: any,
              config: any
            ) => {
              this.preferenceOfUser =
                this.piechartLabels[config.dataPointIndex];
              this.getPreferencedGridData(this.preferenceOfUser);
              this.rowData = [];
              this.columnDefs = [];
            },
          },
        },
        labels: this.piechartLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
      this.cdr.detectChanges();
      //Object.assign(this.PiechartOptions,{chart:{height: 300}});
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
    //this.getPrefrences();
    this.getColumnChart();
  }
  getColumnChart(): any {
    //this.spinner.show();
    const body = { bot_graph_type: 'user_fallback' };
    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccessscol(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessscol(data: any): any {
    this.spinner.hide();
    //this.spinner.hide();

    if (data.res_status === true) {
      const keys = Object.keys(data.data);
      const arr: any[] = [];
      keys.map((item) => {
        arr.push({ name: item, data: [data.data[item]] });
      });
      if (Object.keys(data.data).length > 0) {
        this.colChart = true;
      } else {
        //this.colChart = true;
        this.emptyColChart = true;
      }
      this.colChart = true;
      this.ColumnChartOptions = {
        series: arr,
        chart: {
          type: 'bar',
          height: '400px',
          width: '100%',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '30%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 7,
          colors: ['transparent'],
        },
        xaxis: {
          categories: [''],
        },
        // yaxis: {
        //   title: {
        //     text: '$ (thousands)'
        //   }
        // },
        fill: {
          opacity: 1,
        },
        // tooltip: {
        //   y: {
        //     formatter: function(val) {
        //       return '$ ' + val + ' thousands';
        //     }
        //   }
        // }
      };
      this.cdr.detectChanges();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
    this.getPrefrences();
  }
  dataMove(value: any): any {
    let tabvalue;
    if (value === 'Suggestions') {
      tabvalue = 'My View';
    } else {
      tabvalue = value;
    }
    this.pageservice.setTabData(tabvalue);
  }
  getActiveUsers(): any {
    const body = {};
    this.cs.getActiveUsers(body).subscribe(
      (res: any) => {
        this.onSuccessActiveUsers(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessActiveUsers(data: any): any {
    if (data.res_status === true) {
      this.displayedColumns = ['position', 'name', 'email', 'status'];
      this.chartObject.activeUsers = Array<ActiveUsers>();
      const dataset = data.data;
      dataset.map((item: any) => {
        const usersSet = new ActiveUsers();
        usersSet.chatFlag = item.chat_flag;
        usersSet.chatFlagStatus = item.chat_flag_status;
        usersSet.email = item.user_name;
        usersSet.name = item.name;
        usersSet.status = item.status;
        this.chartObject.activeUsers.push(usersSet);
      });
      this.pageservice.setAllUsersData(data.data);
      // this.chartObject.activeUsers.sort((a,b) => (a.status > b.status && a.chatFlag > b.chatFlag) ? 1 :
      //  ((b.status > a.status && b.chatFlag > a.chatFlag) ? -1 : 0));

      this.chartObject.activeUsers.sort((a: any, b: any) => {
        const statusA = a.status;
        const statusB = b.status;
        const chatFlagA = a.chatFlag;
        const chatFlagB = b.chatFlag;
        if (statusA < statusB) {
          return -1;
        }
        if (statusA > statusB) {
          return 1;
        }
        if (chatFlagA > chatFlagB) {
          return 1;
        }
        if (chatFlagA < chatFlagB) {
          return -1;
        }
        return 0;
      });
      if (this.chartObject.activeUsers.length > 0) {
        this.showusertable = true;
        this.showemptytable = false;
      } else {
        this.showemptytable = true;
        this.showusertable = false;
      }
      this.userNames = this.chartObject.activeUsers;

      const activeUsersCount = [];
      this.userNames.map((item: any) => {
        if (item?.status === 'ACTIVE') {
          activeUsersCount.push(item);
        }
      });
      this.GuageUserChartTreeOptions = {
        series: [100, (activeUsersCount.length / this.userNames.length) * 100],
        chart: {
          height: 390,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ['#008ffb', '#00e396'],
        labels: [
          'Total Users: ' + this.userNames.length,
          'Active Users: ' + activeUsersCount.length,
        ],
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 50,
          offsetY: 10,
          labels: {
            useSeriesColors: true,
          },
          // + ':  ' + opts.w.globals.series[opts.seriesIndex];
          formatter(seriesName: any, opts: any) {
            return seriesName;
          },
          itemMargin: {
            horizontal: 3,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      };
      this.gaugeUserChart = true;
      this.getSupportGroups();
      this.cdr.detectChanges();
    } else {
      this.error.handleError(data);
    }
  }
  getSupportGroups(): any {
    this.spinner.show();
    const body = { support_type: 'retrieve' };
    this.cs.support(body).subscribe(
      (res: any) => {
        this.onSuccessSupport(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessSupport(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.chartrowData = data.data;
      const rowData = data.data;
      const userNames = this.userNames;
      rowData.map((item: any) => {
        userNames.map((test: any) => {
          if (item.email === test.email) {
            this.chartrowData.map((subItem: any) => {
              if (subItem.email === test.email) {
                subItem.status = test.status;
                subItem.chatFlag = test.chatFlag;
              }
              if (
                subItem.status === undefined &&
                subItem.chatFlag === undefined
              ) {
                subItem.status = 'ACTIVE';
              }
            });
          }
        });
      });
      const activeUsersCount = [];
      this.chartrowData.map((item: any) => {
        if (item?.status === 'ACTIVE') {
          activeUsersCount.push(item);
        }
      });
      this.GuageChartTreeOptions = {
        series: [
          100,
          (activeUsersCount.length / this.chartrowData.length) * 100,
        ],
        chart: {
          height: 390,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ['#008ffb', '#00e396'],
        labels: [
          'Total Agents: ' + this.chartrowData.length,
          'Active Agents: ' + activeUsersCount.length,
        ],
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 50,
          offsetY: 10,
          labels: {
            useSeriesColors: true,
          },
          formatter(seriesName: any, opts: any) {
            return seriesName;
          },
          itemMargin: {
            horizontal: 3,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      };
      this.gaugeChart = true;
      this.cdr.detectChanges();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  openChat(val: any): any {
    const obj = { username: val.email, user: val.name };
    this.pageservice.setOpenChat(obj);
  }
  getSuggestionsCount(): any {
    const body = { bot_graph_type: 'sugg_reco' };
    this.cs.getChartsData(body).subscribe(
      (res: any) => {
        this.onSuccessgetSuggestions(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessgetSuggestions(data: any): any {
    if (data.res_status === true) {
      const bgcolors = ['#00a99d', '#ff9c20', '#00a99d'];
      this.datacards = [];
      this.datacards.push({
        cardName: Object.keys(data.data),
        cardVal: Object.values(data.data),
        bgcolor: bgcolors,
      });
      this.showdatacards = true;
      // console.log(this.datacards);
    } else {
      this.error.handleError(data);
    }
  }
  openDiagonstics(Diagonstics: TemplateRef<any>): any {
    this.dialog.open(Diagonstics, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }
  downloadjson() {
    const theJSON = JSON.stringify(this.jsonData);
    const uri = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON)
    );
    this.downloadJson = uri;
  }
  close() {
    this.dialog.closeAll();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
  }
  onsalesGridReady(params: any): void {
    this.salesgridApi = params.api;
    this.salesgridColumnApi = params.columnApi;
    this.salesgridApi.closeToolPanel();
  }
  onserviceGridReady(params: any): void {
    this.servicegridApi = params.api;
    this.servicegridColumnApi = params.columnApi;
    this.servicegridApi.closeToolPanel();
  }
  onChartCreated(event: any): void {}

  onChartRangeSelectionChanged(event: any): void {}

  onChartOptionsChanged(event: any): void {}

  onChartDestroyed(event: any): void {}

  onFirstDataRendered(event: any): void {}
  getPrefrences(): void {
    const body = { preference_type: 'retrieve' };
    //this.common.http.post('preferences', body, success, error);
    this.cs.getPreferences(body).subscribe(
      (res: any) => {
        this.onSuccesPreference(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesPreference(data: any) {
    //let preferenceOfUser;
    if (data.res_status === true) {
      this.gs.storePreferences(data.data);
      if (data.data.org_setup.infydomain === 'WhseOps') {
        this.preferenceOfUser = 'warehouse status';
      } else {
        if (data?.data?.org_setup?.infydomain !== undefined) {
          this.preferenceOfUser = data?.data?.org_setup?.infydomain;
        }
      }

      this.getPreferencedGridData(this.preferenceOfUser);
    } else {
      //preferenceOfUser = this.preferenceOfUser;
      this.emptyPreferences = true;
      this.getPreferencedGridData(this.preferenceOfUser);
    }
    this.routeToPreferences();
  }
  routeToPreferences() {
    if (
      this.emptyPreferences === true &&
      this.emptyColChart === true &&
      this.emptyPieChart === true
    ) {
      this.showNavigateUrlLink = true;
      this.showWeeklySalesData('sales');
      //this.showWeeklyServiceData('service level');
    } else {
      this.showNavigateUrlLink = false;
    }
  }

  showWeeklySalesData(value: any): void {
    if (value !== undefined && value !== null) {
      this.spinner.show();
      const body = {
        input: value,
        chat_bot_mode: this.chatbotmode,
        context: {
          'user-agent': {
            browser: this.getBrowserName(),
            browser_version: this.getBrowserVersion(),
          },
          'user-interface': 'web-ui',
          app_type: this.appType,
        },
      };
      this.cs.sendMessage(body).subscribe(
        (res: any) => {
          this.loadSalesData(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
    }
  }
  showWeeklyServiceData(value: any): void {
    if (value !== undefined && value !== null) {
      this.spinner.show();
      const body = {
        input: value,
        chat_bot_mode: this.chatbotmode,
        context: {
          'user-agent': {
            browser: this.getBrowserName(),
            browser_version: this.getBrowserVersion(),
          },
          'user-interface': 'web-ui',
          app_type: this.appType,
        },
      };
      this.cs.sendMessage(body).subscribe(
        (res: any) => {
          this.loadServiceData(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
    }
  }
  loadServiceData(res: any): void {
    this.spinner.hide();
    if (res.res_status === true) {
      this.servicerowData = [];
      this.servicevals = [];
      this.servicerowData = res.data.output.main_window;
      this.servicevals = res.data.output.main_window;
      this.servicecolumns = [];
      let header: any[] = [];
      this.servicevals.map((item) => {
        header = Object.keys(item);
      });
      header.map((item) => {
        this.servicecolumns.push({ headerName: item, field: item });
      });
      setTimeout(() => {
        this.servicegridApi.sizeColumnsToFit();
      }, 1000);
      this.servicecolumnDefs = this.servicecolumns;
      this.servicedefaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        filter: true,
      };
      this.sidebar = false;
      this.sortingOrder = ['desc', 'asc', null];
      this.rowGroupPanelShow = 'always';
      this.pivotPanelShow = 'open';
      this.pivotColumnGroupTotals = 'after';
      this.pivotRowTotals = 'before';
      this.autoGroupColumnDef = { width: 150 };
      this.aggFuncs = { distinct: CountDFunc };
    } else {
    }
  }
  loadSalesData(res: any): void {
    this.spinner.hide();

    if (res.res_status === true) {
      this.salesrowData = [];
      this.salesvals = [];
      this.salesrowData = res.data.output.main_window;
      this.salesvals = res.data.output.main_window;
      this.salesColumns = [];
      let header: any[] = [];
      this.salesvals.map((item) => {
        header = Object.keys(item);
      });
      header.map((item) => {
        this.salesColumns.push({ headerName: item, field: item });
      });
      setTimeout(() => {
        this.salesgridApi.sizeColumnsToFit();
      }, 1000);
      this.salescolumnDefs = this.salesColumns;
      this.salesdefaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        filter: true,
      };
      this.sidebar = false;
      this.sortingOrder = ['desc', 'asc', null];
      this.rowGroupPanelShow = 'always';
      this.pivotPanelShow = 'open';
      this.pivotColumnGroupTotals = 'after';
      this.pivotRowTotals = 'before';
      this.autoGroupColumnDef = { width: 150 };
      this.aggFuncs = { distinct: CountDFunc };
    } else {
    }
    this.showWeeklyServiceData('service level');
  }
  getPreferencedGridData(value: any): void {
    if (value !== undefined && value !== null) {
      this.spinner.show();
      const body = {
        input: value,
        chat_bot_mode: this.chatbotmode,
        context: {
          'user-agent': {
            browser: this.getBrowserName(),
            browser_version: this.getBrowserVersion(),
          },
          'user-interface': 'web-ui',
          app_type: this.appType,
        },
      };
      this.cs.sendMessage(body).subscribe(
        (res: any) => {
          this.loadGridData(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
    }
  }
  loadGridData(res: any): void {
    this.spinner.hide();
    if (res.res_status === true) {
      this.rowData = [];
      this.vals = [];
      this.tableSearch = '';
      this.rowData = res?.data?.output?.main_window;
      this.vals = res?.data?.output?.main_window;
      this.columns = [];
      let header: any[] = [];
      this.vals?.map((item) => {
        header = Object.keys(item);
      });
      if (header.length > 2) {
        header.map((item) => {
          this.columns?.push({ headerName: item, field: item });
        });
        setTimeout(() => {
          this.gridApi.sizeColumnsToFit();
        }, 1000);
        this.columnDefs = this.columns;
        this.defaultColDef = {
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          sortable: true,
          resizable: true,
          filter: true,
        };
        this.sidebar = true;
        this.sortingOrder = ['desc', 'asc', null];
        this.rowGroupPanelShow = 'always';
        this.pivotPanelShow = 'open';
        this.pivotColumnGroupTotals = 'after';
        this.pivotRowTotals = 'before';
        this.autoGroupColumnDef = { width: 150 };
        this.aggFuncs = { distinct: CountDFunc };
      }
    } else {
    }
    this.cdr.detectChanges();
  }
  getBrowserName(): any {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edg') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(window as any).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(window as any).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
  getBrowserVersion() {
    let userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return 'IE ' + (tem[1] || '');
    }

    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) {
      matchTest.splice(1, 1, tem[1]);
    }

    return matchTest.join(' ');
  }
  onFilterGrid(event: any): void {
    const e: any = event.target.value;
    this.gridApi.setQuickFilter(e);
  }
  onsalesFilterGrid(event: any): void {
    const e: any = event.target.value;
    this.salesgridApi.setQuickFilter(e);
  }
  onserviceFilterGrid(event: any): void {
    const e: any = event.target.value;
    this.servicegridApi.setQuickFilter(e);
  }
  navigateToPrefrences(): void {
    this.pageservice.setShowView('preferences');
  }
}
function CountDFunc(params: any): any {
  // return 'xyz';
  const obj = [...new Set(params)];

  return obj.length;
}
