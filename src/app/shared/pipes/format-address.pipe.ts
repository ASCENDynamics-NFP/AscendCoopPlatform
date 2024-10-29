import {Pipe, PipeTransform} from "@angular/core";
import {Address} from "../../models/account.model";

@Pipe({
  name: "formatAddress",
})
export class FormatAddressPipe implements PipeTransform {
  transform(address: Address): string {
    if (!address) return "";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zipcode,
    ].filter((part) => part);

    return parts.join(", ");
  }
}
