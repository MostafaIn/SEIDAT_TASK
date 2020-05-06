//  *-<((GLOBAL VARIABLES))>-*
const modal = document.querySelector('#modal');
const backDrop = document.querySelector('#backdrop');
const modalState = document.querySelector('.modal-state');
const modalClose = document.querySelector('.fa-times');

const urlInput = document.querySelector('.url-input');
const nameInput = document.querySelector('.name-input');
const bookmarkedList = document.querySelector('.bookmarked-list');
const doneBtn = document.querySelector('.btn-done');
const removeBtn = document.querySelector('.btn-remove');
const bookmarkIcon = document.querySelector('.fa-star');
const screen = document.querySelector('.screen');

let quote = 'New Tab';
let editBookmark = false;
let targetItem = null;



// *-<((BOOKMARK CLASS))>-*
class Bookmark{
    constructor(url,name){
        this.url = url;
        this.name = name;
    }
};



//  *-<((UI CLASS))>-*
class UI{
    static displayBookmarks(){
        const bookmarkedList = Store.getBookmarks();
        console.log(bookmarkedList);
        
        bookmarkedList.forEach( bookmark => UI.addToList(bookmark));
    };

    static addToList(bookmark){
        // console.log(bookmark);
        const item = document.createElement('div');
        item.setAttribute('class', 'item');
        item.setAttribute('draggable', true);
        item.innerHTML =`
            <i class="fas fa-globe"></i>
            <p class="title" id=${bookmark.url}>${bookmark.name}</p>`;
        bookmarkedList.appendChild(item);
    };

    static checkFields =() => urlInput.value == '' ? quote : urlInput.value;

    static openScreen(e){
        if( e.keyCode === 13){
            screen.setAttribute('src',`https://${e.target.value}/`);
            bookmarkIcon.style.display = 'inline';
        }
        screen.setAttribute('src',`https://${urlInput.value}/`);
    }

    static clearField(){
        document.querySelector('.url-input').value = '';
    };

    static removeBookmark(bookmark){
        const item = bookmarkedList.lastElementChild;
        // console.log(item);
        targetItem ? bookmark.remove() : item.remove();
    };

    static modal(state){
        if(bookmarkIcon.classList.contains('fas')){
            state.innerText = 'Edit bookmark'
        }else{
            state.innerText = 'Bookmark added'
        }
    }

    static closeModal(){
        modal.style.display = 'none';
        backDrop.style.display = 'none';
        targetItem = null;
    }
};



 // *-<((STORE CLASS))>-*
class Store{
    static getBookmarks(){
       let bookmarks;
       if(localStorage.getItem('bookmarks') === null){
           bookmarks = [];
       }else{
           bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
       }
       return bookmarks;
    } 

    static addBookmark(bookmark){
        const bookmarks = Store.getBookmarks();
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    static removeBookmark(name){
        const bookmarks = Store.getBookmarks();
        bookmarks.forEach((bookmark, index) => {
            if(bookmark.name === name){
                bookmarks.splice(index, 1);
            }
        });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
};



// *-<((EVENTS))>-*
document.addEventListener('DOMContentLoaded', UI.displayBookmarks);

// Events: url-input
urlInput.addEventListener('keypress',(e) => UI.openScreen(e));
urlInput.addEventListener('input', (e) =>{
    urlInput.setAttribute('value', e.target.value);
    bookmarkIcon.style.display = 'none';
});
urlInput.addEventListener('focus', () =>{
    urlInput.select()
    bookmarkIcon.classList.remove('fas');
    bookmarkIcon.classList.add('far');
});
urlInput.addEventListener('focusout',() =>{
    bookmarkIcon.style.display = 'inline';
});


// Events: bookmark Icon
bookmarkIcon.addEventListener('click',() =>{
// console.log(editBookmark)

    // get values
    !editBookmark && (nameInput.value = UI.checkFields())

    
    // Instantiate bookmark
    const bookmark = new Bookmark(urlInput.value, nameInput.value);
    console.log(bookmark);

    // Add bookmark to UI
    !editBookmark && UI.addToList(bookmark);

     
    
    // call modal
    UI.modal(modalState);
    modal.style.display = 'block';
    backDrop.style.display = 'block';

    // set values
    bookmarkIcon.classList.remove('far');
    bookmarkIcon.classList.add('fas');
    nameInput.select();
});


// Events: Done button
doneBtn.addEventListener('click', () =>{
    
    // Edit bookmark name
    const item = bookmarkedList.lastElementChild.lastChild;
    console.log(item)
    targetItem ? targetItem.innerText = nameInput.value : item.innerText = nameInput.value;
    
    // Add bookmark to store
    const bookmark = {url: item.id, name: item.textContent}
    console.log(editBookmark)
    !editBookmark && Store.addBookmark(bookmark);

    editBookmark = false;
    UI.closeModal();
});


// Events: Remove button
removeBtn.addEventListener('click',(e) =>{
    let bookmarkItem;
    targetItem && (bookmarkItem = targetItem.parentElement);
    
    // Remove from UI
    UI.removeBookmark(bookmarkItem)

    // console.log(bookmarkItem.lastElementChild.textContent)
    // Remove from Store
    Store.removeBookmark(bookmarkItem.lastElementChild.textContent)
    UI.closeModal();
});

// Events: EACH ITEM
bookmarkedList.addEventListener('click',(e) =>{
    const item = e.target;
    // console.log(item);
    if(item.classList.contains('title')){

        // set values
        urlInput.value = item.id;
        nameInput.value = item.textContent;
        bookmarkIcon.classList.remove('far');
        bookmarkIcon.classList.add('fas');
        UI.modal(modalState);
        UI.openScreen(e);
        editBookmark = true;
        // console.log(item);
        
        // assign targetItem for editing the title of bookmark item
        targetItem = item


        // Drag & Drop bookmarked Items
        console.log(item.parentElement)
        const selectedItem = item.parentElement;

        selectedItem.addEventListener('dragstart', () =>{
            selectedItem.classList.add('dragging');
        });

        selectedItem.addEventListener('dragend',() =>{
            selectedItem.classList.remove('dragging');
        });

    }
});


bookmarkedList.addEventListener('dragover',(e) =>{
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    bookmarkedList.appendChild(draggingItem);   
});


// Events: MODAL
backDrop.addEventListener('click', UI.closeModal);
modalClose.addEventListener('click', UI.closeModal);


