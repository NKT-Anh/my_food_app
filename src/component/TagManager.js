export const defaultTags = [
    'Đồ ăn',
    'Thức uống',
    'Bữa sáng',
    'Cơm',
    'Lẩu',
    'Mì',
    'Fast food',
    'Đồ tráng miệng',
    'Salad',
    'Súp',
  ];

  export const addTag = (tags, newTag) =>{

    if( newTag && !tags.includes(newTag)){
        return[...tags,newTag]
    }
    return tags;

  }
  export const removeTag = (tags , tagToRemove) =>{
    return tags.filter(tag => tag !=tagToRemove)
  }