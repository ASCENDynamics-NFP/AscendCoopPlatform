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

import {ContactInformationComponent} from "./contact-information.component";
import {getFirebaseTestProviders} from "../../../../../../testing/test-utilities";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {of} from "rxjs";
import {provideMockStore} from "@ngrx/store/testing";

describe("ContactInformationComponent", () => {
  let component: ContactInformationComponent;
  let fixture: ComponentFixture<ContactInformationComponent>;
  let mockAccountSectionsService: jasmine.SpyObj<AccountSectionsService>;

  beforeEach(async () => {
    mockAccountSectionsService = jasmine.createSpyObj(
      "AccountSectionsService",
      ["contactInfo$"],
    );
    mockAccountSectionsService.contactInfo$.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [ContactInformationComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        ...getFirebaseTestProviders(),
        {
          provide: AccountSectionsService,
          useValue: mockAccountSectionsService,
        },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
