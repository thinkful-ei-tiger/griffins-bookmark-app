
import $ from 'jquery';

import '../css/normalize.css';
import '../css/styles.css';

import storeModule from './store';
import bookmarkFunctions from './bookmarkList';


const main = () => {  
  storeModule.updateLocalBookmarks();
  bookmarkFunctions.render();
  bookmarkFunctions.bindEventHandlers();  
}

$(main);