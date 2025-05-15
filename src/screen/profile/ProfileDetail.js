import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../Firebase/UserContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { updateProfile } from '../../Firebase/FirebaseAPI';
import LoadScreen from '../../component/LoadScreen';
import ImageModal from '../../Modal/ImageModal';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const ProfileDetail = () => {
    const { user } = useContext(UserContext);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

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
                Alert.alert("Thông báo", "Tải ảnh lên thành công")
                setAvatar(uploadedUrl);
                handleUpdate(uploadedUrl)
                
                setLoading(false);
                
        }
        catch(error){
            Alert.alert("Lỗi", "Không thể tải ảnh lên. Vui lòng thử lại!");
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
            address: address,
            city: city,
            district: district,
            ward: ward,
        });
        if (result.success) {
            Alert.alert("Thành công", "Thông tin đã được cập nhật.");
        } else {
            Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại!");
        }
    };

    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Cần quyền truy cập vị trí', 'Vui lòng cấp quyền truy cập vị trí trong cài đặt của thiết bị.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeout: 15000
            });
            
            setCurrentLocation(location.coords);
            setSelectedLocation(location.coords);
            setMapVisible(true);
        } catch (error) {
            console.error('Lỗi:', error.message);
            Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleMapPress = (event) => {
        setSelectedLocation(event.nativeEvent.coordinate);
    };

    const handleSaveLocation = async () => {
        if (!selectedLocation) {
            Alert.alert('Lỗi', 'Vui lòng chọn một vị trí trên bản đồ');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse`,
                {
                    params: {
                        lat: selectedLocation.latitude,
                        lon: selectedLocation.longitude,
                        format: 'json',
                        'accept-language': 'vi'
                    },
                    headers: {
                        'User-Agent': 'MyFoodApp/1.0'
                    }
                }
            );

            if (response.data && response.data.address) {
                const address = response.data.address;
                const houseNumber = address.house_number || '';
                const road = address.road || address.street || '';
                const formattedAddress = `${houseNumber} ${road}, ${response.data.display_name}`;
                
                const city = address.city || address.state || '';
                const district = address.district || address.county || address.suburb || '';
                const ward = address.neighbourhood || address.suburb || '';

                setAddress(formattedAddress);
                setCity(city);
                setDistrict(district);
                setWard(ward);
                setMapVisible(false);
            } else {
                Alert.alert('Lỗi', 'Không thể lấy thông tin địa chỉ. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Lỗi:', error.message);
            Alert.alert('Lỗi', 'Không thể lấy thông tin địa chỉ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
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
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} nestedScrollEnabled={true}>
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
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <TextInput
                                                    style={[styles.textInput, { flex: 1 }]}
                                                    value={address}
                                                    onChangeText={setAddress}
                                                    placeholder="Nhập địa chỉ"
                                                />
                                                <TouchableOpacity 
                                                    onPress={getCurrentLocation}
                                                    style={styles.locationButton}
                                                >
                                                    <Ionicons name="location" size={24} color="#ff5a00" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={styles.itemUser}>
                                            <Text style={styles.textOnInput}>Thành phố</Text>
                                            <TextInput
                                                placeholder="Thành phố"
                                                value={city}
                                                editable={false}
                                                style={styles.textInput}
                                            />
                                        </View>
                                        <View style={styles.itemUser}>
                                            <Text style={styles.textOnInput}>Quận/Huyện</Text>
                                            <TextInput
                                                placeholder="Quận/Huyện"
                                                value={district}
                                                editable={false}
                                                style={styles.textInput}
                                            />
                                        </View>
                                        <View style={styles.itemUser}>
                                            <Text style={styles.textOnInput}>Phường/Xã</Text>
                                            <TextInput
                                                placeholder="Phường/Xã"
                                                value={ward}
                                                editable={false}
                                                style={styles.textInput}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.footerButtons}>
                            <TouchableOpacity style={styles.buttonClose} onPress={() => navigation.goBack()}>
                                <Text style={styles.textButton}>Hủy</Text>
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
                                <Text style={styles.textButton}>Lưu thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <ImageModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCamera={onPickCamera}
                    onLibrary={onPickLibrary}
                />
                <Modal
                    visible={mapVisible}
                    animationType="slide"
                    onRequestClose={() => setMapVisible(false)}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.mapHeader}>
                            <TouchableOpacity onPress={() => setMapVisible(false)}>
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.mapTitle}>Chọn vị trí</Text>
                            <TouchableOpacity onPress={handleSaveLocation}>
                                <Text style={styles.saveButton}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.mapContainer}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                initialRegion={selectedLocation ? {
                                    latitude: selectedLocation.latitude,
                                    longitude: selectedLocation.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                } : {
                                    latitude: 10.762622,
                                    longitude: 106.660172,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                onPress={handleMapPress}
                            >
                                {selectedLocation && (
                                    <Marker
                                        coordinate={selectedLocation}
                                        title="Vị trí đã chọn"
                                    />
                                )}
                            </MapView>
                            <TouchableOpacity 
                                style={styles.currentLocationButton}
                                onPress={getCurrentLocation}
                            >
                                <MaterialIcons name="my-location" size={24} color="#ff5a00" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
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
    drawImage:{
        borderWidth:1,
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
        borderColor:'#77dd77'
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
    locationButton: {
        padding: 10,
        marginLeft: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        color: '#ff5a00',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});