import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VNPayScreen = ({route, navigation}) => {
  const { userId, order } = route.params;

  // 👉 Giả sử bạn có một API backend tạo URL thanh toán VNPay
  const paymentUrl = `https://your-backend.com/create-vnpay-url?amount=${order.totalAmount}&userId=${userId}`;

  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;

    if (url.includes('vnp_ResponseCode')) {
      const params = new URLSearchParams(url.split('?')[1]);
      const responseCode = params.get('vnp_ResponseCode');

      if (responseCode === '00') {
        // ✅ Thanh toán thành công -> Lưu đơn hàng
        await saveOrderAfterPayment(userId, order);
        Alert.alert("Thanh toán thành công!");
        navigation.goBack();
      } else {
        Alert.alert("Thanh toán thất bại hoặc bị hủy.");
        navigation.goBack();
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#007bff" />}
      />
    </View>
  );
};

export default VNPayScreen

const styles = StyleSheet.create({})