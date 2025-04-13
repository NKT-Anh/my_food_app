import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../globals/globalStyles';
import style from '../globals/style';
const ForgetPassword = () => {
  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={globalStyles.safeArea}>
    <View style={globalStyles.topNav}>
        <Text style={globalStyles.navTitle}>
            Quên mật khẩu
        </Text>
    </View>
    <View style={globalStyles.container}>
      <Text style={styles.text}>
        Đặt lại mật khẩu
      </Text>
      <Text style={styles.textResset}>
        Nhập email đăng ký để nhận mật khẩu mới
      </Text>
      <TextInput
      style={styles.input}
      placeholder='Email'
      keyboardType='email-address'
      
      />
      <TouchableOpacity style={styles.btn}>
       <Text style={styles.Reset} > Đặt lại mật khẩu</Text>
      </TouchableOpacity>

    </View>
    </SafeAreaView>
    </View>
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
    input:{
        borderWidth:1,
        borderRadius:5,
        width:'90%',
        paddingHorizontal:10,
        margin:15,

    },
    btn:{
        width: '90%',
        height: 50,
        backgroundColor: '#FFB347',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf:'center',
        borderColor:'black',
        borderWidth:1,
        
    },
    text:{
        fontSize:20,
        margin:15,
        fontWeight:'600'
        
    },
    textResset:{
        color:'#c7d6ec',
        fontSize:14,
        margin:15,
    },
    Reset:{
        fontSize:18,
        color:'white',
        fontWeight:'bold',
        textShadowColor:'black',
        textShadowRadius: 1,
        textShadowOffset: { width: 1, height: 1 },
    
      },
})