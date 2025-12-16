import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as go from 'gojs';
import { DiagramComponent } from 'gojs-angular';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayRef } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { InfosetsService } from '../service/infosets.service';
import { environment } from '../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-build-infosets',
  templateUrl: './build-infosets.component.html',
  styleUrls: ['./build-infosets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService, MessageService],
})
export class BuildInfosetsComponent implements OnInit, OnChanges {
  @ViewChild(MatMenuTrigger) matMenuTrigger!: MatMenuTrigger;
  @ViewChild('menuButton') menuButton!: ElementRef;
  private overlayRef!: OverlayRef;
  updatedTitle: any = '';
  updateIndex: any;

  public diagramNodeData: Array<go.ObjectData> | any = [
    {
      key: 1,
      text: 'Bot is triggered ' + 1,
      color: '#fff',
      parent: '',
      font: '14px Manrope',
      buttonColor: '#3EA3EC',
      plusIconColor: '#fff',
      type: 'label',
      operation_type: 'NA',
      category: 'data_entry',
      attr_type: 'nav',
      attr_name: 'Hi! I am Intellobot. How can I help you?',
      attr_ref: '["NA"]',
      oper_link: 'NA',
      oper_output: 'NA',
      oper_value: 'NA',
      description: 'Hi! I am Intellobot. How can I help you?',
      title: 'Hi! I am Intellobot. How can I help you?',
    },
  ];

  public diagramLinkData: Array<go.ObjectData> = [{ key: -1 }];

  public diagramModelData = { prop: 'value' };
  public skipsDiagramUpdate = false;
  private nextKey = 2;

  imgUrl = environment.imgUrl;
  buildForms = 'table';
  infoSetName: any = 'Build Infosets';
  screenName: any;
  popScreenName: any = 'Pop up messages';
  description: any;
  diagram: any;
  selectFontStyle: any;
  selectFontSize: any;
  selectFontFormat: any;
  selectJustifyOption: any;
  selectActiveLink: any;
  selectColor: any = '#3EA3EC';
  selectViewOption: any;
  selectedCategories: any[] = [];
  selectCustomKey: any;
  viewOptions: any[] = [
    { name: 'Application Bot', value: 'appBot' },
    { name: 'Web Bot', value: 'webBot' },
  ];
  fontSize: any[] = [
    { fontSize: 14, value: 14 },
    { fontSize: 16, value: 16 },
    { fontSize: 18, value: 18 },
    { fontSize: 20, value: 20 },
    { fontSize: 22, value: 22 },
    { fontSize: 24, value: 24 },
  ];
  fontStyle: any[] = [
    { fontName: 'Inter', value: 'roboto' },
    { fontName: 'Poppins', value: 'roboto' },
    { fontName: 'Roboto', value: 'roboto' },
  ];
  justifyOptions: any[] = [
    { value: 1, icon: 'pi pi-align-left' },
    { value: 2, icon: 'pi pi-align-right' },
  ];
  fontFormat: any[] = [
    { value: 1, icon: 'fa fa-bold' },
    { value: 2, icon: 'fa fa-italic' },
    { value: 2, icon: 'fa fa-underline' },
  ];
  activeLink: any[] = [{ value: 1, icon: 'pi pi-link' }];
  categories: any[] = [
    { name: 'Send this message as info title', key: 'SM' },
    { name: 'Track links in this message', key: 'TL' },
  ];
  colData: any[] = [
    { field: 'srNumber', header: 'S.NO' },
    { field: 'infoset_name', header: 'Infoset Name' },
    { field: 'description', header: 'Description' },
    { field: 'created_date', header: 'Created Date' },
    { field: 'status', header: 'Status' },
    { field: 'active_status', header: 'Active Status' },
    { field: 'actions', header: 'Actions' },
  ];
  customBuildInfoset: any[] = [
    { name: 'Appearance', key: 'appearance' },
    { name: 'General Settings', key: 'gs' },
    { name: 'Pop up Messages', key: 'pum' },
    { name: 'Trigger Conditions', key: 'tc' },
    { name: 'Configuration', key: 'config' },
  ];
  rowData = [];
  contextNodeData: any;
  showConfigMenu: boolean = false;
  showPublishScreen: boolean = false;
  cardDetail: any;
  @ViewChild('myDiagram', { static: true }) public myDiagramComponent:
    | DiagramComponent
    | any;

  public diagramDivClassName: string = 'myDiagramDiv';
  activeMenu: any;
  selectedFile!: File;
  imagePreviewUrl!: string | ArrayBuffer | null | any;
  widgetIcon!: string | ArrayBuffer | null | any;
  headerIcon!: string | ArrayBuffer | null | any;
  botIcon!: string | ArrayBuffer | null | any;
  fileType: any;
  headerText: any = 'Arkatiss Desk';
  hintText: any;
  fontColor: any = '#ffffff';
  accentColor: any = '#3ea0e8';
  csStyle: any;
  checkboxes = {
    left: false,
    right: true,
  };
  selectGsSetting: any;
  showTypingSpeed: boolean = false;
  showFeedBack: boolean = false;
  selectSpeed!: number;
  feedBack: any;
  popColData: any[] = [
    { header: 'Include on URLS', field: 'include_on_urls' },
    { header: 'Messages', field: 'messages' },
    { header: 'Media', field: 'media' },
    { header: 'Actions', field: 'actions' },
  ];
  popRowData: any[] = [
    {
      include_on_urls: '/*',
      messages: 'Hey there,how can I help you?',
      media: 'N/a',
    },
    {
      include_on_urls: '/Success',
      messages: 'Successfully Valid Pls wait for data',
      media: 'N/a',
    },
    {
      include_on_urls: '/Failure',
      messages: 'Please ask a valid question',
      media: 'N/a',
    },
  ];
  popVisible: boolean = false;
  generalSettings = [
    { name: 'Play sound when message is received or sent', key: 'sound' },
    { name: 'Remove branding from the chat widget', key: 'rbcw' },
    { name: 'Stop bouncing animation of the chat widget', key: 'sbacw' },
  ];

