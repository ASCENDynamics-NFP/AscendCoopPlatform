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
// professional-info.component.ts

import {Component, Input, OnInit, ElementRef, ViewChild} from "@angular/core";
import {Account, ProfessionalInformation} from "@shared/models/account.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {StorageService} from "../../../../../../core/services/storage.service";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {take} from "rxjs/operators";
import {skillsOptions} from "../../../../../../core/data/options";
import {AccountsService} from "../../../../../../core/services/accounts.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: "app-professional-info-form",
  templateUrl: "./professional-info-form.component.html",
  styleUrls: ["./professional-info-form.component.scss"],
})
export class ProfessionalInfoFormComponent implements OnInit {
  @Input() account?: Account;
  professionalInformationForm: FormGroup;
  public skillsOptions: string[] = skillsOptions;
  resumeFileName = "";
  resumeFile: File | null = null;
  @ViewChild("resumeInput") resumeInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private sections: AccountSectionsService,
    private accountsService: AccountsService,
  ) {
    this.professionalInformationForm = this.fb.group({
      occupation: ["", Validators.required],
      employerName: [""],
      workExperience: [""],
      skillsAndExpertise: [[], Validators.required],
      currentJobTitle: [""],
      linkedInProfile: [""],
      educationalBackground: [""],
      resumeUpload: [null],
    });
  }

  ngOnInit() {
    if (this.account?.id) {
      this.sections
        .professionalInfo$(this.account.id)
        .pipe(take(1))
        .subscribe((pi: any) => {
          if (pi) {
            // Patch form with existing professional info
            this.professionalInformationForm.patchValue({
              ...pi,
              resumeUpload: null, // file input stays empty; keep URL separately
            });
            // Preserve existing URL for later if no new file is uploaded
            if (pi.resumeUpload) {
              this.resumeFileName =
                typeof pi.resumeUpload === "string"
                  ? pi.resumeUpload
                  : this.resumeFileName;
            }
          } else if (this.account?.professionalInformation) {
            this.loadFormData();
          }
        });
    }
  }

  loadFormData() {
    if (this.account?.professionalInformation) {
      this.professionalInformationForm.patchValue({
        occupation: this.account.professionalInformation.occupation || "",
        employerName: this.account.professionalInformation.employerName || "",
        workExperience:
          this.account.professionalInformation.workExperience || "",
        skillsAndExpertise:
          this.account.professionalInformation.skillsAndExpertise || [],
        currentJobTitle:
          this.account.professionalInformation.currentJobTitle || "",
        linkedInProfile:
          this.account.professionalInformation.linkedInProfile || "",
        educationalBackground:
          this.account.professionalInformation.educationalBackground || "",
        resumeUpload: null,
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resumeFile = input.files[0];
      this.resumeFileName = this.resumeFile.name;
      this.professionalInformationForm.patchValue({
        resumeUpload: this.resumeFile,
      });
    }
  }

  async onSubmit() {
    if (this.professionalInformationForm.valid && this.account) {
      const formValue = this.professionalInformationForm.value;
      let resumeUrl =
        this.account.professionalInformation?.resumeUpload || null;
      if (this.resumeFile instanceof File) {
        // Upload resume and get URL
        const extension =
          this.resumeFile.name.split(".").pop()?.toLowerCase() || "pdf";
        const filePath = `accounts/${this.account.id}/resume.${extension}`;
        resumeUrl = await this.storageService.uploadFile(
          filePath,
          this.resumeFile,
        );
      }

      const updatedProfessionalInformation: ProfessionalInformation = {
        ...formValue,
        resumeUpload: resumeUrl,
      } as ProfessionalInformation;

      // Write to sections/professionalInfo via callable
      await firstValueFrom(
        this.accountsService.updateAccountSections({
          accountId: this.account.id,
          professionalInformation: updatedProfessionalInformation,
        }),
      );
    }
  }
}
