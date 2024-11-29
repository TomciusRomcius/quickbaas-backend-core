import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { SetDto } from './dtos/setDto';
import { DeleteDto } from './dtos/deleteDto';

@Injectable()
export class DatabaseClientService {
  private DataModel!: Model<any>;

  public onModuleInit() {
    const schema = new mongoose.Schema({}, { strict: false });
    this.DataModel = mongoose.model('client-space', schema);
    if (!this.DataModel) {
      throw new Error('Failed to create the DataModel');
    }
  }

  // TODO: Fix get with arrays
  public async get(getDto: DeleteDto) {
    const data = await this.DataModel.findOne(
      {},
      {
        [getDto.path]: 1,
      },
    );

    const pathParts = getDto.path.split('.');

    let ref = data;
    pathParts.forEach((path) => {
      ref = ref[path];
    });

    return ref;
  }

  public async set(setDto: SetDto) {
    let data = await this.DataModel.findOne();
    if (!data) {
      data = await new this.DataModel();
    }

    data.set(setDto.path, setDto.value);
    data.save();
  }

  public async push(setDto: SetDto) {
    let data = await this.DataModel.findOneAndUpdate(
      {},
      { $push: { [setDto.path]: setDto.value } },
    );
    if (!data) {
      data = await new this.DataModel();
    }

    data.save();
  }

  public async delete(deleteDto: DeleteDto) {
    let data = await this.DataModel.findOneAndUpdate({});
    if (!data) {
      throw new Error("Object at path doesn't exist");
    }

    data.set(deleteDto.path, undefined);
    data.save();
  }

  public async pop() {}
}
