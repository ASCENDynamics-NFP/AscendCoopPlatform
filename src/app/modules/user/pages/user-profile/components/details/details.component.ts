import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DetailsComponent  implements OnInit {
  @Input() user: User | null = null; // define your user here

  constructor() { }

  ngOnInit() {}

}
