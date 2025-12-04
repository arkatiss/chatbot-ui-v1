import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  websiteUrl: string = 'https://www.example.com/';
  codeSnippet: string = `<script src="https://api.example.com/widget/4CBEKaCEMnKS094610734802aFqGaUuw.js" defer></script>`;

  constructor(private toast: ToastrService) {}

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toast.success('Code snippet copied to clipboard');
  }
}
