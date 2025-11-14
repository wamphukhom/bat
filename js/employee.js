let eemployee = [];

function handleEmployeeForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const employee = {
    id: formData.get('id'),
    empid: formData.get('empId'),
    position: formData.get('empPosition'),
    name: formData.get('empName'),
    phone: formData.get('empPhone'),
    email: formData.get('empEmail'),
    type: formData.get('empType')
  };

  console.log('handleEmployeeForm',employee)
  // eemployee.push(employee);
  // localStorage.setItem('employees', JSON.stringify(eemployee));
  // showSuccessMessage(`บันทึกข้อมูลพนักงาน ${employee.name} เรียบร้อยแล้ว`);
  // event.target.reset();
  // displayEmployeeList();
}

document.getElementById('employee-form').addEventListener('reset', () => {
  const photoPreview = document.getElementById('photo-preview');
  photoPreview.src = 'img/avatar.jpg';
  photoPreview.style.display = 'block';
});

// Show success modal
function showSuccessMessage(message) {
  document.getElementById('success-message').textContent = message;
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
}

// Display employee list
function displayEmployeeList() {
  const employeeListElement = document.getElementById('employee-list');
  
  if (eemployee.length === 0) {
    employeeListElement.innerHTML = '<p class="text-white-50 text-center">ยังไม่มีข้อมูลพนักงาน</p>';
    return;
  }
  
  // Show latest 5 employees
  const latestEmployees = eemployee.slice(-1).reverse();
  let html = '';
  
  latestEmployees.forEach(employee => {
    html += `
      <div class="border-bottom border-secondary pb-2 mb-2">
        <small class="text-info">${employee.name || ''}</small> || <small class="text-info">${employee.emp_position_name || ''}</small>
      </div>
    `;
  });
  
  employeeListElement.innerHTML = html;
}

// Show all employees (placeholder function)
function showAllEmployees() {
  const tableBody = document.getElementById('employee-table-body');
  if (eemployee.length === 0) {
    alert('ยังไม่มีข้อมูลพนักงาน');
    return;
  }

  populateEmployeeTable();
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

// -- api --
const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com'; 
const SINGLE_TYPE_ENDPOINT = 'employees';

const url = `${STRAPI_URL}/api/${SINGLE_TYPE_ENDPOINT}?populate=*`;

async function fetchEmployeeData() {
    try {
        // Retrieve JWT from cookies
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(url, {
            method: 'GET', // Specify GET method explicitly
            headers: {
                'Authorization': `Bearer ${jwt}` // Add Bearer token from cookie
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching employee data:', error);
        throw error;
    }
}

function populateEmployeeTable() {
  const modalBody = document.getElementById('employee-modal-body');
  modalBody.innerHTML = `
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อ</th>
          <th>รูป</th>
        </tr>
      </thead>
      <tbody id="employee-table-body">
      </tbody>
    </table>
  `;

  const tableBody = document.getElementById('employee-table-body');

  eemployee.forEach((employee, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${employee.name}</td>
      <td><img src="${employee.avatar}" alt="Avatar" style="max-height: 50px;"></td>
    `;

    row.addEventListener('click', () => {
      document.querySelector('input[name="id"]').value = employee.id;
      document.querySelector('input[name="empId"]').value = employee.emp_id;
      document.querySelector('input[name="empName"]').value = employee.name;
      document.querySelector('select[name="empPosition"]').value = employee.emp_position_id;
      document.querySelector('input[name="empEmail"]').value = employee.email;
      document.querySelector('input[name="empPhone"]').value = employee.phone;
      document.querySelector('select[name="empType"]').value = employee.emp_type_id;
      const photoPreview = document.getElementById('photo-preview');
      photoPreview.src = employee.avatar;
      photoPreview.style.display = 'block';

      // Close the modal popup
      const employeeModal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
      employeeModal.hide();
    });

    tableBody.appendChild(row);
  });

  const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
  employeeModal.show();
}

async function populateMemberTypes() {
  const empTypeSelect = document.getElementById('empType-select');
  try {
    // Retrieve JWT from cookies
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch('https://meaningful-cow-f24113ac1c.strapiapp.com/api/emp-types', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}` // Add Bearer token from cookie
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch member types');
    }

    const data = await response.json();

    empTypeSelect.innerHTML = '<option value="">เลือกประเภทพนักงาน</option>';
    data.data.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.Etype_name;
      empTypeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading member types:', error);
    empTypeSelect.innerHTML = '<option value="">ไม่สามารถโหลดข้อมูล</option>';
  }
}

async function populatePositions() {
  const empPositionSelect = document.querySelector('select[name="empPosition"]');
  try {
    // Retrieve JWT from cookies
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch('https://meaningful-cow-f24113ac1c.strapiapp.com/api/emp-positions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}` // Add Bearer token from cookie
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }

    const data = await response.json();
    empPositionSelect.innerHTML = '<option value="">เลือกตำแหน่งงาน</option>';
    data.data.forEach(position => {
      const option = document.createElement('option');
      option.value = position.id;
      option.textContent = position.Epo_name;
      empPositionSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading positions:', error);
    empPositionSelect.innerHTML = '<option value="">ไม่สามารถโหลดข้อมูล</option>';
  }
}

// Define an initialization function
function initializeApp() {
  // Add form event listener
  const employeeForm = document.getElementById('employee-form');
  if (employeeForm) {
    employeeForm.addEventListener('submit', handleEmployeeForm);
  }

  // Add phone number formatting
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }

  // Display existing employees
  displayEmployeeList();

  // Set default date for better UX
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = today;
    }
  });

  // Fetch and populate data
  fetchEmployeeData().then(data => {
    if (data && data.data) {
      // Map fetched data to eemployee array
      eemployee = data.data.map(employee => ({
        id: employee.id,
        emp_id: employee.Emp_id,
        name: employee.Emp_name,
        email: employee.Emp_mail,
        phone: employee.Emp_tel,
        avatar: employee.Emp_img?.formats?.thumbnail?.url || employee.Emp_img?.url || '',
        createdAt: employee.createdAt,
        emp_position_id: employee.Emp_position.id,
        emp_position_name: employee.Emp_position.Epo_name,
        emp_type_id: employee.Emp_type.id
      }));

      // Display all employees
      displayEmployeeList();

      // Populate the table
      populateEmployeeTable();
    } else {
      console.error('No employee data found');
    }
  });

  populateMemberTypes();
  populatePositions();
}

// Call the initialization function
initializeApp();

function previewPhoto(event) {
  const input = event.target;
  const preview = document.getElementById('photo-preview');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = 'img/avatar.jpg';
    preview.style.display = 'block';
  }
}