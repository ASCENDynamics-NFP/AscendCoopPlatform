import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingDetailPage } from './listing-detail.page';

describe('ListingDetailPage', () => {
  let component: ListingDetailPage;
  let fixture: ComponentFixture<ListingDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
