import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type Person = {
  name: string;
  dateOfBirth: Date;
  ageAtResult?: number;
  //used for calculations, do NOT fill in!
  currentAge?: number;
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  people: Person[] = [
    {
      name: 'Kája',
      dateOfBirth: new Date('Sat Feb 28 1998 00:00:00 GMT+0200'),
    },
    {
      name: 'Taťka',
      dateOfBirth: new Date('Sat Jun 13 1970 00:00:00 GMT+0200'),
    },
    {
      name: 'Mamka',
      dateOfBirth: new Date('Sat Jun 22 1970 00:00:00 GMT+0200'),
    },
    { name: 'Aňa', dateOfBirth: new Date('Nov 20 2000 00:00:00 GMT+0200') },
    { name: 'Babi D', dateOfBirth: new Date('Jul 10 1947 00:00:00 GMT+0200') },
    { name: 'Děda J', dateOfBirth: new Date('Apr 3 1947 00:00:00 GMT+0200') },
    { name: 'Děda V', dateOfBirth: new Date('Jan 22 1938 00:00:00 GMT+0200') },
    { name: 'Babi Z', dateOfBirth: new Date('Mar 9 1947 00:00:00 GMT+0200') },
    { name: 'Péťa', dateOfBirth: new Date('Sep 23 1983 00:00:00 GMT+0200') },
    { name: 'Marketa', dateOfBirth: new Date('Feb 16 1977 00:00:00 GMT+0200') },
    { name: 'Carlos', dateOfBirth: new Date('Nov 5 1971 00:00:00 GMT+0200') },
    { name: 'Dani', dateOfBirth: new Date('May 11 1971 00:00:00 GMT+0200') },
    { name: 'Alma', dateOfBirth: new Date('May 25 1971 00:00:00 GMT+0200') },
    { name: 'Lucas', dateOfBirth: new Date('Sep 6 1971 00:00:00 GMT+0200') },
  ];
  form: FormGroup;
  result?: Date;
  nicerResult?: Date;
  nrOfYearsFromToday = 1000;
  addingVisible = false;

  constructor() {
    this.form = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      dateOfBirth: new FormControl<string>(
        new Date().toISOString(),
        Validators.required
      ),
    });
    this.adjustResult();
  }

  adjustResult() {
    if (this.nrOfYearsFromToday < 1) {
      this.result = undefined;
      this.nicerResult = undefined;
      return;
    }
    //sort mutates the original array
    this.people.sort(
      (p1, p2) => p1.dateOfBirth.getTime() - p2.dateOfBirth.getTime()
    );

    // this.findXYearsFromNow();

    // this.fillInAges();

    const peopleSortedBasedOnDateInTheYear = this.people
      .slice()
      .sort((p1, p2) => {
        const date1 = new Date(p1.dateOfBirth);
        const date2 = new Date(p2.dateOfBirth);
        date1.setFullYear(0);
        date2.setFullYear(0);
        return date1.getTime() - date2.getTime();
      });

    const indexOfOldestPeron = peopleSortedBasedOnDateInTheYear.findIndex(
      (p) => p.name === this.people[0].name
    );

    let currentYear = this.people[0].dateOfBirth.getFullYear();
    let collectiveAge = 0;
    peopleSortedBasedOnDateInTheYear.forEach((p) => {
      p.currentAge = 0;
    });
    for (
      let i = indexOfOldestPeron;
      collectiveAge !== this.nrOfYearsFromToday;
      i++
    ) {
      if (i === peopleSortedBasedOnDateInTheYear.length) {
        i = 0;
        currentYear++;
      }

      const currentPerson = peopleSortedBasedOnDateInTheYear[i];
      console.log(currentPerson);
      const currentPersonsBirthdayThisYear = new Date(
        currentPerson.dateOfBirth
      );
      currentPersonsBirthdayThisYear.setFullYear(currentYear);
      const ageOfCurrentPerson = getDiffBetweenTwoDatesInYears(
        currentPerson.dateOfBirth,
        currentPersonsBirthdayThisYear
      );
      currentPerson.currentAge = ageOfCurrentPerson;

      if (ageOfCurrentPerson < 0) {
        continue;
      } else if (ageOfCurrentPerson === 0) {
        currentPerson.currentAge = 0;
      }
      collectiveAge = peopleSortedBasedOnDateInTheYear.reduce((prev, curr) => {
        if (!curr.currentAge || curr.currentAge < 0) return prev;
        return prev + curr.currentAge;
      }, 0);

      if (collectiveAge === this.nrOfYearsFromToday) {
        console.log(peopleSortedBasedOnDateInTheYear[i].dateOfBirth);
        const theDay = new Date(
          peopleSortedBasedOnDateInTheYear[i].dateOfBirth
        );
        console.log('theDay: ', theDay);
        theDay.setHours(0, 0, 0, 0);
        theDay.setFullYear(currentYear);
        this.nicerResult = theDay;
        this.fillInAges();
      }
    }
  }

  addAPerson() {
    const { name, dateOfBirth } = this.form.getRawValue();
    this.people.push({
      name,
      dateOfBirth: new Date(dateOfBirth),
    });
    this.form.reset();
    this.adjustResult();
  }

  removePerson(name: string) {
    this.people = this.people.filter((p) => p.name !== name);
    this.adjustResult();
  }

  toggleVisibility() {
    this.addingVisible = !this.addingVisible;
  }

  //Old implementation
  // private findXYearsFromNow() {
  //   let daysLeft = this.nrOfYearsFromToday * 365.25;
  //   for (let i = 0; i < this.people.length; i++) {
  //     if (i === 0) {
  //       //just check that the first one is not too old
  //       const whatDateWouldWeGetIfWeJustAddedAllDaysToFirst = addDaysToADate(
  //         this.people[0].dateOfBirth,
  //         daysLeft
  //       );
  //       if (
  //         whatDateWouldWeGetIfWeJustAddedAllDaysToFirst.getTime() <
  //         this.people[1].dateOfBirth.getTime()
  //       ) {
  //         this.result = whatDateWouldWeGetIfWeJustAddedAllDaysToFirst;
  //         break;
  //       }
  //     }
  //
  //     const previousPerson = this.people[i - 1] || this.people[i];
  //     const currentPerson = this.people[i];
  //
  //     const diff = getDiffBetweenTwoDatesInDays(
  //       previousPerson.dateOfBirth,
  //       currentPerson.dateOfBirth
  //     );
  //     console.log(
  //       `There are ${
  //         Math.round((diff * 100) / 365.25) / 100
  //       } (x ${i}) years between ${currentPerson.name} and ${
  //         previousPerson.name
  //       } is `
  //     );
  //     if (daysLeft - i * diff > 0) {
  //       `${i} people alive, ${Math.round(
  //         (i * diff) / 365.25
  //       )} years were lived`;
  //       console.log(
  //         `(${Math.round((daysLeft * 100) / 365.25) / 100}) - (${
  //           Math.round((i * diff * 100) / 365.25) / 100
  //         })`
  //       );
  //       daysLeft -= i * diff;
  //       console.log(
  //         `years left: ${Math.round((daysLeft * 100) / 365.25) / 100}`
  //       );
  //       console.log('END!');
  //     } else {
  //       const realDaysToAddToPrevious = daysLeft / i;
  //       console.log(
  //         `So i'll only add ${
  //           Math.round((realDaysToAddToPrevious * 100) / 365) / 100
  //         } years to ${previousPerson.dateOfBirth.toDateString()} (${
  //           previousPerson.name
  //         }'s birthday)`
  //       );
  //
  //       this.result = addDaysToADate(
  //         previousPerson.dateOfBirth,
  //         realDaysToAddToPrevious
  //       );
  //       console.log('and that will make it ', this.result);
  //       break;
  //     }
  //
  //     if (i === this.people.length - 1) {
  //       console.log(
  //         'Well, there is still someone left, even though we are on the last'
  //       );
  //       console.log(
  //         `So I devided the remaining ${daysLeft / 365.25} years by ${i + 1}`
  //       );
  //       const realDaysToAddToCurrent = daysLeft / (i + 1);
  //       console.log(`Which equals to ${realDaysToAddToCurrent / 365.25}`);
  //       console.log(`I'll add that to ${currentPerson.name}'s birthday.`);
  //       this.result = addDaysToADate(
  //         currentPerson.dateOfBirth,
  //         realDaysToAddToCurrent
  //       );
  //     }
  //   }
  // }

  private fillInAges() {
    this.people.forEach((p) => {
      if (this.nicerResult) {
        p.ageAtResult = getAge(p.dateOfBirth, this.nicerResult);
      }
    });
  }
}

// const getDiffBetweenTwoDatesInMilliseconds = (
//   date1: Date,
//   date2: Date
// ): number => {
//   return Math.abs(date2.getTime() - date1.getTime());
// };
//
// const getDiffBetweenTwoDatesInDays = (date1: Date, date2: Date): number => {
//   const diffMs = date2.getTime() - date1.getTime();
//   return Math.floor(diffMs / (1000 * 60 * 60 * 24));
// };

const getDiffBetweenTwoDatesInYears = (date1: Date, date2: Date): number => {
  return date2.getFullYear() - date1.getFullYear();
};

// const addDaysToADate = (date: Date, days: number): Date => {
//   let newDate = new Date(date);
//   newDate.setDate(date.getDate() + days);
//   return newDate;
// };

function getAge(birthday: Date, today: Date) {
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
