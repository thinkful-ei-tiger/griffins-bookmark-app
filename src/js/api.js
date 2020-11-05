
const BASE_URL = 'https://thinkful-list-api.herokuapp.com';
const username = 'griffin';
let url = `${BASE_URL}/${username}/bookmarks`;


const apiFetch = (...args) => {
    let error;
    return fetch(...args)
        .then(response => {
            if(!response.ok){
                error = { code: response.status };

                if (!res.headers.get('content-type').includes('json')){
                    error.message = response.statusText;
                    return Promise.reject(error);
                }
            }
            return response.json();

        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
};



const createBookmark = (newTitle, newUrl, newDesc, newRating) => {
    let newItem = JSON.stringify({
        title: newTitle,
        url: newUrl,
        desc: newDesc,
        rating: newRating
    })

    return apiFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: newItem
    })
}


const getBookmarks = () => {
    return apiFetch(url);
}



const updateBookmark = (id, updateData) => {
    let patchURL = `${url}/${id}`;

    return apiFetch(patchURL, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateData)
    });
}


const deleteBookmark = (id) => {
    let deleteURL = `${url}/${id}`;
    
    return apiFetch(deleteURL, {
        method: 'DELETE'
    });
}


export default {
    createBookmark,
    getBookmarks,
    updateBookmark,
    deleteBookmark    
};