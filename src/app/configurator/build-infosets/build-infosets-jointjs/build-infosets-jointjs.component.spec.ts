import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildInfosetsJointjsComponent } from './build-infosets-jointjs.component';

describe('BuildInfosetsJointjsComponent', () => {
  let component: BuildInfosetsJointjsComponent;
  let fixture: ComponentFixture<BuildInfosetsJointjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildInfosetsJointjsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildInfosetsJointjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
