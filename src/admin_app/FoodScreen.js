import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { db } from '../Firebase/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { removeFood } from '../Firebase/FirebaseAPI';

const FoodScreen = () => {
  const [foodData, setFoodData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    const foodCollection = collection(db, 'foods');
    const loadFood = onSnapshot(foodCollection, (snapshot) => {
      const foodList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodData(foodList);
    }, (error) => {
      console.error("load food error", error);
    });

    return () => loadFood();
  }, []);

  const deleteFood = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa món này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const result = await removeFood(id);
            if (result.success) {
              Alert.alert("Thành công", "Món ăn đã được xóa.");
            } else {
              Alert.alert("Lỗi", result.error);
            }
          },
        },
      ]
    );
  };

  const openModal = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
  };

  const handleOrder = () => {
    // Xử lý đặt món ăn (mã xử lý theo nhu cầu của bạn)
    Alert.alert("Đặt món thành công", `${selectedFood.foodName} đã được thêm vào đơn hàng.`);
    closeModal();  // Đóng modal sau khi đặt món
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.foodName}</Text>
        <Text style={styles.itemPrice}>{Number(item.foodPrice).toLocaleString('vi-VN')} đ</Text>
        <Text style={styles.itemDesc}>{item.description}</Text>
      </View>
      <View style={styles.actionIcons}>
        <Feather name="edit" size={22} color="#007BFF" style={{ marginRight: 12 }} />
        <Feather name="trash-2" size={22} color="red" onPress={() => deleteFood(item.id)} />
        <Feather name="eye" size={22} color="green" onPress={() => openModal(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách món ăn</Text>
      <FlatList
        data={foodData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={<Text>Chưa có món ăn nào đc thêm vào.</Text>}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedFood && (
              <>
                <Text style={styles.modalTitle}>{selectedFood.foodName}</Text>
                <Text style={styles.modalPrice}>{Number(selectedFood.foodPrice).toLocaleString('vi-VN')} đ</Text>
                <Text style={styles.modalDesc}>{selectedFood.description}</Text>
                <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                  <Text style={styles.orderButtonText}>Đặt món</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log("Navigating to Add Food")}
      >
        <Ionicons name="add-circle" size={60} color="#0e90ad" />
      </TouchableOpacity>
    </View>
  );
};

export default FoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#e8f5f3',
    alignItems: 'center',
    borderRadius: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  itemPrice: {
    fontSize: 14,
    marginTop: 4,
    color: 'red',
  },
  itemDesc: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  modalPrice: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: '#0e90ad',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  orderButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#333',
    textAlign: 'center',
  },
});
