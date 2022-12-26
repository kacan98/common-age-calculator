import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements CanActivate{

  constructor(private translateService:TranslateService, private navController:NavController) { }

  switchLanguage(lang:string){
    localStorage.setItem('language', lang)
    this.translateService.use(lang)
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentLang = this.translateService.currentLang

    if(!currentLang){
      await this.navController.navigateForward(['/setLanguage'])
      return false
    } else {
     return true
    }
  }
}
