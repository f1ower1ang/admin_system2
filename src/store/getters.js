const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  userInfo: state => state.user.info,
  dialogVisible: state => state.settings.resetPwd
}
export default getters
