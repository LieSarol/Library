// This can stay empty unless you want to handle push events later.
// But it's needed to make showNotification() legal.
self.addEventListener('install', () => {
  console.log('📦 Service Worker installed.');
});
