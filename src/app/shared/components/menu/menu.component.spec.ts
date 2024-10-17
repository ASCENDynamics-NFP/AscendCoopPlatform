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
// src/app/shared/components/menu/menu.component.spec.ts

// import {
//   ComponentFixture,
//   TestBed,
//   fakeAsync,
//   tick,
//   waitForAsync,
// } from "@angular/core/testing";
// import {MenuComponent} from "./menu.component";
// import {ReactiveFormsModule} from "@angular/forms";
// import {IonicModule, ModalController} from "@ionic/angular";
// import {ActivatedRoute, Router} from "@angular/router";
// import {StoreModule, Store} from "@ngrx/store";
// import {authReducer} from "../../../state/reducers/auth.reducer";
// import {By} from "@angular/platform-browser";
// import * as AuthActions from "../../../state/actions/auth.actions";
// import {FeedbackModalComponent} from "../feedback-modal/feedback-modal.component";
// import {CreateGroupModalComponent} from "../../../modules/account/components/create-group-modal/create-group-modal.component";
// import {TranslateModule, TranslateService} from "@ngx-translate/core";
// import {AuthUser} from "../../../models/auth-user.model";
// import {of} from "rxjs";

// describe("MenuComponent", () => {
//   let component: MenuComponent;
//   let fixture: ComponentFixture<MenuComponent>;
//   let store: Store;
//   let router: Router;
//   let modalController: ModalController;
//   let translate: TranslateService;

//   beforeEach(waitForAsync(() => {
//     const routerSpy = jasmine.createSpyObj("Router", [
//       "navigate",
//       "navigateByUrl",
//     ]);
//     const modalControllerSpy = jasmine.createSpyObj("ModalController", [
//       "create",
//     ]);

//     TestBed.configureTestingModule({
//       declarations: [
//         MenuComponent,
//         FeedbackModalComponent,
//         CreateGroupModalComponent,
//       ],
//       imports: [
//         ReactiveFormsModule,
//         IonicModule.forRoot(),
//         StoreModule.forRoot({auth: authReducer}),
//         TranslateModule.forRoot(),
//       ],
//       providers: [
//         {provide: ActivatedRoute, useValue: {params: of({})}}, // Mock ActivatedRoute
//         {provide: Router, useValue: routerSpy},
//         {provide: ModalController, useValue: modalControllerSpy},
//       ],
//     }).compileComponents();

//     store = TestBed.inject(Store);
//     router = TestBed.inject(Router);
//     modalController = TestBed.inject(ModalController);
//     translate = TestBed.inject(TranslateService);

//     fixture = TestBed.createComponent(MenuComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   afterEach(() => {
//     component.ngOnDestroy();
//   });

//   it("should create the MenuComponent", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should initialize project links on ngOnInit", () => {
//     expect(component.project.length).toBe(7); // Adjust based on actual project array
//     expect(component.project[0].title).toBe("ASCENDynamics NFP");
//   });

//   it("should set guest menu items when user is null", () => {
//     // Dispatch signOutSuccess to set user to null
//     store.dispatch(AuthActions.signOutSuccess());

//     fixture.detectChanges();

//     expect(component.menuPages.length).toBe(3);
//     expect(component.menuPages[0].title).toBe("Login");
//     expect(component.menuPages[1].title).toBe("Sign Up");
//     expect(component.menuPages[2].title).toBe("Groups");
//   });

//   it("should set user menu items when user is authenticated", () => {
//     const authUser: AuthUser = {
//       uid: "12345",
//       email: "test@example.com",
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//       emailVerified: true, // Include emailVerified
//     };

//     store.dispatch(AuthActions.signInSuccess({user: authUser}));

//     fixture.detectChanges();

//     expect(component.menuPages.length).toBe(5);
//     expect(component.menuPages[0].title).toBe("Profile");
//     expect(component.menuPages[1].title).toBe("Groups");
//     expect(component.menuPages[2].title).toBe("Users");
//     expect(component.menuPages[3].title).toBe("Settings");
//     expect(component.menuPages[4].title).toBe("Dashboard");
//   });

//   it("should handle language change and update menu items", () => {
//     const authUser: AuthUser = {
//       uid: "12345",
//       email: "test@example.com",
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//       emailVerified: true,
//     };

//     store.dispatch(AuthActions.signInSuccess({user: authUser}));

//     // Spy on translate.instant to return translated strings
//     spyOn(translate, "instant").and.callFake((key: string) => {
//       const translations: {[key: string]: string} = {
//         "menu.profile": "Perfil",
//         "menu.groups": "Grupos",
//         "menu.users": "Usuarios",
//         "menu.settings": "Configuraciones",
//         "menu.dashboard": "Tablero",
//         "menu.login": "Iniciar Sesión",
//         "menu.signup": "Regístrate",
//         "menu.createGroup": "Crear Grupo",
//       };
//       return translations[key] || key;
//     });

//     // Simulate language change
//     translate.onLangChange.emit({lang: "es", translations: {}});

//     fixture.detectChanges();

