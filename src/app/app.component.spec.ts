import {TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppComponent} from "./app.component";
import {of} from "rxjs";
import {AuthService} from "./services/auth.service";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

describe("AppComponent", () => {
  let service: AuthService;
  let authSpy: any;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["onSignOut"]);
    // Mock user$ as an Observable that emits null
    authSpy.user$ = of(null);
    authSpy.onSignOut.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        })],
      providers: [{provide: AuthService, useValue: authSpy}, TranslateService],
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
