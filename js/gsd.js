let gsdTable;

async function fetchTrainingData() {
  try {
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
    const response = await fetch(`${STRAPI_URL}/api/trainings?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch training data');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching training data:', error);
    return [];
  }
}

async function initializeDataTable() {
  const gsdData = await fetchGSDData();
  const trainingData = await fetchTrainingData();

  // สร้าง map เพื่อหา cycle time ที่ดีที่สุดของแต่ละ GSD
  const bestCycleTimeMap = new Map();
  
  trainingData.forEach(training => {
    if (training.Tcycle_time && training.Tcycle_time > 0) {
      const gsdCode = training.Tgsd_id?.GSD_code;
      const employeeName = training.Temp_id?.Emp_name;
      const cycleTime = training.Tcycle_time;
      
      if (gsdCode) {
        const existing = bestCycleTimeMap.get(gsdCode);
        if (!existing || cycleTime < existing.cycleTime) {
          bestCycleTimeMap.set(gsdCode, {
            cycleTime: cycleTime,
            employeeName: employeeName || 'ไม่ระบุ'
          });
        }
      }
    }
  });

  const tableData = gsdData.map((item, index) => {
    const bestData = bestCycleTimeMap.get(item.GSD_code);
    
    return [
      index + 1,
      item.GSD_code || '-',
      item.GSD_name || '-',
      item.GSD_grade || '-',
      item.GSD_SMV || '-',
      (item.GSD_SMV || 0) * 60,
      item.GSD_protype || '-',
      item.GSD_style || '-',
      item.GSD_customer || '-',
      bestData ? bestData.employeeName : '-',
      bestData ? bestData.cycleTime.toFixed(2) : '-'
    ];
  });

  gsdTable = $('#gsd-table').DataTable({
    data: tableData,
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json',
      emptyTable: 'ไม่มีข้อมูลในตาราง',
      info: 'แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ',
      infoEmpty: 'แสดง 0 ถึง 0 จาก 0 รายการ',
      infoFiltered: '(กรองจากทั้งหมด _MAX_ รายการ)',
      lengthMenu: 'แสดง _MENU_ รายการ',
      loadingRecords: 'กำลังโหลด...',
      processing: 'กำลังประมวลผล...',
      search: 'ค้นหา:',
      zeroRecords: 'ไม่พบข้อมูลที่ค้นหา',
      paginate: {
        first: 'หน้าแรก',
        last: 'หน้าสุดท้าย',
        next: 'ถัดไป',
        previous: 'ก่อนหน้า'
      }
    },
    pageLength: 10,
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'ทั้งหมด']],
    responsive: true,
    order: [[0, 'asc']],
    columnDefs: [
      {
        targets: 0,
        width: '50px',
        className: 'text-center'
      },
      {
        targets: [1, 2],
        className: 'text-nowrap'
      }
    ]
  });
}

function initializeApp() {
  const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
  
  if (!jwt) {
    window.location.href = 'login.html';
    return;
  }

  initializeDataTable();
}

document.addEventListener('DOMContentLoaded', initializeApp);