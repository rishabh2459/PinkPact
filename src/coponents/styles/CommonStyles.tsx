import { StyleSheet } from 'react-native';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import colors from '../../utils/styles/Colors';
import { Font_Sizes } from '../../utils/fontScaler/fonts';

export const commonStyles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  underlineText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: NormalizeSize.getFontSize(23),
  },
  linkText: {
    fontSize: 14,
    color: '#ff3f7f',
    textAlign: 'center',
    marginTop: 15,
  },
  dropdownTextInput: {
    fontSize: NormalizeSize.getFontSize(14),
    color: colors?.black,
  },
  input: {
    width: '49%',
    backgroundColor: colors?.white,
    borderRadius: 8,
    padding: 12,
    color: colors?.black,
    marginBottom: NormalizeSize.getFontSize(38),
    borderWidth: 1,
    borderColor: '#333',
  },
    socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    height: NormalizeSize?.getFontSize(48),
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  errorText:{
    fontSize: Font_Sizes.small,
    color: colors?.danger
  }
});
