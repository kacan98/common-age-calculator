import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    let browserLanguage:string| undefined = navigator.language
    if(browserLanguage === 'cs') {
      browserLanguage = 'cz'
    } else if(browserLanguage.startsWith('en')) {
      browserLanguage = 'en'
    } else {
      browserLanguage = undefined
    }
    translateService.addLangs(['cz','en'])
    translateService.setDefaultLang(localStorage.getItem('language') || browserLanguage || 'en')
  }
}
