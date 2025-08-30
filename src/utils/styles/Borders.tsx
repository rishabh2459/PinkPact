import NormalizeSize from '../fontScaler/NormalizeSize'
import colors from './Colors'

const borders = {
  thin: {
    borderWidth: NormalizeSize.getFontSize(1),
    borderColor: colors.lightGrey,
  },
  thick: {
    borderWidth: NormalizeSize.getFontSize(2),
    borderColor: colors.lightGrey,
  },
  radius: {
    small: {
      borderRadius: NormalizeSize.getFontSize(5),
    },
    medium: {
      borderRadius: NormalizeSize.getFontSize(8),
    },
    large: {
      borderRadius: NormalizeSize.getFontSize(12),
    },
    xlarge: {
      borderRadius: NormalizeSize.getFontSize(999),
    },
  },
}

export default borders
