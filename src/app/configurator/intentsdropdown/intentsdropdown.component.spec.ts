import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentsdropdownComponent } from './intentsdropdown.component';

describe('IntentsdropdownComponent', () => {
  let component: IntentsdropdownComponent;
  let fixture: ComponentFixture<IntentsdropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntentsdropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentsdropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
