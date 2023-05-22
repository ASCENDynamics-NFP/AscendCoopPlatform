import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MenuComponent} from "./menu.component";
import {RouterTestingModule} from "@angular/router/testing";

describe("MenuComponent", () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const menu = fixture.componentInstance;
    expect(menu).toBeTruthy();
  });
});
