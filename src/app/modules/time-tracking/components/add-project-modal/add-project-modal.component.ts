import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Observable, BehaviorSubject, combineLatest} from "rxjs";
import {map, take} from "rxjs/operators";
import {Project} from "../../../../../../shared/models/project.model";
import {Account} from "../../../../../../shared/models/account.model";
import * as ProjectsActions from "../../../../state/actions/projects.actions";
import {selectActiveProjectsByAccount} from "../../../../state/selectors/projects.selectors";

@Component({
  selector: "app-add-project-modal",
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Add Project</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()" color="medium">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="modal-container">
        <div class="header-section">
          <h2>Select Project</h2>
          <p>Choose a group and project to add to your timesheet.</p>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label>Group</label>
            <div class="custom-select-wrapper">
              <ion-select
                [(ngModel)]="selectedAccountId"
                (ionChange)="onAccountChange($event)"
                placeholder="Select Group"
                interface="popover"
                class="custom-select"
              >
                <ion-select-option
                  *ngFor="let account of relatedAccounts"
                  [value]="account.id"
                >
                  {{ account.name }}
                </ion-select-option>
              </ion-select>
              <ion-icon
                name="chevron-down-outline"
                class="select-icon"
              ></ion-icon>
            </div>
          </div>

          <div class="form-group" [class.disabled]="!selectedAccountId">
            <label>Project</label>
            <div class="custom-select-wrapper">
              <ion-select
                [(ngModel)]="selectedProjectId"
                placeholder="Select Project"
                [disabled]="
                  !selectedAccountId || (projects$ | async)?.length === 0
                "
                interface="popover"
                class="custom-select"
              >
                <ion-select-option
                  *ngFor="let project of projects$ | async"
                  [value]="project.id"
                >
                  {{ project.name }}
                </ion-select-option>
              </ion-select>
              <ion-icon
                name="chevron-down-outline"
                class="select-icon"
              ></ion-icon>
            </div>
            <div
              *ngIf="selectedAccountId && (projects$ | async)?.length === 0"
              class="helper-text error"
            >
              No active projects found for this group.
            </div>
          </div>
        </div>

        <div class="actions-section">
          <ion-button
            expand="block"
            (click)="addProject()"
            [disabled]="!selectedAccountId || !selectedProjectId"
            class="add-btn"
          >
            Add Project
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .modal-container {
        max-width: 500px;
        margin: 0 auto;
      }

      .header-section {
        text-align: center;
        margin-bottom: 32px;

        h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--ion-text-color);
        }

        p {
          margin: 0;
          color: var(--ion-color-medium);
          font-size: 16px;
        }
      }

      .form-group {
        margin-bottom: 24px;

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        label {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: var(--ion-text-color);
          margin-bottom: 8px;
          margin-left: 4px;
        }

        .custom-select-wrapper {
          position: relative;
          background: var(--ion-color-step-100, #f2f2f2);
          border-radius: 12px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;

          &:focus-within {
            background: var(--ion-background-color, #fff);
            border-color: var(--ion-color-primary);
            box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.1);
          }

          .custom-select {
            width: 100%;
            --padding-start: 16px;
            --padding-end: 40px; /* Make room for icon */
            --padding-top: 16px;
            --padding-bottom: 16px;
            --placeholder-color: var(--ion-color-medium);
            --placeholder-opacity: 1;
            font-size: 16px;
            font-weight: 500;
            color: var(--ion-text-color);
          }

          .select-icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: var(--ion-color-medium);
            font-size: 20px;
          }
        }

        .helper-text {
          font-size: 13px;
          margin-top: 6px;
          margin-left: 4px;

          &.error {
            color: var(--ion-color-danger);
          }
        }
      }

      .actions-section {
        margin-top: 40px;

        .add-btn {
          --border-radius: 12px;
          --padding-top: 16px;
          --padding-bottom: 16px;
          font-weight: 600;
          font-size: 16px;
          height: 52px;
          --box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3);
        }
      }
    `,
  ],
})
export class AddProjectModalComponent implements OnInit {
  @Input() relatedAccounts: Account[] = [];

  selectedAccountId: string = "";
  selectedProjectId: string = "";

  projects$: Observable<Project[]> = new BehaviorSubject([]);

  constructor(
    private modalController: ModalController,
    private store: Store,
  ) {}

  ngOnInit() {}

  onAccountChange(event: any) {
    this.selectedAccountId = event.detail.value;
    this.selectedProjectId = "";

    if (this.selectedAccountId) {
      this.store.dispatch(
        ProjectsActions.loadProjects({accountId: this.selectedAccountId}),
      );
      this.projects$ = this.store.select(
        selectActiveProjectsByAccount(this.selectedAccountId),
      );
    }
  }

  addProject() {
    if (this.selectedAccountId && this.selectedProjectId) {
      this.projects$.pipe(take(1)).subscribe((projects) => {
        const project = projects.find((p) => p.id === this.selectedProjectId);
        if (project) {
          this.modalController.dismiss({
            project: project,
            accountId: this.selectedAccountId,
          });
        }
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
