import { StyleSheet } from 'react-native'
import colors from './Colors'
import NormalizeSize from '../fontScaler/NormalizeSize'
import { RFValue } from 'react-native-responsive-fontsize'

const textStyles = StyleSheet.create({
  h1: {
    fontSize: NormalizeSize.getFontSize(24),
    fontFamily: 'NunitoSans-Bold',
    fontWeight: 'bold',
    color: colors.dark,
  },
  h2: {
    fontSize: NormalizeSize.getFontSize(20),
    fontFamily: 'NunitoSans-SemiBold',
    fontWeight: 'bold',
    color: colors.dark,
  },
  body: {
    fontSize: NormalizeSize.getFontSize(16),
    fontFamily: 'NunitoSans-Regular',
    color: colors.black,
  },
  small: {
    fontSize: NormalizeSize.getFontSize(12),
    fontFamily: 'NunitoSans-Regular',
    color: colors.lightGrey,
  },
  link: {
    fontSize: RFValue(13),
    color: colors.blueButton,
    fontFamily: 'NunitoSans-SemiBold',
    // textDecorationLine: 'underline',
  },
  warning: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: RFValue(12),
    color: colors.error,
  },
  contactText: {
    fontSize: RFValue(16),
    fontFamily: 'NunitoSans-Regular',
    color: colors.grey757A7F,
  },
})

export default textStyles
