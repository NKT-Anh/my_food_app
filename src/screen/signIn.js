import React, { useState } from 'react'
import{
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,

} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import style from '../globals/style'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Fontisto from '@expo/vector-icons/Fontisto';
import globalStyles from '../globals/globalStyles';
const SignInScreen = () => {
  const [fullName,setFullName] = useState('')
  const [phone , setPhone] =useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.topNav}>
        <Text style={globalStyles.navTitle}>My food app</Text>
      </View>

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.innerContainer}>
      <View style={styles.imageLayout}> 
      <Text style={styles.textSignIn} >Đăng Ký</Text>
      </View>
      <View style={styles.viewInput}>
      <AntDesign style={styles.icon} name="user" size={24} color="#ffa500" />
      <TextInput
      style={styles.textInput}
      placeholder='Họ và tên'
      placeholderTextColor={style.colors.textInputColor}
      value={fullName}
      onChangeText={setFullName}
      >
      
      
      </TextInput>
      
      </View>
      <View style={styles.viewInput}>
      <Fontisto style={styles.icon} name="email" size={24} color="#ffa500" />
      <TextInput

      style={styles.textInput}
      placeholder='Email'
      placeholderTextColor={style.colors.textInputColor}
      keyboardType="email-address"
      autoCapitalize='none'


      value={email}
      onChangeText={setEmail}
      />
      </View>
      <View style={styles.viewInput}>
      <AntDesign style={styles.icon} name="phone" size={24} color="#ffa500" />
      <TextInput

      style={styles.textInput}
      placeholder='Số điện thoại'
      placeholderTextColor={style.colors.textInputColor}
      keyboardType="number-pad"

      maxLength={10}


      value={phone}
      onChangeText={setPhone}
      />
      </View>

      <View style={styles.viewInput}>
      <MaterialIcons style={styles.icon} name="lock-outline" size={24} color="#FF8C00" />

      <TextInput
      style={styles.textInput}
      placeholder='Mật khẩu'
      placeholderTextColor={style.colors.textInputColor}
      secureTextEntry={!showPassword}
      autoCapitalize='none'
      value={password}
      onChangeText={setPassword}
      
      />
      <Feather
        style={[styles.icon, {marginLeft:-10} ]}
        name= {showPassword == false ? "eye-off" : 'eye' }   size={24} color="#9E9E9E"
        onPress={() => setShowPassword(!showPassword)}
      />     
      </View>

      <View style={styles.viewInput}>
      <MaterialIcons style={styles.icon} name="lock-outline" size={24} color="#FF8C00" />

      <TextInput
      style={styles.textInput}
      placeholder='Xác nhận mật khẩu'
      placeholderTextColor={style.colors.textInputColor}
      autoCapitalize='none'
      secureTextEntry={!showConfirmPassword}
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      />
      <Feather
        style={[styles.icon , {marginLeft:-10}]}
        name ={showConfirmPassword == false ? "eye-off" : "eye"}  size={24} color="#9E9E9E"
        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />  
      </View>

      <TouchableOpacity style={styles.signInBtn}>
         <Text style={styles.signInTxt}>Đăng ký</Text>
      </TouchableOpacity>

    <View style={globalStyles.hr80}/>
    <TouchableOpacity onPress={()=> navigation.navigate('LogIn') }>
      <Text style={styles.registerText}>
        Đã có tài khoản? <Text style={styles.boldText}>Đăng nhập</Text>
      </Text>
    </TouchableOpacity>


      </View>
    </View>

    </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
      flex:1,
      paddingHorizontal: 20,
      justifyContent:'center',
      backgroundColor:style.colors.backgroundColor,

      
  },
  image:{
    width:100,
    height:100,
    resizeMode:'center',
  },
  imageLayout:{
    width:'80%',
    alignItems:'center',
    
  },
  textSignIn:{
    fontSize: 26,
    fontWeight: 'bold',
    color:style.colors.title ,
   
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,

  },
  logInText:{

  },
  viewInput:{
    width:"90%",
    flexDirection:'row',
    height:50,
    backgroundColor:'#F0F8FF',
    paddingHorizontal:10,

    marginVertical:10,
    elevation:10,
    borderWidth:0.12,
    borderRadius:30,
    


  },
  innerContainer: {
    marginVertical:"10%",
    alignItems: 'center',
    flex:1,
  },
  textInput:{
    width:'80%',
    fontSize:17,
    color:style.colors.text3,
    marginLeft:10,
    marginVertical:3,

  },
  signInBtn:{
    width: '90%',
    height: 50,
    backgroundColor: '#FFB347',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 20,
    alignSelf:'center',
    borderColor:'black',
    borderWidth:1,
  },
  signInTxt:{
    fontSize:18,
    color:'white',
    fontWeight:'bold',
    textShadowColor:'black',
    textShadowRadius: 1,
    textShadowOffset: { width: 1, height: 1 },

  },
  icon:{
    marginVertical:12,

  },
  

  registerText: {
    fontSize: 14,
    color: '#fec003',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'red',
    textDecorationLine: 'underline'
  },
})

export default SignInScreen