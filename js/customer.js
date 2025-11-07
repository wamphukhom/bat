// customer.js - Customer Management System

// Customer data storage (using localStorage)
let customers = JSON.parse(localStorage.getItem('customers')) || [];

// Form submission handler
function handleCustomerForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const customer = {
    id: Date.now(), // Simple ID generation
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    level: formData.get('level'),
    memberType: formData.get('memberType') || 'regular',
    address: formData.get('address'),
    notes: formData.get('notes'),
    createdAt: new Date().toISOString()
  };
  
  // Add to customers array
  customers.push(customer);
  
  // Save to localStorage
  localStorage.setItem('customers', JSON.stringify(customers));
  
  // Show success message
  showSuccessMessage(`บันทึกข้อมูลลูกค้า ${customer.firstName} ${customer.lastName} เรียบร้อยแล้ว`);
  
  // Reset form
  event.target.reset();
  
  // Update customer list display
  displayCustomerList();
}

// Show success modal
function showSuccessMessage(message) {
  document.getElementById('success-message').textContent = message;
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
}

// Display customer list
function displayCustomerList() {
  const customerListElement = document.getElementById('customer-list');
  
  if (customers.length === 0) {
    customerListElement.innerHTML = '<p class="text-white-50 text-center">ยังไม่มีข้อมูลลูกค้า</p>';
    return;
  }
  
  // Show latest 5 customers
  const latestCustomers = customers.slice(-5).reverse();
  let html = '';
  
  latestCustomers.forEach(customer => {
    const levelText = {
      'beginner': 'เริ่มต้น',
      'intermediate': 'ปานกลาง',
      'advanced': 'ชำนาญ',
      'expert': 'ขั้นสูง'
    };
    
    html += `
      <div class="border-bottom border-secondary pb-2 mb-2">
        <div class="fw-bold">${customer.firstName} ${customer.lastName}</div>
        <small class="text-white-50">${customer.phone}</small><br>
        <small class="text-info">${levelText[customer.level] || customer.level}</small>
      </div>
    `;
  });
  
  customerListElement.innerHTML = html;
}

// Show all customers (placeholder function)
function showAllCustomers() {
  alert(`ขณะนี้มีลูกค้าทั้งหมด ${customers.length} คน\n\nฟีเจอร์นี้จะพัฒนาต่อไปในอนาคต`);
}

// Phone number formatting
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length >= 10) {
    value = value.substring(0, 10);
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  input.value = value;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Add form event listener
  const customerForm = document.getElementById('customer-form');
  if (customerForm) {
    customerForm.addEventListener('submit', handleCustomerForm);
  }
  
  // Add phone number formatting
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }
  
  // Display existing customers
  displayCustomerList();
  
  // Set default date for better UX
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = today;
    }
  });
});