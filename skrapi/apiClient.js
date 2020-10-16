// https://github.com/nuxt-community/axios-module/issues/28
let apiClient

const setClient = (newClient) => {
  apiClient = newClient
}

export {
  apiClient,
  setClient
}