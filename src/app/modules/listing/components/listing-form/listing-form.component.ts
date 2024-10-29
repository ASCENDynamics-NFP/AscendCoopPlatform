import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators, FormArray} from "@angular/forms";
import {Listing, SkillRequirement} from "../../../../models/listing.model";
import {Timestamp} from "firebase/firestore";

@Component({
  selector: "app-listing-form",
  templateUrl: "./listing-form.component.html",
  styleUrls: ["./listing-form.component.scss"],
})
export class ListingFormComponent implements OnInit {
  @Input() listing: Listing | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  listingForm: FormGroup;
  listingTypes = ["volunteer", "job", "internship", "gig"];
  skillLevels = ["beginner", "intermediate", "advanced"];

  constructor(private fb: FormBuilder) {
    this.listingForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      type: ["volunteer", Validators.required],
      organization: ["", Validators.required],
      location: this.fb.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipcode: [""],
        remote: [false],
      }),
      skills: this.fb.array([]),
      timeCommitment: this.fb.group({
        hoursPerWeek: [0, Validators.required],
        duration: [""],
        schedule: [""],
        startDate: [null, Validators.required],
        endDate: [null],
        isFlexible: [false],
      }),
      requirements: this.fb.array([]),
      responsibilities: this.fb.array([]),
      benefits: this.fb.array([]),
      contactInformation: this.fb.group({
        emails: this.fb.array([]),
        phoneNumbers: this.fb.array([]),
      }),
      status: ["active"],
    });
  }

  ngOnInit() {
    if (this.listing) {
      this.initializeFormArrays(this.listing);
      this.listingForm.patchValue(this.listing);
    }
  }

  private initializeFormArrays(listing: Listing) {
    if (listing.skills?.length) {
      listing.skills.forEach((skill) => this.addSkill(skill));
    }
    if (listing.requirements?.length) {
      listing.requirements.forEach((req) =>
        this.addArrayItem("requirements", req),
      );
    }
    if (listing.responsibilities?.length) {
      listing.responsibilities.forEach((resp) =>
        this.addArrayItem("responsibilities", resp),
      );
    }
    if (listing.benefits?.length) {
      listing.benefits.forEach((benefit) =>
        this.addArrayItem("benefits", benefit),
      );
    }
  }

  addSkill(skill?: SkillRequirement) {
    const skillForm = this.fb.group({
      name: [skill?.name || "", Validators.required],
      level: [skill?.level || "beginner"],
      required: [skill?.required || true],
    });
    (this.listingForm.get("skills") as FormArray).push(skillForm);
  }

  addArrayItem(arrayName: string, value: string = "") {
    const control = this.fb.control(value, Validators.required);
    (this.listingForm.get(arrayName) as FormArray).push(control);
  }

  addEmail() {
    const emailForm = this.fb.group({
      name: [""],
      email: ["", [Validators.required, Validators.email]],
    });
    (this.listingForm.get("contactInformation.emails") as FormArray).push(
      emailForm,
    );
  }

  addPhoneNumber() {
    const phoneForm = this.fb.group({
      type: ["Mobile"],
      countryCode: ["+1"],
      number: ["", Validators.required],
    });
    (this.listingForm.get("contactInformation.phoneNumbers") as FormArray).push(
      phoneForm,
    );
  }

  removeArrayItem(arrayName: string, index: number) {
    (this.listingForm.get(arrayName) as FormArray).removeAt(index);
  }

  getFormArray(arrayName: string) {
    return this.listingForm.get(arrayName) as FormArray;
  }

  onSubmit() {
    if (this.listingForm.valid) {
      const formValue = this.listingForm.value;
      const listing = {
        ...formValue,
        timeCommitment: {
          ...formValue.timeCommitment,
          startDate: formValue.timeCommitment.startDate
            ? Timestamp.fromDate(new Date(formValue.timeCommitment.startDate))
            : null,
          endDate: formValue.timeCommitment.endDate
            ? Timestamp.fromDate(new Date(formValue.timeCommitment.endDate))
            : null,
        },
      };
      this.formSubmit.emit(listing);
    }
  }
}
