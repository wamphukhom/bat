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
    console.log(data.data);
    const employees = data.data.map(employee => ({
        id: employee.id,
        emp_id: employee.Emp_id,
        emp_name: employee.Emp_name,
        emp_position: employee.Emp_position?.Epo_name
    }));

    console.log('Fetched employees:', employees);
    return employees;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
}

// Example usage: Fetch and log employee data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const employees = await fetchEmployeeData();
});