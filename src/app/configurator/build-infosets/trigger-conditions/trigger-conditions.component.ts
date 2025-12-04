import { Component } from '@angular/core';

@Component({
  selector: 'app-trigger-conditions',
  templateUrl: './trigger-conditions.component.html',
  styleUrls: ['./trigger-conditions.component.scss'],
})
export class TriggerConditionsComponent {
  newUserAction: string = 'auto-open bot';
  newUserTrigger: string = 'time delay';
  newUserDelay: number = 10;

  returningUserDays: number = 12;
  returningUserAction: string = 'Show pop up message';
  returningUserTrigger: string = 'time delay';
  returningUserDelay: number = 10;

  newUserActions = [
    { label: 'Auto-open bot', value: 'auto-open bot' },
    { label: 'Show pop up message', value: 'Show pop up message' },
    { label: 'Do nothing', value: 'Do nothing' },
  ];

  returningUserActions = [
    { label: 'Show pop up message', value: 'Show pop up message' },
    { label: 'Auto-open bot', value: 'auto-open bot' },
    { label: 'Do nothing', value: 'Do nothing' },
  ];

  triggerOptions = [
    { label: 'Time delay', value: 'time delay' },
    { label: 'Immediately', value: 'immediately' },
    { label: 'On scroll', value: 'on scroll' },
  ];

  applyChanges() {
    console.log('Configuration saved:', {
      newUser: {
        action: this.newUserAction,
        trigger: this.newUserTrigger,
        delay: this.newUserDelay,
      },
      returningUser: {
        days: this.returningUserDays,
        action: this.returningUserAction,
        trigger: this.returningUserTrigger,
        delay: this.returningUserDelay,
      },
    });
    // Add your save logic here
  }
}
