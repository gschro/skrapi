import { addAttribute, toBool, valueKey } from './utils'

const mapFields = ({ metadatas, schema: { attributes }}, { componentMap, conditionalAttrs, options }) => Object.entries(metadatas)
.map(([field, value]) => {

  const attribute = { ...value.edit, ...attributes[field] }

  const { attrs: pAttrs = {}, ...comp } = componentMap[attribute.type] || {}
  const attrs = Object.assign({}, pAttrs)

  const finalAttrs = conditionalAttrs.map(({ valueKey, condition = toBool, ...attrib }) => {
    const value = attribute[valueKey]
    const add = condition(value, attribute)
    return {
      add,
      value,
      ...attrib
    }
  })
  .reduce((acc, cv) => addAttribute(acc, cv), attrs)

  const hasOptions = (options && options[field]) || attribute.enum
  const options = hasOptions ? { options: hasOptions } : {}
  const remote = attribute.via ? { remote: attribute.model } : {}
  const { default: defaultValue, description, editable, label, required, type, unique, visible } = attribute
  const commonAttrs = {
    default: defaultValue, description, editable, label, required, type, unique, visible
  }

  return {
    field,
    ...commonAttrs,
    component: {
      is: comp.component,
      attrs: finalAttrs,
      class: comp.class,
      message: '',
      componentState: '',
      ...options,
      ...remote
    }
  }
})
.filter(({ visible }) => visible)
.filter((a) => !a.private)

const mapDateFields = (combinedFields, theModel) => {
  const model = Object.assign({}, theModel)
  combinedFields.filter(a => ['date','datetime','time'].includes(a.type))
    .forEach(a => {
      if (model && model[a.field]){
          if(a.type === 'date' || a.type === 'datetime') {
            model[a.field] = new Date(Date.parse(model[a.field]))
          }
          if(a.type==='time'){
            const dateObj = new Date();
            const dateStr = dateObj.toISOString().split('T').shift();
            const timeStr = model[a.field];
            const timeAndDate = new Date(Date.parse(dateStr + ' ' + timeStr))
            model[`${a.field}_skrapi_time`] = timeAndDate
          }
      }
  })
  return model
}

const populateModel = (model, fields = []) => {
  const data = fields.reduce((acc, cv) => {
    const value = model[cv.field]
    acc[cv.field] = value
      && typeof value === "object"
      && cv.type !== 'json'
      && cv.type !== 'media'
      ? value.id
      : value
    // add extra key for special types (time etc.)
    acc[valueKey(cv)] = acc[cv.field]
    return acc
  }, {
    id: model.id
  })
  return data
}

export {
  mapDateFields,
  mapFields,
  populateModel,
}