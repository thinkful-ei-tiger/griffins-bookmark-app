import api from './api';
import bookmarkFunctions from './bookmarkList';


const store = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0
  };


const updateLocalBookmarks = () => {
  api.getBookmarks()
  .then(jsonResp => {
      jsonResp.forEach(bookmark => {
          addBookmark(bookmark)
      })
  })
  .then( () => {
    bookmarkFunctions.render();
  })
  .catch(error => console.error(error.message))
}


const findById = (id) => {
  return store.bookmarks.find(currentItem => currentItem.id === id);
};  


const toggleExpandedView = (bookmarkObj) => {
  bookmarkObj.expanded = !bookmarkObj.expanded;
};



const addBookmark = (newBookmark) => {
  let newItem = newBookmark;
  Object.assign(newItem, {expanded: false} )
  store.bookmarks.push(newItem);
}


const findAndDeleteBookmark = (id) => {
  store.bookmarks = store.bookmarks.filter(currentItem => currentItem.id !== id);
}


export default {
  store,
  updateLocalBookmarks,
  findById,
  toggleExpandedView,
  addBookmark,
  findAndDeleteBookmark

}