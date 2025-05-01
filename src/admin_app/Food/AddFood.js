import { StyleSheet, Text, TextInput, View,TouchableOpacity,Image,Alert, ScrollView, FlatList  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import style from '../../globals/style'
import {AntDesign,EvilIcons,Ionicons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native'
import globalStyles from '../../globals/globalStyles';
import { db } from '../../Firebase/FirebaseConfig';
import { addDoc,collection } from 'firebase/firestore';
import axios from 'axios';
import ImageModal from '../../Modal/ImageModal';
import LoadScreen from '../../component/LoadScreen';

import * as ImagePicker from 'expo-image-picker';
import { addTag, defaultTags, removeTag } from '../../component/TagManager';

const AddFood = () => {

    const [foodName,setFoodName] = useState('');
    const [foodPrice,setFoodPrice] = useState('');
    const [foodImage,setFoodImage] = useState(null);
    const [restaurantName,setRestaurantName] = useState('');
    const [restaurantAddress,setRestaurantAddress] = useState('');
    const [restaurantPhone,setRestaurantPhone] = useState('');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [tag, setTag] = useState([]);
    const [tagInput, setTagInput] = useState(''); 
    const CLOUD_NAME = 'dtqo1fvv9';
    const UPLOAD_PRESET = 'anhfoodapp';

    const [loading,setLoading] = useState(false);
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
    const uploadImage = async () =>{
        if(!foodName || !foodPrice || !restaurantName || !foodImage) {
            Alert.alert('Thông báo', 'Nhập đủ thông tin');
            return;
        }
        setLoading(true);
        const data = new FormData();
        data.append('file',{
            uri:foodImage,
            type:'image/jpeg',
            name:'foodImage.jpg',
        });
        data.append('upload_preset',UPLOAD_PRESET);
        try{
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data,
                {headers:{'Content-Type': 'multipart/form-data'}}
            );
            setLoading(false);
            const uploadedUrl = response.data.secure_url;
            Alert.alert('Upload thành công!', uploadedUrl);
            saveFood(uploadedUrl);
            setFoodImage(uploadedUrl);
        } catch(error){
            console.log('lỗi upload ', error);
            Alert.alert('Lỗi',"Không tải được ảnh.");
        }
    
    }
    const saveFood = async(uri) =>{
        if (!foodName || !foodPrice || !foodImage || !restaurantName) {
            Alert.alert("Điền thông tin","Nhập đầy đủ thông tin")
            return;
        }
        
        try{
            const foodCollection = collection(db, 'foods');
            await addDoc(foodCollection,{
                foodName,
                foodPrice,
                foodImage: uri,
                restaurantName,
                restaurantAddress,
                restaurantPhone,
                description,
                tag,
                createdAt: new Date(),

            })
            
            Alert.alert('Thành công', 'Đã thêm món ăn vào danh sách.');
            navigation.goBack();
        }
        catch(error){
            console.log('firebase', error);
            Alert.alert('Thông báo', 'Vui lòng thử lại');
        }
    }
    const handAddTag = () => {
        const newTag = addTag(tag,tagInput);
        setTag(newTag);
        setTagInput('');

    }
    const handRemoveTag  = (tagToRemove) =>{
        const newTag = removeTag(tag,tagToRemove);
        setTag(newTag);

    }
    const handSelectedTag = (selectedTag) =>{
        const newTag = addTag(tag,selectedTag);
        setTag(newTag);
    }
  return (
    <View style={{flex:1}}>
        <SafeAreaView style={styles.SafeArea}>
            <LoadScreen isLoading={loading} text='Chờ một chút.....' />
        <View style={styles.viewBack}>
                <AntDesign name="back" size={24} color="black"
                style={styles.iconBack}
                onPress={()=> navigation.goBack()}
                />     
            </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
            
            <View style={{alignItems:'center'}}>
                <Text style={styles.title} >Thêm món ăn</Text>
                </View>  
            <View style={{flex:1, backgroundColor:'white', alignItems: 'center',marginVertical:10}}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={{ position: 'relative' }}>
                <Image
                source = {foodImage ? {uri: foodImage}: require('../../../assets/images/photoDefault.png')}
                style={[
                    styles.image,
                    ]}
                />
                <View style={styles.iconUpload}>
                <EvilIcons  name="camera" size={40} color="red" />
                </View>
            </View>
            </TouchableOpacity>
            
            
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

                <TextInput
                placeholder='Mô tả'
                value={description}
                placeholderTextColor='gray'
                onChangeText={setDescription}
                style={styles.TextInput}
                />
                <TextInput
                placeholder='Loại'
                value={tagInput}
                placeholderTextColor='gray'
                onChangeText={setTagInput}
                style={styles.TextInput}
                />
                    <TouchableOpacity style={styles.iconList} onPress={handAddTag}>
                        <Ionicons name="add-circle-outline" size={30} color="green" />
                    </TouchableOpacity>
                    <FlatList
                    data={tag}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.selectedTagContainer}>
                        <Text style={styles.selectedTagText}>{item}</Text>
                        <TouchableOpacity onPress={() => handRemoveTag(item)}>
                            <Ionicons name="close-circle" size={18} color="red" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                        </View>
                    )}
                    />
                    <FlatList
                    data={defaultTags}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.suggestedTagContainer} onPress={() => handSelectedTag(item)}>
                        <Text style={styles.suggestedTagText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    />
                
                
            </View>
            <View style={styles.endView}>
                <TouchableOpacity style={styles.icon} onPress={uploadImage}>
                    <Ionicons name="save-outline" size={30} color="green" />
                </TouchableOpacity>
            </View>
            </View>

            </ScrollView>
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
        backgroundColor:'white',
        
    },
    container:{
        backgroundColor:'white',
        flex:1,
    },
    iconBack:{
        padding: 5,
        marginBottom: 0,
    },
    viewBack:{
        paddingHorizontal:10,
        backgroundColor:'white',

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
        borderRadius:10,
        height:150,
        width:150,
        borderColor:'black',
        marginHorizontal:10,
        
    },
    iconUpload:{
        position:'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,

    },
    endView:{
        flex:1,
        minHeight:100,
        flexDirection:'row',
        justifyContent:'center',
        marginTop: 20,
        marginBottom: 40,
        
    },
    icon:{
        
        paddingVertical: 5,
        margin:10,
        marginHorizontal:30,
        paddingHorizontal:20,
        height:50,
        width:80,
        // borderRadius:30,
        // elevation:5,
        // backgroundColor:'#0e90ad',
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 5,
      },
      
      tag: {
        fontSize: 14,
        color: '#00796b',
        marginRight: 6,
      },
      selectedTagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        margin: 4,
      },
      
      selectedTagText: {
        fontSize: 14,
        color: '#00796b',
      },
      
      suggestedTagContainer: {
        backgroundColor: '#fce4ec',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
      },
      
      suggestedTagText: {
        fontSize: 14,
        color: '#c2185b',
      },
})