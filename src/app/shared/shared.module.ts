import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FilterPipe } from '../helper/filter.pipe';
import { WebSocketService } from './services/websocket.service';
import { TimerComponent } from './components/timer/timer.component';
import { MainheaderComponent } from './components/mainheader/mainheader.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from './components/data-table/data-table.component';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    //  FilterPipe,
    TimerComponent,
    MainheaderComponent,
    DataTableComponent,
  ],
  exports: [
    //FilterPipe,
    TimerComponent,
    MainheaderComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    ToastModule,
    TableModule,
    OverlayPanelModule,
    DropdownModule,
    TooltipModule,
    ButtonModule,
    NgxSpinnerModule,
  ],
  providers: [WebSocketService, MessageService],
})
export class SharedModule {}
