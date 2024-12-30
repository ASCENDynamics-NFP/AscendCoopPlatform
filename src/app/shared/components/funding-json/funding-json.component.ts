import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "app-funding-json",
  template: "",
})
export class FundingJsonComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get("/funding.json", {responseType: "json"}).subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        window.location.href = url;
      },
      error: (err) => {
        console.error("Error fetching funding.json:", err);
      },
    });
  }
}
