import { Component, Input } from '@angular/core'
import {SettingsService} from "../services/settings/settings.service";
import {TranslateService} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";

export interface ErrorMessage {
  headerIconName?: string
  text: string
  header: string
  interpolateParams?: any
  actions?: {
    callback: () => void
    actionText: string
    iconName?: string
  }[]
}


@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() message?: ErrorMessage
  languages = [{name:"Čeština" ,fileName:'cz', flag:"🇨🇿"}, {name:"English" ,fileName:'en',flag:"🇬🇧"}];
  currentLang = new FormControl(this.translateService.defaultLang)

  constructor(private settingsService: SettingsService, private translateService:TranslateService) {
    this.currentLang.valueChanges.subscribe((c)=>{
      if(c){
        console.log(c)
      this.changeLanguage(c)
      }
    })
  }

  changeLanguage(lang:string) {
    this.settingsService.switchLanguage(lang)
  }
}
