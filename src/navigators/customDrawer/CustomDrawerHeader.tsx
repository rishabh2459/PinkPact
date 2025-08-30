import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerNavigationProp,
} from '@react-navigation/drawer'
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CustomDrawerStyles } from './CustomDrawerStyles'
import Icon from '@/components/atoms/icons/Icons'
import { RFValue } from 'react-native-responsive-fontsize'
import LogoutModal from '@/components/organism/modals/LogoutModal'
import { storage } from '@/App'
import { useAuth } from '@/hooks/auth/AuthContext'
import colors from '@/utils/styles/Colors'
import apiService from '@/api/apiServices'
import NormalizeSize from '@/utils/fontScaler/NormalizeSize'
import { SvgUri } from 'react-native-svg'

interface RouteDescriptor {
  navigation: DrawerNavigationProp<any>
  options: any
  render: () => JSX.Element
  route: any
}

interface CustomDrawerHeaderProps {
  descriptors: {
    [key: string]: RouteDescriptor
  }
  navigation: DrawerNavigationProp<any>
  state: {
    default: string
    history: any[]
    index: number
    key: string
    routeNames: string[]
    routes: any[]
    stale: boolean
    type: string
  }
}

const CustomDrawerHeader: React.FC<CustomDrawerHeaderProps> = (props) => {
  // const getLogOut = useMutation({mutationFn: logOut});
  const [showModal, setshowModal] = useState(false)
  const { logout } = useAuth()
  const [activeRoute, setActiveRoute] = useState('')
  const navigation = useNavigation()

  const handleRouteChange = (routeName: string) => {
    setActiveRoute(routeName)
    props.navigation.navigate(routeName)
  }

  const handleLogOut = async () => {
    try {
      const url = '/auth/api/v1/user/logout/'
      const result = await apiService.post(url)
      if (result?.data) {
        logout()
        storage.clearAll()

        setshowModal(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    setshowModal(false)
  }

  return (
    <View style={CustomDrawerStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={CustomDrawerStyles.drawerContentContainer}>
        <View style={[CustomDrawerStyles.logoContainer]}>
          <View style={CustomDrawerStyles.logoWrapper}>
            <Icon name="logo" width="160" height="40" />
          </View>
        </View>
        {/* <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            // bottom: RFValue(6),
          }}
        > */}

        {props.state.routes.map((route, index) => {
          if (route.name !== 'ContactUs') {
            const isActive = props.state.index === index

            const iconProvider = (routeName: string, isActive: boolean) => {
              // Try to find the module data from the backend by comparing names
              const modulesData = Array.isArray(props.modulesData)
                ? props.modulesData
                : []

              const moduleData = modulesData?.find(
                (module) =>
                  module?.modulename?.toLowerCase() == routeName?.toLowerCase()
              )

              if (moduleData && moduleData.icon) {
                
                return (
                  <SvgUri
                    width="10.7%"
                    height="100%"
                    uri={`https://stagingerpapi.stantech.ai/media/${
                      !isActive ? moduleData.icon : moduleData.iconactive
                    }`}
                  />
                )
                
              }

              // Fallback: if no backend icon exists, return a default icon or null
              return null
            }
            return (
              <DrawerItem
                key={index}
                label={({ color }) => (
                  <Text
                    style={[
                      CustomDrawerStyles.drawerItemText,
                      {
                        color: isActive
                          ? colors.blueButton
                          : colors.blackHeading,
                        marginLeft: -20,
                        // marginTop:-1,
                        // paddingTop: NormalizeSize.getFontSize(2),
                      },
                    ]}>
                    {route.name}
                  </Text>
                )}
                // onPress={() => props.navigation.navigate(route.name)}
                icon={() => iconProvider(route.name, isActive)}
                style={[
                  CustomDrawerStyles.drawerItem,
                  isActive && CustomDrawerStyles.activeDrawerItem,
                ]} // Added style for DrawerItem
                onPress={() => handleRouteChange(route.name)}
              />
            )
          } else {
            return null
          }
        })}
        {/* </View> */}
      </DrawerContentScrollView>
      <View style={CustomDrawerStyles.footer}>
        <TouchableOpacity
          style={[
            CustomDrawerStyles.footerButton,
            {
              borderTopWidth: 1,
              borderTopColor: '#F1F2F3',
              marginTop: 3,
              height: 70,
            },
          ]}
          onPress={() => setshowModal(true)}>
          <View style={CustomDrawerStyles.footerButtonContent}>
            <Icon name="logout" height={25} width={25} />

            <Text style={CustomDrawerStyles.footerButtonText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <LogoutModal
        isVisible={showModal}
        onRetry={handleLogOut}
        onClose={handleCancel}
      />
    </View>
  )
}

export default CustomDrawerHeader
