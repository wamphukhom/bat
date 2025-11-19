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
}

document.getElementById('employee-form').addEventListener('reset', () => {
  const photoPreview = document.getElementById('photo-preview');
  photoPreview.src = 'img/avatar.jpg';
  photoPreview.style.display = 'block';
});

function showAllEmployees() {
  if (eemployee.length === 0) {
    alert('ยังไม่มีข้อมูลพนักงาน');
    return;
  }

  populateEmployeeTable();
}

function displayEmployeeList() {
  const employeeListElement = document.getElementById('employee-list');
  
  if (eemployee.length === 0) {
    employeeListElement.innerHTML = '<p class="text-white-50 text-center">ยังไม่มีข้อมูลพนักงาน</p>';
    return;
  }

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

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length >= 10) {
    value = value.substring(0, 10);
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  input.value = value;
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
    row.style.cursor = 'pointer';

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
    const data = await fetchEmployeeTypes();
    
    empTypeSelect.innerHTML = '<option value="">เลือกประเภทพนักงาน</option>';
    data.forEach(type => {
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
    const data = await fetchEmployeePositions();
    
    empPositionSelect.innerHTML = '<option value="">เลือกตำแหน่งงาน</option>';
    data.forEach(position => {
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

async function initializeApp() {
  const employeeForm = document.getElementById('employee-form');
  if (employeeForm) {
    employeeForm.addEventListener('submit', handleEmployeeForm);
  }

  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }

  displayEmployeeList();

  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = today;
    }
  });

  try {
    const data = await fetchEmployeeData();
    if (data && data.length > 0) {
      eemployee = data.map(employee => ({
        id: employee.id,
        emp_id: employee.Emp_id,
        name: employee.Emp_name,
        email: employee.Emp_mail,
        phone: employee.Emp_tel,
        avatar: employee.Emp_img?.formats?.thumbnail?.url || employee.Emp_img?.url || 'img/avatar.jpg',
        createdAt: employee.createdAt,
        emp_position_id: employee.Emp_position?.id,
        emp_position_name: employee.Emp_position?.Epo_name,
        emp_type_id: employee.Emp_type?.id
      }));

      displayEmployeeList();
    } else {
      console.error('No employee data found');
    }
  } catch (error) {
    console.error('Error loading employee data:', error);
  }

  await populateMemberTypes();
  await populatePositions();
}

document.addEventListener('DOMContentLoaded', initializeApp);

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