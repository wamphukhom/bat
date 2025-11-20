document.addEventListener('DOMContentLoaded', function() {
  initializeCharts();
});

function initializeCharts() {
  const trainerCtx = document.getElementById('trainerPerformanceChart').getContext('2d');
  new Chart(trainerCtx, {
    type: 'bar',
    data: {
      labels: ['เจียม วงศ์แดง', 'ชนานันท์ จันเย็น'],
      datasets: [{
        label: 'Avg Performance',
        data: [75, 63],
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 80
        }
      }
    }
  });

  // Avg Performance by Skills Grade (Donut Chart)
  const skillsCtx = document.getElementById('skillsGradeChart').getContext('2d');
  new Chart(skillsCtx, {
    type: 'doughnut',
    data: {
      labels: ['D', 'B', 'A'],
      datasets: [{
        data: [37.48, 32.65, 29.88],
        backgroundColor: ['#007bff', '#0056b3', '#ff6347'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
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
}

// Filter event listeners (to be implemented based on actual data source)
document.getElementById('trainDateStart').addEventListener('change', function() {
  console.log('Start date changed:', this.value);
  // Implement filtering logic
});

document.getElementById('trainDateEnd').addEventListener('change', function() {
  console.log('End date changed:', this.value);
  // Implement filtering logic
});
