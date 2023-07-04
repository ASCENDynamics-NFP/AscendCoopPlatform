import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MenuComponent} from "./menu.component";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../../../core/services/auth.service";
import {of} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

describe("MenuComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let service: AuthService;
  let authSpy: any;
  let translate: TranslateService;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["onSignOut"]);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    authSpy.onSignOut.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{provide: AuthService, useValue: authSpy}, TranslateService],
    }).compileComponents();

    service = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService); // inject TranslateService
    fixture.detectChanges();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const menu = fixture.componentInstance;
    expect(menu).toBeTruthy();
  });
});
