import {TestBed} from "@angular/core/testing";
import {MenuService} from "./menu.service";

describe("MenuService", () => {
  let service: MenuService;
  let menuSpy: any;

  beforeEach(() => {
    menuSpy = jasmine.createSpyObj("menu", ["onEnter", "onLeave"]);
    menuSpy.onEnter.and.returnValue(null);
    menuSpy.onLeave.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [{provide: MenuService, useValue: menuSpy}],
    });

    service = TestBed.inject(MenuService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
