import { Component } from '@angular/core';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  darkmode() {
    let themeLink: HTMLLinkElement | null = document.head.querySelector('#theme');

    themeLink!.href = '../../../content/css/darkly.min.css';

    console.log('dark');
  }
}
