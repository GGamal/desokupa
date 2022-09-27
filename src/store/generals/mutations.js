export function loginStart (state) {
  state.loggingIn = true
}
export function loginStop (state, errorMessage) {
  state.loggingIn = false
  state.loginError = errorMessage
}

export function updateAccessToken (state, TRI_SESSION_INFO) {
  if (TRI_SESSION_INFO) {
    state.TRI_SESSION_INFO = TRI_SESSION_INFO
    // state.userFullName = TRI_SESSION_INFO.name + ' ' + TRI_SESSION_INFO.lastName
  } else {
    state.TRI_SESSION_INFO = {}
  }
}
export function setCurrentModule (state, payload) {
  state.currentModel = payload.currentModel
  state.currentModule = payload.currentModule
}
export function googleBtnShow (state) {
  state.isContacts = true
}

export function googleBtnHide (state) {
  state.isContacts = false
}

export function tabInfoSales (state) {
  state.listCustomerInfo = true
}

export function tabInfoDependents (state) {
  state.listCustomerInfo = false
}

export function showAll (state) {
  state.customShowListable = 'Todos'
}

export function showNextMonth (state) {
  state.customShowListable = 'Mes Siguiente'
}

export function showCurrentMonth (state) {
  state.customShowListable = 'Mes Actual'
}
export function login (state, data) {
  localStorage.setItem('TRI_SESSION_INFO', JSON.stringify(data.TRI_SESSION_INFO))
  state.TRI_SESSION_INFO = data.TRI_SESSION_INFO
  state.user = data.user
}
export function dataUser (state, data) {
  console.log(data)
  state.user = data
}
export function logout (state) {
  localStorage.removeItem('TRI_SESSION_INFO')
  state.TRI_SESSION_INFO = ''
  state.user = ''
}

export function saveDataEvent (state, data) {
  localStorage.setItem('HEV_DATA_EVENT', JSON.stringify(data))
  state.HEV_DATA_EVENT = data.HEV_DATA_EVENT
  state.data_event = data.data_event
}
