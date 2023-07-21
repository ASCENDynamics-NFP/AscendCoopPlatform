import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FriendsPage} from "./friends.page";
import { of } from "rxjs";
import { ActivatedRoute } from "@angular/router";

describe("FriendsPage", () => {
  let component: FriendsPage;
  let fixture: ComponentFixture<FriendsPage>;

  
  beforeEach(() => {
    
    TestBed.configureTestingModule({
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123e4567', // replace 'value' with the actual value you want to mock
              }
            },
            params: of({id: 123}) // replace 123 with the actual value you want to mock
          } 
        }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(FriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
