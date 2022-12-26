import {NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import {PeopleComponent} from "../people/people.component";
import {TimeAgoPipe} from "time-ago-pipe";
import {TranslateModule} from "@ngx-translate/core";
import {EditPersonComponent} from "../edit-person/edit-person.component";
import {ErrorMessageComponent} from "../error-message/error-message.component";
import {LanguageSelectorComponent} from "../language-selector/language-selector.component";

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [HomePage, PeopleComponent, TimeAgoExtendsPipe, EditPersonComponent, ErrorMessageComponent, LanguageSelectorComponent],
  providers: [TimeAgoPipe],

  exports: [
    ErrorMessageComponent,
    LanguageSelectorComponent
  ]
})
export class HomePageModule {}
