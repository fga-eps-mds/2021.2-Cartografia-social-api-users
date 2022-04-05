export class CreateNonValidatedUserDto {
    name: string;
    email: string;
    cellPhone: string;
    password?: string;
    validated: boolean;
    role: string;
    affiliation: string;
    community: string;
}