import mongoose, { Schema } from 'mongoose';

const serverMiddlewareSchema = new Schema({
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
  runsOn: {
    type: {
      database: Boolean,
      auth: Boolean,
    },
    required: true,
    unique: false,
  },
});

const ServerMiddleware = mongoose.model(
  'server-middleware',
  serverMiddlewareSchema,
);

export default ServerMiddleware;
