// Customer data storage (using array of objects)
let ccustomer = [];

// Form submission handler
function handleCustomerForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const customer = {
    id: Date.now(), // Simple ID generation
    name: formData.get('name'),
    email: formData.get('email'),
    level: formData.get('level'),
    position: formData.get('position'),
    createdAt: new Date().toISOString()
  };
  
  // Add to customers array
  ccustomer.push(customer);
  
  // Save to localStorage
  localStorage.setItem('customers', JSON.stringify(ccustomer));
  
  // Show success message
  showSuccessMessage(`บันทึกข้อมูลลูกค้า ${customer.name} เรียบร้อยแล้ว`);
  
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
  
  if (ccustomer.length === 0) {
    customerListElement.innerHTML = '<p class="text-white-50 text-center">ยังไม่มีข้อมูลลูกค้า</p>';
    return;
  }
  
  // Show latest 5 customers
  const latestCustomers = ccustomer.slice(-1).reverse();
  let html = '';
  
  latestCustomers.forEach(customer => {
    html += `
      <div class="border-bottom border-secondary pb-2 mb-2">
        <div class="fw-bold">${customer.name}</div>
        <small class="text-info">${customer.position || ''}</small> || <small class="text-info">${customer.rank || ''}</small>
      </div>
    `;
  });
  
  customerListElement.innerHTML = html;
}

// Show all customers (placeholder function)
function showAllCustomers() {
  const tableBody = document.getElementById('customer-table-body');
  if (ccustomer.length === 0) {
    alert('ยังไม่มีข้อมูลลูกค้า');
    return;
  }

  populateCustomerTable();
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

// -- api --
const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com'; 
const SINGLE_TYPE_ENDPOINT = 'customers';

const url = `${STRAPI_URL}/api/${SINGLE_TYPE_ENDPOINT}?populate=*`;

async function fetchCustomerData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching customer data:', error);
        throw error;
    }
}

function populateCustomerTable() {
  const modalBody = document.getElementById('customer-modal-body');
  modalBody.innerHTML = `
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อ</th>
          <th>รูป</th>
        </tr>
      </thead>
      <tbody id="customer-table-body">
      </tbody>
    </table>
  `;

  const tableBody = document.getElementById('customer-table-body');

  ccustomer.forEach((customer, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${customer.name}</td>
      <td><img src="${customer.avatar}" alt="Avatar" style="max-height: 50px;"></td>
    `;

    row.addEventListener('click', () => {
      document.querySelector('input[name="firstName"]').value = customer.name;
      document.querySelector('input[name="responsibility"]').value = customer.position;
      document.querySelector('select[name="level"]').value = customer.rank;
      document.querySelector('input[name="email"]').value = customer.email;
      document.querySelector('input[name="phone"]').value = customer.phone;
      const photoPreview = document.getElementById('photo-preview');
      photoPreview.src = customer.avatar;
      photoPreview.style.display = 'block';
    });

    tableBody.appendChild(row);
  });

  const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
  customerModal.show();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomerData().then(data => {
        if (data && data.data) {
            // Map fetched data to ccustomer array
            ccustomer = data.data.map(customer => ({
                id: customer.id,
                name: customer.Emp_Name,
                email: customer.Email,
                phone: customer.Tel,
                position: customer.Positioin,
                rank: customer.Rank,
                avatar: customer.Avatar?.formats?.thumbnail?.url || customer.Avatar?.url || '',
                createdAt: customer.createdAt
            }));

            // Display all customers
            displayCustomerList();

            // Populate the table
            populateCustomerTable();
        } else {
            console.error('No customer data found');
        }
    });
});