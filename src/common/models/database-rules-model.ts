import mongoose, { Schema } from 'mongoose';

const databaseRulesSchema = new Schema({}, { strict: false });

const DatabaseRules = mongoose.model('database-rules', databaseRulesSchema);

export default DatabaseRules;