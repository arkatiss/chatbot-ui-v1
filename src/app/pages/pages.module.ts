import { SearchPipe } from './../helper/search.pipe';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { PreferenceComponent } from './preference/preference.component';
import { MatSelectModule } from '@angular/material/select';
import { MainComponent } from './main/main.component';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { HistoryComponent } from './history/history.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { AgGridModule } from '@ag-grid-community/angular';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RelativeTimePipe } from './timestamp.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsComponent } from './charts/charts.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgJsonEditorModule } from 'ang-jsoneditor';
// import { NgxOrgChartModule } from 'ngx-org-chart';
import { ChatComponent } from './chat/chat.component';
import { DocviewerComponent } from './docviewer/docviewer.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ElasticdocsComponent } from './elasticdocs/elasticdocs.component';
import { RemoveUnderscorePipe } from './underscore.pipe';
import { WebSocketService } from './../helper/webscoket.service';
import { MatBadgeModule } from '@angular/material/badge';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TextComponent } from './chat-elements/text/text.component';
import { ButtonsComponent } from './chat-elements/buttons/buttons.component';
import { HeaderComponent } from './chat-elements/header/header.component';
import { FooterComponent } from './chat-elements/footer/footer.component';
import { DatamarkstabComponent } from './chat-elements/datamarkstab/datamarkstab.component';
import { MyviewComponent } from './chat-elements/myview/myview.component';
import { PeerheaderComponent } from './chat-elements/peerheader/peerheader.component';
import { MultiagentListComponent } from './chat-elements/multiagentlist/multiagent.component';
import { MultiagentdataComponent } from './chat-elements/multiagentdata/multiagentdata.component';
import { GridComponent } from './chat-elements/grid/grid.component';
import { CustomerchatComponent } from './chat-elements/customerchat/customerchat.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SafePipe } from './safe.pipe';
import { DynamicformsComponent } from './chat-elements/dynamicforms/dynamicforms.component';
import { HomeComponent } from './datamark/home.component';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AgGridAngular } from 'ag-grid-angular';
@NgModule({
  declarations: [
    ChatboxComponent,
    ViewprofileComponent,
    SuggestionsComponent,
    PreferenceComponent,
    MainComponent,
    HomeComponent,
    HistoryComponent,
    SearchPipe,
    RecommendationComponent,
    RelativeTimePipe,
    ChartsComponent,
    ChatComponent,
    DocviewerComponent,
    ElasticdocsComponent,
    RemoveUnderscorePipe,
    TextComponent,
    ButtonsComponent,
    HeaderComponent,
    FooterComponent,
    DatamarkstabComponent,
    MyviewComponent,
    PeerheaderComponent,
    MultiagentListComponent,
    MultiagentdataComponent,

    GridComponent,
    CustomerchatComponent,
    SafePipe,
    DynamicformsComponent,
  ],
  imports: [
    PdfJsViewerModule,
    // NgxOrgChartModule,
    MatTableModule,
    NgJsonEditorModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatCheckboxModule,
    MatRadioModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule,
    // AgGridModule.withComponents([]),
    // AgGridModule,
    PopoverModule.forRoot(),
    MatDialogModule,
    DragDropModule,
    DndModule,
    MatChipsModule,
    NgxSpinnerModule,
    NgxDatatableModule,
    MatBadgeModule,
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    // DatetimePopupModule,
    MatTooltipModule,
    MatPaginatorModule,
    SharedModule,
    MatAutocompleteModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    BsDatepickerModule.forRoot(),
    MatSortModule,
    MatStepperModule,
    AutocompleteLibModule,
    AgGridAngular,
  ],
  providers: [WebSocketService, DatePipe],
  schemas: [NO_ERRORS_SCHEMA],
  // exports: [
  //   PdfJsViewerModule,
  //   // NgxOrgChartModule,
  //   MatTableModule,
  //   NgJsonEditorModule,
  //   MatSlideToggleModule,
  //   MatTreeModule,
  //   MatCheckboxModule,
  //   MatRadioModule,
  //   NgApexchartsModule,
  //   ReactiveFormsModule,
  //   MatCardModule,
  //   CommonModule,
  //   PagesRoutingModule,
  //   HttpClientModule,
  //   MatInputModule,
  //   FormsModule,
  //   MatButtonModule,
  //   MatMenuModule,
  //   MatTabsModule,
  //   MatSelectModule,
  //   MatListModule,
  //   MatToolbarModule,
  //   MatSidenavModule,
  //   MatIconModule,
  //   MatSnackBarModule,
  //   MatExpansionModule,
  //   // AgGridModule.withComponents([]),
  //   // AgGridModule,
  //   // PopoverModule.forRoot(),
  //   MatDialogModule,
  //   DragDropModule,
  //   DndModule,
  //   MatChipsModule,
  //   NgxSpinnerModule,
  //   NgxDatatableModule,
  //   MatBadgeModule,
  //   // BsDropdownModule.forRoot(),
  //   // TimepickerModule.forRoot(),
  //   // DatetimePopupModule,
  //   MatTooltipModule,
  //   MatPaginatorModule,
  //   SharedModule,
  //   MatAutocompleteModule,
  //   // MatDatepickerModule,
  //   // MatNativeDateModule,
  //   // BsDatepickerModule.forRoot(),
  //   MatSortModule,
  //   MatStepperModule,
  //   AutocompleteLibModule,
  // ],
  // entryComponents: [ListItemComponent]
})
export class PagesModule {}
