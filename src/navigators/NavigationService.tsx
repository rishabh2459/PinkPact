import {
  CommonActions,
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/native'

let navigator: NavigationContainerRef<NavigationState> | null = null

function setTopLevelNavigator(
  navigationRef: NavigationContainerRef<NavigationState>
) {
  navigator = navigationRef
}

function navigate(routeName: any, params: any) {
  navigator?.navigate(routeName, params)
}

function goBack() {
  navigator?.dispatch(CommonActions.goBack())
}

export default { setTopLevelNavigator, navigate, goBack }
