import { Component } from '@angular/core';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent {
  settings = {
    playSound: true,
    removeBranding: false,
    stopAnimation: true,
    typingDelay: true,
    delayValue: 3,
    collectFeedback: true,
    feedbackQuestion: 'Overall, how would you rate your chat experience ?',
  };
}
