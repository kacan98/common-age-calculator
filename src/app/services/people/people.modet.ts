export type Person = {
  _id: number;
  name: string;
  dateOfBirth: Date;
  ageAtResult?: number;
  //used for calculations, do NOT fill in!
  currentAge?: number;
};
