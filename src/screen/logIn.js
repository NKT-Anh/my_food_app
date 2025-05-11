import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Image, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LogIn } from '../Firebase/FirebaseAPI';
import LoadScreen from '../component/LoadScreen';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập tài khoản và mật khẩu");
      return;
    }
    setLoading(true);

    const result = await LogIn({ email, password });
    setLoading(false);

    if (result.success) {
      const userRole = result.user.role;
      if (userRole === "shipper") {
        navigation.navigate('HomeShipper');
      } else {
        navigation.navigate('Home');
      }
    } else {
      Alert.alert("Đăng nhập thất bại", result.error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Navigation Title */}
        <View style={styles.nav}>
          <Text style={styles.navTitle}>MyFood App</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "android" ? "padding" : "height"} 
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              <Image source={require('../../assets/images/logoC.png')} style={styles.logo} />
              <Text style={styles.title}>Đăng Nhập</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <AntDesign style={styles.icon} name="user" size={24} color="#ffa500" />
                <TextInput 
                  style={styles.input}
                  placeholder="Nhập Email"
                  placeholderTextColor="#FFCC99"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialIcons style={styles.icon} name="lock-outline" size={24} color="#FF8C00" />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập Mật khẩu"
                  placeholderTextColor="#FFCC99"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <Feather
                  style={[styles.icon, { marginLeft: -10 }]}
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#9E9E9E"
                  onPress={() => setShowPassword(!showPassword)}
                />
              </View>

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              {/* Loading Indicator */}
              <LoadScreen isLoading={loading} text="Đang đăng nhập..." />

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogIn} style={styles.loginButton}>
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>

              {/* Social Login */}
              <Text style={styles.otherLoginText}>Hoặc đăng nhập bằng</Text>
              <View style={styles.iconLoginLayout}>
                <TouchableOpacity style={styles.iconLogin}>
                  <AntDesign name="google" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconLogin}>
                  <AntDesign name="facebook-square" size={24} color="blue" />
                </TouchableOpacity>
              </View>

              {/* Register */}
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.registerText}>
                  Chưa có tài khoản? <Text style={styles.boldText}>Đăng ký ngay</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

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
    fontSize: 20,
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
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 50,
    width: '90%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    marginVertical: 12,
  },
  forgotPassword: {
    color: '#FF6F61',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
  },
  loginText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otherLoginText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  iconLoginLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconLogin: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 10,
    elevation: 5,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FF8C00',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
