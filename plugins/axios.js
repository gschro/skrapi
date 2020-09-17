export default function ({$axios, app, store}) {
  $axios.onError(error => {
    console.table('err!!!', error)
    throw error.response
  })
}