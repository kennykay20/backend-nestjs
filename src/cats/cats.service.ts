import { Injectable } from '@nestjs/common';
import { Cat, Breeds } from './DTO/cats.dto';
import * as shortid from 'shortid';

@Injectable()
export class CatsService {
  private readonly CatMode: Cat[] = [];
  create = (cat: Cat): any => {
    let isAdded = false;
    const { name, age } = cat;
    try {
      if (age && name) {
        cat.age = age;
        cat.name = name;
        const duplicateName = this.CatMode.find((x) => x.name == name);
        if (duplicateName) {
          return { isAdded, message: 'name already existed' };
        }
        if (cat.breed === Breeds.American) {
          cat.breed = Breeds.American;
        } else if (cat.breed === Breeds.Berman) {
          cat.breed = Breeds.Berman;
        } else {
          isAdded = false;
          return { isAdded, message: 'Breed name provided not allowed' };
        }
        cat.id = shortid.generate();
        this.CatMode.push(cat);
        console.log('CatsMode: ', this.CatMode);
        isAdded = true;
        return { isAdded, message: 'New cat added successfully!' };
      }
      return { isAdded, message: 'Please provide the required details!' };
    } catch (error) {
      console.log('Error.create.cat ', error);
      return { isAdded, message: `error occur ${error}` };
    }
  };

  findAllCat = () => {
    return this.CatMode;
  };
}
