export interface CreateOrUpdateUserInput {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  isActive: boolean;
  roleNames: string[];
  password: string;
  id: number;
}

export interface ChangePasswordRequestDto {
  userId: Number;
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;

}

export interface UpdateSupporterProfileRequestDto {
  userId: Number,
  name: string,
  contactNumber: string,
  email: string,
  gender: string,
  dateOfBirth: Date,
  countryId: Number
}