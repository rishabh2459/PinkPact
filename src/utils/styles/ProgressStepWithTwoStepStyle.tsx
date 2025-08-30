import { RFValue } from 'react-native-responsive-fontsize'
import { Dimensions } from 'react-native'
import colors from './Colors'

const ProgressStepStyle = {
  ProgressContainer: {
    paddingBottom: RFValue(24),
    paddingTop: RFValue(12),
    paddingHorizontal: RFValue(18),
  },
  stepLabel: () => ({
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    paddingBottom: RFValue(8),
    fontFamily: 'NunitoSans-Regular',
  }),
  greyLine: {
    backgroundColor: colors.greyE2E5E9,
    top: Dimensions.get('window').height * 0.065,
    left: RFValue(18),
    position: 'absolute',
    zIndex: 0,
    width: Dimensions.get('window').width * 0.9,
    height: 3,
    borderRadius: 100,
  },
  greenLine: (currentPosition: number) => ({
    backgroundColor: colors.green,
    top: Dimensions.get('window').height * 0.065,
    position: 'absolute',
    left: RFValue(18),
    alignItems: 'flex-end',
    zIndex: 0,
    width: currentPosition === 1 ? '98%' : '0%',
    height: 3,
    borderRadius: 100,
  }),
  touchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 0,
    alignItems: 'center',
  },
  pressContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  roundButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    zIndex: 2,
    borderColor: colors.green,
    backgroundColor: colors.green,
    borderRadius: 100,
  },
  roundButton2: (currentPosition: number) => ({
    width: 20,
    height: 20,
    left: 55,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: currentPosition != 1 ? colors.greyE2E5E9 : colors.green,
    borderRadius: 100,
  }),
}

export default ProgressStepStyle
