// Chart Manager - จัดการการแสดงผลกราฟ
class ChartManager {
  constructor() {
    this.chart = null;
  }

  // สร้างข้อมูล Cycle Time แบบสุ่ม
  generateRandomCycleTimeData(smvData) {
    return smvData.map(smv => {
      const variation = Math.random() * 20 - 10; // Random variation between -10 and +10
      return smv + variation;
    });
  }

  // สร้างกราฟ Cycle Time vs SMV
  createCycleTimeChart(canvasId, smvValue = 34.8) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.error(`Canvas element with id '${canvasId}' not found`);
      return null;
    }

    // เริ่มต้นด้วยกราฟว่าง ไม่แสดงแท่งกราฟ
    const emptyLabels = [];
    const emptyCycleTimeData = [];
    const emptySmvData = [];
    
    // ทำลายกราฟเก่าถ้ามี
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: emptyLabels,
        datasets: [
          {
            label: 'Avg Cycle Time (sec)',
            data: emptyCycleTimeData,
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            borderWidth: 1,
            yAxisID: 'y',
            order: 2
          },
          {
            label: `Avg SMV (${smvValue} sec)`,
            data: emptySmvData,
            type: 'line',
            borderColor: '#ff0000',
            backgroundColor: 'transparent',
            borderWidth: 2,
            yAxisID: 'y1',
            order: 1
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
            max: 100, // ค่าเริ่มต้นสำหรับกราฟว่าง
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
            max: 100, // ค่าเริ่มต้นสำหรับกราฟว่าง
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

    return this.chart;
  }

  // อัพเดทข้อมูลกราฟ
  updateChart(newSmvValue, realCycleTimeData = null, realDateLabels = null) {
    if (!this.chart) {
      console.error('Chart not initialized');
      return;
    }

    let cycleTimeData, dateLabels, smvData;
    
    if (realCycleTimeData && realDateLabels) {
      // ใช้ข้อมูลจริงจาก database
      cycleTimeData = realCycleTimeData;
      dateLabels = realDateLabels;
      smvData = Array(cycleTimeData.length).fill(newSmvValue);
    } else {
      // ใช้ข้อมูล default
      smvData = Array(11).fill(newSmvValue);
      cycleTimeData = this.generateRandomCycleTimeData(smvData);
      dateLabels = ['10/11/68', '11/11/68', '12/11/68', '13/11/68', '14/11/68', '15/11/68', '16/11/68', '17/11/68', '18/11/68', '19/11/68', '20/11/68'];
    }

    // อัพเดทข้อมูลในกราฟ
    this.chart.data.labels = dateLabels;
    this.chart.data.datasets[0].data = cycleTimeData;
    this.chart.data.datasets[1].data = smvData;
    this.chart.data.datasets[1].label = `Avg SMV (${newSmvValue} sec)`;
    
    // อัพเดท scale
    this.chart.options.scales.y.max = Math.max(...cycleTimeData) + 10;
    this.chart.options.scales.y1.max = Math.max(...smvData) + 10;
    
    this.chart.update();
  }

  // ซ่อน/แสดงกราฟ
  toggleChart(show = true) {
    const chartContainer = document.querySelector('.chart-card');
    if (chartContainer) {
      chartContainer.style.display = show ? 'block' : 'none';
    }
  }

  // ทำลายกราฟ
  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

// สร้าง instance ของ ChartManager
const chartManager = new ChartManager();

// ฟังก์ชันสำหรับเรียกใช้จากภายนอก
function initializeChart(canvasId = 'cycleTimeChart', smvValue = 34.8) {
  return chartManager.createCycleTimeChart(canvasId, smvValue);
}

function updateChartData(smvValue, cycleTimeData = null, dateLabels = null) {
  chartManager.updateChart(smvValue, cycleTimeData, dateLabels);
}

function toggleChartVisibility(show) {
  chartManager.toggleChart(show);
}

function destroyChart() {
  chartManager.destroyChart();
}