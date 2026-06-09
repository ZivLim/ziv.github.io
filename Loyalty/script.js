/* ========= COMMON HELPERS ========= */
const REDIRECT_LOGIN = 'index.html';
const REDIRECT_HOME = 'home.html';

function requireAuth() {
  const user = localStorage.getItem('user');
  if (!user) window.location.href = REDIRECT_LOGIN;
  return user;
}

function signIn(username) {
  localStorage.setItem('user', username);
  // 初始化积分（若没有）
  if (!localStorage.getItem('points')) {
    localStorage.setItem('points', '950'); // 默认初始分
  }
}

function signOut() {
  localStorage.removeItem('user');
  // 保留积分或清除由你决定，这里保留
  window.location.href = REDIRECT_LOGIN;
}

function getPoints() {
  return parseInt(localStorage.getItem('points') || '0', 10);
}

function setPoints(value) {
  const v = Math.max(0, parseInt(value, 10) || 0);
  localStorage.setItem('points', String(v));
  return v;
}

/* ========= LOGIN PAGE ========= */
function handleLoginSubmit(e) {
  e?.preventDefault?.();
  const u = document.getElementById('username')?.value.trim();
  const p = document.getElementById('password')?.value.trim();

  if (!u || !p) {
    alert('Please enter username and password.');
    return;
  }
  // 简单示例：任何用户/密码都允许登录。需要可替换实际验证。
  signIn(u);
  window.location.href = REDIRECT_HOME;
}

/* ========= HOME PAGE (POINTS) ========= */
function renderHome() {
  const user = requireAuth();
  const points = getPoints();

  const nameSlot = document.getElementById('welcomeName');
  if (nameSlot) nameSlot.textContent = user;

  const pointsEl = document.getElementById('pointsValue');
  const tierBadge = document.getElementById('tierBadge');
  const nextTierEl = document.getElementById('nextTier');
  const bar = document.getElementById('progressBar');

  if (pointsEl) pointsEl.textContent = points.toLocaleString();
  if (tierBadge) tierBadge.textContent = getTier(points);
  const next = nextTierAt(points);
  if (nextTierEl) nextTierEl.textContent = next.toLocaleString();

  const pct = Math.min(99, (points / next) * 100);
  if (bar) bar.style.width = pct + '%';
}

function getTier(pts) {
  if (pts >= 3000) return 'Platinum';
  if (pts >= 2000) return 'Gold';
  if (pts >= 1000) return 'Silver';
  return 'Member';
}
function nextTierAt(pts) {
  if (pts < 1000) return 1000;
  if (pts < 2000) return 2000;
  if (pts < 3000) return 3000;
  return pts + 1000;
}

/* ========= REDEEM PAGE ========= */
function initRedeem() {
  requireAuth();
  const list = document.querySelectorAll('[data-redeem]');
  list.forEach(btn => {
    btn.addEventListener('click', () => {
      const cost = parseInt(btn.getAttribute('data-cost') || '0', 10);
      handleRedeem(cost);
    });
  });
  // 首次渲染积分显示
  renderRedeemPoints();
}

function renderRedeemPoints() {
  const points = getPoints();
  const el = document.getElementById('redeemPoints');
  if (el) el.textContent = points.toLocaleString();
}

function handleRedeem(cost) {
  const current = getPoints();
  if (current < cost) {
    alert('❌ Not enough points.');
    return;
  }
  const next = setPoints(current - cost);
  alert('✅ Redeemed successfully!');
  renderRedeemPoints();
}

/* ========= SETTINGS PAGE ========= */
function initSettings() {
  const user = requireAuth();
  const accountName = document.getElementById('accountName');
  if (accountName) accountName.textContent = user;

  const addressText = document.getElementById('addressText');
  const savedAddress = localStorage.getItem('address') || '';
  if (addressText) addressText.textContent = savedAddress || 'Add your delivery address';

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', signOut);

  const editBtn = document.getElementById('editAddressBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const cur = localStorage.getItem('address') || '';
      const val = prompt('Enter your delivery address:', cur);
      if (val !== null) {
        localStorage.setItem('address', val.trim());
        if (addressText) addressText.textContent = val.trim() || 'Add your delivery address';
      }
    });
  }

  const fbBtn = document.getElementById('sendFbBtn');
  if (fbBtn) {
    fbBtn.addEventListener('click', () => {
      const ta = document.getElementById('feedback');
      const txt = ta?.value.trim();
      if (!txt) { alert('Please write some feedback first.'); return; }
      ta.value = '';
      alert('Thanks for your feedback!');
    });
  }
}
