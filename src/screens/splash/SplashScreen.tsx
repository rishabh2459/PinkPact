import { SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-gesture-handler'

const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Rishabh</Text>
        {/* <Logo width={100} height={85} /> */}
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})
