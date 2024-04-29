import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FooterService {
  private darkMode: boolean = false;

  private systemSettingDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

  constructor() {
    this.darkMode = this.systemSettingDark;
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleDark(): void {
    this.darkMode = !this.darkMode;
  }
}
