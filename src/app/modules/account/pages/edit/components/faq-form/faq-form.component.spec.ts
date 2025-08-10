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
import {ReactiveFormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {provideMockStore} from "@ngrx/store/testing";
import {FaqFormComponent} from "./faq-form.component";

describe("FaqFormComponent", () => {
  let component: FaqFormComponent;
  let fixture: ComponentFixture<FaqFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FaqFormComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqFormComponent);
    component = fixture.componentInstance;
    component.account = {
      id: "test-id",
      type: "group",
      groupDetails: {
        faqs: [],
      },
    };
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add FAQ", () => {
    const initialLength = component.faqsFormArray.length;
    component.addFAQ();
    expect(component.faqsFormArray.length).toBe(initialLength + 1);
  });

  it("should remove FAQ", () => {
    component.addFAQ();
    const initialLength = component.faqsFormArray.length;
    component.removeFAQ(0);
    expect(component.faqsFormArray.length).toBe(initialLength - 1);
  });

  it("should move FAQ up", () => {
    component.addFAQ();
    component.addFAQ();
    component.faqsFormArray.at(0).patchValue({question: "First"});
    component.faqsFormArray.at(1).patchValue({question: "Second"});

    component.moveFAQUp(1);

    expect(component.faqsFormArray.at(0).value.question).toBe("Second");
    expect(component.faqsFormArray.at(1).value.question).toBe("First");
  });

  it("should generate unique IDs", () => {
    const id1 = (component as any).generateId();
    const id2 = (component as any).generateId();
    expect(id1).not.toBe(id2);
  });
});
