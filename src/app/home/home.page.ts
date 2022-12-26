import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditPersonComponent } from '../edit-person/edit-person.component';
import { Person } from '../services/people/people.modet';
import {getAge, PeopleService} from '../services/people/people.service';
import { Subscription, combineLatest } from 'rxjs';
import { ErrorMessage } from '../error-message/error-message.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  people?: Person[];
  result?: Date;
  targetNrOfYears = 100;
  message: ErrorMessage = {
    text: 'Intro',
    header: 'Common birthday calculator',
    actions: [
      {
        callback: async () => {
          await this.openEditModal()
        },
        actionText: 'Add someone new',
      },
    ],
  };
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
        this.peopleService.getPeopleListener(),
      ]).subscribe(([result, targetYears, people]) => {
        this.result = result;
        this.targetNrOfYears = targetYears;
        this.people = people?.map((person)=>{
          if(result){
            person.ageAtResult = getAge(person.dateOfBirth, result)
          }
          return person
        })
      })
    );
  }

  async openEditModal(person?: Person, event?: Event) {
    if(event){
    event.stopPropagation();
    }

    const modal = await this.modalController.create({
      component: EditPersonComponent,
      componentProps: { person },
      initialBreakpoint: 0.75,
      breakpoints: [0.75],
      backdropDismiss: true,
      backdropBreakpoint: 0.25,
    });

    await modal.present();
  }

  removeAPerson(person: Person, event: Event) {
    event.stopPropagation();
    this.peopleService.removeAPerson(person);
  }

  setYear(year: number) {
    this.peopleService.setTargetYear(year);
  }
}
