import { StyleSheet, Text, View,Image,ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native'
import {MaterialCommunityIcons ,Ionicons,MaterialIcons,AntDesign,FontAwesome} from '@expo/vector-icons';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../globals/style';
import {useNavigation} from'@react-navigation/native'
import { LogOut } from '../../Firebase/FirebaseAPI';

const ProfileDetail = () => {

    const navigation = useNavigation();
    const handleLogOut = async () =>{
        Alert.alert('Thông báo',"Bạn có muốn đăng xuất",[
            {
                text:"Hủy",
                style:"cancel",
            },
            {
                text:"Đăng xuất",
                onPress: async  () =>{
                    const result = await LogOut();
                    if(result.success){
                        navigation.reset({
                            index:0,
                            routes:[{name: "LogIn"}],
                        })
                    }
                    else{
                        Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại!");
                }
            }
            }
        ])
        
    }
  return (
    <View style={{flex:1}}>
        <SafeAreaView style={{flex:1}}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 ,paddingBottom:100}}>
            <View style={{flex:1}}>
            <View style={styles.viewNav}
            
            >
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                <View style={styles.iconBack}  >
                    <Ionicons name="arrow-back" size={20} color="black" />
                </View>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.drawImage}>
                        <Image source={require('../../../assets/images/nhanvien01.jpg')}
                        style={styles.imageProfile}
                        />
                </View>
                <View style={styles.textAddress}>
                    <Text style={styles.name}>Đân Đồn</Text>
                </View>
                

                

                <View style={styles.profileDetailList}> 
                
                <View style={styles.editDetail}>
                    <Text>
                        Họ và tên
                    </Text>
                    <TextInput
                    style={styles.textInput}
                    placeholder='Đân Đồn'

                    />
                </View>    

                </View>
            </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default ProfileDetail

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        paddingHorizontal: 16,
    },
    viewNav:{
        paddingHorizontal:10,
    },
    iconBack:{
        borderWidth:1,
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#c0c0c0',
        borderRadius:10,
        
    },
    textAddress:{
        marginTop:10,
        alignItems:'center'
        
    },
    viewImage:{
        
        alignItems:'center'
    },
    drawImage:{
        borderWidth:1,
        borderRadius:80,
        width:150,
        height:150,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#77dd77'
        

    },
    imageProfile:{
        width:140,
        height:140,
        borderWidth:1,
        borderRadius:80,
        borderColor:'#77dd77'
    },
    name:{
        fontWeight:'500',
        fontSize:24,
        marginTop:5,
    },
    textInput:{
        borderWidth:1,
    },
    editDetail:{
        margin:1,
    }

})