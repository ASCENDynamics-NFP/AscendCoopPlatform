import {Component, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable, combineLatest} from "rxjs";
import {map, filter as rxFilter} from "rxjs/operators";
import {Dictionary} from "@ngrx/entity";
import {Account, RelatedAccount} from "@shared/models/account.model";
import {AuthUser} from "@shared/models/auth-user.model";
import {GroupRole, RoleType} from "@shared/models/group-role.model";
import {
  selectGroupRolesByGroupId,
  selectRelatedAccountsByAccountId,
  selectAccountEntities,
  selectAccountById,
} from "../../../../state/selectors/account.selectors";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {AccessService} from "../../../../core/services/access.service";

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
  expanded?: boolean;
  accountsExpanded?: boolean;
}

@Component({
  selector: "app-role-hierarchy",
  templateUrl: "./role-hierarchy.page.html",
  styleUrls: ["./role-hierarchy.page.scss"],
})
export class RoleHierarchyPage implements OnInit {
  @Input() embedded: boolean = false;
  groupId!: string;
  tree$!: Observable<TreeNode>;
  filteredTree$!: Observable<TreeNode>;
  orientation: "vertical" | "horizontal" = "vertical";
  searchTerm: string = "";
  private originalTree!: TreeNode;
  private currentTree!: TreeNode;
  // Expose account and auth user for template conditionals
  account$!: Observable<Account | undefined>;
  authUser$!: Observable<AuthUser | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    public access: AccessService,
  ) {
    this.groupId = this.route.snapshot.paramMap.get("accountId") || "";
  }

  ngOnInit() {
    const roles$ = this.store.select(selectGroupRolesByGroupId(this.groupId));
    const relatedAccounts$ = this.store.select(
      selectRelatedAccountsByAccountId(this.groupId),
    );
    const accountEntities$ = this.store.select(selectAccountEntities);
    this.account$ = this.store.select(selectAccountById(this.groupId));
    this.authUser$ = this.store.select(selectAuthUser);

    this.store.dispatch(AccountActions.loadAccounts());
    this.store.dispatch(AccountActions.loadGroupRoles({groupId: this.groupId}));
    this.store.dispatch(
      AccountActions.loadRelatedAccounts({accountId: this.groupId}),
    );

    this.tree$ = combineLatest([
      roles$,
      relatedAccounts$,
      accountEntities$,
      this.account$,
      this.authUser$,
    ]).pipe(
      // Wait until account is loaded to avoid flashing private categories
      rxFilter(([_, __, ___, account]) => !!account),
      map(([roles, related, entities, account, authUser]) => {
        // Filter roles by category visibility before building the tree
        const visibleRoles = roles.filter((r) =>
          this.access.isRoleCategoryVisible(
            account as Account,
            authUser,
            r.standardCategory,
          ),
        );
        const tree = this.buildTree(visibleRoles, related, entities);
        this.originalTree = JSON.parse(JSON.stringify(tree)); // Deep copy
        this.currentTree = tree;
        return tree;
      }),
    );

    this.filteredTree$ = this.tree$;
  }

  /**
   * Resolve category privacy for a given role on an account.
   * Defaults to 'public' when unset or when category is undefined.
   */
  getCategoryPrivacyForRole(
    account: Account | undefined,
    role: GroupRole | undefined,
  ): "public" | "private" {
    if (!account || !role?.standardCategory) return "public";
    const val =
      account.privacySettings?.roleCategories?.[role.standardCategory];
    return val === "private" ? "private" : "public";
  }

  buildTree(
    roles: GroupRole[],
    related: Partial<RelatedAccount>[],
    entities: Dictionary<Account>,
  ): TreeNode {
    const roleMap = new Map<string, TreeNode>();
    roles.forEach((role) => {
      roleMap.set(role.id, {
        role,
        children: [],
        accounts: [],
        expanded: true,
        accountsExpanded: true,
      });
    });

    const root: TreeNode = {
      role: undefined,
      children: [],
      accounts: [],
      expanded: true,
      accountsExpanded: true,
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
      .filter((ra) => ra.status === "accepted" && ra.roleId && ra.id)
      .forEach((ra) => {
        const node = roleMap.get(ra.roleId!);
        if (!node || !ra.id) return;
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

  expandAll() {
    this.setAccountsExpandedState(this.currentTree, true);
    this.refreshView();
  }

  collapseAll() {
    this.setAccountsExpandedState(this.currentTree, false);
    this.refreshView();
  }

  private setAccountsExpandedState(node: TreeNode, expanded: boolean) {
    node.accountsExpanded = expanded;
    node.children.forEach((child) =>
      this.setAccountsExpandedState(child, expanded),
    );
  }

  toggleAccountsForRole(node: TreeNode) {
    node.accountsExpanded = !node.accountsExpanded;
    this.refreshView();
  }

  private refreshView() {
    this.filteredTree$ = new Observable((observer) => {
      observer.next({...this.currentTree});
      observer.complete();
    });
  }

  getRoleIcon(role: GroupRole): string {
    return role.roleType === "user" ? "people" : "business-outline";
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (!this.searchTerm) {
      this.currentTree = JSON.parse(JSON.stringify(this.originalTree));
      this.filteredTree$ = new Observable((observer) => {
        observer.next(this.currentTree);
      });
    } else {
      this.currentTree = this.filterTree(
        JSON.parse(JSON.stringify(this.originalTree)),
      );
      this.filteredTree$ = new Observable((observer) => {
        observer.next(this.currentTree);
      });
    }
  }

  private filterTree(node: TreeNode): TreeNode {
    const filteredNode: TreeNode = {
      role: node.role,
      children: [],
      accounts: [],
      expanded: true,
      accountsExpanded: true,
    };

    // Check if current role matches search term
    const roleMatches = node.role?.name
      ?.toLowerCase()
      .includes(this.searchTerm);

    // If role matches, include ALL accounts for this role
    if (roleMatches && node.accounts) {
      filteredNode.accounts = [...node.accounts];
    } else {
      // Otherwise, filter accounts by name/tagline/role
      if (node.accounts) {
        filteredNode.accounts = node.accounts.filter(
          (account) =>
            account.name?.toLowerCase().includes(this.searchTerm) ||
            account.tagline?.toLowerCase().includes(this.searchTerm) ||
            account.roleName?.toLowerCase().includes(this.searchTerm),
        );
      }
    }

    // Filter children recursively
    if (node.children) {
      for (const child of node.children) {
        const filteredChild = this.filterTree(child);

        // Include child if it has matches, or if the role name matches, or if it has any filtered children
        if (
          filteredChild.accounts.length > 0 ||
          filteredChild.children.length > 0 ||
          roleMatches
        ) {
          filteredNode.children.push(filteredChild);
        }
      }
    }

    return filteredNode;
  }
}
