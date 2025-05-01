import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet,Image, TextInput } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import style from '../globals/style';

const FoodItem = ({ visible, foodItem, userId, onClose, onAddToCart }) => {
  const [soLuong , setSoLuong] = useState(1);
  const [activeButton, setActiveButton] = useState(false);
  const [tongGia,setTongGia] = useState(foodItem.foodPrice);
  const add = () => {
    setSoLuong(prev => prev+1); 
  }
  const remove = () => {
    setSoLuong(prev => prev-1);
  }
  useEffect(()=>{
    setTongGia(soLuong * foodItem.foodPrice);
  },[soLuong])
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <View style={{flexDirection:'row'}}>
            <View style={{padding:10}}>
                <Image source={{ uri: foodItem.foodImage }}
                style={styles.imageFood}
                />
            </View>
            <View style={{justifyContent:'center'}}>
            <Text style={styles.modalTitle}>{foodItem.foodName}</Text>
            <Text style={styles.modalPrice}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(foodItem.foodPrice)}
            </Text>
            <Text style={styles.modalDescription}>{foodItem.description}</Text>
            </View>
            <View style={styles.btnClose}>
            <TouchableOpacity onPress={onClose}>
            <EvilIcons name="close" size={30} color="black" />
            </TouchableOpacity>

            </View>
            <View style={styles.tongGia}>
            <Text style={{color: style.colors.cam, fontSize:20,fontWeight:'600'}}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tongGia)}
            </Text>
            </View>
            </View>
            <View style={styles.hr100} />
            <View style={{flexDirection:'row' , justifyContent:'space-between', marginVertical: 10}} >
                <Text style={{ fontWeight: '400',fontSize:20, }}>Số lượng</Text>
                <View style={{flexDirection:'row',borderWidth:0.5,paddingHorizontal:10,overflow:'hidden',borderRadius:5,height:30,  }}>

                <TouchableOpacity onPress={remove} disabled={soLuong<=1} style={{...styles.btnRemove}}>
                <Ionicons name="remove-outline" size={24}  color={soLuong <= 1 ? '#999' : 'black'}/>
                </TouchableOpacity>

                <View style={{ width: 40, alignItems: 'center', justifyContent: 'center', borderRightWidth: 0.5 }}>
                  <TextInput
                   style={{ fontSize: 16, textAlign: 'center',height: 40, width: 40 ,color:'red'}}
                   value={soLuong.toString()}
                   keyboardType='numeric'
                   onChangeText={(text)=>{
                    const number=  parseInt(text,10);
                    if(!isNaN(number)){
                      setSoLuong(number);
                    }
                    else{
                      setSoLuong('');
                    }
                   }}
                  />
                </View>
              
                <TouchableOpacity onPress={add} style={styles.btnAdd}>
                <Ionicons name="add-sharp" size={24} color="black" />
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.hr100} />
            <TouchableOpacity 
                onPress={() => onAddToCart(userId,{ foodItem,soLuong,tongGia})}
                style={{...styles.addToCartButton, backgroundColor: soLuong >= 1 ? style.colors.cam : '#cccccc' }}
                
            >
                <Text style={{...styles.addToCartButtonText, color: soLuong >= 1 ?'white':'gray'}}>Đặt món</Text>
            </TouchableOpacity>


        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  imageFood:{
    height:150,
    width:150,

  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: '#ff5a00',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  closeModalButtonText: {
    textAlign: 'center',
    color: '#000',
  },
  btnClose:{
    position:'absolute',
    top:0,
    right:0,
  },hr100:{

    width:'100%',
    borderWidth:0.7,
    borderColor:'#dfdfdf',
    marginVertical:7,
  },btnRemove:{
    width:30,
    alignItems:'center',
    justifyContent:'center',
    borderRightWidth:0.5,
  },
  btnAdd:{
    width:30,
    alignItems:'center',
    justifyContent:'center',
  },
  tongGia:{
    position:'absolute',
    bottom:0,  
    right:10
  }
});

export default FoodItem;
