const contentTypeFilter = (model) => ({ schema }) => schema.collectionName === model

const valueKey = (field) => {
  switch(field.type) {
    case 'time':
      return `${field.field}_skrapi_time`
    default:
      return field.field
  }
}

const addAttribute = (obj, { add, field, value, postTransform = a => a }) => {
  if (add) {
    return {
      ...obj,
      [field]: postTransform(value)
    }
  }
  return obj
}
const toBool = a => !!a


export {
  addAttribute,
  toBool,
  contentTypeFilter,
  valueKey,
}