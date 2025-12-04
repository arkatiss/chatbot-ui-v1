import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomaincreateComponent } from './domaincreate.component';

describe('DomaincreateComponent', () => {
  let component: DomaincreateComponent;
  let fixture: ComponentFixture<DomaincreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomaincreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomaincreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
