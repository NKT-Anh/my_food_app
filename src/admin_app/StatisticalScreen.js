import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { getOverviewStats } from "../Firebase/FirebaseAPI";

const StatisticalScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Đang chờ cập nhật...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tổng số đơn hàng:</Text>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Tổng doanh thu:</Text>
          <Text style={styles.statValue}>{stats.totalRevenue} VND</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Số lượng người dùng:</Text>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Số cửa hàng hoạt động:</Text>
          <Text style={styles.statValue}>{stats.activeRestaurants}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Số món ăn đã thêm:</Text>
          <Text style={styles.statValue}>{stats.totalFoods}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
});