  nodeIndex: any;
  dialogDetails: any = '';
  selectedFormDetails: any;
  dataTypes: any[] = ['Number', 'Input', 'Dropdown'];
  infoCategories: any = [
    { name: 'Data Retrieval', field: 'data_retrieval' },
    { name: 'Data Entry', field: 'data_entry' },
  ];
  attrValues: any = [];
  tdtpes: any[] = [];
  operationTypes: any = [];
  shownewInfoset = false;
  catName: any;
  orderTypes: any = [];
  attr: any;
  duration: any = true;
  showAttribute: any = 'false';
  oplink = false;
  showtd = false;
  showtd2 = true;
  operationVal: any;
  opvalue = false;
  opinput = true;
  oplinktext: any;
  showfile = false;
  orderShow = false;
  operation = 'Operation';
  formvalue = false;
  menuList = ['Select Domain', 'Configuration'];
  selectReport: any = 'Select Domain';
  domainDetails: any[] = [];
  subDomainDetails: any[] = [];
  filteredDomainOptions: any = [];
  filteredSubDomainOptions: any = [];
  filteredInfosetOptions: any = [];
  domain: any;
  dialogDomain: any;
  tempSecuriryFlag: any;
  securityFlag = '';
  jsonfilenameData: any;
  subDomain: any;
  dialogSubDomain: any;
  infoset: any;
  sampleBotResponse: any = [
    {
      operation_type: 'NA',
      category: 'data_entry',
      uniqueId: 'NA',
      attr_type: 'nav',
      attr_name: 'Hi! I am Intellobot. How can I help you?',
      attr_ref: '["NA"]',
      oper_link: 'NA',
      oper_output: 'NA',
      oper_value: 'NA',
      description: 'Hi! I am Intellobot. How can I help you?',
      childs: [
        {
          operation_type: 'link',
          category: 'data_entry',
          uniqueId: 'NA',
          attr_type: 'nav',
          attr_name: 'Home',
          attr_ref: '["NA"]',
          oper_link: 'https://www.arkatiss.com/',
          oper_output: 'NA',
          oper_value: 'NA',
          description: 'Home',
          childs: [],
          title: 'Home',
        },
        {
          operation_type: 'link',
          category: 'data_entry',
          uniqueId: 'NA',
          attr_type: 'nav',
          attr_name: 'About Us',
          attr_ref: '["NA"]',
          oper_link: 'https://www.arkatiss.com/about-us/',
          oper_output: 'NA',
          oper_value: 'NA',
          description: 'About Us',
          childs: [],
          title: 'About Us',
        },
        {
          operation_type: 'link',
          category: 'data_entry',
          uniqueId: 'NA',
          attr_type: 'nav',
          attr_name: 'Services',
          attr_ref: '["NA"]',
          oper_link: 'https://www.arkatiss.com/services/',
          oper_output: 'NA',
          oper_value: 'NA',
          description: 'Services',
          childs: [],
          title: 'Services',
        },
        {
          operation_type: 'NA',
          category: 'data_entry',
          uniqueId: 'NA',
          attr_type: 'nav',
          attr_name: 'Products',
          attr_ref: '["NA"]',
          oper_link: 'NA',
          oper_output: 'NA',
          oper_value: 'NA',
          description: 'Products',
          childs: [
            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'NEXT GEN',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'NEXT GEN',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'SCYANTRA',
                  attr_ref: '["NA"]',
                  oper_link: 'https://www.arkatiss.com/products/chatbot/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'SCYANTRA',
                  childs: [],
                  title: 'SCYANTRA',
                },
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'AI ASSISTED COMMERCE',
                  attr_ref: '["NA"]',
                  oper_link: 'https://www.arkatiss.com/products/ecommerce/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'AI ASSISTED COMMERCE',
                  childs: [],
                  title: 'AI ASSISTED COMMERCE',
                },
              ],
              title: 'NEXT GEN',
            },
            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'PROCESS RE-ENGINEERING',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'PROCESS RE-ENGINEERING',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'PROCESS MANAGEMENT',
                  attr_ref: '["NA"]',
                  oper_link:
                    'https://www.arkatiss.com/products/process-management/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'PROCESS MANAGEMENT',
                  childs: [],
                  title: 'PROCESS MANAGEMENT',
                },
              ],
              title: 'PROCESS RE-ENGINEERING',
            },
            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'DATA ENGINEERING',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'DATA ENGINEERING',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'DATA PIPELINE',
                  attr_ref: '["NA"]',
                  oper_link: 'https://www.arkatiss.com/products/data-pipeline/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'DATA PIPELINE',
                  childs: [],
                  title: 'DATA PIPELINE',
                },
              ],
              title: 'DATA ENGINEERING',
            },

            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'USER MANAGEMENT',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'USER MANAGEMENT',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'HELP DESK',
                  attr_ref: '["NA"]',
                  oper_link: 'https://www.arkatiss.com/products/helpdesk/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'HELP DESK',
                  childs: [],
                  title: 'HELP DESK',
                },
              ],
              title: 'USER MANAGEMENT',
            },
            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'SECURITY',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'SECURITY',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'IDENTITY & ACCESS MANAGEMENT',
                  attr_ref: '["NA"]',
                  oper_link: 'https://www.arkatiss.com/products/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'IDENTITY & ACCESS MANAGEMENT',
                  childs: [],
                  title: 'IDENTITY & ACCESS MANAGEMENT',
                },
              ],
              title: 'SECURITY',
            },
            {
              operation_type: 'NA',
              category: 'data_entry',
              uniqueId: 'NA',
              attr_type: 'nav',
              attr_name: 'KNOWLEDGE MGT',
              attr_ref: '["NA"]',
              oper_link: 'NA',
              oper_output: 'NA',
              oper_value: 'NA',
              description: 'KNOWLEDGE MGT',
              childs: [
                {
                  operation_type: 'link',
                  category: 'data_entry',
                  uniqueId: 'NA',
                  attr_type: 'nav',
                  attr_name: 'CONTENT MANAGEMENT',
                  attr_ref: '["NA"]',
                  oper_link:
                    'https://www.arkatiss.com/products/content-management/',
                  oper_output: 'NA',
                  oper_value: 'NA',
                  description: 'CONTENT MANAGEMENT',
                  childs: [],
                  title: 'CONTENT MANAGEMENT',
                },
              ],
              title: 'KNOWLEDGE MGT',
            },
          ],
          title: 'Products',
        },
        {
          operation_type: 'link',
          category: 'data_entry',
          uniqueId: 'NA',
          attr_type: 'nav',
          attr_name: 'Contact Us',
          attr_ref: '["NA"]',
          oper_link: 'https://www.arkatiss.com/contact-us/',
          oper_output: 'NA',
          oper_value: 'NA',
          description: 'Contact Us',
          childs: [],
          title: 'Contact Us',
        },
      ],
      title: 'Hi! I am Intellobot. How can I help you?',
    },
  ];
  edit = false;
  appearanceConfig: any = {};
  infosetFlag: any = false;
  constructor(
    public dialogBox: MatDialog,
    private http: HttpClient,
    public api: InfosetsService,
    private toast: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    sessionStorage.setItem('activeListMenu', 'Infosets');
    this.screenName = sessionStorage.getItem('activeListMenu');
    console.log(this.screenName);
  }

  ngOnInit(): void {
    this.initDiagram = this.initDiagram.bind(this);
    this.retrieveDomain();
    this.selectViewOption = this.viewOptions[1].value;
    this.selectCustomKey = this.customBuildInfoset[1].name;
    if (this.customBuildInfoset && this.customBuildInfoset.length > 0) {
      this.activeMenu = this.customBuildInfoset[0].key;
    }
  }
  retrieveDomain(): any {
    const body = { chat_bot_type: 'retrieve' };
    this.api.domainData(body).subscribe(
      (res) => {
        console.log(res);
        if (res.status === 200 && res.res_status) {
          this.filteredDomainOptions = res.data;
        }
        //this.onSuccesssRetDomain(res);
      },
      (err) => {
        //this.onErrorr(err);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {}
  addNode(type: string, parentKey: number): void {
    const newKey = ++this.nextKey;

    let obj = {
      key: newKey,
      text: type,
      color: '#fff',
      parent: parentKey,
      buttonColor: '#3EA3EC',
      plusIconColor: '#fff',
      operation_type: '',
      description: '',
      category: '',
      master_data_id: '',
      //domain: this.diagramNodeData[this.diagramNodeData.length - 1]?.domain ?? '',
      //sub_domain: this.diagramNodeData[this.diagramNodeData.length - 1]?.sub_domain ?? '',
      attr_type: '',
      attr_name: '',
      attr_ref: '',
      oper_link: '',
      oper_output: '',
      oper_value: '',
      id: '',
      // infoset: this.diagramNodeData[this.diagramNodeData.length - 1]?.infoset ?? '',
      type: type,
    };
    if (type === 'Form') {
      Object.assign(obj, {
        fields: [
          {
            name: 'Ticket Id',
            type: '',
            placeholder: '',
            value: '',
            required: false,
          },
        ],
      });
    }
    //this.rowNodeIndex = this.diagramNodeData.length;
    this.diagramNodeData.push(obj);
    this.diagramLinkData.push({ key: -newKey, from: parentKey, to: newKey });
    console.log(this.diagramNodeData);
    console.log(this.diagramLinkData);
    this.skipsDiagramUpdate = false;
    this.diagramNodeData = [...this.diagramNodeData];
    this.diagramLinkData = [...this.diagramLinkData];
  }
  public initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key',
      }),
      layout: $(go.TreeLayout, {
        angle: 90,
        layerSpacing: 35,
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      {
        selectionAdornmentTemplate: $(
          go.Adornment,
          'Auto',
          $(go.Shape, { fill: null, stroke: 'dodgerblue', strokeWidth: 2 }),
          $(go.Placeholder)
        ),
      },
      $(
        go.Shape,
        'RoundedRectangle',
        { strokeWidth: 1, stroke: '#3ea3ec' },
        new go.Binding('fill', 'color'),
        {
          click: (e: any, obj: any) => {
            var node = obj.part;
            if (node) {
              this.openConfigMenu(node, 'config');
            }
          },
        }
      ),
      $(
        go.Panel,
        'Vertical',
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding('text', 'text'),
          new go.Binding('font', 'font').makeTwoWay(),
          {
            click: (e: any, obj: any) => {
              var node = obj.part;
              if (node) {
                this.openConfigMenu(node, 'config');
              }
            },
          }
        ),
        $(
          go.Panel,
          'Auto',
          {
            alignment: go.Spot.Bottom,
            alignmentFocus: go.Spot.Bottom,
          },
          $(
            go.Panel,
            'Spot',
            $(
              go.Shape,
              'Circle',
              {
                click: (e: any, obj: any) => this.onAddNodeButtonClick(e, obj),
              },
              {
                width: 24,
                height: 24,
                stroke: null,
                strokeWidth: 0,
              },
              new go.Binding('fill', 'buttonColor')
            ),
            $(
              go.Shape,
              'PlusLine',
              { width: 12, height: 12, cursor: 'pointer' },
              {
                click: (e: any, obj: any) => this.onAddNodeButtonClick(e, obj),
              },
              new go.Binding('stroke', 'plusIconColor')
            )
          )
        )
        // $(
        //   'Button',
        //   {
        //     alignment: go.Spot.Bottom,
        //     alignmentFocus: go.Spot.Bottom,
        //     click: (e, obj) => this.onAddNodeButtonClick(e, obj),
        //   },
        //   $(go.Shape, 'PlusLine', { width: 12, height: 12 })
        // )
      )
    );

    return diagram;
  }

  private onAddNodeButtonClick(e: go.InputEvent, obj: go.GraphObject) {
    const clickedNode = obj.part;
    if (clickedNode instanceof go.Node) {
      const nodeData = clickedNode.data;
      this.contextNodeData = nodeData;
      const mousePt = e.viewPoint;
      this.openMenuAt(mousePt.x, mousePt.y);
    }
  }

  private openMenuAt(x: number, y: number) {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.matMenuTrigger.openMenu();
    setTimeout(() => {
      const overlayPane = document.querySelector(
        '.cdk-overlay-pane'
      ) as HTMLElement;
      if (overlayPane) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const leftPercent = (x / viewportWidth) * 100;
        const topPercent = ((y + 210) / viewportHeight) * 100;

        overlayPane.style.position = 'absolute';
        overlayPane.style.left = `${leftPercent}%`;
        overlayPane.style.top = `${topPercent}%`;
      }
    }, 0);
  }

  public handleMenuAction(action: string) {
    console.log(this.contextNodeData);
    if (this.contextNodeData) {
      this.addNode(action, this.contextNodeData.key);
    }
  }
  saveInfoset(saveDialogBox: any) {
    this.dialogBox?.open(saveDialogBox as any, {
      width: '24%',
      height: '42%',
      disableClose: true,
      panelClass: 'edit-user-dialog',
    });
  }
  closeDialog() {
    this.dialogBox.closeAll();
  }
  cancelScreen() {
    this.closeDialog();
  }
  editTitle(): void {
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      this.infoSetName = newTitle;
    }
  }

  openConfigMenu(e: any, b: any) {
    this.dialogDetails = '';
    console.log(e, b);
    //this.rowNodeIndex = e?.zb.key;
    console.log(this.rowNodeIndex);
    this.rowNodeIndex = this.diagramNodeData.findIndex(
      (res: any) => res.key === e?.zb.key
    );
    console.log(this.nodeIndex);
    console.log(this.diagramModelData);
    console.log(this.diagramLinkData);
    console.log(this.diagramNodeData);
    if (b === 'config') {
      this.showConfigMenu = true;
      this.cardDetail = e?.zb;
    }
  }

  selectValue(v: any) {
    console.log(v.value);
  }

  selectConfig(m: any, name: any) {
    this.activeMenu = m;
    sessionStorage.setItem('activeListMenu', name);
  }

  onFileSelected(event: Event, type: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFile = fileInput.files[0];
      this.onUpload(type);
      this.previewImage(this.selectedFile, type);
    }
  }

  triggerFileInput(t: any) {
    this.fileType = t;
    document.getElementById('fileInput')?.click();
  }
  previewImage(file: File, t: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (t === 'widgetIcon') {
        this.widgetIcon = e.target?.result;
      } else if (t === 'headerLogo') {
        this.headerIcon = e.target?.result;
      } else if (t === 'botIcon') {
        this.botIcon = e.target?.result;
      }
    };
    reader.readAsDataURL(file);
  }
  onUpload(type: any) {
    if (!this.selectedFile) return;
    const uploadData = new FormData();
    uploadData.append('image', this.selectedFile, this.selectedFile.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (type === 'widgetIcon') {
        localStorage.setItem('widgetIcon', base64String);
        this.widgetIcon = base64String;
      } else if (type === 'headerLogo') {
        localStorage.setItem('headerLogo', base64String);
        this.headerIcon = base64String;
      } else if (type === 'botIcon') {
        localStorage.setItem('botIcon', base64String);
        this.botIcon = base64String;
      }
    };
    reader.readAsDataURL(this.selectedFile);
  }
  onCheckboxChange(checkbox: string) {
    if (checkbox === 'left' && this.checkboxes.left) {
      this.checkboxes.right = false;
    } else if (checkbox === 'right' && this.checkboxes.right) {
      this.checkboxes.left = false;
    }
  }

  addMessage() {
    this.popVisible = true;
  }

  backToInfosetCreation() {
    console.log('iam in main screen');
    this.buildForms = 'buildInfosetsScreen';
    this.activeMenu = 'appearance';
    sessionStorage.setItem('activeListMenu', 'Infosets');
  }
  showBot = false;
  openTestBoatChat() {
    this.showBot = true;
    this.initBot();
    // this.dialogBox?.open(openChatTestBot as any, {
    //   width: '360px',
    //   height: '610px',
    //   disableClose: true,
    //   panelClass: 'chat-test-dialog',
    // });
  }
  botResponse: any = [];
  initBot() {
    console.log(this.diagramNodeData);
    this.sampleBotResponse = [];
    this.sampleBotResponse = this.transformArray(this.diagramNodeData);
    console.log(this.sampleBotResponse);

    this.botResponse = [
      {
        output: this.sampleBotResponse[0].attr_name,
        list: this.getChilds(this.sampleBotResponse[0]),
      },
    ];
  }
  sendMsg(data: any = null) {
    this.botResponse.push({ input: data.attr_name });
    setTimeout(() => {
      this.botResponse.push({
        output:
          this.getChilds(data).length > 0
            ? 'Please select following'
            : 'I am sorry there was an error whi le processing request',
        list: this.getChilds(data),
      });
    }, 2000);
  }
  getChilds(data: any) {
    if (data?.childs) {
      return data?.childs;
    }
  }
  updateFormDetails(m: any, type: any) {
    this.dialogDetails = type;
    this.selectedFormDetails = m;
    console.log('formDetails', m, type);
  }
  rowNodeIndex: any = 1;
  addProps(m: any, i: any) {
    console.log(m);
    console.log(i);
    this.updateIndex = i;
    //this.rowNodeIndex = i;
    console.log(this.diagramNodeData[this.rowNodeIndex]);
    this.dialogDetails = 'Buttons';
  }
  addField() {
    this.diagramNodeData[this.rowNodeIndex]?.fields.push({
      name: 'Ticket Id',
      type: '',
      placeholder: '',
      value: '',
      required: false,
    });
  }

  saveField() {
    console.log('saveFields', this.diagramNodeData[this.rowNodeIndex]?.fields);
  }

  deleteFormDetails(index: any) {
    this.diagramNodeData[this.rowNodeIndex]?.fields.splice(index, 1);
    console.log(
      'deleteFormDetails',
      this.diagramNodeData[this.rowNodeIndex]?.fields
    );
  }
  assignRequired(event: any) {
    console.log(event);
  }
  removeNodeData(i: any) {
    const filteredLinkData = this.removeConnectedObjects(
      i,
      this.diagramLinkData
    );
    const matchedLinkData: any = [];
    this.diagramNodeData?.map((item: any) => {
      filteredLinkData?.map((sub) => {
        if (item.key === Math.abs(sub.key)) {
          matchedLinkData.push(item);
        }
      });
    });
    this.diagramNodeData = matchedLinkData;
    this.diagramLinkData = filteredLinkData;
  }
  removeConnectedObjects(index: number, data: any[]) {
    const startObject = data[index];

    if (!startObject) return data;

    const startKey = startObject.key;

    let keysToRemove = new Set([startKey, Math.abs(startKey)]);

    const findConnectedObjects = (key: number) => {
      for (let obj of data) {
        if (keysToRemove.has(obj.key)) continue;

        if (
          (obj.from && Math.abs(obj.from) === Math.abs(key)) ||
          (obj.to && Math.abs(obj.to) === Math.abs(key))
        ) {
          keysToRemove.add(obj.key);

          findConnectedObjects(obj.key);
        }
      }
    };

    findConnectedObjects(startKey);
    return data.filter((obj) => !keysToRemove.has(obj.key));
  }

  selectCategory(event: any): any {
    const catName: any = event.value;
    // this.addForm.reset();
    this.catName = catName;
    this.attrValues = [];
    this.operationTypes = [];
    this.orderTypes = [];
    this.tdtpes = [];
    if (catName === 'data_retrieval') {
      if (this.catName === 'data_retrieval' && this.attr === 'td') {
        this.showAttribute = 'true';
        this.tdtpes = [
          { op_type: 'Summary', field: 'summary' },
          { op_type: 'Detail', field: 'detail' },
          { op_type: 'Aggregation', field: 'aggregation' },
        ];
      } else {
        this.showAttribute = 'false';
      }
      const values = [
        { op_type: 'Api', field: 'api' },
        { op_type: 'Script', field: 'script' },
        { op_type: 'Sql', field: 'sql' },
        { op_type: 'Fixed', field: 'fixed' },
      ];
      this.attrValues = [
        { op_type: 'MD', field: 'md' },
        { op_type: 'TD', field: 'td' },
        { op_type: 'NAV', field: 'nav' },
      ];
      this.operationTypes = values;
      this.duration = true;
      this.orderShow = false;
      this.operation = 'Operation';
      this.oplink = false;
      // this.selectOperation('link');
    } else if (catName === 'data_entry') {
      // this.addForm.patchValue({
      //   operation_type: ['']
      // });
      this.oplinktext = 'Operation Link';
      // this.showtd = false;
      // this.showtd2 = true;
      this.showAttribute = 'false';
      this.orderShow = true;
      this.duration = false;
      this.formvalue = true;
      // this.addForm.patchValue({
      //   oper_link: ['']
      // });
      this.attrValues = [{ op_type: 'NAV', field: 'nav' }];
      this.orderTypes = [
        { op_type: 'Previous Orders', field: 'previous_orders' },
        { op_type: 'New Orders', field: 'new_orders' },
      ];
      const values = [
        { op_type: 'NA', field: 'NA' },
        { op_type: 'Link', field: 'link' },
        { op_type: 'Browse', field: 'browse' },
        { op_type: 'Form', field: 'form' },
        { op_type: 'Input', field: 'input' },
        { op_type: 'Output', field: 'output' },
      ];
      this.operationTypes = values;
    }
  }
  selectOperation(event: any, empty: any): any {
    const operation: any = event.value;
    this.operationVal = operation;
    if (this.catName === 'data_retrieval') {
      if (this.operationVal === 'fixed' && this.catName === 'data_retrieval') {
        this.oplink = false;
        this.opvalue = true;
        this.opinput = false;
        // this.opvalue = true;
      } else if (
        this.operationVal === 'script' &&
        this.catName === 'data_retrieval'
      ) {
        this.oplink = false;
        this.opvalue = false;
        this.opinput = true;
      } else if (
        this.operationVal === 'sql' &&
        this.catName === 'data_retrieval'
      ) {
        //this.dialog.open(openConnectors, { width: 'max-content', maxHeight: 'calc(100vh - 60px)' });
        // this.dialog.open();
        // this.showConnectorsList();
        this.oplink = true;
        this.oplinktext = 'Enter Query';
        this.opvalue = false;
        this.opinput = false;
      } else {
        // this.addForm.patchValue({
        //   oper_link: ['']
        // });
        this.oplinktext = 'Operation Link';
        this.oplink = true;
        this.opvalue = true;
        this.opinput = true;
        this.opvalue = false;
      }
    } else {
      if (this.operationVal === 'link' && this.catName === 'data_entry') {
        this.oplink = true;
        this.opinput = false;
        this.duration = false;
        this.showfile = false;
      } else if (
        this.operationVal === 'browse' &&
        this.catName === 'data_entry'
      ) {
        this.showfile = true;
        this.oplink = false;
        this.duration = false;
      } else if (
        this.operationVal === 'input' &&
        this.catName === 'data_entry'
      ) {
        this.duration = true;
        this.oplink = true;
        this.opinput = false;
      } else {
        this.opvalue = false;
        this.showfile = false;
        this.oplink = false;
        this.opinput = false;
        this.duration = false;
      }
    }

    // if (operation === 'link') {
    //   this.operation = 'Paste Link Here';
    //   this.showfile = false;
    //   this.showmasterdata = true;
    // } else if (operation === 'browse') {
    //   this.operation = 'Browse File';
    //   this.showmasterdata = false;
    //   this.showfile = true;
    // }
  }
  selectAttribute(event: any): any {
    const attr: any = event.value;
    this.attr = attr;
    if (this.catName === 'data_retrieval' && attr === 'td') {
      this.showtd = true;
      this.showtd2 = false;
      this.tdtpes = [
        { op_type: 'Summary', field: 'summary' },
        { op_type: 'Detail', field: 'detail' },
        { op_type: 'Aggregation', field: 'aggregation' },
      ];
    } else {
      this.showtd = false;
      this.showtd2 = true;
    }
  }

  changeSecurity(evt: any): void {
    if (this.tempSecuriryFlag === undefined) {
      if (evt.checked === true) {
        this.securityFlag = 'public';
      } else {
        this.securityFlag = 'private';
      }
    } else {
      if (evt.checked === true) {
        this.securityFlag = 'public';
      } else {
        this.securityFlag = 'private';
      }
      this.updateSecurityFlag();
    }
  }
  addnewInfoset() {}
  showFormDiv() {}

  updateSecurityFlag(): void {
    this.jsonfilenameData = '';
    // this.jsonfilenameData = this.infosetform.get('infosetControl').value;
    const body = {
      json_format: {
        domain: this.domain.domain,
        sub_domain: this.subDomain,
        category: 'data_entry',
        security_flag: this.securityFlag,
      },
      file: this.jsonfilenameData,
      infoset_type: 'update',
    };
    // this.cs.saveInfoset(body).subscribe(
    //   (res:any) => {
    //     this.onSuccessUpdateFlag(res);
    //   },
    //   (err:any) => {
    //     this.onErrorr(err);
    //   }
    // );
  }
  changeSubDomainForInfoset(data: any = null): any {
    this.infosetFlag = true;
    if (data?.domain && data?.subDomain) {
      this.domain = this.filteredDomainOptions.find(
        (item: any) => item.domain === data?.domain
      );
      this.subDomain = data?.subDomain;
    }
    this.getDomainSubdomainBasedList(this.domain, this.subDomain);
  }
  dialogSubDomainForInfoset() {
    this.getDomainSubdomainBasedList(this.dialogDomain, this.dialogSubDomain);
  }
  getDomainSubdomainBasedList(domain: any, subDomain: any) {
    this.rowData = [];
    const body = {
      infoset_type: 'retrieve',
      domain: domain?.domain,
      sub_domain: subDomain,
    };
    this.api.retInfoset(body).subscribe(
      (res) => {
        console.log(res);
        if (res.status === 200 && res.res_status) {
          const resultSet = res?.data?.map((item: any, i: any) => {
            return {
              srNumber: i + 1,
              infoset_name: item?.file?.split('.')[0],
              item,
            };
          });
          this.rowData = resultSet;
          this.filteredInfosetOptions = res.data.map((item: any) => {
            return {
              file: item?.file,
              id: item?.id,
              name: item?.file?.split('.')[0],
            };
          });
          if (this.filteredInfosetOptions.length > 0 && this.edit === false) {
            this.infosetFlag = true;
          } else {
            this.infosetFlag = false;
          }
        }

        //this.onSuccessInfoView(res);
      },
      (err) => {
        //this.onErrorr(err);
      }
    );
  }
  operationType: any = undefined;
  category: any = undefined;
  attrType: any = undefined;
  attrName: any = undefined;
  attrRef: any;
  operLink: any = undefined;
  operOutput: any = undefined;
  operValue: any = undefined;
  unique_id: any = undefined;
  getValidValue(value: string | undefined | null): string {
    return value && value !== '' ? value : 'NA';
  }
  saveRowData() {
    this.unique_id = Math.floor(100000 + Math.random() * 9000);
    let attrRef;
    if (
      this.diagramNodeData[this.rowNodeIndex].attr_ref === null ||
      this.diagramNodeData[this.rowNodeIndex].attr_ref === '' ||
      this.diagramNodeData[this.rowNodeIndex].attr_ref === undefined
    ) {
      const a = '["NA"]';
      attrRef = a;
    } else {
      attrRef = this.diagramNodeData[this.rowNodeIndex].attr_ref;
    }
    const dataValues: any = {
      operation_type: [
        this.getValidValue(
          this.diagramNodeData[this.rowNodeIndex].operation_type
        ),
      ],
      description: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].description),
      ],
      category: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].category),
      ],
      master_data_id: [uuid.v4()],
      // domain: [this.getValidValue(this.diagramNodeData[this.rowNodeIndex].domain?.domain)],
      //sub_domain: [this.getValidValue(this.diagramNodeData[this.rowNodeIndex].sub_domain)],
      attr_type: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].attr_type),
      ],
      attr_name: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].attr_name),
      ],
      attr_ref: [attrRef.replace(/'/g, '"')],
      oper_link: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].oper_link),
      ],
      oper_output: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].oper_output),
      ],
      oper_value: [
        this.getValidValue(this.diagramNodeData[this.rowNodeIndex].oper_value),
      ],
      id: [this.unique_id],
      //infoset: this.infoset
    };

    console.log(dataValues);
    const body = {
      master_store_data: dataValues,
      master_data_type: 'insert',
    };
    Object.assign(this.diagramNodeData[this.rowNodeIndex], {
      text: this.diagramNodeData[this.rowNodeIndex].attr_name,
    });
    this.diagramNodeData = [...this.diagramNodeData];
    this.dialogDetails = '';
    console.log(this.diagramNodeData);
    return;
    this.api.chatbotMasterData(body).subscribe(
      (res: any) => {
        console.log(res);
        this.getTableData();
      },
      (err) => {
        //this.onErrorrNewHierachy(err);
      }
    );
    console.log(body);
  }
  appearanceData(event: any) {
    console.log(event);
    this.appearanceConfig = event;
  }
  saveInfosetData(type: any) {
    console.log(this.diagramNodeData);
    const timeStamp: any = new Date().toISOString();
    this.infoset
      ? this.infoset
      : (this.infoset =
          this.dialogDomain.domain +
          '_' +
          this.dialogSubDomain +
          '_' +
          timeStamp);
    let body: any = {};
    const data = this.transformArray(this.diagramNodeData);
    const firstObjectChilds = data[0]?.childs || [];
    const transformedArray = [...firstObjectChilds, ...data.slice(1)];

    const domainData = {
      domain: this.dialogDomain.domain,
      sub_domain: this.dialogSubDomain,
    };
    body = {
      json_format: {
        botType: this.selectViewOption,
        domain_data: domainData,
        infoset_data:
          transformedArray?.length === 0
            ? [{ category: 'data_entry' }]
            : transformedArray,
        draggedData: {
          linkData: this.diagramLinkData,
          nodeData: this.diagramNodeData,
        },
      },
      file: this.infoset,
    };
    if (this.filteredInfosetOptions?.length === 0 && this.edit === false) {
      Object.assign(body, { infoset_type: 'insert' });
    }
    console.log(body);
    if (Object.keys(this.appearanceConfig).length > 0) {
      Object.assign(body['json_format'], { appearance: this.appearanceConfig });
      console.log(body);
    }
    if (
      (this.filteredInfosetOptions.length > 0 && this.edit === false) ||
      this.infosetFlag === true
    ) {
      this.toast.warning(
        'This infoset already exists. You are not allowed to save it. Please update the existing infoset instead.'
      );
    } else if ((this.infosetFlag = false)) {
      this.api.saveInfoset(body).subscribe(
        (res) => {
          console.log(res);
          if (res.status === 200 && res.res_status) {
            this.toast.success(res.msg);
            this.closeDialog();
            this.dialogDomain = '';
            this.dialogSubDomain = '';
            this.infoset = '';
          } else {
            this.toast.error(res.msg);
          }
          //this.onSuccesssInfo(res);
        },
        (err) => {
          //this.onErrorr(err);
        }
      );
    }
  }
  getTableData(): any {
    const body = {
      master_data_type: 'retrieve',
      domain: this.domain.domain,
      sub_domain: this.subDomain,
      id: this.unique_id,
      infoset: this.infoset,
    };
    this.api.chatbotMasterData(body).subscribe(
      (res) => {
        console.log(res);
        // this.onSuccessschangesub(res);
      },
      (err) => {
        //this.onErrorr(err);
      }
    );
  }
  transformArray(input: any[]): any[] {
    const map = new Map<number, any>(); // Map to store items by their key
    const result: any[] = [];
    input.forEach((item) => {
      let attrRef;
      if (
        item.attr_ref === null ||
        item.attr_ref === '' ||
        item.attr_ref === undefined
      ) {
        const a = '["NA"]';
        attrRef = a;
      } else {
        attrRef = item.attr_ref;
      }
      const transformedItem = {
        operation_type: this.getValidValue(item.operation_type),
        category: this.getValidValue(item.category),
        uniqueId: this.getValidValue(item.uniqueId),
        attr_type: this.getValidValue(item.attr_type),
        attr_name: this.getValidValue(item.attr_name ?? item?.attr_name),
        attr_ref: attrRef,
        oper_link: this.getValidValue(item.oper_link),
        oper_output: this.getValidValue(item.oper_output),
        oper_value: this.getValidValue(item.oper_value),
        description: this.getValidValue(item.description),
        childs: [],
        title: item.attr_name,
      };

      map.set(item.key, transformedItem);
    });
    input.forEach((item) => {
      if (item.parent !== '') {
        const parent = map.get(item.parent);
        if (parent) {
          parent.childs.push(map.get(item.key));
        }
      } else {
        result.push(map.get(item.key));
      }
    });

    return result;
  }
  editRow(evt: any) {
    console.log(evt);
    this.edit = true;
    this.diagramNodeData = evt.item.info_data?.draggedData?.nodeData;
    this.diagramLinkData = evt.item.info_data?.draggedData?.linkData;
    this.appearanceConfig = evt.item.info_data?.appearance;
    this.buildForms = 'buildInfosetsScreen';
    const domainObj = this.filteredDomainOptions.find(
      (item: any) => item.domain === evt.item.info_data.domain_data.domain
    );
    const infosetObj = this.filteredInfosetOptions.find(
      (item: any) => item.file === evt.item.file
    );
    this.dialogDomain = domainObj;
    this.infoset = infosetObj?.file;
    this.dialogSubDomain = evt.item.info_data.domain_data.sub_domain;
    this.nextKey = this.diagramNodeData[this.diagramNodeData.length - 1].key;
  }
  deleteRow(event: any) {
    console.log(event);
    const body = {
      infoset_id: event.item.id,
      infoset_yml: event.item.file,
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.api.infosetDelete(body).subscribe((res: any) => {
          console.log(res);
          if (res.status === 200 && res.res_status) {
            this.toast.success(res.msg);
            this.getTableData();
            this.getDomainSubdomainBasedList(this.domain, this.subDomain);
          } else {
            this.toast.error(res.msg);
          }
        });
      },
      reject: () => {},
    });
  }

  titleChange(data: any, index: any) {
    this.updatedTitle = data;
    this.sampleBotResponse[index].attr_name = data;
    this.sampleBotResponse[index].title = data;
    this.sampleBotResponse[index].description = data;
    console.log(this.sampleBotResponse);
  }
  saveChangedTitle() {
    this.diagramNodeData[this.updateIndex].attr_name = this.updatedTitle;
    this.diagramNodeData[this.updateIndex].title = this.updatedTitle;
    this.diagramNodeData[this.updateIndex].description = this.updatedTitle;
    console.log(this.sampleBotResponse, this.diagramNodeData);
  }
  cancel() {
    this.dialogDetails = '';
    this.updatedTitle = '';
    this.updateIndex = '';
    this.initBot();
  }
  showForm() {
    this.buildForms = 'buildInfosetsScreen';
    this.edit = false;
    this.appearanceConfig = {
      widgetIcon: '',
      headerLogo: '',
      botIcon: '',
      headerText: 'ARKATISS DESK',
      hintText: 'Enter Prompt',
      accentColor: '#ffffff',
      fontColor: '#555555',
      customCSS: '',
      chatPosition: 'right',
    };
  }
}
