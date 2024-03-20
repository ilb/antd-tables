import moment from "moment";

const schemaAdapter = (schema) => {
  let adaptedSchema = [];
  for (const propertyName in schema.properties) {
    if (schema.properties.hasOwnProperty(propertyName)) {
      const property = schema.properties[propertyName];
      const columnType = getColumnType(property);

      adaptedSchema.push({
        title: property.title,
        dataIndex: property.dataIndex || propertyName,
        render: getRenderByType(columnType),
        sorter: getSorterByType(columnType, propertyName),
      });
    }
  }

  return adaptedSchema;
};

const getColumnType = (property) => {
  if (property.format === "date") {
    return "date";
  }

  return property.type;
};

const getRenderByType = (type) => {
  return (value) => {
    switch (type) {
      case "date":
        return value ? moment(value).format("DD.MM.YYYY") : "";
      default:
        return value;
    }
  };
};

const getSorterByType = (type, propertyName) => {
  switch (type) {
    case "number":
    case "integer":
    case "float":
      case "date":
      return (a, b) => a[propertyName] - b[propertyName];
    case "string":
      return (a, b) => a[propertyName].localeCompare(b[propertyName]);
    default:
      return null;
  }
};

export default schemaAdapter;
