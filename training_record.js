document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-employee-button').addEventListener('click', async () => {
    const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
    employeeModal.show();

    const modalBody = document.getElementById('employee-modal-body');
    let table = modalBody.querySelector('table');

    // Create table structure if not exists
    if (!table) {
      modalBody.innerHTML = `
        <table class="table table-dark table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ</th>
              <th>รูป</th>
            </tr>
          </thead>
          <tbody id="employee-table-body"></tbody>
        </table>
      `;
    }

    const tableBody = document.getElementById('employee-table-body');

    try {
      const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';
      const SINGLE_TYPE_ENDPOINT = 'employees';
      const url = `${STRAPI_URL}/api/${SINGLE_TYPE_ENDPOINT}?populate=*`;

      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      tableBody.innerHTML = '';

      if (data && data.data) {
        data.data.forEach((employee, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${employee.Emp_name}</td>
            <td><img src="${employee.Emp_img?.formats?.thumbnail?.url || employee.Emp_img?.url || ''}" alt="Avatar" style="max-height: 50px;"></td>
          `;
          row.style.cursor = 'pointer';

          row.addEventListener('click', () => {
            document.getElementById('emp_id').value = employee.Emp_id;
            document.getElementById('emp_name').value = employee.Emp_name;
            document.getElementById('emp_position').value = employee.Emp_position?.Epo_name || '';

            const employeeModalInstance = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
            employeeModalInstance.hide();
          });

          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center text-white-50">ยังไม่มีข้อมูลพนักงาน</td></tr>';
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน');
    }
  });
});