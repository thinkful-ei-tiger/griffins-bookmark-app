import $ from 'jquery';
import storeModule from './store';
import api from './api';
import templates from './templates';

const $injectionSite = $('main');


const render = () => {
        
    if (storeModule.store.error){
        handleRenderView(renderErrorWithCreateNew);
    } else if (storeModule.store.adding) {
        //render create-new view
        handleRenderView(renderCreateNewView);
    } else {
        //render initial view
        handleRenderView(renderInitialView);
    }
};


const handleRenderView = (viewToRender) => {
    let pageHTML = ``;
    let sectionsToRender = viewToRender();
    sectionsToRender.forEach(sectionGenerator => pageHTML += sectionGenerator());
    $($injectionSite).html(pageHTML)
};


const renderInitialView = () => {
    let sectionsToRender = [
        templates.generateTitleSection,
        templates.generateAddAndFilterSection,
        templates.generateBookmarkContentArea
    ];

    return sectionsToRender;
};


const renderCreateNewView = () => {
    let sectionsToRender = [
        templates.generateTitleSection,
        templates.generateAddBookmarkSection,
        templates.generateBookmarkContentArea
    ];

    return sectionsToRender;
};

const renderErrorWithCreateNew = () => {
    let sectionsToRender = [
        templates.generateTitleSection,
        templates.generateErrorContainer,
        templates.generateAddBookmarkSection,
        templates.generateBookmarkContentArea
    ];

    return sectionsToRender;
}


const bindEventHandlers = () => {
    handleAddNewBookmark();
    handleSubmitNewBookmark();
    handleCancelNewBookmark();
    handleClickedBookmark();
    handleFilterByChange();
}

const handleFilterByChange = () => {
    $($injectionSite).on('change', '#filterByRating', () => {
        let newFilterVal =  $('#filterByRating').val();
        storeModule.store.filter = newFilterVal;
        render();
    })
}


const handleAddNewBookmark = () => {
    $($injectionSite).on('click', 'button#addBookmark', () => {
        storeModule.store.adding = true;
        render();
    })
}


const handleSubmitNewBookmark = () => {
    $($injectionSite).on('click', 'button#submitNewBookmark', (event) => {
        event.preventDefault();
        storeModule.store.adding = false;
        let newTitle = $('input[type=text]#bookmarkTitle').val();
        let newUrl = $('input[type=text]#bookmarkLink').val();
        let newDesc = $('#bookmarkDescription').val();
        let newRating = $('#selectRating').val();

        if(doInputsHaveValues()){
            api.createBookmark(newTitle, newUrl, newDesc, newRating)  
            .then((newItem) => {
                storeModule.addBookmark(newItem);
                render();
            })
            .catch((error) => {
                storeModule.store.error = error;
                render();
            })
        } else {
            alert(`All input fields must be completed and the url must begin with either 'http' or 'https'.`)
            return false;
        }


        
    })
};


const doInputsHaveValues = () => {
    let newTitle = $('input[type=text]#bookmarkTitle').val();
    let newUrl = $('input[type=text]#bookmarkLink').val();
    let newDesc = $('#bookmarkDescription').val();
    let newRating = $('#selectRating').val();

    if (newTitle == undefined
        || newUrl == undefined
        || newDesc == undefined
        || newRating == undefined){
        return false
    } else {
        return true;
    }

}   


const handleCancelNewBookmark = () => {
    $($injectionSite).on('click', 'button#cancelSubmitNew', (event) => {
        event.preventDefault();
        storeModule.store.adding = false;
        storeModule.store.error = null;
        render();
    })
};


const handleClickedBookmark = () => {
    $($injectionSite).on('click', '.js-bookmarkItem', (event) => {
        let id = getItemIdFromElement(event.currentTarget);
        let bookmark = storeModule.findById(id);

        if( $(event.target).is('button#deleteBookmark') ) {
            api.deleteBookmark(id)
                .then( () => {
                    storeModule.findAndDeleteBookmark(id);
                    render();
                })
                .then( () => render() )
                .catch((error) => {
                    storeModule.store.error = error;
                    render();
                })
            
        } else {   
            storeModule.toggleExpandedView(bookmark);
            render()
        }
    })
};


const getItemIdFromElement = (item) => {
    return $(item)
      .closest('.js-bookmarkItem')
      .data('item-id');
  };


export default {
    render,
    bindEventHandlers
};