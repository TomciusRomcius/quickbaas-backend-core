export type SchemaDatatype = {
  key: string;
  datatype: any;
};

const typeMap = {
  String: String,
  Number: Number,
  Boolean: Boolean,
};

export function parseSchema(schemaStructure: {}) {
  const schema = structuredClone(schemaStructure);
  for (let key in schema) {
    // Will be set to false if we find a type key match
    let isObject = true;
    for (let typeKey in typeMap) {
      if (schema[key] === typeKey) {
        isObject = false;
        schema[key] = typeMap[typeKey];
      }

      if (isObject) {
        const obj = schema[key];
        for (let typeKey in typeMap) {
          if (obj['type'] === typeKey) {
            obj['type'] = typeMap[typeKey];
          }
        }
      }
    }
  }

  return schema;
}
