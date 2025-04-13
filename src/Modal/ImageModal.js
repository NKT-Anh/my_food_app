import { StyleSheet, Text, View,Modal,TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather, MaterialIcons } from '@expo/vector-icons';

const ImageModal = ({visible,onClose,onCamera,onLibrary}) => {
  return (
    <Modal
    visible={visible}
    transparent={true}
     animationType="slide"
    onRequestClose={onClose}    
    >
        <View style={styles.modalView}>
            <View style={styles.container}>
              <Text style={{fontSize:22,fontWeight:'bold'}}>Chọn ảnh</Text>
              <View style={{borderWidth:1 ,width:'100%',borderColor:'gray'}}></View>
                <TouchableOpacity style={styles.optionButton} onPress={onCamera}>
                <Feather name="camera" size={24} color="#0e90ad" />
                <Text style={styles.optionText}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={onLibrary}>
                <MaterialIcons name="photo-library" size={24} color="#0e90ad" />
                <Text style={styles.optionText}>Chọn từ thư viện</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
            </View>
        </View>

    </Modal>
  )
}

export default ImageModal

const styles = StyleSheet.create({
  modalView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container:{
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius:15,
    width:'80%',
    padding:10,

  },
  optionButton:{
    flexDirection:'row',
    alignItems:'center',
    padding:10,
  },
  optionText:{
    marginLeft: 10,
    fontSize: 16,
    color: '#0e90ad',
  },
  cancelText:{
    color:'red',
    fontSize:16,
    marginTop:10
  }

})