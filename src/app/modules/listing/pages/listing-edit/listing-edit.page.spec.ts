import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingEditPage } from './listing-edit.page';

describe('ListingEditPage', () => {
  let component: ListingEditPage;
  let fixture: ComponentFixture<ListingEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
