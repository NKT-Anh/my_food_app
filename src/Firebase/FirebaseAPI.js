import { collection,onSnapshot, where,query,getDocs,addDoc,Timestamp, setDoc,doc,getDoc, deleteDoc, updateDoc, arrayUnion, writeBatch, arrayRemove } from "firebase/firestore";
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
        const userRef = doc(db, "User", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, {
                favorites: arrayUnion(foodId),
            });
        } else {
            await setDoc(userRef, {
                favorites: [foodId],
            });
        }
        return { success: true, message: "Đã thêm món ăn vào danh sách yêu thích" };
    } catch (error) {
        console.error("Lỗi khi thêm món ăn vào danh sách yêu thích:", error.message);
        return { success: false, message: "Lỗi khi thêm món ăn vào danh sách yêu thích!" };
    }
}
export const removeFavoritesFood = async (userId, foodId) => {
    try {
        const userRef = doc(db, "User", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, {
                favorites: arrayRemove(foodId),
            });
        }
        return { success: true, message: "Đã xóa món ăn khỏi danh sách yêu thích" };
    } catch (error) {
        console.error("Lỗi khi xóa món ăn khỏi danh sách yêu thích:", error.message);
        return { success: false, message: "Lỗi khi xóa món ăn khỏi danh sách yêu thích!" };
    }
}
export const loadFavoritesFood = async (userId) => {
    if (!userId) {
        return [];
    }

    try {
        const userRef = doc(db, "User", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.favorites || [];
        }
        return [];
    } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error.message);
        return [];
    }
}
export const addOrder = async (userId, orderData) => {
    try {
        const userReference = doc(db, "User", userId);
        const userDoc = await getDoc(userReference);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const deliveryAddress = userData.address || " "; 

            // Kiểm tra nếu không có địa chỉ
            if (!deliveryAddress || deliveryAddress.trim() === "") {
                return { success: false, message: "Vui lòng cập nhật địa chỉ trước khi đặt hàng!" };
            }

            const newOrder = {
                ...orderData,
                deliveryAddress,
                status: "Chờ xác nhận",
                createdAt: new Date(),
            };

            // Lưu đơn hàng vào collection "orders"
            const orderRef = doc(collection(db, "orders"));
            await setDoc(orderRef, newOrder);

            return { success: true, message: "Đơn hàng đã được thêm vào trạng thái Chờ xác nhận" };
        } else {
            return { success: false, message: "Người dùng không tồn tại" };
        }
    } catch (error) {
        console.error("Lỗi khi thêm đơn hàng:", error.message);
        return { success: false, message: "Lỗi khi thêm đơn hàng!" };
    }
};
export const checkoutOrders = async (userId, ordersToCheckout,paymentMethod) => {
    try {
        const userReference = doc(db, "User", userId);
        const userDoc = await getDoc(userReference);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const deliveryAddress = userData.address || " ";
            if (!deliveryAddress || deliveryAddress.trim() === "") {
                return { success: false, message: "Vui lòng cập nhật địa chỉ trước khi thanh toán!" };
            }
            const newOrder = {
                items: ordersToCheckout[0].items.map(item => ({
                    foodItem: {
                        foodName: item.foodItem.foodName,
                        ...item.foodItem
                    },
                    soLuong: item.soLuong,
                    tongGia: item.tongGia
                })),
                deliveryAddress,
                status: "Chờ giao hàng",
                createdAt: new Date(),
                updatedAt: new Date(),
                paymentMethod,
                userId,
                totalAmount: ordersToCheckout[0].totalAmount
            };

           
            const orderRef = doc(collection(db, "orders"));
            await setDoc(orderRef, newOrder);

           
            await updateDoc(userReference, {
                cart: [],
            });

            return { success: true, message: "Thanh toán thành công chờ shipper giao hàng" };
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
  try {
    // Lấy thống kê đơn hàng
    const ordersQuery = query(collection(db, "orders"));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let readyOrders = 0;
    let deliveringOrders = 0;
    let completedOrders = 0;
    
    // Khởi tạo mảng thống kê theo ngày
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dailyStats = Array(31).fill(0); // Mảng lưu số đơn hàng mỗi ngày
    const dailyRevenue = Array(31).fill(0); // Mảng lưu doanh thu mỗi ngày
    
    ordersSnapshot.forEach((doc) => {
      const orderData = doc.data();
      totalOrders++;
      totalRevenue += orderData.totalAmount || 0;
      
      // Thống kê theo trạng thái
      switch (orderData.status) {
        case "Chờ xác nhận":
          pendingOrders++;
          break;
        case "Chờ giao hàng":
          readyOrders++;
          break;
        case "Đang giao":
          deliveringOrders++;
          break;
        case "Đã đặt":
          completedOrders++;
          break;
      }
      
      // Thống kê theo ngày
      const orderDate = orderData.createdAt?.toDate();
      if (orderDate && orderDate >= firstDayOfMonth && orderDate <= today) {
        const dayIndex = orderDate.getDate() - 1;
        dailyStats[dayIndex]++;
        dailyRevenue[dayIndex] += orderData.totalAmount || 0;
      }
    });

    // Lấy tổng số người dùng
    const usersSnapshot = await getDocs(collection(db, "User"));
    const totalUsers = usersSnapshot.size;

    // Lấy tổng số món ăn
    const foodsSnapshot = await getDocs(collection(db, "foods"));
    const totalFoods = foodsSnapshot.size;

    return {
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalFoods,
        pendingOrders,
        readyOrders,
        deliveringOrders,
        completedOrders,
        dailyStats: dailyStats.slice(0, today.getDate()), // Chỉ lấy đến ngày hiện tại
        dailyRevenue: dailyRevenue.slice(0, today.getDate()), // Chỉ lấy đến ngày hiện tại
      },
    };
  } catch (error) {
    console.error("Error getting overview stats:", error);
    return { success: false, error: error.message };
  }
};
export const getAnalyticsData = async (timeframe) => {
  try {
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const now = new Date();
    let filteredOrders = [];

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt);

      if (timeframe === "day" && createdAt.toDateString() === now.toDateString()) {
        filteredOrders.push(data);
      } else if (timeframe === "week" && now - createdAt <= 7 * 24 * 60 * 60 * 1000) {
        filteredOrders.push(data);
      } else if (timeframe === "month" && now.getMonth() === createdAt.getMonth()) {
        filteredOrders.push(data);
      }
    });

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
export const updateRestaurantInfo = async (restaurantId, restaurantData) => {
    if (!restaurantId) {
        return { success: false, error: 'Không tìm thấy ID nhà hàng!' };
    }

    try {
        const restaurantRef = doc(db, 'restaurants', restaurantId);
        await setDoc(restaurantRef, restaurantData, { merge: true });
        return { success: true, message: 'Thông tin nhà hàng đã được lưu thành công!' };
    } catch (error) {
        console.error('Lỗi khi lưu thông tin nhà hàng:', error.message);
        return { success: false, error: 'Không thể lưu thông tin nhà hàng. Vui lòng thử lại!' };
    }
};
export const fetchRestaurantInfo = async (userId) => {
    try {
        const restaurantRef = doc(db, 'restaurants', userId);
        const restaurantSnap = await getDoc(restaurantRef);

        if (restaurantSnap.exists()) {
            const restaurantData = restaurantSnap.data();
            return { success: true, data: restaurantData };
        } else {
            return { success: false, error: 'Không tìm thấy thông tin nhà hàng!' };
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra nhà hàng:', error.message);
        return { success: false, error: 'Không thể kiểm tra thông tin nhà hàng. Vui lòng thử lại!' };
    }
};
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const orderRef = doc(db, "orders", orderId);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
            return { success: false, message: "Không tìm thấy đơn hàng!" };
        }

        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: new Date()
        });

        return { success: true, message: "Cập nhật trạng thái đơn hàng thành công!" };
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return { success: false, message: "Lỗi khi cập nhật trạng thái đơn hàng!" };
    }
};
export const searchFoods = async (searchText) => {
  try {
    const foodsRef = collection(db, "foods");
    const q = query(
      foodsRef,
      where("foodName", ">=", searchText),
      where("foodName", "<=", searchText + "\uf8ff")
    );
    
    const querySnapshot = await getDocs(q);
    const foods = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: foods };
  } catch (error) {
    console.error("Error searching foods:", error);
    return { success: false, error: error.message };
  }
};
export const handleUserMessage = async (userId, message) => {
  const foodName = extractFoodName(message);

  let botReply = "";
  let foundFoodItems = null;

  if (!foodName) {
    botReply = "Xin lỗi, tôi không hiểu bạn muốn tìm món ăn nào. Bạn có thể cho tôi biết tên món ăn cụ thể không?";
  } else {
    try {
      // Lấy tất cả món ăn từ database
      const allFoods = await getDocs(collection(db, "foods"));
      const foodsList = allFoods.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Tìm kiếm các món ăn phù hợp
      const matchingFoods = foodsList.filter(food => {
        const foodNameLower = food.foodName.toLowerCase();
        const searchTerms = foodName.toLowerCase().split(/\s+/);
        return searchTerms.every(term => foodNameLower.includes(term));
      });

      if (matchingFoods.length > 0) {
        foundFoodItems = matchingFoods; // Lưu danh sách món ăn tìm thấy

        // Nếu tìm thấy nhiều món
        if (matchingFoods.length > 1) {
          botReply = `Tôi tìm thấy ${matchingFoods.length} món phù hợp:\n\n`;
          matchingFoods.forEach((food, index) => {
            const price = food.foodPrice ? `${food.foodPrice}₫` : 'chưa có giá';
            const storeName = food.restaurantName || 'chưa có thông tin quán';
            botReply += `${index + 1}. ${food.foodName} - ${price} tại quán ${storeName}\n`;
            if (food.description) {
              botReply += `   Mô tả: ${food.description}\n`;
            }
            botReply += '\n';
          });
        } else {
          // Nếu chỉ tìm thấy 1 món
          const foodItem = matchingFoods[0];
          const price = foodItem.foodPrice ? `${foodItem.foodPrice}₫` : 'chưa có giá';
          const storeName = foodItem.restaurantName || 'chưa có thông tin quán';
          botReply = `Tôi tìm thấy món ${foodItem.foodName} có giá ${price} tại quán ${storeName}. ${foodItem.description ? `\nMô tả: ${foodItem.description}` : ''}`;
        }
      } else {
        botReply = `Xin lỗi, tôi không tìm thấy món "${foodName}" trong menu. Bạn có thể kiểm tra lại tên món hoặc thử tìm món khác.`;
      }
    } catch (error) {
      console.error("Lỗi khi truy vấn món ăn:", error);
      botReply = "Có lỗi xảy ra khi tìm món ăn. Vui lòng thử lại sau.";
    }
  }

  try {
    await addDoc(collection(db, "chatHistories"), {
      userId,
      question: message,
      response: botReply,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử chat:", error);
  }

  return { replyText: botReply, foundFoodItems };
};

const extractFoodName = (message) => {
  // Loại bỏ các từ thừa và chuẩn hóa tin nhắn
  const normalizedMessage = message.toLowerCase().trim();
  
  // Các mẫu để tìm tên món ăn
  const patterns = [
    /món ăn là (.+?)(?:\s|$)/i,
    /món (.+?)(?:\s|$)/i,
    /tìm (.+?)(?:\s|$)/i,
    /giá của (.+?)(?:\s|$)/i,
    /thông tin về (.+?)(?:\s|$)/i,
    /(.+?)(?:\s|$)/i  // Mẫu cuối cùng để bắt tất cả các từ còn lại
  ];

  // Thử từng mẫu cho đến khi tìm thấy kết quả
  for (const pattern of patterns) {
    const match = normalizedMessage.match(pattern);
    if (match && match[1]) {
      const foodName = match[1].trim();
      // Kiểm tra xem tên món có hợp lệ không (ít nhất 2 ký tự)
      if (foodName.length >= 2) {
        return foodName;
      }
    }
  }

  return null;
};

export const updateCartItemQuantity = async (userId, foodId, newQuantity) => {
    if (!userId || !foodId || newQuantity < 1) {
        return { success: false, message: "Thông tin cập nhật không hợp lệ." };
    }

    try {
        const userReference = doc(db, "User", userId);
        const userDoc = await getDoc(userReference);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const cart = userData.cart || [];
            const itemIndex = cart.findIndex(item => item.foodItem.foodId === foodId);

            if (itemIndex > -1) {
                const itemToUpdate = cart[itemIndex];
                // Đảm bảo foodPrice là số trước khi tính toán
                const foodPrice = typeof itemToUpdate.foodItem.foodPrice === 'string' 
                                ? parseInt(itemToUpdate.foodItem.foodPrice) || 0
                                : itemToUpdate.foodItem.foodPrice || 0;
                
                itemToUpdate.soLuong = newQuantity;
                itemToUpdate.tongGia = foodPrice * newQuantity;

                await updateDoc(userReference, {
                    cart: cart
                });
                return { success: true, message: "Cập nhật số lượng thành công!" };
            } else {
                return { success: false, message: "Không tìm thấy món ăn trong giỏ hàng." };
            }
        } else {
            return { success: false, message: "Người dùng không tồn tại." };
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng giỏ hàng:", error);
        return { success: false, message: "Lỗi khi cập nhật số lượng giỏ hàng!" };
    }
};

export const getTotalOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      where('status', '==', 'Đã đặt')
    );
    const querySnapshot = await getDocs(q);
    console.log('Total orders found:', querySnapshot.size, 'for user:', userId);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting total orders:', error);
    return 0;
  }
};