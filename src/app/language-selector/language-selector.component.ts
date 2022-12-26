import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SettingsService } from '../services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  languages = [
    { name: 'Čeština', fileName: 'cz', flag: '🇨🇿' },
    { name: 'English', fileName: 'en', flag: '🇬🇧' },
  ];
  currentLang = new FormControl(this.translateService.defaultLang);

  constructor(
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.currentLang.valueChanges.subscribe((lang) => {
      if (lang) {
        this.settingsService.switchLanguage(lang);
      }
    });
  this.translateService.onLangChange.subscribe((lang)=>{
    this.currentLang.setValue(lang.lang)
  })
  }
}
