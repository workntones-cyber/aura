/* ══════════════════════════════════════════════════
   AURA - settings.js
   設定画面の制御（settings.html 専用）
   ══════════════════════════════════════════════════ */

let currentMode = 'personal';
let apiKeyVisible = false;

// ── 初期化 ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
});

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const data = await res.json();
    selectMode(data.ai_mode || 'personal', false);
    if (data.groq_api_key) {
      document.getElementById('apiKeyInput').value = data.groq_api_key;
    }
  } catch (e) {
    // 設定未保存の場合はデフォルト値のまま
  }
}

// ── モード選択 ────────────────────────────────────
function selectMode(mode, showNotice = true) {
  currentMode = mode;

  document.getElementById('card-personal').className = 'mode-card';
  document.getElementById('card-business').className = 'mode-card';

  if (mode === 'personal') {
    document.getElementById('card-personal').classList.add('active-personal');
    document.getElementById('businessNotice').classList.remove('visible');
    document.getElementById('groqSection').style.display = 'block';
  } else {
    document.getElementById('card-business').classList.add('active-business');
    if (showNotice) {
      document.getElementById('businessNotice').classList.add('visible');
    }
    document.getElementById('groqSection').style.display = 'none';
  }
}

// ── APIキー表示切替 ───────────────────────────────
function toggleApiKeyVisibility() {
  apiKeyVisible = !apiKeyVisible;
  const input = document.getElementById('apiKeyInput');
  const btn   = document.querySelector('.api-key-toggle');
  input.type  = apiKeyVisible ? 'text' : 'password';
  btn.textContent = apiKeyVisible ? '隠す' : '表示';
}

// ── 設定保存 ──────────────────────────────────────
async function saveSettings() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();

  if (currentMode === 'personal' && !apiKey) {
    showToast('❌ Groq APIキーを入力してください');
    return;
  }

  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ai_mode: currentMode,
      groq_api_key: apiKey,
    }),
  });

  const data = await res.json();
  if (data.status === 'saved') {
    const btn = document.getElementById('saveBtn');
    btn.textContent = '✓ 保存しました';
    btn.classList.add('saved');
    setTimeout(() => {
      btn.textContent = '設定を保存';
      btn.classList.remove('saved');
    }, 2000);
    showToast('✅ 設定を保存しました');
  } else {
    showToast('❌ 保存に失敗しました');
  }
}

// ── ユーティリティ ────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── 全削除モーダル ────────────────────────────────
function confirmDeleteAll() {
  document.getElementById('deleteModal').classList.add('visible');
}

function closeModal() {
  document.getElementById('deleteModal').classList.remove('visible');
}

async function deleteAll() {
  closeModal();

  try {
    const res  = await fetch('/api/recordings/all', { method: 'DELETE' });
    const data = await res.json();
    if (data.status === 'deleted') {
      showToast(`🗑️ ${data.count}件のデータを削除しました`);
    } else {
      showToast('❌ ' + (data.message || '削除に失敗しました'));
    }
  } catch (e) {
    showToast('❌ ネットワークエラーが発生しました');
  }
}

// モーダル外クリックで閉じる
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('deleteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
});
