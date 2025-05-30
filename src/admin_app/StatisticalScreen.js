import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { getOverviewStats } from "../Firebase/FirebaseAPI";
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const StatisticalScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getOverviewStats();
      if (result.success) {
        setStats(result.data);
      } else {
        console.error(result.error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không thể tải dữ liệu thống kê</Text>
      </View>
    );
  }

  const chartData = {
    labels: stats.dailyStats.map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: stats.dailyStats,
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const revenueChartData = {
    labels: stats.dailyRevenue.map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: stats.dailyRevenue.map(revenue => revenue / 1000), // Chuyển đổi sang nghìn VND
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thống kê đơn hàng</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrderScreen')}>
            <Ionicons name="arrow-forward" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="cart-outline" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Tổng đơn hàng</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="cash-outline" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.statValue}>{formatPrice(stats.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Tổng doanh thu</Text>
          </View>
        </View>

        <View style={styles.statusGrid}>
          <View style={[styles.statusCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.statusValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statusLabel}>Chờ xác nhận</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statusValue}>{stats.readyOrders}</Text>
            <Text style={styles.statusLabel}>Chờ giao hàng</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statusValue}>{stats.deliveringOrders}</Text>
            <Text style={styles.statusLabel}>Đang giao</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.statusValue}>{stats.completedOrders}</Text>
            <Text style={styles.statusLabel}>Đã đặt</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê theo ngày</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Số lượng đơn hàng</Text>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 40, stats.dailyStats.length * 30)}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: '#FF6B6B'
              }
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
          />
        </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Doanh thu (nghìn VND)</Text>
          <LineChart
            data={revenueChartData}
            width={Math.max(screenWidth - 40, stats.dailyRevenue.length * 30)}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: '#2ecc71'
              }
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
          />
        </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê hệ thống</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="people-outline" size={24} color="#FF6B6B" />
              <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
                <Ionicons name="arrow-forward" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Người dùng</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="restaurant-outline" size={24} color="#FF6B6B" />
              <TouchableOpacity onPress={() => navigation.navigate('FoodScreen')}>
                <Ionicons name="arrow-forward" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.statValue}>{stats.totalFoods}</Text>
            <Text style={styles.statLabel}>Món ăn</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="star-outline" size={24} color="#FF6B6B" />
              <TouchableOpacity onPress={() => navigation.navigate('ReviewScreen')}>
                <Ionicons name="arrow-forward" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.statValue}>...</Text>
            <Text style={styles.statLabel}>Đánh giá/Phản hồi</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  horizontalScroll: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});