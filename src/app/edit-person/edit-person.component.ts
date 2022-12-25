import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService } from '../services/people/people.service';
import { Person } from '../services/people/people.modet';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.scss'],
})
export class EditPersonComponent implements OnInit {
  @Input() person?: Person;
  form: FormGroup;
  months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

  constructor(private peopleService: PeopleService, private modalController:ModalController) {
    this.form = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      dayOfBirth: new FormControl<number>(0,[Validators.required, Validators.min(1), Validators.max(31)]),
      monthOfBirth: new FormControl<number>(0,[Validators.required, Validators.min(1), Validators.max(11)]),
      yearOfBirth: new FormControl<number>(0,[Validators.required, Validators.min(1), Validators.max(5000)]),
    });
    this.resetFormToToday()
  }

  ngOnInit() {
      if (this.person) {
        this.form.setValue({ name:this.person.name, dateOfBirth: this.person.dateOfBirth.toISOString() });
      }
  }

  savePerson() {
    const { name, dayOfBirth, monthOfBirth, yearOfBirth } = this.form.getRawValue();
    const dateOfBirth = new Date()
    dateOfBirth.setDate(dayOfBirth)
    dateOfBirth.setMonth(monthOfBirth - 1)
    dateOfBirth.setFullYear(yearOfBirth)
    if (this.person) {
      this.editAPerson(this.person, {
        ...this.person,
        name,
        dateOfBirth,
      });
    } else {
      this.peopleService.addAPerson({
        _id: Math.random()*1000000,
        name,
        dateOfBirth,
      });
    }
    this.resetFormToToday()
  }

  private async editAPerson(oldVersion: Person, editedVersion: Person) {
    this.peopleService.editAPerson(oldVersion, editedVersion);
    await this.modalController.dismiss(undefined,'submit')
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  private resetFormToToday() {
    const today = new Date()
    this.form.setValue({
      ...this.form.getRawValue(),
      name:"",
      dayOfBirth: today.getDate(),
      monthOfBirth:today.getMonth(),
      yearOfBirth:today.getFullYear(),
    })
  }
}

