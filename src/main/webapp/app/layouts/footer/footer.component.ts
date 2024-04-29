import { Component } from '@angular/core';
import { FooterService } from './footer.service';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private themeLink: HTMLLinkElement | null = document.head.querySelector('#theme');

  constructor(private footerService: FooterService) {
    this.themeLink!.href = footerService.isDarkMode() ? '../../../content/css/darkly.min.css' : '../../../content/css/flatly.min.css';
  }

  darkmode(): void {
    if (this.footerService.isDarkMode()) {
      this.footerService.toggleDark();
      this.themeLink!.href = '../../../content/css/flatly.min.css';
    } else {
      this.footerService.toggleDark();
      this.themeLink!.href = '../../../content/css/darkly.min.css';
    }
  }
}
