import { Component, Input } from '@angular/core';
import { Account } from '../../../../../../models/account.model';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss'],
  standalone: false
})
export class ContactInformationComponent {

  _account!: Partial<Account>
  get account() {
    return this._account
  }
  @Input() set account(account: Partial<Account> | undefined) {
    if(!account) {
      return
    }
    this._account = account
  }

  getPhoneNumber(): string {
    if(this.account?.contactInformation?.phoneNumbers.length === 0 ) {
      return '-'
    }
    const firstPhoneInfos = this.account?.contactInformation?.phoneNumbers[0]
    return `+${firstPhoneInfos?.countryCode}${firstPhoneInfos?.number}`
  }


}
