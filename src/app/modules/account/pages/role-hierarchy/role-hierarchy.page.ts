import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest, of} from "rxjs";
import {map} from "rxjs/operators";
import {RelatedAccount} from "@shared/models/account.model";
import {GroupRole} from "@shared/models/group-role.model";
import {
  selectGroupRolesByGroupId,
  selectRelatedAccountsByAccountId,
} from "../../../../state/selectors/account.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";

interface TreeNode {
  role?: GroupRole;
  children: TreeNode[];
  accounts: Partial<RelatedAccount>[];
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

    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.groupId}),
    );

    this.tree$ = combineLatest([roles$, relatedAccounts$]).pipe(
      map(([roles, related]) => this.buildTree(roles, related)),
    );
  }

  buildTree(roles: GroupRole[], related: Partial<RelatedAccount>[]): TreeNode {
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
        if (node) node.accounts.push(ra);
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
