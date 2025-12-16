import {
  ChangeDetectorRef,
  NgZone,
  Component,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
})
export class AppearanceComponent {
  activeTab: 'web' | 'mobile' = 'web';
  @Output() configChanged = new EventEmitter<string>();
  @Input() config: any = {
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

  constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  onFileSelect(event: any, field: 'widgetIcon' | 'headerLogo' | 'botIcon') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.config[field] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // onFileSelect(event: any, field: 'widgetIcon' | 'headerLogo' | 'botIcon') {
  //   console.log(event, field);
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     // Always assign to a *new* config object (break shared ref)
  //     this.config = {
  //       ...this.config,
  //       [field]: e.target.result,
  //     };
  //   };

  //   reader.readAsDataURL(file);

  //   // Reset the input
  //   event.target.value = '';
  //   console.log(this.config);
  // }

  applyChanges() {
    console.log('Applied Config:', this.config);
    this.configChanged.emit(this.config);
  }

  setTab(tab: 'web' | 'mobile') {
    this.activeTab = tab;
  }
  togglePosition(position: 'left' | 'right') {
    this.config.chatPosition =
      this.config.chatPosition === position ? '' : position;
  }
}
