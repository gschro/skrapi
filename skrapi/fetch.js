import { apiClient } from './apiClient'
import pluralize from 'pluralize'

const getObject = async (path, params) => apiClient.get(path, { params })
const getModelById = async (model, id) => apiClient.get(`/${model}/${id}`)
const getModel = async (model, params, all = false) => {
  const values = await apiClient.$get(`/${model}`, { params })
  const [value] = values
  return all ? values : value
}

const contentTypeFilter = (model) => ({ schema }) => schema.collectionName === model

const valueKey = (field) => {
  switch(field.type) {
    case 'time':
      return `${field.field}_skrapi_time`
    default:
      return field.field
  }
}

const populateModel = (model, fields = []) => {
  console.log('fields1', fields)
  console.log('model1', model)
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
  console.log('DATA!!!', data)
  return data
}

const fetchModel = async (model, id, fields) => {
  const response = await getModelById(model, id)
  const populatedModel = populateModel(response.data, fields)
  console.log('popped model', populatedModel)
  return {
    response,
    model: populatedModel
  }
}

const fetchSchema = async (params) => {
  const { data: { data: contentTypes } } = await getObject('/content-manager/content-types')
  const [contentType] = contentTypes.filter(contentTypeFilter(params.model))

  const { data: meta } = await getObject(`/content-manager/content-types/${contentType.uid}`)

  return {
    contentType,
    meta
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

const getFieldRelations = async (fields, remotes) => {
  const modelsWRels = fields.filter(a => a.remote)
  const relations = {}
  const memo = {}

  for(const model of modelsWRels){
    const relModel = pluralize(model.model)
    if (remotes[relModel]){
      continue
    }
    if(memo[relModel]){
      relations[model.field] = memo[relModel]
    }
    else {
      const resp = await getModel(relModel, null, true)
      relations[model.field] = resp
      memo[relModel] = resp
    }
  }
  return relations
}

export {
  fetchSchema,
  fetchModel,
  getFieldRelations,
  mapFields,
  valueKey
}
