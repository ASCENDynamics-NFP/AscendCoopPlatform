import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HeroComponent  implements OnInit {
  @Input() user: User | null = null; // define your user here

  constructor() { }

  ngOnInit() {}

}
