import { StyleSheet, Text, View,Image,ScrollView, TouchableOpacity, Alert } from 'react-native'
import {MaterialCommunityIcons ,Ionicons,MaterialIcons,AntDesign,FontAwesome} from '@expo/vector-icons';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../globals/style';
import {useNavigation} from'@react-navigation/native'
import { LogOut } from '../../Firebase/FirebaseAPI';

const Profile = () => {

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
                    <Text style={styles.address}>Đồng Nice, Bình Dương</Text>
                </View>

                <View style={styles.viewOrder}>
                    <View style={styles.box}>
                        <Text style={styles.textBox}>Blance</Text>
                        <Text style={styles.textBox}>00:00</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.textBox}>Đơn hàng</Text>
                        <Text style={styles.textBox}>10</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.textBox}>Speed</Text>
                        <Text style={styles.textBox}>10:00</Text>
                    </View>
                </View>

                <View style={styles.profileDetailList}> 
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('ProfileDetail')}
                    >
                    <View style={styles.profileDetail}>
                        <MaterialCommunityIcons style={styles.iconRight} name="account-edit-outline" size={24} color="#49a083" />
                        <Text style={styles.text}>
                            Thông tin người dùng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>

                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <FontAwesome  style={styles.iconRight} name="shopping-cart" size={24} color="#49a083" />
                        <Text style={styles.text}>
                            Giỏ hàng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>

                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <AntDesign  style={styles.iconRight} name="heart" size={22} color="#49a083" />
                        <Text style={styles.text}>
                            Yêu thích
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>


                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <MaterialCommunityIcons style={styles.iconRight} name="account-edit-outline" size={24} color="#49a083" />
                        <Text style={styles.text}>
                            Thông tin người dùng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>


                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <MaterialCommunityIcons style={styles.iconRight} name="account-edit-outline" size={24} color="#49a083" />
                        <Text style={styles.text}>
                            Thông tin người dùng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>


                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <MaterialCommunityIcons style={styles.iconRight} name="account-edit-outline" size={24} color="#49a083" />
                        <Text style={styles.text}>
                            Thông tin người dùng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5,}}></View>


                    <TouchableOpacity 
                    onPress={()=> handleLogOut()}
                    >
                    <View style={styles.profileDetail}>
                        <AntDesign style={styles.iconRight} name="logout" size={24} color="red" />
                        <Text style={styles.text}>
                            Đăng xuất
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="gray" />
                    </View>
                    </TouchableOpacity>
                    

                </View>
            </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default Profile

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
    address: {
        color: '#555',
        fontSize: 14,
        marginTop: 4,
      },
    viewOrder:{

        justifyContent:'space-between',
        flexDirection:'row',
        marginTop:20,
    },
    box:{
        marginTop:1,
        backgroundColor:'#49a083',
        borderWidth:1,
        marginHorizontal:10,
        alignItems:'center',
        paddingVertical:10,
        width:90,
        height:70,
        borderRadius:10,
        // borderColor:'#49a083',
        borderColor:'gray',
        elevation:10,
        
    },
    textBox:{
        color:'white',
        fontWeight:'500',
        paddingHorizontal:10,
    },
    profileDetailList:{
        
        flex:1,
        width:'100%',
        marginTop:10,
    },
    profileDetail:{
        flexDirection:'row',
        marginHorizontal:10,
        marginVertical:5,
        marginTop:10,
    },
    text:{
        color:"black",
        fontSize:16,
        marginLeft:10,

    },
    iconLeft:{
        position:'absolute',
        right:0,
    },
    iconRight:{
        margin:0
    }

})