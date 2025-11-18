const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';

async function fetchEmployeeData() {
  try {
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch(`${STRAPI_URL}/api/employees?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }

    const data = await response.json();
    const employees = data.data.map(employee => ({
        id: employee.id,
        emp_id: employee.Emp_id,
        emp_name: employee.Emp_name,
        emp_position: employee.Emp_position?.Epo_name
    }));

    return employees;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
}

async function fetchGSDData() {
  try {
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch(`${STRAPI_URL}/api/gsds?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GSD data');
    }

    const data = await response.json();
    const gsds = data.data.map(gsd => ({
        id: gsd.id,
        gsd_code: gsd.GSD_code,
        gsd_name: gsd.GSD_name,
        smv: gsd.GSD_SMV
    }));

    return gsds;
  } catch (error) {
    console.error('Error fetching GSD data:', error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const eemployees = await fetchEmployeeData();
  const ggsd = await fetchGSDData();
});

document.getElementById('emp_name').addEventListener('input', async function () {
  const input = this.value.toLowerCase();
  const employees = await fetchEmployeeData();

  const filteredEmployees = employees.filter(employee =>
    employee.emp_name.toLowerCase().includes(input)
  );

  const datalist = document.getElementById('emp_name_datalist');
  datalist.innerHTML = '';

  filteredEmployees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.emp_name;
    option.textContent = `${employee.emp_name} (${employee.emp_position})`;
    datalist.appendChild(option);
  });

  document.getElementById('emp_name').addEventListener('change', function () {
    const selectedName = this.value;
    const selectedEmployee = employees.find(employee => employee.emp_name === selectedName);
    if (selectedEmployee) {
      document.getElementById('emp_id').value = selectedEmployee.emp_id;
      document.getElementById('emp_position').value = selectedEmployee.emp_position;
    }
  });
});

document.getElementById('gsd_name').addEventListener('input', async function () {
    const input = this.value.toLowerCase();
    const gsds = await fetchGSDData();

    const filteredGsds = gsds.filter(gsd =>
        gsd.gsd_name.toLowerCase().includes(input)
    );

    const datalist = document.getElementById('gsd_name_datalist');
    datalist.innerHTML = '';

    filteredGsds.forEach(gsd => {
        const option = document.createElement('option');
        option.value = gsd.gsd_name;
        option.textContent = `${gsd.gsd_name} (SMV: ${gsd.smv})`;
        datalist.appendChild(option);
    });

    document.getElementById('gsd_name').addEventListener('change', function () {
        const selectedName = this.value;
        const selectedGsd = gsds.find(gsd => gsd.gsd_name === selectedName);
        if (selectedGsd) {
            document.getElementById('gsd_id').value = selectedGsd.gsd_code;
            document.getElementById('gsd_smv').textContent = parseFloat(selectedGsd.smv).toFixed(2);
        }
    });
});

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

  // Cycle Time VS SMV by Operation Chart
  const cycleTimeCtx = document.getElementById('cycleTimeChart').getContext('2d');
  new Chart(cycleTimeCtx, {
    type: 'bar',
    data: {
      labels: ['ขัดผิด', 'เช็ด น.', '301 I.L.', '301 S.', '006 I.L.', '301 S.', '301 S.', '305 I.L.', '519 O.L.', '602 I.L.', '301 S.', '301 R.', '1000 O.L.', '301 S.', '301 S.', '301 S.', '301 S.', '301 S.', '301 S.'],
      datasets: [
        {
          label: 'Avg Cycle Time (sec)',
          data: [320, 180, 120, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 48, 45, 43, 40, 38],
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Avg SMV (sec)',
          data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 75, 70, 65, 60, 55, 50],
          type: 'line',
          borderColor: '#0056b3',
          backgroundColor: 'transparent',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Avg Cycle Time (sec)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Avg SMV (sec)'
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      }
    }
  });
});