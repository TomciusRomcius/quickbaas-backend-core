import mongoose from 'mongoose';

const schema = new mongoose.Schema({}, { strict: false });
const ClientSpaceModel = mongoose.models['client-space']
  ? mongoose.model('client-space')
  : mongoose.model('client-space', schema);

export default ClientSpaceModel;
