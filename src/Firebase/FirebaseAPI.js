import { collection,onSnapshot, where,query,getDocs, setDoc,doc,getDoc, deleteDoc, updateDoc, arrayUnion, writeBatch } from "firebase/firestore";
import { db,auth} from "./FirebaseConfig";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail  } from "firebase/auth";
import { useContext, useId, useRef } from "react";
import { UserContext } from "./UserContext";

export const loadFoodHome  = (loadScreen) =>{
    const foodCollection = collection(db,'foods');
    const stopLoadFood  =  onSnapshot(
        foodCollection,
        (snapshot) =>{
        const foodList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()

        }))

        loadScreen(foodList);
    } , (error) =>{
        console.log("no firebase", error);
    }
)
    return stopLoadFood;

}
export const searchName = async (name) =>{
    try{
        const foodCollection = collection(db,'foods');
        const q = query(foodCollection,where("foodName","==",name))
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }));
        return result;

    } catch(error){
        console.error("Error searching food by name:", error);
        return [];
    }

}
export const signInUser =  async ({email,password,fullName,phone,address}) =>{
    const emailTrim = email.trim();
    const fullNameTrim = fullName.trim();
    const checkEmail = (email)=>{
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    
    if(!checkEmail(email)){
        return{success:false,error: "Email không hợp lệ"};
    }

    if (!password || password.length < 6) {
        return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
      }
    try{
        const userGG = await createUserWithEmailAndPassword(auth,email,password);
        const user = userGG.user;

        await setDoc(doc(db,"User",user.uid),{
            fullName:fullNameTrim,
            phone: phone || "", 
            email:emailTrim,
            address,
            role:"user",
            createAt: new Date()

        });
        return {success:true, user};

    }
    catch(error){
        console.log("Registration error:", error.code, error.message);
        if(error.code === "auth/email-already-in-use" ){
            return{success:false, error:"Email này đã được đăng ký. Vui lòng dùng email khác!"}
        }

        return { success: false, error: "Đăng ký thất bại. Vui lòng thử lại!" };
    }
}
export const LogIn = async ({email,password})=>{
    
    try{
        const userGG = await signInWithEmailAndPassword (auth,email,password);
        const user = userGG.user;

        const userDoc = await getDoc(doc(db,"User",user.uid))
        if(userDoc.exists()){
            const userData = userDoc.data();
            const role = userData.role
            return { success: true , user: { id: user.uid, role, ...userData } };
        }
        else{
            return{success:false, error :"Tài khoản hoặc mật khẩu không tồn tại" };

        }


       
    }
    catch (error) {
    console.error("Login error: ", error.message);
    if (error.code === 'auth/wrong-password') {
        return { success: false, error: 'Sai mật khẩu, vui lòng thử lại!' };
      }
      
      if (error.code === 'auth/user-not-found') {
        return { success: false, error: 'Tài khoản không tồn tại!' };
      }
      return { success: false, error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!' };
    }
  
}
export const LogOut  = async ()=>{
    // const { setUser } = useContext(UserContext);
    try{
        await auth.signOut();
        // setUser(null); 
        console.log("logoit");
        return{success:true};
    }
    catch(error){
        console.error("Logout error:", error.message);
        return{success:false,error: error.message}
    }
}
export const updateProfile = async (uid, updateDataUser) =>{
    try{
        const userReference = doc(db, "User", uid);
        await updateDoc(userReference,updateDataUser);
        
        return{success:true};
    }
    catch(error){
        console.error("Cập nhật thông tin người dùng thất bại:", error.message);
        return { success: false, error: "Không thể cập nhật thông tin. Vui lòng thử lại!" };
    }
}
export const removeFood  = async (foodId) => {
    if(!foodId){
        return{success:false , error:"lỗi gì r á"};
    }
    try{
        const foodReference = doc(db,"foods" , foodId);
        await deleteDoc(foodReference);
        return {success:true};
    }
    catch(error){
        console.error("Xóa món ăn thất bại:", error.message);
        return { success: false, error: "Không thể xóa món ăn. Vui lòng thử lại!" };
    }
}

export const addToCart = async (userId , {foodItem,soLuong,tongGia}) =>{
    console.log("foodItem id:", foodItem.foodId);

    try{
        const userReference  = doc(db,"User" , userId);
        const userDoc = await getDoc(userReference);

        if(userDoc.exists()){
            const userData = userDoc.data();
            const cart = userData.cart || [];
            const index = cart.findIndex(item => item.foodItem.foodId === foodItem.foodId);
            if(index>=0){
                cart[index].soLuong +=soLuong;
                cart[index].tongGia +=tongGia;
            }
            else{
                cart.push({foodItem,soLuong,tongGia})
            }

            await updateDoc(userReference,{
                cart

            });
            return{success:true, message:"Đã thêm vào giỏ hàng"};
        }
        else{
            return{success:false,message:"Chưa Đăng nhập"};
        }
    }
    catch(error){
        console.error("Lỗi giỏ hàng" , error);
        return{success:false,message:"Lỗi khi thêm món ăn vào giỏ hàng!"}
    }
}

export const loadCart = async (userId,setCart) =>{
    try{
        const userReference = doc(db,"User",userId)
        const unsubscribe  = onSnapshot(userReference,(userDoc)=>{
            if(userDoc.exists()){
                const userData = userDoc.data();
                const cart = userData.cart ||[];
                return{success:true, cart};
                setCart(cart);
    
            }
            else{
                setCart([]);
            }
        });
        return unsubscribe;
        
    }
    catch(error){
        console.error("Lỗi khi load giỏ hàng", error);
        setCart([]);
        return { success: false, message: "Lỗi khi tải giỏ hàng!" };
    }
}
export const getUserById = async(userId) =>{
    try{
        const userDoc = await getDoc(doc(db,"User",userId));
        if((userDoc).exists){
            return{success:true,user:{id:userId,...userDoc.data()}}
        }
        else{
            return{success:false,error:"Lỗi load userID"};
            
        }
    }
    catch (error){
        console.log("Lỗi getUserById",error.message)
        return { success: false, error: "Lỗi khi lấy thông tin người dùng!" };
    }
} 

export const loadCart1 = async (userId, setCart) => {
    try {
      const userReference = doc(db, "User", userId);
      const unsubscribe = onSnapshot(userReference, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const cart = userData.cart || [];
          setCart(cart);
        } else {
          setCart([]);
        }
      });
  
      return unsubscribe;
    } catch (error) {
      console.error("Lỗi khi load giỏ hàng:", error);
      setCart([]);
      return { success: false, message: "Lỗi khi tải giỏ hàng!" };
    }
  };
  export const loadCartRealTime = (userId, setCart) => {
    try {
        const userDocRef = doc(db, "User", userId);
        const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const cart = userData.cart || [];
                console.log("Giỏ hàng của người dùng (real-time):", cart);
                setCart(cart);
            } else {
                console.log("Không tìm thấy người dùng với ID:", userId);
                setCart([]);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error("Lỗi khi theo dõi giỏ hàng:", error.message);
        setCart([]);
    }
};
export const removeFoodFromCart = async (userId, foodId) => {
    const userReference = doc(db, "User", userId);
    const userDoc = await getDoc(userReference);
    try{
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const cart = userData.cart || [];

            const updatedCart = cart.filter((item) => item.foodItem.foodId !== foodId);

            await updateDoc(userReference, {
                cart: updatedCart,
            });
            return { success: true, message: "Đã xóa món ăn khỏi giỏ hàng" };
        } else {
            return { success: false, message: "Người dùng không tồn tại" };
        }
    }catch(error){
        console.error("Lỗi khi xóa món ăn khỏi giỏ hàng:", error.message);
        return { success: false, message: "Lỗi khi xóa món ăn khỏi giỏ hàng!" };
    }
}
export const addFavoritesFood = async (userId, foodId) => {
    try {
        const userReference = doc(db, "User", userId);
        await updateDoc(userReference, {
            favorites: arrayUnion(foodId),
        });
        return { success: true, message: "Đã thêm món ăn vào danh sách yêu thích" };
    } catch (error) {
        console.error("Lỗi khi thêm món ăn vào danh sách yêu thích:", error.message);
        return { success: false, message: "Lỗi khi thêm món ăn vào danh sách yêu thích!" };
    }
}
export const removeFavoritesFood = async (userId, foodId) => {
    try {
        const userReference = doc(db, "User", userId);
        await updateDoc(userReference, {
            favorites: arrayRemove(foodId),
        });
        return { success: true, message: "Đã xóa món ăn khỏi danh sách yêu thích" };
    } catch (error) {
        console.error("Lỗi khi xóa món ăn khỏi danh sách yêu thích:", error.message);
        return { success: false, message: "Lỗi khi xóa món ăn khỏi danh sách yêu thích!" };
    }
}
export const loadFavoritesFood = async (userId, setFavorites) => {
    try {
        const userReference = doc(db, "User", userId);
        const unsubscribe = onSnapshot(userReference, (userDoc) => {
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const favorites = userData.favorites || [];
                setFavorites(favorites);
            } else {
                setFavorites([]);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error.message);
        setFavorites([]);
    }
}
export const addOrder = async (userId, orderData) => {
    try {
        const userReference = doc(db, "User", userId);
        const userDoc = await getDoc(userReference);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const orders = userData.orders || [];
            const newOrder = {
                ...orderData,
                status: "Chờ xác nhận",
                createdAt: new Date(),
            };

            orders.push(newOrder);

            await updateDoc(userReference, {
                orders,
            });

            return { success: true, message: "Đơn hàng đã được thêm vào trạng thái Chờ xác nhận" };
        } else {
            return { success: false, message: "Người dùng không tồn tại" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng:", error.message);
        return { success: false, message: "Lỗi khi thêm đơn hàng!" };
    }
};
export const checkoutOrders = async (userId, ordersToCheckout) => {
    try {
        const userReference = doc(db, "User", userId);
        const userDoc = await getDoc(userReference);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Cập nhật trạng thái các đơn hàng
            const updatedOrders = ordersToCheckout.map((item) => ({
                ...item,
                status: "Chờ giao hàng", // Chuyển trạng thái sau khi thanh toán
                updatedAt: new Date(), // Thời gian cập nhật
                createdAt: new Date(), // Thời gian tạo đơn hàng
                userId, // Gắn ID người dùng vào đơn hàng
            }));

            // Tạo bản sao đơn hàng trong collection "orders" ở cấp cao nhất
            const batch = writeBatch(db); // Sử dụng writeBatch để thực hiện nhiều thao tác ghi cùng lúc
            updatedOrders.forEach((order) => {
                const orderRef = doc(collection(db, "orders")); // Tạo document mới trong "orders"
                batch.set(orderRef, order);
            });

            await batch.commit(); // Thực hiện tất cả các thao tác ghi

            // Xóa giỏ hàng của người dùng
            await updateDoc(userReference, {
                cart: [], // Đặt giỏ hàng thành rỗng
            });

            return { success: true, message: "Thanh toán thành công và chuyển sang trạng thái Chờ giao hàng!" };
        } else {
            return { success: false, message: "Người dùng không tồn tại" };
        }
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error.message);
        return { success: false, message: "Đã xảy ra lỗi khi thanh toán!" };
    }
};
export const resetPasswordEmail = async (email) => {
    const auth = getAuth();
    try{
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Email đặt lại mật khẩu đã được gửi!" };
    }
    catch(error){
        console.error("Lỗi khi gửi email đặt lại mật khẩu:", error.message);
        return { success: false, error: "Lỗi khi gửi email đặt lại mật khẩu!" };
    }
}
export const getOverviewStats = async () => {
    try{
        const ordersSnapshot = await getDocs(collection(db, "User"));
        const totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "completed") {
        totalRevenue += data.totalPrice;
      }
    });

    // Lấy số lượng người dùng
    const usersSnapshot = await getDocs(collection(db, "users"));
    const totalUsers = usersSnapshot.size;

    // Lấy số lượng cửa hàng đang hoạt động
    const activeRestaurantsSnapshot = await getDocs(
      query(collection(db, "restaurants"), where("isActive", "==", true))
    );
    const activeRestaurants = activeRestaurantsSnapshot.size;

    // Lấy số lượng món ăn
    const foodsSnapshot = await getDocs(collection(db, "foods"));
    const totalFoods = foodsSnapshot.size;

    return {
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalUsers,
        activeRestaurants,
        totalFoods,
      },
    };


    }
    catch(error){
        console.error("Lỗi khi lấy thống kê tổng quan:", error.message);
        return { success: false, error: "Lỗi khi lấy thống kê tổng quan!" };
    }
}
export const getAnalyticsData = async (timeframe) => {
  try {
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const now = new Date();
    let filteredOrders = [];

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt);

      // Lọc theo khoảng thời gian
      if (timeframe === "day" && createdAt.toDateString() === now.toDateString()) {
        filteredOrders.push(data);
      } else if (timeframe === "week" && now - createdAt <= 7 * 24 * 60 * 60 * 1000) {
        filteredOrders.push(data);
      } else if (timeframe === "month" && now.getMonth() === createdAt.getMonth()) {
        filteredOrders.push(data);
      }
    });

    // Tính tổng doanh thu
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    return {
      success: true,
      data: {
        totalRevenue,
        ordersCount: filteredOrders.length,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phân tích:", error.message);
    return { success: false, error: error.message };
  }
};
export const loadOrdersRealTime = (userId, setOrders) => {
    try {
        let ordersQuery = collection(db, "orders");
        if (userId) {
            ordersQuery = query(ordersQuery, where("userId", "==", userId));
        }

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersData);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Lỗi khi tải đơn hàng theo thời gian thực:", error.message);
        setOrders([]);
    }
};