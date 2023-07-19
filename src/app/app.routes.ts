import {Routes} from "@angular/router";
import {AuthGuard} from "./core/guards/auth.guard";
import {SecureInnerPagesGuard} from "./core/guards/secure-inner-pages.guard";

export const routes: Routes = [
  // {
  //   path: "user",
  //   loadChildren: () => import("./modules/user/user.routes").then((m) => m.routes),
  // },
  {
    path: "",
    redirectTo: "user-signup",
    pathMatch: "full",
  },
  {
    path: "group-create",
    loadComponent: () =>
      import("./modules/group/pages/group-create/group-create.page").then(
        (m) => m.GroupCreatePage,
      ),
  },
  {
    path: "group-detail",
    loadComponent: () =>
      import("./modules/group/pages/group-detail/group-detail.page").then(
        (m) => m.GroupDetailPage,
      ),
  },
  {
    path: "group-edit",
    loadComponent: () =>
      import("./modules/group/pages/group-edit/group-edit.page").then(
        (m) => m.GroupEditPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "group-list",
    loadComponent: () =>
      import("./modules/group/pages/group-list/group-list.page").then(
        (m) => m.GroupListPage,
      ),
  },
  {
    path: "group-members",
    loadComponent: () =>
      import("./modules/group/pages/group-members/group-members.page").then(
        (m) => m.GroupMembersPage,
      ),
  },
  {
    path: "group-profile/:groupId",
    loadComponent: () =>
      import("./modules/group/pages/group-profile/group-profile.page").then(
        (m) => m.GroupProfilePage,
      ),
  },
  {
    path: "user-dashboard/:uid",
    loadComponent: () =>
      import("./modules/user/pages/user-dashboard/user-dashboard.page").then(
        (m) => m.UserDashboardPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-profile/:uid",
    loadComponent: () =>
      import("./modules/user/pages/user-profile/user-profile.page").then(
        (m) => m.UserProfilePage,
      ),
  },
  {
    path: "user-profile/:uid/friends",
    loadComponent: () =>
      import("./modules/user/pages/friends/friends.page").then(
        (m) => m.FriendsPage,
      ),
  },
  {
    path: "user-signup",
    loadComponent: () =>
      import("./modules/user/pages/user-signup/user-signup.page").then(
        (m) => m.UserSignupPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "user-login",
    loadComponent: () =>
      import("./modules/user/pages/user-login/user-login.page").then(
        (m) => m.UserLoginPage,
      ),
    canActivate: [SecureInnerPagesGuard],
  },
  {
    path: "user-settings/:uid",
    loadComponent: () =>
      import("./modules/user/pages/user-settings/user-settings.page").then(
        (m) => m.UserSettingsPage,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "friends",
    loadComponent: () =>
      import("./modules/user/pages/friends/friends.page").then(
        (m) => m.FriendsPage,
      ),
  },
  {
    path: 'users',
    loadComponent: () => import('./modules/user/pages/users/users.page').then( m => m.UsersPage)
  },
];