//     expect(component.menuPages[0].title).toBe("Perfil");
//     expect(component.menuPages[1].title).toBe("Grupos");
//     expect(component.menuPages[2].title).toBe("Usuarios");
//     expect(component.menuPages[3].title).toBe("Configuraciones");
//     expect(component.menuPages[4].title).toBe("Tablero");
//   });

//   it("should handle button clicks correctly", fakeAsync(async () => {
//     const authUser: AuthUser = {
//       uid: "12345",
//       email: "test@example.com",
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//       emailVerified: true,
//     };

//     store.dispatch(AuthActions.signInSuccess({user: authUser}));

//     fixture.detectChanges();

//     const createGroupMenuItem = component.menuPages.find(
//       (p) => p.buttonLink === "create-group",
//     );
//     expect(createGroupMenuItem).toBeDefined();

//     const mockModal = {
//       present: jasmine.createSpy("present"),
//       onWillDismiss: jasmine
//         .createSpy("onWillDismiss")
//         .and.returnValue(
//           Promise.resolve({data: {groupId: "group123"}, role: "confirm"}),
//         ),
//     };

//     (modalController.create as jasmine.Spy).and.returnValue(
//       Promise.resolve(mockModal),
//     );

//     await component.handleButtonClick("create-group");
//     tick();

//     expect(modalController.create).toHaveBeenCalledWith({
//       component: CreateGroupModalComponent,
//     });
//     expect(mockModal.present).toHaveBeenCalled();
//     expect(router.navigate).toHaveBeenCalledWith(["/group123"]);
//   }));

//   it("should not navigate when handleButtonClick is called with empty string", fakeAsync(async () => {
//     spyOn(router, "navigate").and.stub();
//     await component.handleButtonClick("");
//     tick();

//     expect(router.navigate).not.toHaveBeenCalled();
//   }));

//   it("should open feedback modal", fakeAsync(async () => {
//     const authUser: AuthUser = {
//       uid: "12345",
//       email: "test@example.com",
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//       emailVerified: true,
//     };

//     store.dispatch(AuthActions.signInSuccess({user: authUser}));

//     fixture.detectChanges();

//     const mockModal = {
//       present: jasmine.createSpy("present"),
//     };

//     (modalController.create as jasmine.Spy).and.returnValue(
//       Promise.resolve(mockModal),
//     );

//     await component.showFeedbackModal();
//     tick();

//     expect(modalController.create).toHaveBeenCalledWith({
//       component: FeedbackModalComponent,
//       componentProps: {user: authUser},
//     });
//     expect(mockModal.present).toHaveBeenCalled();
//   }));

//   it("should display menu items correctly in the template", () => {
//     const authUser: AuthUser = {
//       uid: "12345",
//       email: "test@example.com",
//       displayName: "Test User",
//       photoURL: "http://example.com/photo.jpg",
//       emailVerified: true,
//     };

//     store.dispatch(AuthActions.signInSuccess({user: authUser}));

//     fixture.detectChanges();

//     const menuItems = fixture.debugElement.queryAll(By.css("ion-item"));
//     // Expecting 5 user menu items + 1 feedback item = 6
//     expect(menuItems.length).toBe(6);

//     const profileItem = menuItems.find(
//       (item) =>
//         item.query(By.css("ion-label")).nativeElement.textContent.trim() ===
//         "Profile",
//     );
//     expect(profileItem).toBeTruthy();

//     const groupsItem = menuItems.find(
//       (item) =>
//         item.query(By.css("ion-label")).nativeElement.textContent.trim() ===
//         "Grupos",
//     ); // Assuming Spanish
//     expect(groupsItem).toBeTruthy();

//     const usersItem = menuItems.find(
//       (item) =>
//         item.query(By.css("ion-label")).nativeElement.textContent.trim() ===
//         "Usuarios",
//     );
//     expect(usersItem).toBeTruthy();
//   });

//   it("should display project links correctly", () => {
//     const projectItems = fixture.debugElement.queryAll(By.css(".project-item"));

//     expect(projectItems.length).toBe(component.project.length);

//     component.project.forEach((project, index) => {
//       const projectItem = projectItems[index];
//       const title = projectItem
//         .query(By.css("ion-label"))
//         .nativeElement.textContent.trim();
//       const href = projectItem.attributes["href"];
//       expect(title).toBe(project.title);
//       expect(href).toBe(project.url);
//     });
//   });

//   it("should display login, signup, and groups for guests", () => {
//     // Ensure user is null
//     store.dispatch(AuthActions.signOutSuccess());

//     fixture.detectChanges();

//     const menuItems = fixture.debugElement.queryAll(By.css("ion-item"));

//     expect(menuItems.length).toBe(3);

//     expect(
//       menuItems[0].query(By.css("ion-label")).nativeElement.textContent.trim(),
//     ).toBe("Login");
//     expect(
//       menuItems[1].query(By.css("ion-label")).nativeElement.textContent.trim(),
//     ).toBe("Sign Up");
//     expect(
//       menuItems[2].query(By.css("ion-label")).nativeElement.textContent.trim(),
//     ).toBe("Groups");
//   });
// });
