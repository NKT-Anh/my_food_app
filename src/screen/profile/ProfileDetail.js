import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; // Import Google Places Autocomplete
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../Firebase/UserContext';
import { updateProfile } from '../../Firebase/FirebaseAPI';
import LoadScreen from '../../component/LoadScreen';
import ImageModal from '../../Modal/ImageModal';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProfileDetail = () => {
    const { user } = useContext(UserContext);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [address, setAddress] = useState(user?.address || ''); // Thêm state cho địa chỉ
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const CLOUD_NAME = 'dtqo1fvv9';
    const UPLOAD_PRESET = 'anhfoodapp';

    const onPickCamera = async () =>{
        setModalVisible(false);
        const result = await ImagePicker.launchCameraAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,quality:1});
        if(!result.canceled) setAvatar(result.assets[0].uri);
    }

    const onPickLibrary = async () =>{
        setModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,quality:1});
        if(!result.canceled) setAvatar(result.assets[0].uri);
    }

    const uploadImage= async ()=>{
        const data = new FormData();
        data.append('file',{
            uri:avatar,
            type:'image/jpeg',
            name:'avatarImage.jpg',
        })
        data.append('upload_preset',UPLOAD_PRESET);
        try{
            setLoading(true)
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data,
                {headers:{'Content-Type': 'multipart/form-data'}}
            )
                const uploadedUrl = response.data.secure_url;
                Alert.alert("Upload tad",uploadedUrl)
                setAvatar(uploadedUrl);
                handleUpdate(uploadedUrl)
                
                setLoading(false);
                
        }
        catch(error){

        }
    }

    const navigation = useNavigation();
    const handleUpdate = async (avatarUrl = user.avatar) =>{
        if (!user) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
            return;
        }
        const result = await updateProfile(user.id, {
            avatar: avatarUrl || [],
            fullName: fullName,
            phone: phone,
            address: address, // Cập nhật địa chỉ
        });
        if (result.success) {
            Alert.alert("Thành công", "Thông tin đã được cập nhật.");
        } else {
            Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại!");
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <LoadScreen isLoading={loading} text="Chờ một chút....." />
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.viewNav}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <View style={styles.iconBack}>
                                    <Ionicons name="arrow-back" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <View style={styles.drawImage}>
                                    <Image
                                        source={
                                            typeof avatar === 'string' && avatar.trim() !== ''
                                                ? { uri: avatar }
                                                : typeof user?.avatar === 'string' && user.avatar.trim() !== ''
                                                ? { uri: user.avatar }
                                                : require('../../../assets/images/nhanvien01.jpg')
                                        }
                                        style={styles.imageProfile}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.profileDetailList}>
                                <View style={styles.editDetail}>
                                    <View style={styles.itemUser}>
                                        <Text style={styles.textOnInput}>Họ và tên</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={fullName}
                                            onChangeText={setFullName}
                                        />
                                    </View>
                                    <View style={styles.itemUser}>
                                        <Text style={styles.textOnInput}>Số điện thoại</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={phone}
                                            onChangeText={setPhone}
                                        />
                                    </View>
                                    <View style={styles.itemUser}>
                                        <Text style={styles.textOnInput}>Địa chỉ</Text>
                                        <GooglePlacesAutocomplete
                                            placeholder="Nhập địa chỉ"
                                            fetchDetails={true}
                                            onPress={(data, details = null) => {
                                                const formattedAddress = details?.formatted_address || data.description;
                                                setAddress(formattedAddress);
                                            }}
                                            query={{
                                                key: 'YOUR_GOOGLE_MAPS_API_KEY',
                                                language: 'vi',
                                            }}
                                            styles={{
                                                textInput: styles.textInput,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.footerButtons}>
                        <TouchableOpacity style={styles.buttonClose} onPress={() => navigation.goBack()}>
                            <Text style={styles.textButton}>Đóng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonUpdate}
                            onPress={() => {
                                if (avatar !== user.avatar) {
                                    uploadImage();
                                } else {
                                    handleUpdate(user.avatar);
                                }
                            }}
                        >
                            <Text style={styles.textButton}>Cập nhật</Text>
                        </TouchableOpacity>
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
    );
};

export default ProfileDetail;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        paddingHorizontal: 5,
        backgroundColor:"#dfdfdf",
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
    viewImage:{
        
        alignItems:'center'
    },
    drawImage:{
        borderWidth:1,
        // borderRadius:80,
        width:160,
        height:160,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#77dd77',
        marginVertical:10,
    },
    imageProfile:{
        width:170,
        height:170,
        borderWidth:1,
        // borderRadius:80,
        borderColor:'#77dd77'
    },
    name:{
        fontWeight:'500',
        fontSize:24,
        marginTop:5,
    },
    textInput:{
        borderWidth:1,
        color:'black',
        fontSize:16,
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        marginTop: 5,
    },
    profileDetailList:{
        backgroundColor:'white',
        flex:1,
        width:'100%',
        borderRadius:10,
        padding:10,
        marginBottom:10,
    },
    editDetail:{
        margin:1,
        flex:1,
    },
    itemUser:{
        margin:5,

    },
    textOnInput:{
        color:'gray',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
      },
      
      buttonClose: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
      },
      
      buttonUpdate: {
        backgroundColor: '#77dd77',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
      },
      
      textButton: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
      },
      

})