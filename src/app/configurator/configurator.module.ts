import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorRoutingModule } from './configurator-routing.module';
import { DomaincreateComponent } from './domaincreate/domaincreate.component';
import { DomainviewComponent } from './domainview/domainview.component';
import { InfosetcreateComponent } from './infosetcreate/infosetcreate.component';
import { InfosetviewComponent } from './infosetview/infosetview.component';
import { DataauthcreateComponent } from './dataauthcreate/dataauthcreate.component';
import { DataauthviewComponent } from './dataauthview/dataauthview.component';
import { ConfigComponent } from './config/config.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ListItemComponent } from '../shared/components/list-item/list-item.component';
import { MatListModule } from '@angular/material/list';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TrainingbotComponent } from './trainingbot/trainingbot.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfiguratiosComponent } from './configuratios/configuratios.component';
import { AgGridAngular } from 'ag-grid-angular';
import { IntentsdropdownComponent } from './intentsdropdown/intentsdropdown.component';
import { CheckboxcomponentComponent } from './checkboxcomponent/checkboxcomponent.component';
import { BuildInfosetsComponent } from './build-infosets/build-infosets.component';
import { AppearanceComponent } from './build-infosets/appearance/appearance.component';
import { ConfigurationComponent } from './build-infosets/configuration/configuration.component';
import { GeneralSettingsComponent } from './build-infosets/general-settings/general-settings.component';
import { TriggerConditionsComponent } from './build-infosets/trigger-conditions/trigger-conditions.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { GojsAngularModule } from 'gojs-angular';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { SliderModule } from 'primeng/slider';
// import { DiagramComponent, PaletteComponent, OverviewComponent } from 'gojs-angular';
// import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
//import { NgxAnnotateTextModule } from 'ngx-annotate-text';

import { TableModule } from 'primeng/table';
import { MarkdownModule } from 'ngx-markdown';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToastrModule } from 'ngx-toastr';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { TreeTableModule } from 'primeng/treetable';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PaginatorModule } from 'primeng/paginator';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgxOrgChartComponent } from '@ahmedaoui/ngx-org-chart';
import { PopupMessagesComponent } from './build-infosets/popup-messages/popup-messages.component';
import { MegaMenuModule } from 'primeng/megamenu';

@NgModule({
  declarations: [
    DomaincreateComponent,
    DomainviewComponent,
    InfosetcreateComponent,
    InfosetviewComponent,
    DataauthcreateComponent,
    DataauthviewComponent,
    ConfigComponent,
    ListItemComponent,
    TrainingbotComponent,
    ConfiguratiosComponent,
    IntentsdropdownComponent,
    CheckboxcomponentComponent,
    BuildInfosetsComponent,
    AppearanceComponent,
    ConfigurationComponent,
    GeneralSettingsComponent,
    TriggerConditionsComponent,
    PopupMessagesComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    DragDropModule,
    MatTabsModule,
    DndModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    NgJsonEditorModule,
    MatSlideToggleModule,
    MatIconModule,
    MatToolbarModule,
    ConfiguratorRoutingModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PopoverModule.forRoot(),
    MatAutocompleteModule,
    MatPaginatorModule,
    SharedModule,
    MatProgressBarModule,
    ColorPickerModule,
    CheckboxModule,
    ToastModule,
    DialogModule,
    AgGridAngular,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    GojsAngularModule,
    FieldsetModule,
    FileUploadModule,
    SliderModule,
    ButtonModule,
    MegaMenuModule,
    // NgIdleKeepaliveModule.forRoot()
    // NgxAnnotateTextModule
    // AgGridModule.withComponents([]),
    // AgGridModule,

    TableModule,
    MarkdownModule,
    NgApexchartsModule,
    ToastrModule,
    MultiSelectModule,
    SkeletonModule,
    AutoCompleteModule,
    MatButtonToggleModule,
    InputSwitchModule,
    SelectButtonModule,
    AnimateOnScrollModule,
    ConfirmDialogModule,
    FloatLabelModule,
    AccordionModule,
    InputTextareaModule,
    RadioButtonModule,
    CalendarModule,
    TreeTableModule,
    OverlayPanelModule,
    TreeTableModule,
    OverlayPanelModule,
    PanelMenuModule,
    PaginatorModule,
    TextFieldModule,
    NgxOrgChartComponent,
  ],
  //   // TrainingbotComponent,
  //   IntentsdropdownComponent,
  //   CheckboxcomponentComponent,
  // ],
  // entryComponents: [ListItemComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ConfiguratorModule {}
