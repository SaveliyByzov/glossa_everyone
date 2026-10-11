// Настройки облачной синхронизации (см. docs/SYNC.md).
// endpoint — адрес развёрнутого Cloudflare Worker, например 'https://glossa-sync.<аккаунт>.workers.dev'.
// Пока endpoint пуст, облачная синхронизация скрыта; офлайн-способы (файл, код переноса) работают всегда.
export default {
  endpoint: 'https://glossa-sync.glossa-788695.workers.dev',
  app: 'srpski',     // пространство имён на сервере: 'glossa' | 'srpski'
};
