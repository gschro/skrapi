import { setClient } from '~/skrapi/apiClient'

export default ({ app, store }) => {
  setClient(app.$axios)
}