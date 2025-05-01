import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState ,createContext} from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from './FirebaseConfig';

import { doc, getDoc } from 'firebase/firestore';
export const UserContext = createContext();
export const UserProvider  = ({children}) => {
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const unSubcribe = onAuthStateChanged(auth,async (firebaseUser) =>{
            if(firebaseUser){
                const userReference = doc(db,"User",firebaseUser.uid);
                const userDoc = await getDoc(userReference);    
                if(userDoc.exists()){
                    console.log("Thành công");
                    const userData = userDoc.data();
                    setUser({
                        id:firebaseUser.uid,
                        email:firebaseUser.email,
                        fullName: userData.fullName || '',
                        address: userData.address || '',
                        phone: userData.phone || '',
                        avatar: userData.avatar || '',
                        role:userData.role || '',
                    })
                }
                else{
                    console.log("Không đc");
                    setUser({id: firebaseUser.uid, email:firebaseUser.email});
                }
                
            }
            else {
                setUser(null);
            }
        })
        return ()=> unSubcribe();
    },[])
  return (
    <UserContext.Provider value = {{user,setUser}}>
        {children}
    </UserContext.Provider>
  )
}