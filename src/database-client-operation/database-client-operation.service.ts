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

  // TODO: Fix get with arrays
  public async get(getDto: DeleteDto) {
    const data = await this.DataModel.findOne(
      {},
      {
        [getDto.path]: 1,
      },
    );

    return navigateStringPath(data, getDto.path);
  }

  public async set(setDto: SetDto) {
    await this.DataModel.create({ [setDto.path]: setDto.value });
  }

  public async push(setDto: SetDto) {
    const newId = new mongoose.Types.ObjectId().toString();

    await this.DataModel.create({
      [`${setDto.path}.${newId}`]: setDto.value,
    });
  }

  public async delete(deleteDto: DeleteDto) {
    let data = await this.DataModel.findOneAndUpdate({});
    if (!data) {
      throw new BadRequestException("Object at path doesn't exist");
    }

    data.set(deleteDto.path, undefined);
    data.save();
  }

  public async pop() {}
}
