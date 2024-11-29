import mongoose, { Schema } from 'mongoose';

const serverFunctionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: false,
  },
});

const ServerFunction = mongoose.model('server-function', serverFunctionSchema);

export default ServerFunction;
