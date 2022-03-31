export class CreateNonValidatedUserDto {
    name: string;
    email: string;
    cellPhone: string;
    password?: string;
    justification: string;
    affiliation: string;
    community: string;
}