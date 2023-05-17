import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: "tabs",
    loadChildren: () => import("./tabs/tabs.routes").then((m) => m.routes),
  },
  {
    path: "",
    redirectTo: "user-signup",
    pathMatch: "full",
  },
  {
    path: "group-create",
    loadComponent: () =>
      import("./pages/group/group-create/group-create.page").then(
        (m) => m.GroupCreatePage,
      ),
  },
  {
    path: "group-detail",
    loadComponent: () =>
      import("./pages/group/group-detail/group-detail.page").then(
        (m) => m.GroupDetailPage,
      ),
  },
  {
    path: "group-edit",
    loadComponent: () =>
      import("./pages/group/group-edit/group-edit.page").then(
        (m) => m.GroupEditPage,
      ),
  },
  {
    path: "group-list",
    loadComponent: () =>
      import("./pages/group/group-list/group-list.page").then(
        (m) => m.GroupListPage,
      ),
  },
  {
    path: "group-members",
    loadComponent: () =>
      import("./pages/group/group-members/group-members.page").then(
        (m) => m.GroupMembersPage,
      ),
  },
  {
    path: "group-profile",
    loadComponent: () =>
      import("./pages/group/group-profile/group-profile.page").then(
        (m) => m.GroupProfilePage,
      ),
  },
  {
    path: "user-dashboard",
    loadComponent: () =>
      import("./pages/user/user-dashboard/user-dashboard.page").then(
        (m) => m.UserDashboardPage,
      ),
  },
  {
    path: "user-profile",
    loadComponent: () =>
      import("./pages/user/user-profile/user-profile.page").then(
        (m) => m.UserProfilePage,
      ),
  },
  {
    path: "user-signup",
    loadComponent: () =>
      import("./pages/user/user-signup/user-signup.page").then(
        (m) => m.UserSignupPage,
      ),
  },
  {
    path: "user-login",
    loadComponent: () =>
      import("./pages/user/user-login/user-login.page").then(
        (m) => m.UserLoginPage,
      ),
  },
  {
    path: "user-password-reset",
    loadComponent: () =>
      import("./pages/user/user-password-reset/user-password-reset.page").then(
        (m) => m.UserPasswordResetPage,
      ),
  },
  {
    path: "user-settings",
    loadComponent: () =>
      import("./pages/user/user-settings/user-settings.page").then(
        (m) => m.UserSettingsPage,
      ),
  },
];
