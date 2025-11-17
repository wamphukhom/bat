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