export type SchemaDatatype = {
  key: string;
  datatype: any;
};

const typeMap = {
  String: String,
  Number: Number,
  Boolean: Boolean,
};

function parseType(typeString: string) {
  for (let typeKey in typeMap) {
    if (typeString === typeKey) {
      return typeMap[typeKey];
    }
  }
  return null;
}

export function parseSchema(schemaStructure: {}) {
  const schema = structuredClone(schemaStructure);
  for (let key in schema) {
    // Will be set to false if we find a type key match
    const type = parseType(schema[key]);
    if (type !== null) {
      schema[key] = type;
    } else {
      const obj = schema[key];
      const innerType = parseType(obj['type']);
      if (innerType !== null) {
        obj['type'] = innerType;
      } else {
        throw new Error('Unexpected schema structure!');
      }
    }
  }

  return schema;
}
