import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    let browserLanguage:string| undefined = navigator.language.slice(0, 2)
    if(browserLanguage === 'cs') {
      browserLanguage = 'cz'
    } 
    translateService.addLangs(LanguageSelectorComponent.languages.map(language => language.fileName))
    translateService.setDefaultLang(localStorage.getItem('language') || browserLanguage || 'en')
  }
}
