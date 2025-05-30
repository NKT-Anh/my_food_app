import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Import Firebase API function (need to add fetchReviews if not exist)
// import { fetchReviews } from '../../Firebase/FirebaseAPI';

const ReviewScreen = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Need to implement fetchReviews in FirebaseAPI.js
        // const result = await fetchReviews();

        // Placeholder data for now
        const result = {
            success: true,
            data: [
                {
                    id: 'rev1',
                    userId: 'user1',
                    userName: 'Nguyen Van A',
                    foodItem: { foodName: 'Phở Bò' },
                    rating: 5,
                    comment: 'Món phở rất ngon và đậm đà!',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'rev2',
                    userId: 'user2',
                    userName: 'Tran Thi B',
                    foodItem: { foodName: 'Bún Chả' },
                    rating: 4,
                    comment: 'Bún chả tạm được, hơi ít.',
                    createdAt: new Date().toISOString(),
                },
            ]
        };

        if (result.success && result.data) {
          setReviews(result.data);
        } else {
          console.error(result.message || 'Không thể tải đánh giá.');
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.userName}>{item.userName || 'Người dùng ẩn danh'}</Text>
      <Text style={styles.foodName}>{item.foodItem?.foodName || 'Món ăn không rõ'}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Đánh giá: {item.rating}/5</Text>
        {/* You can add star icons here based on rating */}
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e90ad" />
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có đánh giá nào.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Quản lý Đánh giá</Text>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  nav: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e90ad',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  foodName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#ff9800', // A typical color for ratings
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default ReviewScreen; 