import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  getDaysInAMonth,
  PeopleService,
} from '../services/people/people.service';
import { Person } from '../services/people/people.modet';
import { ModalController } from '@ionic/angular';
import {combineLatest} from 'rxjs';

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
  dayOptions = this.createAnArrayFromNrOfDays(31);

  constructor(
    private peopleService: PeopleService,
    private modalController: ModalController
  ) {
    const monthOfBirth = new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(11),
    ]);
    const yearOfBirth = new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5000),
    ]);

    combineLatest([
      yearOfBirth.valueChanges,
      monthOfBirth.valueChanges,
    ]).subscribe(([selectedYear, selectedMonth]) => {
      if (!selectedMonth || !selectedYear) {
        this.dayOptions = this.createAnArrayFromNrOfDays(31);
      } else {
        const dayOfBirth = this.form.controls['dayOfBirth'];
        if (dayOfBirth.value > 28) dayOfBirth.setValue(null);
        this.dayOptions = this.createAnArrayFromNrOfDays(
          getDaysInAMonth(selectedYear, selectedMonth)
        );
      }
    });

    this.form = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      dayOfBirth: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      monthOfBirth,
      yearOfBirth,
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
      this.form.reset();
    }
  }

  private async editAPerson(oldVersion: Person, editedVersion: Person) {
    await this.peopleService.editAPerson(oldVersion, editedVersion);
    await this.modalController.dismiss(undefined, 'submit');
    this.form.reset();
  }

  cancel() {
    this.modalController.dismiss(undefined, 'cancel');
  }

  private createAnArrayFromNrOfDays(days: number) {
    return Array.from({ length: days }).map((i, index) => index + 1);
  }
}
