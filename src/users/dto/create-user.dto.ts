export class CreateUserDto {
  name: string;
  email: string;
  cellPhone: string;
  password?: string;
  validated?: boolean;
  role?: string;
  affiliation?: string;
  community?: string;
  type: string;
}
