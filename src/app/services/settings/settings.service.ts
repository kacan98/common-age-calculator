import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private translateService:TranslateService) { }

  switchLanguage(lang:string){
    localStorage.setItem('language', lang)
    this.translateService.use(lang)
  }
}
