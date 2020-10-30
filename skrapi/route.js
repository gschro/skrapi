import pluralize from 'pluralize'
const getMethodLabel (method) => method === 'put' ? 'Update' : 'Add'
const combine (str1, str2) => `${str1} ${str2}`

const test = (method, name, { editPath = '/edit', editName = 'Edit', routeParam = 'id' } ) => {
  const plural = pluralize(name)
  const methodLabel = getMethodLabel(method)
  const backLabel = combine(methodLabel, name)
  const nameLabel = combine('All', plural)

  return {
    methodLabel,
    backLabel,
    allLabel,
    editPath,
    editLabel,
    routeParam
  }
}

export default test