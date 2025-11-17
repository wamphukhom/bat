const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';
const GSD_ENDPOINT = 'gsds';

let gsdTable;

async function fetchGSDData() {
  try {
    showLoading();
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];

    const response = await fetch(`${STRAPI_URL}/api/${GSD_ENDPOINT}?populate=*`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching GSD data:', error);
    return [];
  } finally {
    hideLoading();
  }
}

async function initializeDataTable() {
  const gsdData = await fetchGSDData();

  const tableData = gsdData.map((item, index) => {
    return [
      index + 1,
      item.GSD_code || '-',
      item.GSD_name || '-',
      item.GSD_grade || '-',
      item.GSD_SMV || '-',
      (item.GSD_SMV || 0) * 60,
      item.GSD_protype || '-',
      item.GSD_style || '-',
      item.GSD_customer || '-'
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