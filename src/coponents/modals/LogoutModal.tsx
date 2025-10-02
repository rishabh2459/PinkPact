import React from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import SvgIcon from '../icons/Icons'
import colors from '../../utils/styles/Colors'

interface LogoutModalProps {
  isVisible: boolean
  onRetry: () => void
  onClose: () => void
  title: string
  sure: string
  confirmButtonText: string
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isVisible,
  onRetry,
  onClose,
  title,
  sure,
  confirmButtonText,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.firstCnt}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SvgIcon name="logoutIconBlack" width={28} height={28} />
              <Text style={styles.title}>{title}</Text>
            </View>

            <Text style={styles.message}>
              Are you sure you want to {sure}?
            </Text>
          </View>

          <View style={styles.btnCont}>
            <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
              <Text style={styles.btnTxt}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { borderLeftColor: colors.lightGrey, borderLeftWidth: 1 },
              ]}
              onPress={onRetry}
            >
              <Text style={[styles.btnTxt, { color: '#E4483B',marginTop: -1 }]}>{confirmButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    // height: '20%',
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  firstCnt: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: heightPercentageToDP(4.5),
  },

  title: {
    fontSize: RFValue(15),
    fontFamily: 'NunitoSans-SemiBold',
    color: '#212529',
    // marginTop: 8,
    marginLeft: 6,
  },
  message: {
    fontSize: RFValue(13),
    marginTop: 5,
    // marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'NunitoSans-SemiBold',
    color: '#757A7F',
  },
  btnCont: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    // backgroundColor:'red',
    // marginTop: 1,
  },
  actionBtn: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F2F3',
  },
  btnTxt: {
    color: '#9FA3A9',
    fontSize: RFValue(14),
    fontFamily: 'NunitoSans-SemiBold',
  },
})

export default LogoutModal
