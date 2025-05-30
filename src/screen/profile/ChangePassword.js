import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Style from '../../globals/style';
import { UserContext } from '../../Firebase/UserContext';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp.");
        return;
    }

    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      Alert.alert("Lỗi", passwordValidationError);
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
          setLoading(false);
          return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Change password
      await updatePassword(user, newPassword);
      Alert.alert(
        "Thành công",
        "Mật khẩu đã được thay đổi thành công!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Đã xảy ra lỗi khi đổi mật khẩu.';
      
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Mật khẩu hiện tại không chính xác.';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu mới quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
          break;
        case 'auth/network-request-failed':
            errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.';
            break;
        default:
          errorMessage = `Không thể thay đổi mật khẩu. Lỗi: ${error.message || error.code}. Vui lòng thử lại sau.`;
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}> 
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showCurrentPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nhập mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showNewPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.changeButtonText}>Đổi mật khẩu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  changeButton: {
    backgroundColor: Style.colors.cam,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword; 