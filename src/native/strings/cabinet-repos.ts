import { defineStrings } from '../i18n.ts'

/** Repositories: the list with the sync state per branch, add, remove. */
export const S = defineStrings({
  'repos.count': { ru: 'репозиториев: {n}', en: 'repositories: {n}' },
  'repos.explainer': {
    ru: 'Сравниваем ваш исходный репозиторий каждого модуля с нашей рабочей копией и показываем расхождения по веткам. «Синхронизировать» переносит изменения к нам: в ваш репозиторий ничего не отправляется.',
    en: 'We compare your upstream repository of each module with our working copy and show the drift per branch. “Sync” brings the changes to us: nothing is pushed to your repository.',
  },
  'repos.refresh': { ru: 'Обновить состояние', en: 'Refresh the state' },
  'repos.syncAll': { ru: 'Синхронизировать все ({n})', en: 'Sync all ({n})' },
  'repos.nothingToSync': { ru: 'Нечего синхронизировать', en: 'Nothing to sync' },
  'repos.add': { ru: 'Добавить репозиторий', en: 'Add a repository' },
  'repos.error': {
    ru: 'Не удалось загрузить состояние репозиториев',
    en: 'Could not load the repository state',
  },
  'repos.empty': {
    ru: 'У проекта нет исходных репозиториев.',
    en: 'The project has no upstream repositories.',
  },
  'repos.tokensWhere': {
    ru: 'Токены задаются в кабинете: «Настройки» → «Доступы к репозиториям».',
    en: 'Tokens are set in the cabinet: Settings → Repository access.',
  },
  'repos.tokenBanner': {
    ru: 'Токены заданы для {x} из {y} репозиториев — без токена статусы и синхронизация недоступны.',
    en: 'Tokens are set for {x} of {y} repositories — without a token statuses and sync are unavailable.',
  },
  'repos.addTokens': { ru: 'Добавить токены', en: 'Add tokens' },
  'repos.noUpstream': { ru: 'нет исходного репозитория', en: 'no upstream' },
  'repos.inSync': { ru: 'всё в синхроне', en: 'all in sync' },
  'repos.drift': { ru: 'расхождений: {n}', en: 'drift: {n}' },
  'repos.check': { ru: 'Проверить', en: 'Check' },
  'repos.sync': { ru: 'Синхронизировать', en: 'Sync' },
  'repos.remove': { ru: 'Убрать репозиторий', en: 'Remove the repository' },
  'repos.removeTitle': { ru: 'Убрать репозиторий «{name}»?', en: 'Remove repository “{name}”?' },
  'repos.removeText': {
    ru: 'Рабочая копия и её ветки задач будут удалены из установки. Ваш исходный репозиторий не изменится.',
    en: 'The working copy and its task branches are removed from the install. Your upstream repository is untouched.',
  },
  'repos.pointerBehind': {
    ru: 'Проект ссылается на устаревшую версию модуля — отстаёт на {n} (ветка {branch}); синхронизация обновит ссылку',
    en: 'The project points to an old module version — {n} behind (branch {branch}); sync updates the pointer',
  },
  'repos.pointerInSync': {
    ru: 'Проект ссылается на актуальную версию модуля',
    en: 'The project points to the current module version',
  },
  'repos.pointerUnknown': {
    ru: 'Версия модуля в проекте: статус неизвестен',
    en: 'Module version in the project: unknown',
  },
  'repos.internal': {
    ru: 'Внутренний репозиторий — синхронизировать не с чем.',
    en: 'An internal repository — nothing to sync with.',
  },
  'repos.needToken': {
    ru: 'Ветки исходного репозитория недоступны без токена.',
    en: 'Upstream branches are unavailable without a token.',
  },
  'repos.noBranches': {
    ru: 'Веток в исходном репозитории не найдено.',
    en: 'No branches found upstream.',
  },
  'repos.bInsync': { ru: 'в синхроне', en: 'in sync' },
  'repos.bBehind': { ru: 'отстаёт на {n}', en: '{n} behind' },
  'repos.bMissing': { ru: 'новая в исходном', en: 'new upstream' },
  'repos.bAhead': { ru: 'опережает на {n}', en: '{n} ahead' },
  'repos.bDiverged': { ru: 'расхождение +{a}/−{b}', en: 'diverged +{a}/−{b}' },
  'repos.bUnknown': { ru: 'неизвестно', en: 'unknown' },
  'repos.default': { ru: 'по умолчанию', en: 'default' },
  'repos.syncing': { ru: 'синхронизация…', en: 'syncing…' },
  'repos.holdsTitle': {
    ru: 'Инструменты разработки — отложенные изменения',
    en: 'Development tools — deferred changes',
  },
  'repos.holdTask': { ru: 'Задача #{n}', en: 'Task #{n}' },
  'repos.hAwaiting': {
    ru: 'ожидает принятия в вашем репозитории ({m}/{t})',
    en: 'awaits acceptance in your repository ({m}/{t})',
  },
  'repos.hReady': { ru: 'готово к слиянию', en: 'ready to merge' },
  'repos.hMerging': {
    ru: 'слияние в инструменты разработки…',
    en: 'merging into the development tools…',
  },
  'repos.hConflict': {
    ru: 'конфликт слияния — будет повторено',
    en: 'merge conflict — will be retried',
  },
  'repos.hMerged': {
    ru: 'влито в инструменты разработки',
    en: 'merged into the development tools',
  },
  'repos.accepted': { ru: 'принято', en: 'accepted' },
  'repos.pending': { ru: 'ожидает', en: 'pending' },
  'repos.url': { ru: 'HTTPS-адрес репозитория', en: 'Repository HTTPS address' },
  'repos.urlError': {
    ru: 'Нужен HTTPS-адрес с путём owner/project (ssh не поддерживается).',
    en: 'An HTTPS address with an owner/project path is needed (ssh is not supported).',
  },
  'repos.name': {
    ru: 'Имя в рабочей копии (необязательно — иначе из URL)',
    en: 'Name in the working copy (optional — else from the URL)',
  },
  'repos.token': {
    ru: 'Токен для приватного источника (необязательно)',
    en: 'Token for a private source (optional)',
  },
  'repos.tokenPlaceholder': {
    ru: 'GitLab PAT со scope read_repository',
    en: 'GitLab PAT with the read_repository scope',
  },
  'repos.createDev': {
    ru: 'Сразу создать проект разработки из ветки по умолчанию',
    en: 'Create a development project from the default branch right away',
  },
  'repos.createDevHint': {
    ru: 'После импорта откроется этот проект.',
    en: 'That project opens after the import.',
  },
  'repos.devName': { ru: 'Имя проекта разработки', en: 'Development project name' },
  'repos.import': { ru: 'Импортировать', en: 'Import' },
  'repos.importing': { ru: 'Импортируется…', en: 'Importing…' },
  'repos.importingHint': {
    ru: 'Импорт может занять несколько минут. Можно закрыть — он продолжится в фоне.',
    en: 'The import may take a few minutes. You may close — it continues in the background.',
  },
})
