import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentlistComponent } from './spentlist.component';

describe('SpentlistComponent', () => {
  let component: SpentlistComponent;
  let fixture: ComponentFixture<SpentlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpentlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
