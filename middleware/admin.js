export default function ({ store, redirect }) {
  if (!(store.state.auth.loggedIn && store.state.auth.user.role.name === 'Admin')) {
    return redirect('/')
  }
}