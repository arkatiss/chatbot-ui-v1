import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildInfosetsComponent } from './build-infosets.component';

describe('BuildInfosetsComponent', () => {
  let component: BuildInfosetsComponent;
  let fixture: ComponentFixture<BuildInfosetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildInfosetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildInfosetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
