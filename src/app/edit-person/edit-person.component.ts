import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService } from '../services/people/people.service';
import { Person } from '../services/people/people.modet';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss'],
})
export class EditPersonComponent implements OnInit {
  @Input() person?: Person;
  form: FormGroup;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    private peopleService: PeopleService,
    private modalController: ModalController
  ) {
    this.form = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      dayOfBirth: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      monthOfBirth: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(11),
      ]),
      yearOfBirth: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000),
      ]),
    });
  }

  ngOnInit() {
    if (this.person) {
      const dateOfBirth = this.person.dateOfBirth;
      this.form.setValue({
        name: this.person.name,
        dayOfBirth: dateOfBirth.getDate(),
        monthOfBirth: dateOfBirth.getMonth(),
        yearOfBirth: dateOfBirth.getFullYear(),
      });
    }
  }

  async savePerson() {
    const { name, dayOfBirth, monthOfBirth, yearOfBirth } =
      this.form.getRawValue();
    const dateOfBirth = new Date();
    dateOfBirth.setDate(dayOfBirth);
    dateOfBirth.setMonth(monthOfBirth);
    dateOfBirth.setFullYear(yearOfBirth);
    if (this.person) {
      await this.editAPerson(this.person, {
        ...this.person,
        name,
        dateOfBirth,
      });
    } else {
      this.peopleService.addAPerson({
        _id: Math.round(Math.random() * 58976421341312),
        name,
        dateOfBirth,
      });
    }}

  private async editAPerson(oldVersion: Person, editedVersion: Person) {
    await this.peopleService.editAPerson(oldVersion, editedVersion);
    await this.modalController.dismiss(undefined, 'submit');
    this.form.reset()
  }

  cancel() {
    this.modalController.dismiss(undefined,'cancel')
  }
}
