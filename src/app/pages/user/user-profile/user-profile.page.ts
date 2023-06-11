import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {UsersService} from "../../../services/users.service";
import {ActivatedRoute} from "@angular/router";
import {MenuService} from "../../../services/menu.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserProfilePage implements OnInit {
  user: any;
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private menuService: MenuService,
  ) {}

  ngOnInit() {
    this.getUser();
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  async getUser() {
    this.usersService
      .getUser(this.route.snapshot.paramMap.get("uid"))
      .then((data) => {
        this.user = data;
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
