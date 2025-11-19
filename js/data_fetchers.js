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
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/trainings?filters[Temp_id][Emp_id][$eq]=${emp_id}&filters[Tgsd_id][GSD_code][$eq]=${gsd_code}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch training data');
        }

        const data = await response.json();
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

async function fetchTrainingDetails(training_id) {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/training-dtls?filters[Thead_id][$eq]=${training_id}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch training details');
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching training details:', error);
        return [];
    }
}

async function fetchTrainingDetailsByDate(training_id, date) {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const searchResponse = await fetch(`${STRAPI_URL}/api/training-dtls?filters[Thead_id][$eq]=${training_id}&filters[Tdtl_date][$eq]=${date}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        if (!searchResponse.ok) {
            throw new Error('Failed to search training details');
        }

        const searchData = await searchResponse.json();
        console.log('Training details by date data:', searchData);
        return searchData;
                
    } catch (error) {
        console.error('Error fetching training details by date:', error);
        throw error;
    }
}

async function createTrainingDetail(training_id, date, cycle_time) {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

        const response = await fetch(`${STRAPI_URL}/api/training-dtls`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    Thead_id: training_id,
                    Tdtl_date: date,
                    Tdtl_amv: cycle_time
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create training detail');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating training detail:', error);
        throw error;
    }
}

async function updateTrainingDetail(record_id, cycle_time) {
    try {
        const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
        
        const response = await fetch(`${STRAPI_URL}/api/training-dtls/${record_id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    Tdtl_amv: cycle_time
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update training detail');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating training detail:', error);
        throw error;
    }
}