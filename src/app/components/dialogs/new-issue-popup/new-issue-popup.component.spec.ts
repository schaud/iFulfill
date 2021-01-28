import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssuePopupComponent } from './new-issue-popup.component';

describe('NewIssuePopupComponent', () => {
  let component: NewIssuePopupComponent;
  let fixture: ComponentFixture<NewIssuePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIssuePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIssuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
