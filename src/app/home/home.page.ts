import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditPersonComponent } from '../edit-person/edit-person.component';
import { Person } from '../services/people/people.modet';
import { PeopleService } from '../services/people/people.service';
import { Subscription,  combineLatest} from 'rxjs';
import {ErrorMessage} from "../error-message/error-message.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  people?: Person[];
  result?: Date;
  targetNrOfYears = 100;
  addingVisible = false;
  message:ErrorMessage = {text:'Start by adding clicking above', header:'No birthdays yet'}
  private subscriptions: Subscription[] = [];

  constructor(
    private modalController: ModalController,
    private peopleService: PeopleService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([
        this.peopleService.getResultListener(),
        this.peopleService.getTargetNrOfYearListener(),
        this.peopleService.getPeopleListener()
      ]).subscribe(([result, targetYears, people]) => {
        this.result = result;
        this.targetNrOfYears = targetYears;
        this.people = people;
      })
    );
  }

  toggleVisibility() {
    this.addingVisible = !this.addingVisible;
  }

  async openEditModal(person: Person) {
    const modal = await this.modalController.create({
      component: EditPersonComponent,
      componentProps: { person,  },
    });

    await modal.present()
    await modal.dismiss();
  }

  removeAPerson(person: Person) {
    this.peopleService.removeAPerson(person);
  }

  setYear(year: number) {
    this.peopleService.setTargetYear(year);
  }
}
