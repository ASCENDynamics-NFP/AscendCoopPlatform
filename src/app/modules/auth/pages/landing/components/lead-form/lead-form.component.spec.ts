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
import {IonicModule} from "@ionic/angular";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LeadFormComponent} from "./lead-form.component";
import {LeadService} from "../../../../../../core/services/lead.service";

describe("LeadFormComponent", () => {
  let component: LeadFormComponent;
  let fixture: ComponentFixture<LeadFormComponent>;
  let leadService: LeadService;

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj("LeadService", ["submitLead"]);

    await TestBed.configureTestingModule({
      declarations: [LeadFormComponent],
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [{provide: LeadService, useValue: leadServiceSpy}],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadFormComponent);
    component = fixture.componentInstance;
    leadService = TestBed.inject(LeadService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit form through service", () => {
    component.form.setValue({
      name: "Tester",
      email: "t@example.com",
      phone: "",
      inquiry: "general",
      message: "hi",
      from: "ASCENDynamics NFP",
    });
    (leadService.submitLead as jasmine.Spy).and.returnValue({
      subscribe: () => {},
    });
    component.submit();
    expect(leadService.submitLead).toHaveBeenCalled();
  });
});
