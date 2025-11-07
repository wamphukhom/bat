// main.js - Badminton Club Management System

// JavaScript for navigation between sections
function showSection(sectionName) {
  // Hide all sections
  document.getElementById('hero-section').classList.add('d-none');
  document.getElementById('menu-section').classList.add('d-none');
  document.getElementById('customers-section').classList.add('d-none');
  document.getElementById('bookings-section').classList.add('d-none');
  document.getElementById('pos-section').classList.add('d-none');
  
  // Show the requested section
  if (sectionName === 'hero') {
    document.getElementById('hero-section').classList.remove('d-none');
  } else if (sectionName === 'menu') {
    document.getElementById('menu-section').classList.remove('d-none');
  } else if (sectionName === 'customers') {
    document.getElementById('customers-section').classList.remove('d-none');
  } else if (sectionName === 'bookings') {
    document.getElementById('bookings-section').classList.remove('d-none');
  } else if (sectionName === 'pos') {
    document.getElementById('pos-section').classList.remove('d-none');
  }
}

// Form submission handlers
function handleCustomerForm(event) {
  event.preventDefault();
  // Add customer form logic here
  alert('บันทึกข้อมูลลูกค้าเรียบร้อย');
}

function handleBookingForm(event) {
  event.preventDefault();
  // Add booking form logic here
  alert('บันทึกการจองเรียบร้อย');
}

function handlePOForm(event) {
  event.preventDefault();
  // Add PO form logic here
  alert('บันทึกใบ PO เรียบร้อย');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Event listener for the "Let's get start" button
  document.getElementById('start-btn').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('menu');
  });

  // Add form event listeners
  const customerForm = document.getElementById('customer-form');
  if (customerForm) {
    customerForm.addEventListener('submit', handleCustomerForm);
  }

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingForm);
  }

  const poForm = document.getElementById('po-form');
  if (poForm) {
    poForm.addEventListener('submit', handlePOForm);
  }
});