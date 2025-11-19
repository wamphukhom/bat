const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';

function showLoading() {
  const loadingElement = document.getElementById('loadingOverlay');
  loadingElement.classList.remove('hidden');
}

function hideLoading() {
  const loadingElement = document.getElementById('loadingOverlay');
  setTimeout(() => {
      loadingElement.classList.add('hidden');
  }, 100); // ระยะเวลา transition ใน CSS
}

async function fetchEmployeeData() {
  try {
    showLoading();
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch(`${STRAPI_URL}/api/employees?populate=*`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    hideLoading();
    console.error('Error fetching employee data:', error);
    return [];
  } finally {
    hideLoading();
  }
}

async function fetchGSDData() {
  try {
    showLoading();
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch(`${STRAPI_URL}/api/gsds?populate=*`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GSD data');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    hideLoading();
    console.error('Error fetching GSD data:', error);
    return [];
  } finally {
    hideLoading();
  }
}

async function fetchTrainData(emp_id, gsd_code) {
    console.log(emp_id, gsd_code);
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/trainings?temp_id=${emp_id}&tgsd_code=${gsd_code}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch training data');
        }

        const data = await response.json();
        console.log('data', data);
        return data;
    } catch (error) {
        console.error('Error fetching Train data:', error);
        return [];
    }
}

async function fetchEmployeeTypes() {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/emp-types`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employee types');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching employee types:', error);
        return [];
    }
}

async function fetchEmployeePositions() {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/emp-positions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employee positions');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching employee positions:', error);
        return [];
    }
}