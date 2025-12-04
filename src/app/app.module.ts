import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
// import { AgGridModule } from '@ag-grid-community/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatInterceptor } from './helper/interceptor';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { MessagingService } from './service/messaging.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AnnotatorComponent } from './annotator/annotator.component';
import { NgxAnnotateTextModule } from 'ngx-annotate-text';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
// import { ConfiguratorModule } from './configurator/configurator.module';

//import { ConfigheaderComponent } from './pages/chat-elements/configheader/configheader.component';
@NgModule({
  declarations: [
    AppComponent,
    AnnotatorComponent,
    // ConfigheaderComponent
  ],
  imports: [
    MatSlideToggleModule,
    RouterModule.forRoot([]),
    NgJsonEditorModule,
    MatDialogModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatProgressBarModule,
    MatTabsModule,
    MatMenuModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ToastrModule.forRoot(),
    // AgGridModule.withComponents([]),
    // AgGridModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    MatSnackBarModule,
    NgxAnnotateTextModule,
    MatAutocompleteModule,
    // ConfiguratorModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ChatInterceptor, multi: true },
    MessagingService,
    AsyncPipe,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
