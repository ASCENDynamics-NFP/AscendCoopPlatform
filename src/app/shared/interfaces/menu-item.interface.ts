// src/app/shared/interfaces/menu-item.interface.ts

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  hasButton?: boolean;
  buttonLink?: string;
  buttonText?: string;
  buttonIcon?: string;
}
