import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { titles } from '../globals/style';

const FoodScreen = () => {
  const navigation  = useNavigation();
  const [foodData, setFoodData] = useState([
    { id: '1', name: 'Bún bò Huế', price: '35000', description: 'Món ăn đặc sản miền Trung', image: require('../../assets/images/logoC.png'), },
    { id: '2', name: 'Phở bò', price: '40000', description: 'Phở truyền thống Hà Nội', image: require('../../assets/images/logoC.png'), },
    { id: '3', name: 'Cơm gà', price: '30000', description: 'Cơm gà chiên giòn', image: require('../../assets/images/logoC.png'), },
  ]);
  const deleteFood  = (id)=>{
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa món này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const updatedData = foodData.filter((item) => item.id !== id);
            setFoodData(updatedData);
          },
        },
      ]
    );
  };
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} đ</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
      </View>
      <View style={styles.actionIcons}>
        <Feather name="edit" size={22} color="#007BFF" style={{ marginRight: 12 }} />
        <Feather name="trash-2" size={22} color="red" onPress={() => deleteFood(item.id)} />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách món ăn</Text>
      <FlatList
        data={foodData}
        keyExtractor={(item)=> item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFood')}
      >
        <Ionicons name="add-circle" size={60} color="#0e90ad" />
      </TouchableOpacity>
    </View>
  );
};

export default FoodScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10
  },
  title:{
    fontSize:22,
    fontWeight:'bold',
    color:'#0e90ad',
  },
  itemContainer:{
    flexDirection:'row',
    padding:10,
    backgroundColor: '#e8f5f3',
    alignItems:'center',
    borderRadius:20,
  },
  itemName:{
    fontSize:16,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  itemPrice:{
    fontSize: 14,
    marginTop: 4,
    color:'red'
  },
  itemDesc:{
    fontSize:12,
    fontStyle: 'italic',
    color:'#666',
    marginTop: 4,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  


})