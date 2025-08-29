import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {
  StandardProjectCategory,
  STANDARD_PROJECT_CATEGORIES_INFO,
} from "@shared/models/standard-project-template.model";

interface CategoryOption {
  value: StandardProjectCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: "app-category-selector",
  templateUrl: "./category-selector.component.html",
  styleUrls: ["./category-selector.component.scss"],
})
export class CategorySelectorComponent implements OnInit {
  @Input() selectedCategory?: StandardProjectCategory;
  @Input() placeholder = "Select a project category";
  @Input() disabled = false;
  @Input() required = false;
  @Output() categoryChange = new EventEmitter<StandardProjectCategory>();

  categoryOptions: CategoryOption[] = [];

  ngOnInit() {
    this.initializeCategoryOptions();
  }

  private initializeCategoryOptions() {
    this.categoryOptions = (
      Object.entries(STANDARD_PROJECT_CATEGORIES_INFO) as Array<
        [StandardProjectCategory, any]
      >
    ).map(([key, info]) => ({
      value: key,
      label: key,
      description: info.description,
      icon: info.icon,
      color: info.color,
    }));
  }

  onCategorySelect(category: StandardProjectCategory) {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  getCategoryInfo(category: StandardProjectCategory) {
    return STANDARD_PROJECT_CATEGORIES_INFO[category];
  }
}
