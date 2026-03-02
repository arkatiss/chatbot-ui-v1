import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import { InfosetsService } from '../../service/infosets.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-build-infosets-jointjs',
  templateUrl: './build-infosets-jointjs.component.html',
  styleUrl: './build-infosets-jointjs.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class BuildInfosetsJointjsComponent implements OnInit, AfterViewInit {
  /* jointjs variables*/
  // @ViewChild('paper', { static: true }) paperEl!: ElementRef;
  @Output() nodeSelected = new EventEmitter<{}>();
  @Output() diagramChanged = new EventEmitter<any>();
  @ViewChild('paper', { static: false }) paperEl!: ElementRef;

  graph!: joint.dia.Graph;
  paper!: joint.dia.Paper;
  selectedNode: joint.dia.Element | null = null;
  rootNode!: joint.dia.Element;
  nodeIndex = 0;
  // selectedNode: joint.shapes.standard.Rectangle | null = null;
  menuVisible = false;
  menuX = 0;
  menuY = 0;
  searchText = '';

  menuItems = [
    'Send Message',
    'Collect Input',
    'Buttons',
    'Carousel',
    'Calendar',
  ];
  editingNode: joint.dia.Element | null = null;
  editingText = '';

  editorX = 0;
  editorY = 0;
  editorWidth = 120;
  draggedType: string | null = null;
  showConfigMenu = false;
  // selectedNode!: joint.dia.Element;
  // cardDetail: any = {
  //   text: '',
  //   buttons: [],
  // };
  cardDetail: any = {};
  zoomLevel = 1;

  constructor(
    public api: InfosetsService,
    private toast: ToastrService,
    private confirmationService: ConfirmationService,
  ) {}
  ngOnInit(): void {}

  /*jointjs code*/

  get filteredMenuItems() {
    return this.menuItems.filter((item) =>
      item.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }
  // ngAfterViewInit() {
  //   sessionStorage.getItem('diagramData')
  //     ? this.loadDiagram(JSON.parse(sessionStorage.getItem('diagramData')!))
  //     : this.initDiagram();
  // }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.paperEl) return;

      const saved: any = sessionStorage.getItem('diagramData');
      console.log('ngAfterViewInit Saved', JSON.parse(saved));

      saved ? this.loadDiagram(JSON.parse(saved)) : this.initDiagram();
    });
  }

  initDiagram() {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: this.paperEl.nativeElement,
      model: this.graph,
      width: '100%',
      height: 600,
      overflow: true,
      gridSize: 10,
      interactive: true,
      defaultLink: () =>
        new joint.shapes.standard.Link({
          router: { name: 'orthogonal' },
          connector: { name: 'rounded' },
          attrs: {
            line: {
              stroke: '#4f8cff',
              strokeWidth: 2,
            },
          },
        }),
      linkPinning: false,
      validateConnection: (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet,
      ) => {
        // prevent self-link
        if (sourceView === targetView) return false;

        return true;
      },
    });

    /* ZOOM (ADD HERE) */
    this.attachZoom();

    const startNode = this.createNode(100, 100, 'Start', this.nodeIndex);
    this.graph.addCell(startNode);
    this.rootNode = startNode;
    this.bindPaperEvents();
  }

  createNode(x: number, y: number, text: string, index: number) {
    const node = new joint.shapes.standard.Rectangle();

    node.position(x, y);
    node.resize(180, 60);

    node.attr({
      body: {
        fill: '#ffffff',
        stroke: '#4f8cff',
        rx: 8,
        ry: 8,
      },
      label: {
        text,
        fontSize: 14,
        fill: '#000',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
      plusCircle: {
        r: 10,
        fill: '#4f8cff',
        cursor: 'pointer',
      },
      plusText: {
        text: '+',
        fill: '#fff',
        fontSize: 16,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        cursor: 'pointer',
      },
    });

    node.markup = [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'label' },
      { tagName: 'circle', selector: 'plusCircle' },
      { tagName: 'text', selector: 'plusText' },
    ];

    node.prop('ports/groups', {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#4f8cff',
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#4f8cff',
            fill: '#fff',
          },
        },
      },

      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#4f8cff',
            fill: '#fff',
          },
        },
      },
    });

    // ✅ ADD PORT INSTANCES
    node.addPorts([
      { id: 'top', group: 'top' },
      { id: 'right', group: 'right' },
      { id: 'left', group: 'left' },
    ]);

    // node.attr({
    //   plusCircle: { refX: '50%', refY: '118%', refY2: 0 },
    //   plusText: { refX: '50%', refY: '118%', refY2: 0, dy: '0.35em' },
    // });

    node.attr({
      plusCircle: {
        ref: 'body',
        refX: '50%',
        refY: '100%',
        refY2: 12,
      },
      plusText: {
        ref: 'body',
        refX: '50%',
        refY: '100%',
        refY2: 12,
        dy: '0.35em',
      },
    });

    // 🔑 FULL business JSON (matches your required format)
    (node as any).attributes.nodeData = {
      key: index,
      text,
      color: '#fff',
      loc: `${x} ${y}`,
      parent: '',
      font: '14px Manrope',
      buttonColor: '#3EA3EC',
      plusIconColor: '#fff',
      type: 'label',
      operation_type: 'NA',
      category: 'data_entry',
      attr_type: 'nav',
      attr_name: text,
      attr_ref: '["NA"]',
      oper_link: 'NA',
      oper_output: 'NA',
      oper_value: 'NA',
      description: text,
      title: text,
    };

    (node as any).children = [];

    return node;
  }

  addChild(type: string) {
    if (!this.selectedNode) return;

    const parent = this.selectedNode;
    console.log('addChild-parent', parent);
    const parentData = (parent as any).attributes.nodeData;

    const children = (parent as any).children as joint.dia.Element[];

    const parentPos = parent.position();
    const parentSize = parent.size();

    const LEVEL_GAP = 120;
    const H_GAP = 220;

    const index = children.length;
    const offset = index - children.length / 2;

    const child = this.createNode(
      parentPos.x + parentSize.width / 2 + offset * H_GAP - 90,
      parentPos.y + LEVEL_GAP,
      type,
      ++this.nodeIndex,
    );

    // 🔗 set parent reference
    (child as any).attributes.nodeData.parent = parentData.key;
    (child as any).attributes.nodeData.type = type;

    children.push(child);

    const link = new joint.shapes.standard.Link();
    link.source(parent);
    link.target(child);
    link.router('orthogonal');
    link.connector('rounded');
    link.attr({
      line: {
        stroke: '#4f8cff', // blue
        strokeWidth: 2,
        targetMarker: {
          type: 'path',
          d: 'M 10 -5 0 0 10 5 z',
        },
      },
    });
    this.graph.addCells([child, link]);
    this.applyTreeLayout();
    this.menuVisible = false;
    this.emitDiagramData();
  }

  // saveDiagram() {
  //   const elements = this.graph.getElements();

  //   const json = elements.map((el) => {
  //     const data = (el as any).attributes.nodeData;
  //     const pos = el.position();

  //     return {
  //       ...data,
  //       loc: `${Math.round(pos.x)} ${Math.round(pos.y)}`,
  //     };
  //   });

  //   sessionStorage.setItem('diagramData', JSON.stringify(json));
  // }

  bindGraphEvents() {
    this.paper.on('link:connect', (linkView: any) => {
      const link = linkView.model as joint.dia.Link;

      const source = link.getSourceElement();
      const target = link.getTargetElement();

      if (!source || !target) {
        link.remove();
        return;
      }

      // ❌ SAME NODE
      if (source === target) {
        link.remove();
        return;
      }

      // ❌ DUPLICATE CONNECTION
      if (this.isAlreadyConnected(source, target)) {
        link.remove();
        return;
      }

      // ✅ VALID CONNECTION → update JSON
      const parentData = (source as any).attributes.nodeData;
      const childData = (target as any).attributes.nodeData;

      if (parentData && childData) {
        childData.parent = parentData.key;
      }
    });
  }

  loadDiagram(dataArray: any[]) {
    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: this.paperEl.nativeElement,
      model: this.graph,
      width: '100%',
      height: 600,
      gridSize: 10,
      interactive: true,
      defaultLink: () =>
        new joint.shapes.standard.Link({
          router: { name: 'orthogonal' },
          connector: { name: 'rounded' },
          attrs: {
            line: {
              stroke: '#4f8cff',
              strokeWidth: 2,
            },
          },
        }),
      linkPinning: false,

      validateConnection: (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet,
      ) => {
        // prevent self-link
        if (sourceView === targetView) return false;

        return true;
      },
    });
    /* ZOOM (ADD HERE) */
    this.attachZoom();

    const map = new Map<number, joint.dia.Element>();

    // 1️⃣ CREATE ALL NODES FIRST
    dataArray.forEach((d) => {
      let x, y;

if (d?.loc) {
  [x, y] = d.loc.split(' ').map(Number);
}


      const node = this.createNode(x, y, d.text, d.key);
      (node as any).attributes.nodeData = d;
      (node as any).children = [];

      map.set(d.key, node);
      this.graph.addCell(node);
    });

    // 2️⃣ CREATE LINKS
    dataArray.forEach((d) => {
      if (d.parent === '' || d.parent === null || d.parent === undefined)
        return;

      const parent = map.get(d.parent);
      const child = map.get(d.key);

      if (!parent || !child) return; // safety

      (parent as any).children.push(child);

      const link = new joint.shapes.standard.Link();
      link.source(parent);
      link.target(child);

      // ⚠️ keep simple for now
      link.router('orthogonal');
      link.connector('rounded');
      link.attr({
        line: {
          stroke: '#4f8cff', // blue
          strokeWidth: 2,
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
          },
        },
      });
      this.graph.addCell(link);
    });
    this.nodeIndex = dataArray.length - 1;
    this.bindPaperEvents();
    this.applyTreeLayout();
  }
  applyTreeLayout() {
    joint.layout.DirectedGraph.layout(this.graph, {
      graphlib: dagre.graphlib,
      dagre: dagre,
      setLinkVertices: false,
      rankDir: 'TB', // Top → Bottom
      rankSep: 80, // vertical gap
      nodeSep: 60, // horizontal gap
      marginX: 50,
      marginY: 50,
    });

    this.emitDiagramData();
  }

  // centerDiagram() {
  //   const bbox = this.graph.getBBox(this.graph.getElements());
  //   this.paper.translate(-bbox.x + 50, -bbox.y + 50);
  // }

  bindPaperEvents() {
    const paperElement = this.paper.options['el'] as HTMLElement;

    paperElement.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    paperElement.addEventListener('drop', (e) => {
      e.preventDefault();

      const type = e.dataTransfer?.getData('text/plain');
      if (!type) return;

      const point = this.paper.clientToLocalPoint({
        x: e.clientX,
        y: e.clientY,
      });

      const node = this.createNode(point.x, point.y, type, ++this.nodeIndex);

      this.graph.addCell(node);
    });

    this.paper.on('element:pointerdown', (view: any, evt: PointerEvent) => {
      const data = (view.model as any).attributes.nodeData;
      if (data?.key === 0) {
        view.model.set('locked', true);
      }
      let target = evt.target as HTMLElement;

      while (target && !target.getAttribute('joint-selector')) {
        target = target.parentElement as HTMLElement;
      }

      const selector = target?.getAttribute('joint-selector');
      this.selectedNode = view.model as joint.dia.Element;
      console.log('###########', this.selectedNode);
      if (selector === 'plusCircle' || selector === 'plusText') {
        evt.stopPropagation();

        const local = this.paper.clientToLocalPoint({
          x: evt.clientX,
          y: evt.clientY,
        });
        this.menuX = local.x;
        this.menuY = local.y;
        // this.menuX = evt.clientX;
        // this.menuY = evt.clientY;
        this.menuVisible = true;
      }
    });
    this.paper.on('link:mouseup', (linkView: any) => {
      const link = linkView.model as joint.dia.Link;

      const source = link.getSourceElement();
      const target = link.getTargetElement();

      if (!source || !target || source === target) {
        link.remove();
        return;
      }

      if (this.hasExistingLink(source, target, link)) {
        link.remove();
        return;
      }

      const parentData = (source as any).attributes.nodeData;
      const childData = (target as any).attributes.nodeData;

      if (parentData && childData) {
        childData.parent = parentData.key;
      }
    });

    this.paper.on('element:pointerdblclick', (view: any, evt) => {
      const target = evt.target as HTMLElement;

      if (
        target.getAttribute('joint-selector') !== 'body' &&
        target.getAttribute('joint-selector') !== null
      )
        return;

      evt.stopPropagation();

      this.startInlineEdit(view.model as joint.dia.Element);

      this.hidePorts(view.model as joint.dia.Element);
    });

    this.paper.on('element:pointermove', () => {
      this.menuVisible = false;
      this.editingNode = null;
    });

    this.paper.on('blank:pointerdown', () => {
      this.menuVisible = false;
      this.editingNode = null;
    });

    // this.paper.on('element:pointerclick', (view: any) => {
    //   const model = view.model;
    //   const data = model.attributes.nodeData;
    //   this.selectedNode = view.model as joint.dia.Element;
    // });

    this.paper.on('element:pointerclick', (view: any) => {
      this.selectedNode = view.model as joint.dia.Element;

      const nodeData = (this.selectedNode as any).attributes.nodeData || {};
      this.nodeSelected.emit(nodeData);

      console.log('********', this.selectedNode, nodeData);
    });

    this.paper.on('link:pointerup', (linkView: any) => {
      const link = linkView.model as joint.dia.Link;

      const source = link.getSourceElement();
      const target = link.getTargetElement();

      if (!source || !target || source.id === target.id) {
        link.remove();
        return;
      }

      if (this.isDuplicateLink(link, source, target)) {
        link.remove();
        return;
      }

      const parent = (source as any).attributes.nodeData;
      const child = (target as any).attributes.nodeData;

      if (parent && child) {
        child.parent = parent.key;
      }
    });

    this.paper.on(
      'blank:mousewheel',
      (evt: WheelEvent, x: number, y: number) => {
        evt.preventDefault();

        const oldZoom = this.zoomLevel;

        // Wheel UP → zoom in, Wheel DOWN → zoom out
        // const scaleFactor = evt.deltaY < 0 ? 1.1 : 0.9;
        const scaleFactor = evt.deltaY < 0 ? 1.05 : 0.95;

        this.zoomLevel = Math.min(2, Math.max(0.4, oldZoom * scaleFactor));

        const localPoint = this.paper.clientToLocalPoint({
          x: evt.clientX,
          y: evt.clientY,
        });

        this.paper.scale(this.zoomLevel, this.zoomLevel);

        // 🔑 keep mouse position fixed
        this.paper.translate(
          localPoint.x - (localPoint.x * this.zoomLevel) / oldZoom,
          localPoint.y - (localPoint.y * this.zoomLevel) / oldZoom,
        );
      },
    );

    // this.paper.on('blank:mousewheel', (evt: WheelEvent) => {
    //   evt.preventDefault();

    //   const delta = evt.deltaY < 0 ? 0.1 : -0.1;
    //   this.zoomLevel = Math.min(2, Math.max(0.4, this.zoomLevel + delta));

    //   this.paper.scale(this.zoomLevel);
    // });
  }

  // zoomIn() {
  //   this.zoomLevel = Math.min(2, this.zoomLevel + 0.1);
  //   this.paper.scale(this.zoomLevel);
  // }

  // zoomOut() {
  //   this.zoomLevel = Math.max(0.4, this.zoomLevel - 0.1);
  //   this.paper.scale(this.zoomLevel);
  // }

  isAlreadyConnected(
    source: joint.dia.Element,
    target: joint.dia.Element,
    currentLink?: joint.dia.Link,
  ): boolean {
    return this.graph.getLinks().some((link) => {
      if (currentLink && link === currentLink) return false;

      const s = link.getSourceElement();
      const t = link.getTargetElement();

      return (s === source && t === target) || (s === target && t === source);
    });
  }
  isDuplicateLink(
    current: joint.dia.Link,
    a: joint.dia.Element,
    b: joint.dia.Element,
  ): boolean {
    return this.graph.getLinks().some((link) => {
      if (link.id === current.id) return false;

      const s = link.getSourceElement();
      const t = link.getTargetElement();

      if (!s || !t) return false;
      return (
        (s.id === a.id && t.id === b.id) || (s.id === b.id && t.id === a.id)
      );
    });
  }

  hasExistingLink(
    a: joint.dia.Element,
    b: joint.dia.Element,
    currentLink: joint.dia.Link,
  ): boolean {
    return this.graph.getLinks().some((link) => {
      if (link === currentLink) return false;

      const s = link.getSourceElement();
      const t = link.getTargetElement();

      if (!s || !t) return false;

      return (
        (s.id === a.id && t.id === b.id) || (s.id === b.id && t.id === a.id)
      );
    });
  }

  finishInlineEdit() {
    if (!this.editingNode) return;

    this.showPorts(this.editingNode);
    this.editingNode = null;
  }

  startInlineEdit(node: joint.dia.Element) {
    const paperEl = this.paper.options['el'] as HTMLElement;

    const pos = node.position();
    const size = node.size();
    const currentText = node.attr('label/text') || '';

    const old = document.getElementById('inline-editor');
    if (old) old.remove();

    const input = document.createElement('input');
    input.id = 'inline-editor';
    input.value = currentText;

    Object.assign(input.style, {
      position: 'absolute',
      left: `${pos.x}px`,
      top: `${pos.y }px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      fontSize: '14px',
      fontFamily: 'Manrope',
      textAlign: 'center',
      border: '2px solid #4f8cff',
      borderRadius: '8px',
      outline: 'none',
      zIndex: '1000',
    });

    paperEl.appendChild(input);
    input.focus();

    const finish = () => {

      node.attr('label/text', input.value);

      const data = (node as any).attributes.nodeData;
      if (data) {
        data.text = input.value;
        data.title = input.value;
        data.attr_name = input.value;
        data.description = input.value;
      }
this.emitDiagramData();
      input.remove();
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finish();
      if (e.key === 'Escape') input.remove();
    });

    input.addEventListener('blur', finish);
    this.emitDiagramData();
  }

  hidePorts(node: joint.dia.Element) {
    node.attr('ports/items/*/attrs/circle/display', 'none');
  }

  showPorts(node: joint.dia.Element) {
    node.attr('ports/items/*/attrs/circle/display', 'block');
  }

  commitEdit() {
    if (!this.editingNode) return;

    const newText = this.editingText.trim();
    if (!newText) return;

    this.editingNode.attr('label/text', newText);

    const data = (this.editingNode as any).attributes.nodeData;
    data.text = newText;
    data.title = newText;
    data.attr_name = newText;
    data.description = newText;

    this.editingNode = null;

    // this.saveDiagram();
    this.emitDiagramData();
  }

  deleteNodeRecursively(node: joint.dia.Element) {
    console.log('delete jointjs node-----', node);
    const children = (node as any).children || [];

    children.forEach((child: joint.dia.Element) => {
      this.deleteNodeRecursively(child);
    });

    this.graph.getConnectedLinks(node).forEach((link) => link.remove());

    const parent = this.findParentNode(node);
    if (parent) {
      (parent as any).children = (parent as any).children.filter(
        (c: joint.dia.Element) => c.id !== node.id,
      );
    }

    node.remove();
    // this.emitDiagramData();
  }

  findParentNode(child: joint.dia.Element): joint.dia.Element | null {
    for (const el of this.graph.getElements()) {
      const children = (el as any).children || [];
      if (children.some((c: joint.dia.Element) => c.id === child.id)) {
        return el;
      }
    }
    return null;
  }

  deleteSelectedNode() {
    if (!this.selectedNode) return;

    const data = (this.selectedNode as any).attributes.nodeData;
    console.log('data*****', data);

    if (data.key === 0) {
      console.warn('Root node cannot be deleted');
      return;
    }

    this.deleteNodeRecursively(this.selectedNode);
    this.selectedNode = null;
    // this.saveDiagram();
    this.emitDiagramData();
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteSelectedNode();
    }
  }

  onDragStart(event: DragEvent, type: string) {
    this.draggedType = type;
    event.dataTransfer?.setData('text/plain', type);
  }

  emitDiagramData() {
    const elements = this.graph.getElements();
    console.log('emitDiagramData', elements);

    const nodeData = elements.map((el) => {
      const data = (el as any).attributes.nodeData;
      const pos = el.position();

      return {
        ...data,
        loc: `${Math.round(pos.x)} ${Math.round(pos.y)}`,
      };
    });
   // sessionStorage.setItem('diagramData', JSON.stringify(nodeData));

    this.diagramChanged.emit({
      nodeData,
      linkData: this.graph.getLinks().map((l) => l.toJSON()),
    });
  }
  attachZoom() {
    this.zoomLevel = 1;

    const paperEl = this.paper.options['el'] as HTMLElement;
    // const paperEl = this.paper.el as HTMLElement;

    paperEl.addEventListener(
      'wheel',
      (evt: WheelEvent) => {
        evt.preventDefault();

        const oldZoom = this.zoomLevel;
        const scaleFactor = evt.deltaY < 0 ? 1.1 : 0.9;

        this.zoomLevel = Math.min(2, Math.max(0.4, oldZoom * scaleFactor));

        const localPoint = this.paper.clientToLocalPoint({
          x: evt.clientX,
          y: evt.clientY,
        });

        this.paper.scale(this.zoomLevel, this.zoomLevel);

        this.paper.translate(
          localPoint.x - (localPoint.x * this.zoomLevel) / oldZoom,
          localPoint.y - (localPoint.y * this.zoomLevel) / oldZoom,
        );
      },
      { passive: false },
    );
  }
}
