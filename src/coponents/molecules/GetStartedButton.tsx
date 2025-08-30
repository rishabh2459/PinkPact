import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
          <LinearGradient
        colors={['#ff3cab', '#aa7cff']} // Pink → Light Pink
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
      <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%', // 80% of screen width for responsiveness
    height: NormalizeSize.getFontSize(48),
    // paddingVertical: 14,
    backgroundColor: '#ff3f7f',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
    textAlignVertical: 'center'
  },
});

export default CustomButton;
