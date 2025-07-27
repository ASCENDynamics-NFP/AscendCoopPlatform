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
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule, ModalController} from "@ionic/angular";
import {LandingPage} from "./landing.page";
import {MetaService} from "../../../../core/services/meta.service";
import {ElementRef, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {LegalModalComponent} from "../../../../shared/components/legal-modal/legal-modal.component";

describe("LandingPage", () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;
  let metaServiceSpy: jasmine.SpyObj<MetaService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    const metaSpy = jasmine.createSpyObj("MetaService", [
      "updateMetaTags",
      "addStructuredData",
    ]);
    const modalSpy = jasmine.createSpyObj("ModalController", ["create"]);

    await TestBed.configureTestingModule({
      declarations: [LandingPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: MetaService, useValue: metaSpy},
        {provide: ModalController, useValue: modalSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    metaServiceSpy = TestBed.inject(MetaService) as jasmine.SpyObj<MetaService>;
    modalControllerSpy = TestBed.inject(
      ModalController,
    ) as jasmine.SpyObj<ModalController>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with correct current year", () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it("should update meta tags on ionViewWillEnter", () => {
    component.ionViewWillEnter();
    expect(metaServiceSpy.updateMetaTags).toHaveBeenCalledWith(
      "ASCENDynamics NFP | Volunteer Opportunities",
      jasmine.any(String),
      jasmine.any(String),
      jasmine.any(Object),
      jasmine.any(Object),
    );
    expect(metaServiceSpy.addStructuredData).toHaveBeenCalledWith(
      jasmine.any(Object),
    );
  });

  it("should open legal modal with privacy policy", async () => {
    const mockModal = {present: jasmine.createSpy("present")};
    modalControllerSpy.create.and.returnValue(
      Promise.resolve(mockModal as any),
    );

    await component.openLegalModal("privacyPolicy");

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: LegalModalComponent,
      componentProps: {content: "privacyPolicy"},
    });
    expect(mockModal.present).toHaveBeenCalled();
  });

  it("should initialize swiper with correct config", () => {
    const mockElement = {
      nativeElement: {
        initialize: jasmine.createSpy("initialize"),
      },
    };
    component.swiperElement = mockElement as ElementRef;

    component.initSwiper();

    expect(mockElement.nativeElement.initialize).toHaveBeenCalled();
  });

  it("should have valid features array structure", () => {
    expect(component.features.length).toBeGreaterThan(0);
    component.features.forEach((feature) => {
      expect(feature.icon).toBeDefined();
      expect(feature.title).toBeDefined();
      expect(feature.description).toBeDefined();
    });
  });

  it("should have valid roadmap array structure", () => {
    expect(component.roadmap.length).toBeGreaterThan(0);
    component.roadmap.forEach((phase) => {
      expect(phase.id).toBeDefined();
      expect(phase.title).toBeDefined();
      expect(phase.items).toBeDefined();
      expect(Array.isArray(phase.items)).toBeTruthy();
    });
  });

  it("should have valid testimonials array structure", () => {
    expect(component.testimonials.length).toBeGreaterThan(0);
    component.testimonials.forEach((testimonial) => {
      expect(testimonial.message).toBeDefined();
      expect(testimonial.author).toBeDefined();
    });
  });
});
