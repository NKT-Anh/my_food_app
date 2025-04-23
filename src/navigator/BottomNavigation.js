import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation,useRoute  } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import React from 'react'
const tags = [
    { id: 'Home', name: 'Trang chủ', iconName: 'home-outline' ,iconSetName:'home'},
    { id: 'Home1', name: 'Thẻ', iconName: 'bookmark-outline', iconSetName:'bookmark' },
    { id: 'Profile', name: 'Tôi', iconName: 'person-outline',iconSetName: 'person' },
    { id: 'SearchScreen', name: 'Thông báo', iconName: 'notifications-outline',iconSetName:'notifications' },
  ];
const BottomNavigation = () => {
    
    const navigation = useNavigation();
    const route = useRoute();
    const currentIndex = tags.findIndex(tag => tag.id === route.name);

    const renderTag = (item,index)=>{
        const isSelected = index === currentIndex ;
        const iconColor = isSelected ? '#ff5722' : 'black';
        return (
            <TouchableOpacity
            key={item.id}
            style={styles.tag}
            onPress={()=> {
                
                navigation.navigate(item.id)}
            }
            >
            <View style={[styles.tag ,isSelected ] }>
            <Ionicons
                name= {isSelected == true ?  item.iconSetName : item.iconName }
                size={24}
                color={iconColor}
            />
                <Text style={[styles.text, isSelected && styles.selectedText,]}>
        
                    {item.name}
                </Text>
                
            </View>
            </TouchableOpacity>
          )
    }
    
    return <View style={styles.tags}>
        {
        tags.map(renderTag)
        }
    </View>
};

export default BottomNavigation

const styles = StyleSheet.create({
    tags: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        
      },
      tag: {
        alignItems: 'center',
      },

      selectedText:{
        color: '#ff5722',
    }

})