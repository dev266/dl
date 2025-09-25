// Global variables
let groceryList = [];
let itemToUpdateId = null;
let userName = "Guest";

// DOM references
const userNameDisplay = document.getElementById('userNameDisplay');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');
const itemDiscountSelect = document.getElementById('itemDiscount');
const addItemBtn = document.getElementById('addItemBtn');
const itemsList = document.getElementById('itemsList');
const taxRateInput = document.getElementById('taxRate');
const subtotalAllSpan = document.getElementById('subtotalAll');
const totalDiscountAllSpan = document.getElementById('totalDiscountAll');
const taxAmountAllSpan = document.getElementById('taxAmountAll');
const grandTotalAllSpan = document.getElementById('grandTotalAll');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const closeMessageBtn = document.getElementById('closeMessageBtn');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const saveNameBtn = document.getElementById('saveNameBtn');

// Show message box
function showMessageBox(message) {
  messageText.textContent = message;
  messageBox.classList.remove('hidden');
}

// Hide message box
closeMessageBtn.addEventListener('click', () => {
  messageBox.classList.add('hidden');
});

// Render items
function renderItems() {
  itemsList.innerHTML = '';
  const taxRate = parseFloat(taxRateInput.value) / 100 || 0;

  if (groceryList.length > 0) {
    groceryList.forEach(item => {
      const priceWithDiscount = item.price - item.discountAmount;
      const taxPerItem = priceWithDiscount * taxRate;
      const finalPriceWithTax = priceWithDiscount + taxPerItem;

      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-700');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">${item.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">${item.discountPercent}% ($${item.discountAmount.toFixed(2)})</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">$${finalPriceWithTax.toFixed(2)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${item.addedBy}</td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button onclick="updateItem('${item.id}')" class="text-blue-500 hover:text-blue-400 mr-2">Update</button>
          <button onclick="deleteItem('${item.id}')" class="text-red-500 hover:text-red-400">Delete</button>
        </td>
      `;
      itemsList.appendChild(row);
    });
  }
  calculateTotals();
}

// Calculate totals
function calculateTotals() {
  let subtotalAll = 0;
  let totalDiscountAll = 0;
  const taxRate = parseFloat(taxRateInput.value) / 100 || 0;

  groceryList.forEach(item => {
    subtotalAll += item.price;
    totalDiscountAll += item.discountAmount;
  });

  const taxableAmountAll = subtotalAll - totalDiscountAll;
  const taxAmountAll = taxableAmountAll * taxRate;
  const grandTotalAll = taxableAmountAll + taxAmountAll;

  subtotalAllSpan.textContent = `$${subtotalAll.toFixed(2)}`;
  totalDiscountAllSpan.textContent = `-$${totalDiscountAll.toFixed(2)}`;
  taxAmountAllSpan.textContent = `$${taxAmountAll.toFixed(2)}`;
  grandTotalAllSpan.textContent = `$${grandTotalAll.toFixed(2)}`;
}

// Delete item
window.deleteItem = (itemId) => {
  groceryList = groceryList.filter(item => item.id !== itemId);
  renderItems();
};

// Update item
window.updateItem = (itemId) => {
  const itemToEdit = groceryList.find(item => item.id === itemId);

  if (itemToEdit) {
    itemNameInput.value = itemToEdit.name;
    itemPriceInput.value = itemToEdit.price;
    itemDiscountSelect.value = itemToEdit.discountPercent;
    itemToUpdateId = itemId;
    addItemBtn.textContent = 'Update Item';
    addItemBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    addItemBtn.classList.add('bg-green-600', 'hover:bg-green-700');
  }
};

// Add/update item
addItemBtn.addEventListener('click', () => {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);
  const discountPercent = parseInt(itemDiscountSelect.value, 10);

  if (!name || isNaN(price) || price <= 0) {
    showMessageBox('Please enter a valid item name and price.');
    return;
  }

  const discountAmount = price * (discountPercent / 100);

  if (itemToUpdateId) {
    // Update existing item
    groceryList = groceryList.map(item => {
      if (item.id === itemToUpdateId) {
        return { ...item, name, price, discountPercent, discountAmount };
      }
      return item;
    });

    // Reset
    itemToUpdateId = null;
    addItemBtn.textContent = 'Add Item';
    addItemBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    addItemBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
  } else {
    // Add new item
    const newItem = {
      id: crypto.randomUUID(),
      name,
      price,
      discountPercent,
      discountAmount,
      addedBy: userName
    };
    groceryList.push(newItem);
  }

  // Clear and re-render
  itemNameInput.value = '';
  itemPriceInput.value = '';
  itemDiscountSelect.value = '0';
  renderItems();
});

// Tax rate listener
taxRateInput.addEventListener('input', renderItems);

// Name modal logic
const savedName = localStorage.getItem('userName');
if (savedName) {
  nameInput.value = savedName;
  userName = savedName;
  userNameDisplay.textContent = userName;
}
nameModal.classList.remove('hidden');

saveNameBtn.addEventListener('click', () => {
  const newName = nameInput.value.trim();
  if (newName) {
    userName = newName;
    localStorage.setItem('userName', userName);
    userNameDisplay.textContent = userName;
    nameModal.classList.add('hidden');
  } else {
    showMessageBox("Please enter a name to continue.");
  }
});

// Initial render
renderItems();
