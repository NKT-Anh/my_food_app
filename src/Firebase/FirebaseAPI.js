import { collection,onSnapshot, where,query,getDocs, setDoc,doc,getDoc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db,auth} from "./FirebaseConfig";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";
import { useId, useRef } from "react";

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
            const role = userData.role || 'user';
            return { success: true , role,user};
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
    try{
        await auth.signOut();
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
    try{
        const userReference  = doc(db,"User" , userId);
        const userDoc = await getDoc(userReference);

        if(userDoc.exists()){
            const userData = userDoc.data();
            let cart = userData.cart || [];
            const index = cart.findIndex(item => item.foodId == foodItem.foodId);
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

export const loadCart = async (userId,cartItem) =>{
    try{
        const userReference = doc(db,"User",userId)
        const userDoc = await getDoc(userReference);
        if(!userDoc.exists()){
            
        }
    }
    catch(error){

    }
}