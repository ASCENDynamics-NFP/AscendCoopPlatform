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
import {LandingPage} from "./landing.page";
import {IonicModule, ModalController} from "@ionic/angular";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";

describe("LandingPage", () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    const modalSpy = jasmine.createSpyObj("ModalController", ["create"]);

    component.swiperConfig.loop = false;
    component.swiperElement = {
      nativeElement: {
        initialize: jasmine.createSpy("initialize"),
      },
    };

    TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [IonicModule.forRoot()],
      providers: [{provide: ModalController, useValue: modalSpy}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    modalControllerSpy = TestBed.inject(
      ModalController,
    ) as jasmine.SpyObj<ModalController>;

    // Mock the create method to return a modal with a present method
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy("present"),
      } as any),
    );

    fixture.detectChanges();
  }));

  it("should create the landing page component", () => {
    expect(component).toBeTruthy();
  });

  it("should have currentYear set to the current year", () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toEqual(currentYear);
  });

  it("should have features defined and not empty", () => {
    expect(component.features).toBeDefined();
    expect(component.features.length).toBeGreaterThan(0);
  });

  it("should have roadmap defined and not empty", () => {
    expect(component.roadmap).toBeDefined();
    expect(component.roadmap.length).toBeGreaterThan(0);
  });

  it("should have testimonials defined and not empty", () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBeGreaterThan(0);
  });

  it("should have testimonialOptions defined with correct values", () => {
    expect(component.testimonialOptions).toBeDefined();
    expect(component.testimonialOptions.autoplay.delay).toEqual(5000);
    expect(component.testimonialOptions.loop).toBeTrue();
  });

  it("should open legal modal with correct content type", async () => {
    const contentType: "privacyPolicy" | "termsOfUse" = "privacyPolicy";

    await component.openLegalModal(contentType);

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: LegalModalComponent,
      componentProps: {content: contentType},
    });

    const modal =
      await modalControllerSpy.create.calls.mostRecent().returnValue;
    expect(modal.present).toHaveBeenCalled();
  });
});
