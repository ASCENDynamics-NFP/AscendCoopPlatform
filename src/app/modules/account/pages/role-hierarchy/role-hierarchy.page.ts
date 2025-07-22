import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest} from "rxjs";
import {map} from "rxjs/operators";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {GroupRole} from "@shared/models/group-role.model";
import {
  selectGroupRolesByGroupId,
  selectRelatedAccountsByAccountId,
  selectAccountEntities,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

interface DisplayAccount {
  id: string | undefined;
  name?: string;
  tagline?: string;
  iconImage?: string;
  roleName?: string;
}

interface TreeNode {
  role?: GroupRole;
  children: TreeNode[];
  accounts: DisplayAccount[];
}

@Component({
  selector: "app-role-hierarchy",
  templateUrl: "./role-hierarchy.page.html",
  styleUrls: ["./role-hierarchy.page.scss"],
})
export class RoleHierarchyPage implements OnInit {
  groupId!: string;
  tree$!: Observable<TreeNode>;
  orientation: "vertical" | "horizontal" = "vertical";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    const roles$ = this.store.select(selectGroupRolesByGroupId(this.groupId));
    const relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.groupId),
    );
    const accountEntities$ = this.store.select(selectAccountEntities);

    this.store.dispatch(AccountActions.loadAccounts());
    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.groupId}),
    );

    this.tree$ = combineLatest([roles$, relatedAccounts$, accountEntities$]).pipe(
      map(([roles, related, entities]) =>
        this.buildTree(roles, related, entities),
      ),
    );
  }

  buildTree(
    roles: GroupRole[],
    related: Partial<RelatedAccount>[],
    entities: {[id: string]: Account},
  ): TreeNode {
    const roleMap = new Map<string, TreeNode>();
    roles.forEach((role) => {
      roleMap.set(role.id, {role, children: [], accounts: []});
    });

    const root: TreeNode = {
      role: {id: "root", name: "None"},
      children: [],
      accounts: [],
    };

    roles.forEach((role) => {
      const node = roleMap.get(role.id)!;
      if (role.parentRoleId) {
        const parent = roleMap.get(role.parentRoleId);
        if (parent) parent.children.push(node);
        else root.children.push(node);
      } else {
        root.children.push(node);
      }
    });

    related
      .filter((ra) => ra.status === "accepted" && ra.roleId)
      .forEach((ra) => {
        const node = roleMap.get(ra.roleId!);
        if (!node) return;
        const account = entities[ra.id];
        const display: DisplayAccount = {
          id: ra.id,
          name: account?.name || ra.name,
          tagline: account?.tagline || ra.tagline,
          iconImage: account?.iconImage || ra.iconImage,
          roleName: ra.role || node.role?.name,
        };
        node.accounts.push(display);
      });

    return root;
  }

  toggleOrientation() {
    this.orientation =
      this.orientation === "vertical" ? "horizontal" : "vertical";
  }

  goToAccount(id: string | undefined | null) {
    if (id) {
      this.router.navigate([`/account/${id}`]);
    }
  }
}
