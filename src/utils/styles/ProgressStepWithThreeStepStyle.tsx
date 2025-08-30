import { RFValue } from 'react-native-responsive-fontsize'
import { Dimensions, Platform, ViewStyle } from 'react-native'
import colors from './Colors'
import { Font_Sizes } from '../fontScaler/fonts'
import { FontStyles } from '../fontScaler/FontStyles'
import spacing from './Spacing'
import NormalizeSize from '../fontScaler/NormalizeSize'

interface ProgressStepWithThreeStyleType {
  container: ViewStyle
  stepLabel: (currentPosition: number, index: number) => ViewStyle
  greyLine: (currentPosition: number, stepCount: number) => ViewStyle
  greenLine: (currentPosition: number, stepCount: number) => ViewStyle
  touchContainer: ViewStyle
  pressContainer: (
    currentPosition: number,
    index: number,
    stepCount: number
  ) => ViewStyle
  roundButton: (currentPosition: number, index: number) => ViewStyle
}

const ProgressStepWithThreeStyle: ProgressStepWithThreeStyleType = {
  container: {
    paddingBottom: spacing.small,
    paddingTop: spacing.large,
    paddingHorizontal: RFValue(16),
  },
  stepLabel: (currentPosition: number, index: number) => ({
    fontSize: Font_Sizes.medium,
    lineHeight: RFValue(20),
    paddingBottom: RFValue(8),
    fontFamily: FontStyles.regular,
    color: currentPosition >= index ? colors.green : colors.heading,
  }),
  greyLine: (currentPosition: number, stepCount: number): ViewStyle => ({
    // backgroundColor: colors.greyE2E5E9,
    backgroundColor: colors.greyE2E5E9,
    top:
      Platform.OS == 'ios'
        ? Dimensions.get('window').height * 0.068
        : Dimensions.get('window').height * 0.072,
    left: RFValue(16),
    position: 'absolute',
    width: '100%',
    height: 3,
    borderRadius: 100,
  }),
  greenLine: (currentPosition: number, stepCount: number): ViewStyle => ({ 
    backgroundColor: colors.green,
    top:  Platform.OS == 'ios'
    ? Dimensions.get('window').height * 0.068
    : Dimensions.get('window').height * 0.072,
    position: 'absolute',
    left: RFValue(16),
    width:
      stepCount === 3 && currentPosition === 1
        ? `${(currentPosition / stepCount) * 155}%`
        : stepCount === 3 && currentPosition === 2
        ? `${(currentPosition / stepCount) * 150}%`
        : `${(currentPosition / stepCount) * 200}%`,
    height: 3,
    borderRadius: 100,
  }),
  touchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 0,
    alignItems: 'center',
  } as ViewStyle,
  pressContainer: (
    currentPosition: number,
    index: number,
    stepCount: number
  ): ViewStyle => ({
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:
      stepCount === 3
        ? index === 2
          ? 'flex-end'
          : index === 1
          ? 'center'
          : 'flex-start'
        : index === 0
        ? 'flex-start'
        : 'flex-end',
  }),
  roundButton: (currentPosition: number, index: number): ViewStyle => ({
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      currentPosition >= index ? colors.green : colors.greyE2E5E9,
    borderRadius: 100,
  }),
}

export default ProgressStepWithThreeStyle
