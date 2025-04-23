export const defaultTags = [
    'Đồ chay',
    'Đồ uống',
    'Rau củ',
    'Đồ hộp',
    'Trái cây',
    'Gia vị',
    'Fast food',
    'Đồ tráng miệng',
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