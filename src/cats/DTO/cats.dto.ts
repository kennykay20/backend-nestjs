export class CreateCatsDTO {
  id: string;
  name: string;
  age: number;
  breed: Breeds;
}

export interface Cat {
  id: string;
  name: string;
  age: number;
  breed: Breeds;
}

export enum Breeds {
  American = 'American Curl',
  Berman = 'Berman',
}
