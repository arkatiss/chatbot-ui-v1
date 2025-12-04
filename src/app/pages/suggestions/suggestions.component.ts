import { PagesService } from './../pages.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  constructor(private pageservice:PagesService) { }

  ngOnInit(): void {
  }

}
