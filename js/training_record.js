let theadId = 0;

document.addEventListener('DOMContentLoaded', () => {
  initializeChart('cycleTimeChart', parseFloat(document.getElementById('gsd_smv').textContent)*60 || 0);
});

document.getElementById('emp_name').addEventListener('input', async function () {
  const input = this.value.toLowerCase();
  const employees_data = await fetchEmployeeData();

  const employees = employees_data.map(employee => ({
        id: employee.id,
        emp_id: employee.Emp_id,
        emp_name: employee.Emp_name,
        emp_position: employee.Emp_position?.Epo_name
    }));

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
    const gsds_data = await fetchGSDData();

    const gsds = gsds_data.map(gsd => ({
        id: gsd.id,
        gsd_code: gsd.GSD_code,
        gsd_style: gsd.GSD_style,
        gsd_protype: gsd.GSD_protype,
        gsd_customer: gsd.GSD_customer,
        gsd_name: gsd.GSD_name,
        smv: gsd.GSD_SMV
    }));

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

    document.getElementById('gsd_name').addEventListener('change', async function () {
        const selectedName = this.value;
        const selectedGsd = gsds.find(gsd => gsd.gsd_name === selectedName);
        if (selectedGsd) {
            document.getElementById('gsd_id').value = selectedGsd.gsd_code;
            document.getElementById('gsd_smv').textContent = parseFloat(selectedGsd.smv).toFixed(2);
            document.getElementById('productType').value = selectedGsd.gsd_protype || '';
            document.getElementById('style').value = selectedGsd.gsd_style || '';
            document.getElementById('customer').value = selectedGsd.gsd_customer || '';

            const trainData = await fetchTrainData(document.getElementById('emp_id').value, selectedGsd.gsd_code);
            if (trainData && trainData.data && trainData.data.length > 0) {
                const latestTrain = trainData.data[0];
                document.getElementById('productType').value = latestTrain.Ttype.Ptype_name || '';
                document.getElementById('style').value = latestTrain.Tstyle || '';
                document.getElementById('customer').value = latestTrain.Tcustomer.Cus_name || '';
                document.getElementById('quality').value = latestTrain.Tquality || '';
                // document.getElementById('cycleTimeMin').value = latestTrain.Tcycle_time || '';
                document.getElementById('performance').value = latestTrain.Tperformance || '';

                theadId = latestTrain.documentId;
            }
        }
    });
});

document.getElementById('search-employee-button').addEventListener('click', async () => {
  const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
  employeeModal.show();

  const modalBody = document.getElementById('employee-modal-body');
  let table = modalBody.querySelector('table');

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
    const employees = await fetchEmployeeData();
    tableBody.innerHTML = '';

    if (employees && employees.length > 0) {
      employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${employee.Emp_name}</td>
          <td><img src="${employee.Emp_img?.formats?.thumbnail?.url || employee.Emp_img?.url || 'img/avatar.jpg'}" alt="Avatar" style="max-height: 50px;"></td>
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

document.getElementById('add-employee-button').addEventListener('click', () => {
  const inputFields = document.querySelectorAll('input');
  inputFields.forEach(input => input.value = '');

  document.getElementById('emp_name_datalist').innerHTML = '';
  document.getElementById('gsd_name_datalist').innerHTML = '';
  document.getElementById('gsd_smv').textContent = '';
});

document.getElementById('show-chart-button').addEventListener('click', async () => {
  if (theadId === 0) {
    alert('กรุณาเลือกพนักงานและ GSD ก่อน');
    return;
  }

  try {
    const trainingDetails = await fetchTrainingDetails(theadId);
    
    if (trainingDetails && trainingDetails.length > 0) {
      const sortedDetails = trainingDetails.sort((a, b) => new Date(a.Tdtl_date) - new Date(b.Tdtl_date));
      const validCycleTimes = trainingDetails.map(detail => detail.Tdtl_amv || 0).filter(time => time > 0);
      const minCycleTime = validCycleTimes.length > 0 ? Math.min(...validCycleTimes) : 0;
      const cycleTimeData = sortedDetails.map(detail => detail.Tdtl_amv || 0);
      const dateLabels = sortedDetails.map(detail => {
        const date = new Date(detail.Tdtl_date);
        return `${date.getDate()}/${date.getMonth() + 1}/${(date.getFullYear() + 543).toString().slice(-2)}`;
      });
      const smvValue = parseFloat(document.getElementById('gsd_smv').textContent)*60 || 0;
      
      if (cycleTimeData.length > 0) {
        updateChartData(smvValue, cycleTimeData, dateLabels);
      }

      // อัพเดท Tcycle_time ใน training record ถ้า minCycleTime > 0
      if (minCycleTime > 0) {
        try {
          await updateTrainingCycleTime(theadId, minCycleTime);
        } catch (error) {
          console.error('Error updating training cycle time:', error);
        }
      }
    } else {
      alert('ไม่พบข้อมูลรายละเอียดการฝึกอบรม');
    }
  } catch (error) {
    console.error('Error loading training details:', error);
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
  }
});

document.getElementById('save-cycle-time-button').addEventListener('click', async () => {
  if (theadId === 0) {
      alert('กรุณาเลือกพนักงานและ GSD ก่อน');
    return;
  }

  const cycleTimeValue = document.getElementById('cycleTimeMin').value;
  if (!cycleTimeValue || cycleTimeValue <= 0) {
    alert('กรุณาใส่ค่า Cycle Time ที่ถูกต้อง');
    return;
  }

  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    showLoading();
    
    const existingData = await fetchTrainingDetailsByDate(theadId, currentDate);
    const todayRecord = existingData.data?.find(record => {
      const recordDate = record.attributes?.Tdtl_date || record.Tdtl_date;
      return recordDate === currentDate;
    });
    
    if (todayRecord) {
      await updateTrainingDetail(todayRecord.documentId, parseFloat(cycleTimeValue));
    } else {
      await createTrainingDetail(theadId, currentDate, parseFloat(cycleTimeValue));
    }
    
    alert('บันทึก Cycle Time เรียบร้อยแล้ว');
    document.getElementById('cycleTimeMin').value = '';
    
  } catch (error) {
    console.error('Error saving cycle time:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
  } finally {
    hideLoading();
  }
});

document.getElementById('save-training-button').addEventListener('click', async () => {
  // ดึงข้อมูลจากฟอร์ม
  const emp_id = document.getElementById('emp_id').value;
  const gsd_id = document.getElementById('gsd_id').value;
  const productType = document.getElementById('productType').value;
  const customer = document.getElementById('customer').value;
  const quality = document.getElementById('quality').value;
  const performance = document.getElementById('performance').value;
  const style = document.getElementById('style').value;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!emp_id) {
    alert('กรุณาเลือกพนักงาน');
    return;
  }
  if (!gsd_id) {
    alert('กรุณาเลือก GSD');
    return;
  }

  try {
    showLoading();
    const result = await saveTrainingData(emp_id, gsd_id, productType, customer, quality, performance, style);
    
    if (result.action === 'created') {
      alert('สร้างข้อมูลการฝึกอบรมใหม่เรียบร้อยแล้ว');
      // อัพเดท theadId ด้วยข้อมูลใหม่
      theadId = result.data.data.documentId;
    } else if (result.action === 'updated') {
      alert('อัพเดทข้อมูลการฝึกอบรมเรียบร้อยแล้ว');
    }
    
  } catch (error) {
    console.error('Error saving training data:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
  } finally {
    hideLoading();
  }
});