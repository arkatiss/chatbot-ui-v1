import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { RolesComponent } from './roles/roles.component';
import { MainComponent } from './main/main.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewrolesComponent } from './viewroles/viewroles.component';
import { SupportgroupComponent } from './supportgroup/supportgroup.component';
import { ViewsupportComponent } from './viewsupport/viewsupport.component';
import { MapingComponent } from './maping/maping.component';
import { ViewmapingComponent } from './viewmaping/viewmaping.component';
import { AuthService } from '../auth/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { CreatevizrolesComponent } from './createvizroles/createvizroles.component';
import { ViewvizrolesComponent } from './viewvizroles/viewvizroles.component';
import { AppsComponent } from './apps/apps.component';
// import { AgGridModule } from '@ag-grid-community/angular';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    RolesComponent,
    MainComponent,
    ViewrolesComponent,
    SupportgroupComponent,
    ViewsupportComponent,
    MapingComponent,
    ViewmapingComponent,
    CreatevizrolesComponent,
    ViewvizrolesComponent,
    AppsComponent,
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MatToolbarModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCheckboxModule,
    PopoverModule,
    MatListModule,
    MatTabsModule,
    MatAutocompleteModule,
    SharedModule,
    // AgGridModule.withComponents([]),
    // AgGridModule,
    MatTableModule,
    AgGridAngular,
    // MatDatepickerModule,
    // MatNativeDateModule,
  ],
  providers: [AuthService, DatePipe],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SecurityModule {}
