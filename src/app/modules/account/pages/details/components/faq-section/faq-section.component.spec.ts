/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FaqSectionComponent} from "./faq-section.component";

describe("FaqSectionComponent", () => {
  let component: FaqSectionComponent;
  let fixture: ComponentFixture<FaqSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FaqSectionComponent],
      imports: [IonicModule.forRoot(), CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display empty state when no FAQs", () => {
    component.faqs = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector(".no-faqs")).toBeTruthy();
  });

  it("should display FAQs when provided", () => {
    component.faqs = [
      {
        id: "1",
        question: "Test Question",
        answer: "Test Answer",
      },
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector(".faq-accordion")).toBeTruthy();
  });

  it("should show edit buttons when canEdit is true", () => {
    component.canEdit = true;
    component.faqs = [
      {
        id: "1",
        question: "Test Question",
        answer: "Test Answer",
      },
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector(".add-faq-btn")).toBeTruthy();
  });

  it("should track FAQs by id", () => {
    const faq = {id: "test-id", question: "Test", answer: "Test"};
    expect(component.trackByFAQ(0, faq)).toBe("test-id");
  });
});
