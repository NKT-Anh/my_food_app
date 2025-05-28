import { StyleSheet, Text, View,Image,ScrollView, TouchableOpacity, Alert } from 'react-native'
import {MaterialCommunityIcons ,Ionicons,MaterialIcons,AntDesign,FontAwesome} from '@expo/vector-icons';
import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import style from '../../globals/style';
import {useNavigation} from'@react-navigation/native'
import { LogOut, getTotalOrders } from '../../Firebase/FirebaseAPI';
import { UserContext } from '../../Firebase/UserContext';
import BottomNavigation from '../../navigator/BottomNavigation';

const Profile = () => {
    const {user} = useContext(UserContext)
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [role,setRole]  = useState(user?.role || '')
    const [totalOrders, setTotalOrders] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('User context:', user);
        const loadTotalOrders = async () => {
            if (user?.id) {
                const count = await getTotalOrders(user.id);
                setTotalOrders(count);
            } else {
                console.log('không có user:', user);
            }
        };
        loadTotalOrders();
    }, [user]);

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
                    <Image 
                       source={
                        typeof avatar === 'string' && avatar.trim() !== ''
                          ? { uri: avatar }
                          : require('../../../assets/images/nhanvien01.jpg')
                      }
                        style={styles.imageProfile}
                        />

                </View>
                <View style={styles.textAddress}>
                    <Text style={styles.name}>{user.fullName}</Text>
                    <Text style={styles.address}>{user.address}</Text>
                </View>

                <View style={styles.viewOrder}>
                    <View style={styles.box}>
                        <Text style={styles.textBox}>Blance</Text>
                        <Text style={styles.textBox}>00:00</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.textBox}>Đơn hàng</Text>
                        <Text style={styles.textBox}>{totalOrders}</Text>
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
                        <MaterialCommunityIcons style={styles.iconRight} name="account-edit-outline" size={24} color="#ff5722" />
                        <Text style={styles.text}>
                            Thông tin người dùng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('Order')}>
                        <View style={styles.profileDetail}>
                            <FontAwesome style={styles.iconRight} name="shopping-cart" size={24} color="#ff5722" />
                            <Text style={styles.text}>Đơn hàng</Text>
                            <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>

                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <AntDesign  style={styles.iconRight} name="heart" size={22} color="#ff5722" />
                        <Text style={styles.text}>
                            Yêu thích
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>


                    <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
                    <View style={styles.profileDetail}>
                        <MaterialIcons name="password" size={24} color="#ff5722" style={styles.iconRight}/>
                        <Text style={styles.text}>
                            Đổi mật khẩu
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                    </View>
                    </TouchableOpacity>
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>

                    {user.role  !== "Admin" && (
                    <>
                    <TouchableOpacity>
                    <View style={styles.profileDetail}>
                        <AntDesign name="deleteuser" size={24} color="#ff5722" style={styles.iconRight} />
                        <Text style={styles.text}>
                            Yêu cầu xóa tài khoản
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                    </View>
                    </TouchableOpacity>
                    </>)}
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>

                    {user.role  !== "user" && (
                    <>
                    <TouchableOpacity onPress={()=> navigation.navigate('AdminHome')}>
                    <View style={styles.profileDetail}>
                        <MaterialIcons style={styles.iconRight} name="admin-panel-settings" size={24} color="#0056b3" />
                        <Text style={{...styles.text , color:'#0056b3'}}>
                            Quản lý cửa hàng
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#0056b3" />
                    </View>
                    </TouchableOpacity>
                    </>)}
                    <View style={{width:'100%', borderWidth:0.5, borderColor: '#eee'}}></View>

                    {user.role === "shipper" && (
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('HomeShipper')}>
                                <View style={styles.profileDetail}>
                                    <MaterialIcons style={styles.iconRight} name="local-shipping" size={24} color="#ff5722" />
                                    <Text style={styles.text}>Trang chủ Shipper</Text>
                                    <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#999" />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#eee' }}></View>
                        </>
                    )}

                    <TouchableOpacity 
                    onPress={()=> handleLogOut()}
                    >
                    <View style={styles.profileDetail}>
                        <AntDesign style={styles.iconRight} name="logout" size={24} color="#dc3545" />
                        <Text style={{...styles.text, color:'#dc3545'}}>
                            Đăng xuất
                        </Text>
                        <MaterialIcons style={styles.iconLeft} name="navigate-next" size={24} color="#dc3545" />
                    </View>
                    </TouchableOpacity>
                    

                </View>
            </View>
            </View>
            </ScrollView>
            <BottomNavigation />
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
        backgroundColor: '#f8f9fa',
    },
    viewNav:{
        paddingHorizontal:10,
        backgroundColor: '#fff',
        width: '100%',
        paddingVertical: 10,
    },
    iconBack:{
        borderWidth:1,
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#e0e0e0',
        borderRadius:10,
        backgroundColor: '#fff',
    },
    textAddress:{
        marginTop:10,
        alignItems:'center',
    },
    drawImage:{
        borderWidth:2,
        borderRadius:80,
        width:150,
        height:150,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#ff5722',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageProfile:{
        width:140,
        height:140,
        borderRadius:80,
    },
    name:{
        fontWeight:'600',
        fontSize:24,
        marginTop:5,
        color: '#333',
    },
    address: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    viewOrder:{
        justifyContent:'space-between',
        flexDirection:'row',
        marginTop:20,
        width: '100%',
    },
    box:{
        marginTop:1,
        backgroundColor:'#ff5722',
        borderWidth:1,
        marginHorizontal:5,
        alignItems:'center',
        paddingVertical:10,
        width:90,
        height:70,
        borderRadius:10,
        borderColor:'#ff5722',
        elevation:3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    textBox:{
        color:'white',
        fontWeight:'500',
        paddingHorizontal:10,
    },
    profileDetailList:{
        flex:1,
        width:'100%',
        marginTop:20,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    profileDetail:{
        flexDirection:'row',
        marginHorizontal:10,
        marginVertical:12,
        alignItems: 'center',
    },
    text:{
        color:"#333",
        fontSize:16,
        marginLeft:10,
        fontWeight: '500',
    },
    iconLeft:{
        position:'absolute',
        right:0,
    },
    iconRight:{
        margin:0,
        color: '#ff5722',
    }
});