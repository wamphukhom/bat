const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';
const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

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

async function saveTrainingData(emp_id, gsd_id, productType, customer, quality, performance, style) {
    console.log('Saving training data:', { emp_id, gsd_id, productType, customer, quality, performance, style });
    try {
        // ค้นหาข้อมูลที่มีอยู่แล้ว
        const existingResponse = await fetch(`${STRAPI_URL}/api/trainings?filters[Temp_id][Emp_id][$eq]=${emp_id}&filters[Tgsd_id][GSD_code][$eq]=${gsd_id}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        if (!existingResponse.ok) {
            throw new Error('Failed to check existing training data');
        }

        const existingData = await existingResponse.json();
        console.log('Existing training data:', existingData);

        if (existingData.data && existingData.data.length > 0) {
            // อัพเดทข้อมูลที่มีอยู่แล้ว
            const existingRecord = existingData.data[0];
            console.log('Updating existing training record ID:', existingRecord.documentId);
            
            const updateResponse = await fetch(`${STRAPI_URL}/api/trainings/${existingRecord.documentId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        Tquality: quality,
                        Tperformance: performance,
                        Tstyle: style
                    }
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update training data');
            }

            const updateData = await updateResponse.json();
            console.log('Updated training data:', updateData);
            return { action: 'updated', data: updateData };
        } else {
            // สร้างข้อมูลใหม่
            console.log('Creating new training record', emp_id, gsd_id, productType, customer);
            
            // ค้นหา employee และ GSD data เพื่อได้ relation IDs
            const [employeeData, gsdData, productTypeData, customerData] = await Promise.all([
                fetch(`${STRAPI_URL}/api/employees?filters[Emp_id][$eq]=${emp_id}`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                }).then(res => res.json()),
                fetch(`${STRAPI_URL}/api/gsds?filters[GSD_code][$eq]=${gsd_id}`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                }).then(res => res.json()),
                fetch(`${STRAPI_URL}/api/pro-types?filters[Ptype_name][$eq]=${productType}`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                }).then(res => res.json()),
                fetch(`${STRAPI_URL}/api/customers?filters[Cus_name][$eq]=${customer}`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                }).then(res => res.json())

            ]);

            console.log('Employee data for relation:', employeeData);
            console.log('GSD data for relation:', gsdData);

            if (!employeeData.data?.length || !gsdData.data?.length) {
                throw new Error('Employee or GSD not found for creating training record');
            }

            const employeeDocId = employeeData.data[0].documentId;
            const gsdDocId = gsdData.data[0].documentId;
            const productTypeDocId = productTypeData.data[0].documentId;
            const customerDocId = customerData.data[0].documentId;

            const createPayload = {
                data: {
                    Temp_id: employeeDocId,  // ใช้ documentId แทน Emp_id
                    Tgsd_id: gsdDocId,       // ใช้ documentId แทน GSD_code
                    Tquality: quality || '',
                    Tperformance: performance || '',
                    Tstyle: style || '',
                    Ttype: productTypeDocId || '',
                    Tcustomer: customerDocId || ''
                }
            };

            console.log('Create payload:', JSON.stringify(createPayload, null, 2));
            
            const createResponse = await fetch(`${STRAPI_URL}/api/trainings`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createPayload)
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                console.error('Create training error response:', errorText);
                throw new Error(`Failed to create training data: ${errorText}`);
            }

            const createData = await createResponse.json();
            console.log('Created training data:', createData);
            return { action: 'created', data: createData };
        }
    } catch (error) {
        console.error('Error saving training data:', error);
        throw error;
    }
}