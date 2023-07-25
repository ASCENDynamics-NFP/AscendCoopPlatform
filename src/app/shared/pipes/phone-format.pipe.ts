import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "phoneFormat",
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phoneNumber: string): string {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return "";
  }
}
