import { StyleSheet, Text, TextInput, View,TouchableOpacity,Image,Alert  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import style from '../../globals/style'
import AntDesign from '@expo/vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native'
import globalStyles from '../../globals/globalStyles';
import ImageModal from '../../Modal/ImageModal';
import * as ImagePicker from 'expo-image-picker';

const AddFood = () => {
    const [foodName,setFoodName] = useState('');
    const [foodPrice,setFoodPrice] = useState('');
    const [foodImage,setFoodImage] = useState(null);
    const [restaurantName,setRestaurantName] = useState('');
    const [restaurantAddress,setRestaurantAddress] = useState('');
    const [restaurantPhone,setRestaurantPhone] = useState('');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    const navigation = useNavigation();

   
    const onPickCamera = async () =>{
        setModalVisible(false);
        const result = await ImagePicker.launchCameraAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,quality:1});
        if(!result.canceled) setFoodImage(result.assets[0].uri);
    }

    const onPickLibrary = async () =>{
        setModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,quality:1});
        if(!result.canceled) setFoodImage(result.assets[0].uri);
    }

  return (
    <View style={{flex:1}}>
        <SafeAreaView style={styles.SafeArea}>

            <View style={styles.container}>
            <View style={styles.viewBack}>
                <AntDesign name="back" size={24} color="black"
                style={styles.iconBack}
                onPress={()=> navigation.goBack()}
                />
                <View style={{alignItems:'center'}}>
                <Text style={styles.title} >Thêm món ăn</Text>
                </View>       
            </View>
            <View>
                <TextInput
                placeholder='Tên món ăn'
                value={foodName}
                placeholderTextColor='gray'
                onChangeText={setFoodName}
                style={styles.TextInput}
                />

                <TextInput
                placeholder='Giá (VND)'
                value={foodPrice}
                keyboardType='numeric'
                placeholderTextColor='gray'
                onChangeText={setFoodPrice}
                style={styles.TextInput}
                />
               
                <TextInput
                placeholder='Tên cửa hàng'
                value={restaurantName}
                placeholderTextColor='gray'
                onChangeText={setRestaurantName}
                style={styles.TextInput}
                />

                <TextInput
                placeholder='Địa chỉ'
                value={restaurantAddress}
                placeholderTextColor='gray'
                onChangeText={setRestaurantAddress}
                style={styles.TextInput}
                />

                <TextInput
                placeholder='Số liên lạc'
                value={restaurantPhone}
                placeholderTextColor='gray'
                onChangeText={setRestaurantPhone}
                style={styles.TextInput}
                maxLength={10}
                keyboardType='numeric'
                />
                
            </View>
            <View style={{flex:1, backgroundColor:'#0e90ad'}}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                source = {foodImage ? {uri: foodImage}: require('../../../assets/images/user.png')}
                style={[
                    styles.image,
                    // aviOnly && {height: 35 , with:35,
                    //     borderWidth:0},
                    //     imgStyle,
                    ]}
                />
            </TouchableOpacity>
            
            </View>
            </View>
            <ImageModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCamera={onPickCamera}
                onLibrary={onPickLibrary}
            />
        </SafeAreaView>
      
    </View>
    
  )
}

export default AddFood

const styles = StyleSheet.create({

    SafeArea:{
        flex:1,
        backgroundColor:style.colors.colAdmin,
        
    },
    container:{
        backgroundColor:'white',
        flex:1,
    },
    iconBack:{
        padding: 10,
        marginBottom: 5,
    },
    viewBack:{
        paddingHorizontal:10,
    },
    title:{
        fontSize: 26,
        fontWeight: 'bold',
        color:style.colors.title ,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,

    },
    TextInput:{
        backgroundColor:'#f7f8f9',
        margin:10,
        paddingHorizontal:10,
        borderRadius:10,
        borderColor:'#e5e5e5',
        borderWidth:1,
    },
    image:{
        borderRadius:75,
        height:150,
        width:150,
        borderWidth:5,
        borderColor:'black',
    }
})