'use strict';
/* global $ */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  filter: 'noFilter',
  filteredItems: [],
};

// function handleClear (event){
//   $('.js-clear').on('click', function (event){
//     $('.js-search-query').val('');
//     setFilter('noFilter');
//     renderShoppingList();
//   });
// }
function handleEditForm(itemIndex){
  $('#item-edit-form').submit(function (event){
    event.preventDefault();
    let usrInput = $(this).find('input[type="text"]').val();
    STORE.items[itemIndex].name = usrInput;
    console.log(usrInput);
    renderShoppingList();
  });
}

function showEditor (itemIndex, target){
  
  target.html(`<form id="item-edit-form">
  <lable for="itemEdit"></lable>
  <input type="text" id="itemEdit" name="itemEdit">
  <button>Edit</button>
  </form>`);
  handleEditForm(itemIndex);
}

function handleEdit() {
  $('.js-shopping-list').on('click', '.js-edit', function(event){
    console.log('handleEdit ran');
    const toBeEdited = $(event.target).closest('li').find('.js-shopping-item');
    const itemIndex = getItemIndexFromElement(toBeEdited);

    $(this).addClass('hidden');
    showEditor(itemIndex, toBeEdited);
    //toBeEdited.text('Testing');
  }); 
}

function handleSearch (event) {
  $('#js-search').on('submit', function (event){
    event.preventDefault();
    let usrInput = $(this).find('.js-search-query').val();

    setFilter(usrInput);

    renderShoppingList();
  });
}

function setFilter (input) {
  STORE.filter = input;
  console.log(STORE.filter);
}
function handleFilter () {
  $('.js-checked-filter').on('change', function (event){
    let usrInput;
    if( $(this).is(':checked') ) usrInput = 'noCheckedItems';
    else {usrInput = 'noFilter';}

    setFilter(usrInput);
    renderShoppingList();
  });
}

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span><span class="js-edit"><i class="fas fa-pen-square editbtn"></i></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  //check for filters
  let currentFilter = STORE.filter;
  STORE.filteredItems = [...STORE.items];

  //check if on nocheckeditems
  if (currentFilter === 'noCheckedItems'){
    console.log('no checked items filter selected');
    STORE.filteredItems=STORE.items.filter((item)=> item.checked === false);
  }

  //check if search term given
  if (currentFilter !== 'noFilter' && currentFilter !== 'noCheckedItems'){
    STORE.filteredItems = STORE.items.filter((item)=> item.name === currentFilter);
  }
  
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilter();
  handleSearch();
  // handleClear();
  handleEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);