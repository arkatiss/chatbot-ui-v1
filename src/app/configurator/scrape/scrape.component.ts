import { Component, OnInit } from '@angular/core';
import { InfosetsService } from '../service/infosets.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-scrape',
  templateUrl: './scrape.component.html',
  styleUrl: './scrape.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ScrapeComponent implements OnInit {
  colData: any[] = [
    { field: 'domain', header: 'Domain' },
    { field: 'sub_domain', header: 'Sub Domain' },
    { field: 'created_on', header: 'Created Date' },
    { field: 'created_by', header: 'Created By' },
    { field: 'Delete', header: 'Actions' },
  ];
  rowData = [];
  isLoading = false;
  screenName: any;
  domain: any;
  scrape_domain: any;
  scrape_subDomain: any;
  subDomain: any;
  scrapeUrl: any;
  filteredDomainOptions: any = [];
  infosetFlag: any = false;
  showScrapePopup: boolean = false;

  constructor(
    public api: InfosetsService,
    private toast: ToastrService,
    private confirmationService: ConfirmationService,
  ) {
    sessionStorage.setItem('activeListMenu', 'Scrape');
  }

  ngOnInit(): void {
    this.retrieveDomain();
    this.getScrapeList();
  }

  retrieveDomain(): any {
    const body = { chat_bot_type: 'retrieve' };
    this.api.domainData(body).subscribe(
      (res: any) => {
        if (res.status === 200 && res.res_status) {
          this.filteredDomainOptions = res.data;
        }
      }
    );
  }

  changeDomain(data: any): any {
    this.scrape_domain = this.filteredDomainOptions.find(
      (item: any) => item.domain === data?.domain,
    );
  }

  getScrapeList(): any {
    this.rowData = [];
    this.isLoading = true;
    this.api.getScrapList().subscribe(
      (res: any) => {
        if (res.res_status) {
          this.rowData = res.data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (err: any) => {
        this.isLoading = false;
      },
    );
  }

  showForm() {
    this.showScrapePopup = true;
  }

  submitScrape(): any {
    if (!this.scrape_domain || !this.scrape_subDomain || !this.scrapeUrl) {
      this.toast.error('Please fill all the fields');
      return;
    }
    const alreadyExists = this.rowData.some(
      (item: any) =>
        item.domain === this.scrape_domain?.domain &&
        item.sub_domain === this.scrape_subDomain,
    );

    if (alreadyExists) {
      this.toast.warning('This Domain and Sub Domain already exists');
      return;
    }

    this.isLoading = true;
    const body = {
      url: this.scrapeUrl,
      domain: this.scrape_domain?.domain,
      sub_domain: this.scrape_subDomain,
      user_name: sessionStorage.getItem('userName'),
    };
    this.api.insertScrape(body).subscribe(
      (res: any) => {
        if (res.res_status) {
          this.toast.success(res.msg);
          this.getScrapeList();
          this.scrape_domain = '';
          this.scrape_subDomain = '';
          this.scrapeUrl = '';
          this.isLoading = false;
          this.showScrapePopup = false;
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.showScrapePopup = false;
      },
    );
  }

  closePopup() {
    this.showScrapePopup = false;
    this.scrape_domain = '';
    this.scrape_subDomain = '';
  }

  deleteRow(event: any) {
    const body = {
      domain: event?.domain,
      sub_domain: event.sub_domain,
    };
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.isLoading = true;
        this.api.deleteScrape(body).subscribe((res: any) => {
          if (res?.res_status) {
            this.isLoading = false;
            this.toast.success(res?.msg);
            this.getScrapeList();
          } else {
            this.isLoading = false;
            this.toast.error(res?.msg);
          }
        });
      },
      reject: () => {},
    });
  }
}
