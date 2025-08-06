import {Component, OnInit, OnDestroy} from "@angular/core";
import {
  RelationshipService,
  RelatedAccount,
} from "../../services/relationship.service";
import {
  LoadingController,
  ToastController,
  AlertController,
} from "@ionic/angular";
import {Subject, combineLatest, of, firstValueFrom} from "rxjs";
import {takeUntil, switchMap, map, catchError} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {FirestoreService} from "../../../../core/services/firestore.service";

interface BlockedUser {
  id: string;
  name: string;
  tagline?: string;
  iconImage?: string;
}

@Component({
  selector: "app-block-list",
  templateUrl: "./block-list.component.html",
  styleUrls: ["./block-list.component.scss"],
})
export class BlockListComponent implements OnInit, OnDestroy {
  blockedUsers: BlockedUser[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private currentUserId!: string;

  constructor(
    private relationshipService: RelationshipService,
    private store: Store<AuthState>,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    // Get current user ID from store
    this.store
      .select(selectAuthUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user?.uid) {
          this.currentUserId = user.uid;
          this.loadBlockedUsers();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadBlockedUsers() {
    if (!this.currentUserId) return;

    try {
      this.loading = true;

      // Get blocked relationships
      this.relationshipService
        .getBlockedRelationships(this.currentUserId)
        .pipe(
          takeUntil(this.destroy$),
          switchMap((blockedRelationships) => {
            // Get account details for each blocked user
            if (blockedRelationships.length === 0) {
              return of([]);
            }
            const blockedUserPromises = blockedRelationships.map((rel) =>
              this.firestoreService
                .getDocument<any>("accounts", rel.targetId)
                .pipe(
                  map((account) => ({
                    id: rel.targetId,
                    name:
                      account?.name || account?.displayName || "Unknown User",
                    tagline: account?.tagline,
                    iconImage: account?.iconImage,
                  })),
                  catchError(() =>
                    of({
                      id: rel.targetId,
                      name: "Unknown User",
                      tagline: undefined,
                      iconImage: undefined,
                    }),
                  ),
                ),
            );
            return combineLatest(blockedUserPromises);
          }),
        )
        .subscribe({
          next: (users) => {
            this.blockedUsers = users;
            this.loading = false;
          },
          error: (error) => {
            console.error("Error loading blocked users:", error);
            this.showToast("Failed to load blocked users", "danger");
            this.loading = false;
          },
        });
    } catch (error) {
      console.error("Error in loadBlockedUsers:", error);
      this.loading = false;
    }
  }

  async unblockUser(user: BlockedUser) {
    const alert = await this.alertController.create({
      header: "Unblock User",
      message: `Are you sure you want to unblock ${user.name}? You will be able to message each other again.`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Unblock",
          role: "destructive",
          handler: () => {
            this.performUnblock(user);
          },
        },
      ],
    });

    await alert.present();
  }

  private async performUnblock(user: BlockedUser) {
    const loading = await this.loadingController.create({
      message: "Unblocking user...",
    });
    await loading.present();

    try {
      await firstValueFrom(
        this.relationshipService.unblockUser(this.currentUserId, user.id),
      );

      // Remove from local list
      this.blockedUsers = this.blockedUsers.filter((u) => u.id !== user.id);

      await this.showToast(`${user.name} has been unblocked`, "success");
    } catch (error) {
      console.error("Error unblocking user:", error);
      await this.showToast("Failed to unblock user", "danger");
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: "top",
    });
    await toast.present();
  }

  getInitials(name: string): string {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "??"
    );
  }
}
