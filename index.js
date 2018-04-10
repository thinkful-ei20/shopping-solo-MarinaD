'use strict';
/* global $ */

//APPLICATION DATA

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

//CLEAR ALL FILTERS
function handleClear() {
  $('.js-clear').on('click', () => {
    //clear search query and checkbox
    $('body').find('.js-search-query').val('');
    $('body').find('#toggleChecked').attr('checked', false);

    setFilter('noFilter');
    renderShoppingList();
    console.log('handleClear ran');
  });
}

//HANDLE EDITING

//listen for submission of the edit button, change the STORE and render the new shopping list
function handleEditForm(itemIndex){
  $('#item-edit-form').submit(function (event){
    event.preventDefault();
    let usrInput = $(this).find('input[type="text"]').val();
    STORE.items[itemIndex].name = usrInput;
    renderShoppingList();
  });
}

//When edit button is clicked, replace old title with editing form
function showEditor (itemIndex, target){
  target.html(`<form id="item-edit-form">
  <lable for="itemEdit"></lable>
  <input type="text" id="itemEdit" name="itemEdit">
  <button>Edit</button>
  </form>`);
  handleEditForm(itemIndex);
}

//listen for clicks on the little pen icon, pass info about the item to be changed
function handleEdit() {
  $('.js-shopping-list').on('click', '.js-edit', function(event){
    const toBeEdited = $(event.target).closest('li').find('.js-shopping-item');
    const itemIndex = getItemIndexFromElement(toBeEdited);
    $(this).addClass('hidden');
    showEditor(itemIndex, toBeEdited);
  }); 
}

// listen for submission of the search form, grab the user input, update the filter and render the shopping list
function handleSearch () {
  $('#js-search').on('submit', function (event){
    event.preventDefault();
    let usrInput = $(this).find('.js-search-query').val();
    setFilter(usrInput);
    renderShoppingList();
  });
}

//helper function to set the filter property of STORE as needed
function setFilter (input) {
  STORE.filter = input;
}

//listen for a click on the filter by checked option, grab the current state and update the filter, render the shopping list
function handleFilter () {
  $('.js-checked-filter').on('change', function (){
    let usrInput;
    if( $(this).is(':checked') ) usrInput = 'noCheckedItems';
    else {usrInput = 'noFilter';}

    setFilter(usrInput);
    renderShoppingList();
  });
}

//takes an item from the store (an object) and the item's index- creates html for the item to be rendered to the DOM
function generateItemElement(item, itemIndex) {
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

// take maps through the current array of items in STORE and uses the helper function to create HTML from them
function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

//checks for filters, search, renders the STORE.items objects appropriately
function renderShoppingList() {
  //check for filters
  let currentFilter = STORE.filter;
  STORE.filteredItems = [...STORE.items];

  //check if on nocheckeditems
  if (currentFilter === 'noCheckedItems'){
    STORE.filteredItems=STORE.items.filter((item)=> item.checked === false);
  }

  //check if search term given
  if (currentFilter !== 'noFilter' && currentFilter !== 'noCheckedItems'){
    STORE.filteredItems = STORE.items.filter((item)=> item.name === currentFilter);
  }
  
  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(STORE.filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

//helper function to push new item data into the STORE.items property
function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

//listen to the add form submission, grab the user input, update the store and render the new STORE to the DOM
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

//helper function to update the STORE.items[item]'s checked status
function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

//helper function to pull the index of the item from the HTML
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

//listen to the 'check' button on all the shopping list items, grab the index of the item checked, use helper function to update STORE and render to the DOM
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

// listen to clicks on the delete button for each item, grab the actual item's index, run helper function to remove it from STORE and then re-render the DOM
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
  handleClear();
  handleEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);