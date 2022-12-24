import {NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { MessageComponentModule } from '../message/message.module';
import {PeopleComponent} from "../people/people.component";
import {TimeAgoPipe} from "time-ago-pipe";

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
    MessageComponentModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [HomePage, PeopleComponent, TimeAgoExtendsPipe],
  providers: [TimeAgoPipe],

})
export class HomePageModule {}
