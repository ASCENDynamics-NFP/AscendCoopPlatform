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
import {NgModule} from "@angular/core";
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
  TranslatePipe,
  TranslateDirective,
} from "@ngx-translate/core";
import {of} from "rxjs";

/**
 * Mock TranslateService for testing
 */
export class MockTranslateService {
  get(key: string, params?: any): any {
    // Return the key as translation for simplicity in tests
    return of(key);
  }

  instant(key: string, params?: any): string {
    return key;
  }

  setTranslation(lang: string, translations: any): void {}

  use(lang: string): any {
    return of(lang);
  }

  addLangs(langs: string[]): void {}

  setDefaultLang(lang: string): void {}

  getDefaultLang(): string {
    return "en";
  }

  getBrowserLang(): string {
    return "en";
  }

  onTranslationChange = of();
  onLangChange = of();
  onDefaultLangChange = of();
}

/**
 * Testing module that provides TranslateModule with mock service
 * Use this in your test configurations to avoid translation-related errors
 */
@NgModule({
  imports: [TranslateModule],
  providers: [{provide: TranslateService, useClass: MockTranslateService}],
  exports: [TranslateModule],
})
export class TranslateTestingModule {}
