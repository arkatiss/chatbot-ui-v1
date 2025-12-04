import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingbotComponent } from './trainingbot.component';

describe('TrainingbotComponent', () => {
  let component: TrainingbotComponent;
  let fixture: ComponentFixture<TrainingbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingbotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
