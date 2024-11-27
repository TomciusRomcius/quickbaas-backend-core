import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { SetDto } from './dtos/setDto';
import { generatePushQuery } from './utils';
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

  public async set(setDto: SetDto) {
    let data = await this.DataModel.findOne();
    if (!data) {
      data = await new this.DataModel();
    }

    data.set(setDto.path, setDto.value);
    data.save();
  }

  public async push(setDto: SetDto) {
    const pushQuery = generatePushQuery(setDto.path, setDto.value);
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
