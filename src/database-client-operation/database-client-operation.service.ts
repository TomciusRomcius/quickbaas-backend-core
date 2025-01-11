import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { navigateStringPath } from 'src/common/utils/navigateStringPath';
import { DeleteDto } from 'src/database-client/dtos/deleteDto';
import { SetDto } from 'src/database-client/dtos/setDto';

@Injectable()
export class DatabaseClientOperationService {
  private DataModel!: Model<any>;

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
    if (getDto.path) {
      const result = await this.DataModel.findOne(
        {},
        {
          [getDto.path]: 1,
        },
      );

      return navigateStringPath(result, getDto.path);
    } else {
      return await this.DataModel.findOne();
    }
  }

  public async set(setDto: SetDto) {
    if (setDto.path) {
      await this.DataModel.create({ [setDto.path]: setDto.value });
    } else {
      await this.DataModel.create(setDto.value);
    }
  }

  public async push(setDto: SetDto) {
    const newId = new mongoose.Types.ObjectId()._id.toString();
    const path = `${setDto.path}.${newId}`;
    await this.DataModel.updateOne(
      {},
      { $set: { [path]: setDto.value } },
      { upsert: true },
    );

    const db = await this.DataModel.findOne({});
    return newId;
  }
}
