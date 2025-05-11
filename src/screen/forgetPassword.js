import React, { useState } from 'react';
import { 
  StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetPasswordEmail } from '../Firebase/FirebaseAPI';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await resetPasswordEmail(email); 
      setLoading(false);

      if (result.success) {
        Alert.alert("Thành công", "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
        setEmail('');
      } else {
        Alert.alert("Thất bại", result.error || "Không thể gửi email đặt lại mật khẩu.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi email đặt lại mật khẩu.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nav}>
          <Text style={styles.navTitle}>Quên mật khẩu</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "android" ? "padding" : "height"} 
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Đặt lại mật khẩu</Text>
              <Text style={styles.subtitle}>Nhập email đăng ký để nhận mật khẩu mới</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Nhập Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={[styles.btn, loading && styles.btnDisabled]} 
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.btnText}>{loading ? "Đang gửi..." : "Đặt lại mật khẩu"}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  nav: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5, // Giảm khoảng cách để hiển thị lỗi gần input
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputError: {
    borderColor: 'red', // Đổi viền thành màu đỏ khi có lỗi
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  btn: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: '#FFDAB9',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});