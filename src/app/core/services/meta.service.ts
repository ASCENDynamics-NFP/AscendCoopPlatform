import {Injectable} from "@angular/core";
import {Title, Meta} from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class MetaService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {}

  /**
   * Update meta tags for a page
   * @param title - The title of the page
   * @param description - The meta description
   * @param keywords - The meta keywords
   * @param ogTitle - Open Graph title
   * @param ogDescription - Open Graph description
   * @param ogUrl - Open Graph URL
   */
  updateMetaTags(
    title: string,
    description: string,
    keywords: string,
    ogTitle: string,
    ogDescription: string,
    ogUrl: string,
  ): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({name: "description", content: description});
    this.metaService.updateTag({name: "keywords", content: keywords});
    this.metaService.updateTag({property: "og:title", content: ogTitle});
    this.metaService.updateTag({
      property: "og:description",
      content: ogDescription,
    });
    this.metaService.updateTag({property: "og:url", content: ogUrl});
  }
}
