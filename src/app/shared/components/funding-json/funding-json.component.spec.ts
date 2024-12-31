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
import {TestBed} from "@angular/core/testing";
import {FundingJsonComponent} from "./funding-json.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

describe("FundingJsonComponent", () => {
  let component: FundingJsonComponent;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FundingJsonComponent],
    });

    const fixture = TestBed.createComponent(FundingJsonComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should log an error if funding.json fails to load", () => {
    const consoleErrorSpy = spyOn(console, "error");

    component.ngOnInit();

    const req = httpMock.expectOne("/funding.json");
    expect(req.request.method).toBe("GET");

    // Simulate error response
    req.error(new ErrorEvent("Network error"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching funding.json:",
      jasmine.any(Object),
    );
  });
});
