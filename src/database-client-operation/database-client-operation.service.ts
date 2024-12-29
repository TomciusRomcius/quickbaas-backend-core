import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { CachingService } from 'src/caching/caching.service';
import { navigateStringPath } from 'src/common/utils/navigateStringPath';
import { DeleteDto } from 'src/database-client/dtos/deleteDto';
import { SetDto } from 'src/database-client/dtos/setDto';

@Injectable()
export class DatabaseClientOperationService {
  private DataModel!: Model<any>;

  constructor(private cachingService: CachingService) { }

  public onModuleInit() {
    const schema = new mongoose.Schema({}, { strict: false });
    try {
      this.DataModel = mongoose.model('client-space', schema);
    } catch {
      this.DataModel = mongoose.model('client-space');
    }
    if (!this.DataModel) {
      throw new Error('Failed to create the DataModel');
    }
  }

  public async get(getDto: DeleteDto) {
    const cachedData = await this.cachingService.get(getDto.path);

    let data;

    if (cachedData !== null) {
      data = cachedData;
    } else if (!getDto.path) {
      data = await this.DataModel.findOne();
      await this.cachingService.set(getDto.path, data);
    } else {
      data = await this.DataModel.findOne(
        {},
        {
          [getDto.path]: 1,
        },
      );
      await this.cachingService.set(getDto.path, data);
    }

    return data;
  }

  public async set(setDto: SetDto) {
    let addToDbFn;
    if (setDto.path) {
      addToDbFn = this.DataModel.create({ [setDto.path]: setDto.value });
    } else {
      addToDbFn = this.DataModel.create(setDto.value);
    }
    const promises = [
      this.cachingService.set(setDto.path, setDto.value),
      addToDbFn,
    ];

    await Promise.all(promises);
  }

  public async push(setDto: SetDto) {
    const newId = new mongoose.Types.ObjectId()._id.toString();
    const path = `${setDto.path}.${newId}`;

    const promises = [
      this.DataModel.create({
        [path]: setDto.value,
      }),
      this.cachingService.set(path, setDto.value),
    ];

    await Promise.all(promises);
    return newId;
  }

  public async delete(deleteDto: DeleteDto) {
    const promises = [
      this.DataModel.findOneAndUpdate(),
      this.cachingService.set(deleteDto.path, null),
    ];

    const [data] = await Promise.all(promises);
    if (!data) {
      throw new BadRequestException("Object at path doesn't exist");
    }

    data.set(deleteDto.path, undefined);
    data.save();
  }

  public async pop() {}
}
