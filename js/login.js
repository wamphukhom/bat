const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

async function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com';
  const url = `${STRAPI_URL}/api/auth/local`;

  const loginButton = document.getElementById('login-button');
  loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังโหลด...';
  loginButton.disabled = true;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    const data = await response.json();
    setCookie('jwt', data.jwt, 7);
    window.location.href = 'main.html';
  } catch (error) {
    console.error('Error during login:', error);
    alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  } finally {
    loginButton.innerHTML = 'เข้าสู่ระบบ';
    loginButton.disabled = false;
  }
}

const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', handleLogin);