import {StyleSheet, Text, TouchableOpacity, View ,TouchableWithoutFeedback, Alert} from 'react-native'
import React, { useState,useContext } from 'react'
import { useNavigation  } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles from '../globals/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodScreen from './FoodScreen';
import OrderScreen from './OrderScreen';
import StatisticalScreen from './StatisticalScreen';
import UserScreen from './UserScreen';
import { LogOut } from '../Firebase/FirebaseAPI';
import { UserContext } from '../Firebase/UserContext';
const menuItem=[
    {
        key:'1',
        label :'Thống kê' 
    },
    { key:'2' ,label:'Người dùng'},
    { key: '3', label: 'Món ăn' },
    { key: '4', label: 'Đơn hàng' },
    { key: '5', label: 'Đăng xuất' },
]

const AdminScreen = () => {
    const {user} = useContext(UserContext);
    if(!user){
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Về đi</Text>
        </View>
    }
    else{
        console.log("I am comeback" ,user.fullName)
    }

    const [selectedMenu, setSelectedMenu] = useState('1')
    const [sidebar, setSidebar] = useState(true);
    const navigation = useNavigation();

    const handleLogOut = () =>{
        Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất?",[
            {
                text:"Hủy",
                style:"cancel",
            },
            {
                text:"Đăng xuất",
                onPress: async()=>{
                    const result = await LogOut();
                    if(result.success){
                        navigation.reset({
                            index:0,
                            routes:[{name:"LogIn"},]
                        });
                    }
                    else{
                        Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại!");
                    }
                }

            }
        ])
    }
    const renderItem = () =>{
        
        switch(selectedMenu){
            case '1':
                return <StatisticalScreen/>
            case '2':
                return <UserScreen/>
            case '3':
                return <FoodScreen/>
            case '4':
                return <OrderScreen/>
            default:
                return null;
        }
    }
    const getTitle = () => {
        switch (selectedMenu) {
            case '1': return 'Thống kê';
            case '2': return 'Danh sách người dùng';
            case '3': return 'Danh sách món ăn';
            case '4': return 'Danh sách đơn hàng';
            default: return '';
        }
    };
    return (
        <View style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea} >
            <View style={styles.topNav}>
            {!sidebar && (
                <TouchableOpacity style={styles.openBtn} onPress={()=> setSidebar(true)}>
                    <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>
            )}
                <Text style={GlobalStyles.navTitle}>
                    {getTitle()}
                </Text>
            </View>
            <View style={styles.container}>
            {sidebar && 
            <TouchableWithoutFeedback onPress={() => setSidebar(false)}>
                <View style={styles.overPlay}></View>
            </TouchableWithoutFeedback>
            }
            {sidebar && (
                <View style={styles.sidebar}>
                    <View style={styles.navMenu}>
                    
                    <Text style={styles.navTitle}>
                        Xin chào {user.fullName}
                    </Text>
                    <TouchableOpacity onPress={() => setSidebar(false)} style={styles.closeBtn} >
                    <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    </View>
                    {menuItem.map((item =>(
                        <TouchableOpacity
                        key={item.key}
                        style={[
                            styles.menuItem,
                            selectedMenu == item.key && styles.menuItemActive
                        ]}
                        onPress={()=>{
                            if(item.key == '5'){
                                handleLogOut();
                            }
            
                            setSelectedMenu(item.key)}
                        }
                        >
                            <Text style={styles.menuText}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )))}
                </View>
            )}
            <View style={styles.content}>

            <View style={styles.titleText}>
            {renderItem()}
            </View>
        </View>
        </View>
        </SafeAreaView>
        </View>
    )
}

export default AdminScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
    },
    sidebar:{
        width:'60%',
        backgroundColor: '#007BFF',
        paddingHorizontal:10,
        position: 'absolute',
        zIndex: 10,
        left: 0,
        top: 0,
        bottom: 0
    },
    menuItem:{
        paddingHorizontal:10,
        borderRadius:5,
        marginBottom:10,
        paddingVertical:5,
    },
    menuItemActive:{
        backgroundColor: '#0056b3',
    },
    menuText:{
        color:'white',
        fontWeight:'600',
        fontSize:15,
    },
    navTitle:{
        color:'white',
        fontWeight:'600',
        fontSize:22,
        alignItems:'center',
        justifyContent:'center',
        marginBottom: 20,
        paddingHorizontal:10,
    },
    navMenu:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    closeBtn:{
        margin:5,
    },
    openBtn:{
        padding:11,
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    contentText:{
        fontSize: 18,
        fontWeight: '600',
        
    },
    titleText:{
        marginTop: 10,
        marginLeft: 10,
        flex: 1,
        
    },    
    safeArea: {
        backgroundColor: '#007BFF',
        flex: 1,
    },
    topNav: {
        height: 50,
        marginLeft:10,
        flexDirection:'row'
    },
    overPlay:{
        position: 'absolute',
        zIndex:1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(145, 145, 145, 0.1)',

    },
    
})