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
// src/app/core/services/meta.service.ts
/**
 * MetaService: Enhancing SEO for Angular Pages
 */
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
   * Updates meta tags for a page
   * @param title - Page title
   * @param description - Meta description
   * @param keywords - Meta keywords
   * @param ogData - Open Graph data including title, description, and URL
   * @param twitterData - Twitter Card metadata
   */
  updateMetaTags(
    title: string,
    description: string,
    keywords: string,
    ogData: {title: string; description: string; url: string; image?: string},
    twitterData?: {
      card: string;
      title: string;
      description: string;
      image?: string;
    },
  ): void {
    // Set title
    this.titleService.setTitle(title);

    // Update standard meta tags
    if (description && description.trim()) {
      this.metaService.updateTag({name: "description", content: description});
    }
    this.metaService.updateTag({name: "keywords", content: keywords});

    // Update Open Graph meta tags
    if (ogData.title && ogData.title.length <= 60) {
      this.metaService.updateTag({property: "og:title", content: ogData.title});
    } else {
      console.warn(
        "Open Graph title exceeds recommended length (60 characters).",
      );
    }
    this.metaService.updateTag({
      property: "og:description",
      content: ogData.description,
    });
    this.metaService.updateTag({property: "og:url", content: ogData.url});
    if (ogData.image) {
      this.metaService.updateTag({property: "og:image", content: ogData.image});
    }

    // Update Twitter Card meta tags if provided
    if (twitterData) {
      this.metaService.updateTag({
        name: "twitter:card",
        content: twitterData.card,
      });
      this.metaService.updateTag({
        name: "twitter:title",
        content: twitterData.title,
      });
      this.metaService.updateTag({
        name: "twitter:description",
        content: twitterData.description,
      });
      if (twitterData.image) {
        this.metaService.updateTag({
          name: "twitter:image",
          content: twitterData.image,
        });
      }
    }
  }

  /**
   * Clears all meta tags (optional, for dynamic pages)
   */
  clearMetaTags(): void {
    const metaTags = [
      "description",
      "keywords",
      "og:title",
      "og:description",
      "og:url",
      "og:image",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ];

    metaTags.forEach((tag) => {
      this.metaService.removeTag(`name='${tag}', property='${tag}'`);
    });
  }
}
