import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { saveOrderAfterPayment } from '../../Firebase/FirebaseAPI';
import { SafeAreaView } from 'react-native-safe-area-context';

const VNPayScreen = ({route, navigation}) => {
  const { userId, totalPrice, cartItems, paymentMethod, orderId } = route.params;
  const [paymentProcessed, setPaymentProcessed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [paymentUrl, setPaymentUrl] = React.useState('');

  // Xử lý nút back của thiết bị
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handlePaymentCancel();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // Hàm xử lý khi hủy thanh toán
  const handlePaymentCancel = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có muốn hủy thanh toán và quay về trang chủ?",
      [
        {
          text: "Không",
          style: "cancel"
        },
        {
          text: "Có",
          onPress: () => {
            // Reset navigation stack và chuyển về Home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }
        }
      ]
    );
  };

  useEffect(() => {
    // Tạo payment URL khi component mount
    fetch('http://192.168.1.56:8888/order/create_payment_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: totalPrice,
        language: 'vn',
        bankCode: '',
      }),
    })
    .then(async response => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // Nếu server redirect, lấy URL từ response
        const url = response.url;
        if (url) {
          return { url: url };
        }
        throw new Error('Invalid response from server');
      }
    })
    .then(data => {
      if (data && data.url) {
        setPaymentUrl(data.url);
      } else {
        Alert.alert("Lỗi", "Không thể tạo URL thanh toán");
        handlePaymentCancel();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert("Lỗi", "Không thể kết nối đến server thanh toán");
      handlePaymentCancel();
    });
  }, []);

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;

    if (!paymentProcessed && url.includes('vnp_ResponseCode')) {
      setPaymentProcessed(true);

      const params = new URLSearchParams(url.split('?')[1]);
      const responseCode = params.get('vnp_ResponseCode');

      if (responseCode === '00') {
        saveOrderAfterPayment(userId, orderId, true).then(() => {
          Alert.alert(
            "Thông báo",
            "Thanh toán thành công!",
            [{ 
              text: "OK", 
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }
            }],
            { cancelable: false }
          );
        }).catch((error) => {
          console.error('Error saving order:', error);
          Alert.alert("Lỗi", "Lỗi khi lưu đơn hàng!");
          handlePaymentCancel();
        });
      } else {
        Alert.alert(
          "Thông báo", 
          "Thanh toán thất bại hoặc bị hủy.",
          [{ text: "OK", onPress: handlePaymentCancel }]
        );
      }
    }
  };

  if (!paymentUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#007bff" />}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default VNPayScreen;