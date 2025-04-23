import { collection,onSnapshot, where,query,getDocs, setDoc,doc } from "firebase/firestore";
import { db,auth} from "./FirebaseConfig";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";

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
    const checkEmail = (email)=>{
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    if(!checkEmail(email)){
        return{success:false,error: "Email không hợp lệ"};
    }
    try{
        const userGG = await createUserWithEmailAndPassword(auth,email,password);
        const user = userGG.user;

        await setDoc(doc(db,"User",user.uid),{
            fullName,
            phone,
            email,
            address,
            role:"user",
            createAt: new Date()

        });
        return {success:true, user};

    }
    catch(error){
        console.error("Registration error: ", error.message);
        return { success: false, error: error.message };
    }
}
export const LogIn = async ({email,password})=>{
    
    try{
        const userGG = await signInWithEmailAndPassword (auth,email,password);
        const user = userGG.user;

        return {success: true,user}
    }
    catch (error) {
    // console.error("Login error: ", error.message);
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
        console.log("éo",error);
        return{success:false,error: error.message}
    }
}