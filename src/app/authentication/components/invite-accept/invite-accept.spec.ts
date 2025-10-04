import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAccept } from './invite-accept';

describe('InviteAccept', () => {
  let component: InviteAccept;
  let fixture: ComponentFixture<InviteAccept>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteAccept]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteAccept);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
