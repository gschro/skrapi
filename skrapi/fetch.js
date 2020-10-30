import { apiClient } from './apiClient'
import pluralize from 'pluralize'
import { componentMap, conditionalAttrs } from './component'
import { addAttribute, toBool, contentTypeFilter, valueKey } from './utils'
import { mapDateFields, mapFields, populateModel } from './dataUtils'

const getObject = async (path, params) => apiClient.get(path, { params })

const getModelById = async (model, id) => apiClient.get(`/${model}/${id}`)

const getModel = async (model, params, all = false) => {
  const values = await apiClient.$get(`/${model}`, { params })
  const [value] = values
  return all ? values : value
}

const fetchModel = async (model, id, fields) => {
  const response = await getModelById(model, id)
  const populatedModel = populateModel(response.data, fields)
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

const editModel = async ({ params, model, options, componentMapOverrides, conditionalAttrsOverrides, remotes }) => {
  // get content type metadata
  const { contentType, meta } = await fetchSchema(params)
  const name = contentType.label

  const finalComponentMap = { ...componentMap, ...componentMapOverrides }

  // combine field metadata, component map, conditonal attributes, and options
  const combined = mapFields(meta.data.contentType, { componentMap: finalComponentMap, conditionalAttrs, options })

  // get remotes from field relationships
  const relations = await getFieldRelations(combined, remotes)
  const finalRemotes = { ...relations, ...remotes }

  // get model data
  const { model: fetchMod } = await fetchModel(params.model, params.id, combined)

  // parse / convert date/time fields for components
  const fetchedModel = mapDateFields(combined, fetchMod)
  const modelParam = mapDateFields(combined, model)

  // combine retrieved model with model paramter overrides
  const finalModel = { ...fetchedModel, ...modelParam }
  return {
    combined,     // fields
    finalModel,   // model values
    finalRemotes, // drop down values
    name,         // model display name
  }
}

export {
  editModel,
  fetchSchema,
  fetchModel,
  getObject,
  getModelById,
  getModel,
}
