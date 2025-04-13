import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {Ionicons,Feather} from '@expo/vector-icons';

const DATA = [
  {
    id: '1',
    name: 'First Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '3',
    name: 'Second Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '22',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '2q',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '2e',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '2f',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '2d',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: '2a',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
  {
    id: 'a',
    name: 'Third Item',
    email: 'Exam@gamil.com',
  },
];


const UserScreen = () => {
    const addUser= () =>{
        {Alert.alert("add user")}
    }
    const deleteUser =(userName) =>{
        Alert.alert(
          "Xác nhận xóa",
          `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
          [
            {
              text:'Không',
              style:'cancel',
              onPress: ()=> console.log("Hủy xóa"),
            },
            {
              text:'Có',
              style:'destructive',
              onPress: ()=> console.log(`Đã xóa ${userName}`),
            }
          ]

        )
    }

    const itemData = ({item})=>{
      return(
      <View style={styles.itemContainer}>
      <Ionicons name="person-circle-outline" size={40} color="#0e90ad" />
      <View >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemEmail}>{item.email}</Text>
      </View>
       <View style={styles.icon}>
       <Feather name="edit" size={24} color="#0e90ad" 
       style={{marginRight:10}}
       onPress={()=> Alert.alert('Tên :', item.name)}
       />
       <Feather name="trash-2" size={24} color="red"
       onPress={()=> deleteUser(item.name)} />
       </View>
     
      </View>
      )
    } 
  return (
    <View style={{flex:1}}>
      <View style={styles.titleView}>
        <View>
          <Text>Chào admin</Text>
          <Text>Chào mừng bạn trở lại</Text>
        </View>
        <View style={styles.halfCircle}>
        <View style={styles.countUser}>
        
        <Text style={styles.textUser}>20</Text>
        </View>
        </View>
      </View>
    <View style={styles.container}>
      {/* <Text>UserScreen</Text> */}
      <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={itemData}
      ItemSeparatorComponent={() => <View style={styles.list}></View>}
      />
        

      <TouchableOpacity style={styles.createButton} onPress={addUser}>
      <Ionicons name="add-circle" size={60} color="#007BFF" />
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default UserScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
    },
    createButton:{
        position:'absolute',
        bottom:20,
        right:20,
        elevation:5,
        shadowColor: '#000',
        shadowOffset:{width:1,height:1},
        shadowOpacity:0.2,
        shadowRadius: 3,

    },
    titleView:{
      paddingHorizontal:10,
      flexDirection:'row',
      justifyContent:'space-between',
      // backgroundColor: '#f2f2f2',
      padding:5,
    },
    halfCircle: {
      width: 60,
      height: 60,
      borderRadius: 50,
      borderWidth: 5,
      borderColor: 'orange',
      
    },
    countUser:{
      backgroundColor:'#e8f5f3',
      height:50,
      width:50,
      borderRadius:50,
      alignItems:'center',
      
      
    },
    textUser:{
      textAlign:'center',
      paddingTop:15,
      color:'#0e90ad',
      fontSize:15,
      fontWeight:'600'

    },
    itemContainer:{
      flexDirection:'row',
      alignItems: 'center',
      backgroundColor: '#e8f5f3',
      flex:1,
      height:70,
      padding:5,
    },
    list:{
      height: 20,
    },  
    itemTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      color:'#0e90ad',
      paddingHorizontal:20,
      marginVertical:5,
      
    },
    itemEmail: {
      color: '#fffff',
      fontSize: 14,
      paddingHorizontal:20,
      fontStyle:'italic'
    },
    icon:{
      position:'absolute',
      right:10,
      flexDirection:'row',
      marginRight:10,
      alignItems:'center',
    }
})