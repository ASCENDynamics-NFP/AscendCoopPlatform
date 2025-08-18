/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ToastController} from "@ionic/angular";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LeadFormComponent} from "./lead-form.component";
import {LeadService} from "../../../../core/services/lead.service";
import {of} from "rxjs";

describe("LeadFormComponent", () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;
  let leadService: LeadService;
  let toastController: ToastController;

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj("LeadService", ["submitLead"]);
    const toastControllerSpy = jasmine.createSpyObj("ToastController", [
      "create",
    ]);

    await TestBed.configureTestingModule({
      declarations: [LeadFormComponent],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        {provide: LeadService, useValue: leadServiceSpy},
        {provide: ToastController, useValue: toastControllerSpy},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    leadService = TestBed.inject(LeadService);
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit form through service", async () => {
    // Mock toast controller methods
    const mockToast = {
      present: jasmine.createSpy("present"),
    };
    (toastController.create as jasmine.Spy).and.returnValue(
      Promise.resolve(mockToast),
    );

    component.form.setValue({
      name: "Tester",
      email: "t@example.com",
      phone: "",
      inquiry: "general",
      message: "hello world",
    });

    // Mock the submitLead service to return an observable
    (leadService.submitLead as jasmine.Spy).and.returnValue(
      of({success: true}),
    );

    await component.submit();

    expect(leadService.submitLead).toHaveBeenCalledWith({
      name: "Tester",
      email: "t@example.com",
      phone: "",
      inquiry: "general",
      message: "hello world",
      from: "landing-page",
    });
    expect(toastController.create).toHaveBeenCalled();
  });
});
