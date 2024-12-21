export interface ParentData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
  }
  
  export interface BabyData {
    name: string;
    dateOfBirth: string;
    gender: string;
    medicalConditions: string;
  }
  
  export interface Errors {
    [key: string]: string;
  }
  