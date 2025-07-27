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
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {BehaviorSubject, Observable, combineLatest, map} from "rxjs";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems!: number;
  @Input() pageSize: number = 20;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  totalPages$!: Observable<number>;
  pageNumbers$!: Observable<number[]>;
  currentPageRange$!: Observable<{start: number; end: number; total: number}>;
  pagination$!: Observable<{
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  }>;

  ngOnInit() {
    this.initializePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["totalItems"] || changes["pageSize"]) {
      this.initializePagination();
    }
  }

  initializePagination() {
    // Calculate total pages
    this.totalPages$ = new BehaviorSubject(this.totalItems).pipe(
      map(() => Math.ceil(this.totalItems / this.pageSize)),
    );

    // Generate page numbers
    this.pageNumbers$ = combineLatest([
      this.currentPage$,
      this.totalPages$,
    ]).pipe(
      map(([currentPage, totalPages]) => {
        let startPage = Math.max(
          1,
          currentPage - Math.floor(this.maxVisiblePages / 2),
        );
        let endPage = startPage + this.maxVisiblePages - 1;
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
        }
        return Array.from(
          {length: endPage - startPage + 1},
          (_, i) => startPage + i,
        );
      }),
    );

    // Calculate page range
    this.currentPageRange$ = combineLatest([
      this.currentPage$,
      this.totalPages$,
    ]).pipe(
      map(([currentPage, totalPages]) => {
        const start = (currentPage - 1) * this.pageSize + 1;
        const end = Math.min(currentPage * this.pageSize, this.totalItems);
        return {start, end, total: this.totalItems};
      }),
    );

    // Combine pagination data
    this.pagination$ = combineLatest([
      this.currentPage$,
      this.totalPages$,
      this.pageNumbers$,
    ]).pipe(
      map(([currentPage, totalPages, pageNumbers]) => ({
        currentPage,
        totalPages,
        pageNumbers,
      })),
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPageSubject.next(page);
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage < Math.ceil(this.totalItems / this.pageSize)) {
      this.goToPage(currentPage + 1);
    }
  }

  previousPage() {
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }
}
