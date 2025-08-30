import { Font_Sizes } from '@/utils/fontScaler/fonts'
import { FontStyles } from '@/utils/fontScaler/FontStyles'
import NormalizeSize from '@/utils/fontScaler/NormalizeSize'
import colors from '@/utils/styles/Colors'
import spacing from '@/utils/styles/Spacing'
import { Platform, StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export const CustomDrawerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  drawerContentContainer: {
    backgroundColor: colors.white,
    // marginTop: RFValue(4),
    width: '100%',
    // height: '100%',
  },
  logoContainer: {
    height:
      Platform.OS == 'ios'
        ? heightPercentageToDP(11)
        : heightPercentageToDP(11),
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: hp(-0.5),
    marginLeft:spacing.large
  },
  logoWrapper: {
    width: wp(63),
    height: hp(10),
    justifyContent: 'center',
    borderBottomColor: '#F1F2F3',
    borderBottomWidth: 1,
    // paddingLeft: '4%',

  },
  drawerItem: {
    height: RFValue(40),
    display: 'flex',
    justifyContent: 'center',
    // backgroundColor: 'blue'
  },
  drawerItemText: {
    fontFamily: FontStyles.regular,
    fontSize: NormalizeSize.getFontSize(14),
    color: '#212529',
    // height: '100%',
    fontWeight: Platform.OS == 'ios' ? '400' : '500',
    
  },
  footer: {
    backgroundColor: '#FFFFFF',
    justifyContent:'center',
  },
  footerButton: {
    height: hp(5.7),

    marginTop: hp(-0.2),
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    justifyContent:'center'
  },
  footerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  footerButtonText: {
    fontSize: NormalizeSize.getFontSize(14),
    color: '#212529',
    fontFamily: 'NunitoSans-Regular',
    marginLeft: NormalizeSize.getHPercent(1.2),
    fontWeight: Platform.OS == 'ios' ? '400' : '500',
    textAlignVertical: 'center',
  },
  activeDrawerItem: {
    backgroundColor: '#EEF8FC',
    height: RFValue(40),
    borderRadius: wp(2),
  },
})
