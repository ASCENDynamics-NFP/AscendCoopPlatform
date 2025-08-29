import {Component, Input} from "@angular/core";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "@shared/models/standard-project-template.model";

@Component({
  selector: "app-category-badge",
  templateUrl: "./category-badge.component.html",
  styleUrls: ["./category-badge.component.scss"],
})
export class CategoryBadgeComponent {
  @Input() category?: StandardProjectCategory;
  @Input() size: "small" | "medium" | "large" = "medium";
  @Input() showIcon = true;
  @Input() showText = true;

  getCategoryInfo(category: StandardProjectCategory) {
    return STANDARD_PROJECT_CATEGORIES_INFO[category];
  }
}
