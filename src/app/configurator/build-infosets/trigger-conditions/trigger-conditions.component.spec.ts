import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerConditionsComponent } from './trigger-conditions.component';

describe('TriggerConditionsComponent', () => {
  let component: TriggerConditionsComponent;
  let fixture: ComponentFixture<TriggerConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggerConditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriggerConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
