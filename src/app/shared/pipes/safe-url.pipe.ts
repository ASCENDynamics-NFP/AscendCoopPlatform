import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
