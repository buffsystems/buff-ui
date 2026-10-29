import { defineStrings } from '../i18n.ts'

/** Development: the task detail — tabs, gate, controls, changes, tests, history, create. */
export const S = defineStrings({
  'devd.tabDetails': { ru: 'Детали', en: 'Details' },
  'devd.tabSubtasks': { ru: 'Подзадачи', en: 'Subtasks' },
  'devd.tabChanges': { ru: 'Изменения', en: 'Changes' },
  'devd.tabTests': { ru: 'Тесты', en: 'Tests' },
  'devd.tabHistory': { ru: 'История', en: 'History' },
  'devd.tabMetrics': { ru: 'Метрики', en: 'Metrics' },
  'devd.notFound': { ru: 'Задача #{n} не найдена', en: 'Task #{n} not found' },
  'devd.notFoundText': {
    ru: 'Возможно, она была удалена, или номер в ссылке неверный.',
    en: 'It may have been deleted, or the number in the link is wrong.',
  },
  'devd.toList': { ru: 'К списку задач', en: 'To the task list' },
  'devd.toReview': { ru: 'Перейти к ревью', en: 'Go to review' },
  'devd.reviewHistory': {
    ru: 'Замечания и обсуждения ревью',
    en: 'Review findings and discussions',
  },
  'devd.actions': { ru: 'Действия', en: 'Actions' },
  'devd.stPaused': {
    ru: 'На паузе — работа остановлена. «Продолжить» поднимет её с того же места.',
    en: 'Paused — work is stopped. “Continue” picks it up from the same place.',
  },
  'devd.stRunning': {
    ru: 'Идёт проработка — аналитик формулирует задачу…',
    en: 'In progress — the analyst is formulating the task…',
  },
  'devd.stClarify': {
    ru: 'Аналитик задал уточняющие вопросы.',
    en: 'The analyst asked clarifying questions.',
  },
  'devd.stGate': {
    ru: 'Формулировка готова и ждёт решения.',
    en: 'The formulation is ready for a decision.',
  },
  'devd.stDecomposing': {
    ru: 'Формулировка утверждена — идёт декомпозиция на подзадачи…',
    en: 'Formulation approved — decomposing into subtasks…',
  },
  'devd.stPreparing': {
    ru: 'Идёт подготовка к разработке: эталонный прогон тестов…',
    en: 'Preparing for development: the baseline test run…',
  },
  'devd.stImplementing': { ru: 'Идёт разработка подзадач…', en: 'Developing the subtasks…' },
  'devd.stReview': { ru: 'На ревью — ждёт вашей проверки.', en: 'In review — awaits your check.' },
  'devd.stDone': {
    ru: 'Разработка завершена — все подзадачи выполнены.',
    en: 'Development finished — every subtask is done.',
  },
  'devd.stIdle': {
    ru: 'Задача декомпозирована — разработка ещё не запущена.',
    en: 'The task is decomposed — development has not started.',
  },
  'devd.stepSync': {
    ru: 'Все подзадачи готовы — синхронизация с основной веткой…',
    en: 'All subtasks done — syncing with the main branch…',
  },
  'devd.stepConflicts': {
    ru: 'Все подзадачи готовы — ИИ разрешает конфликты с основной веткой…',
    en: 'All subtasks done — the AI resolves conflicts with the main branch…',
  },
  'devd.stepAcceptance': {
    ru: 'Приёмка задачи: прогон тестов на чистой копии…',
    en: 'Acceptance: running the tests on a clean copy…',
  },
  'devd.stepOpenPrs': {
    ru: 'Открываем pull request задачи…',
    en: 'Opening the task’s pull request…',
  },
  'devd.stepRework': {
    ru: 'Приёмка не прошла — готовится доработка…',
    en: 'Acceptance failed — preparing the rework…',
  },
  'devd.stepOf': { ru: 'на этом шаге {elapsed}', en: '{elapsed} on this step' },
  'devd.subtasksLine': {
    ru: 'Подзадачи: {done} из {total} выполнено',
    en: 'Subtasks: {done} of {total} done',
  },
  'devd.now': { ru: 'Сейчас', en: 'Now' },
  'devd.nowParallel': { ru: 'Сейчас параллельно ({n}):', en: 'Now in parallel ({n}):' },
  'devd.holdTitle': {
    ru: 'Задача одобрена — изменения ожидают принятия в вашем репозитории ({merged}/{total})',
    en: 'Task approved — changes await acceptance in your repository ({merged}/{total})',
  },
  'devd.holdNote': {
    ru: 'После мержа и синхронизации всех PR изменения в инструментах разработки будут влиты автоматически. Прогресс — в разделе «Репозитории».',
    en: 'Once every PR is merged and synced, the development-tool changes merge automatically. Progress is in “Repositories”.',
  },
  'devd.postanovka': { ru: 'Исходная постановка', en: 'Original statement' },
  'devd.attachmentsN': { ru: 'Вложений: {n}', en: 'Attachments: {n}' },
  'devd.devprepTitle': {
    ru: 'Подготовка инструментов разработки',
    en: 'Development tools preparation',
  },
  'devd.none': { ru: 'пока нет', en: 'none yet' },
  'devd.clarifications': { ru: 'Уточнения', en: 'Clarifications' },
  'devd.clarificationsNote': {
    ru: 'вопросов перед формулировкой: {n}',
    en: 'questions before the formulation: {n}',
  },
  'devd.noAnswer': { ru: 'нет ответа', en: 'no answer' },
  'devd.finalFormulation': { ru: 'Финальная формулировка', en: 'Final formulation' },
  'devd.currentFormulation': { ru: 'Текущая формулировка', en: 'Current formulation' },
  'devd.decompositionReport': { ru: 'Отчёт о декомпозиции', en: 'Decomposition report' },
  'devd.gateTitle': {
    ru: 'Формулировка готова — ваше решение',
    en: 'The formulation is ready — your decision',
  },
  'devd.approve': { ru: 'Утвердить', en: 'Approve' },
  'devd.baselineTitle': {
    ru: 'Сломанные тесты — нужно решение',
    en: 'Broken tests — a decision is needed',
  },
  'devd.baselineDefault': {
    ru: 'Мы нашли тесты, которые не работали ещё до этой задачи.',
    en: 'We found tests that were already failing before this task.',
  },
  'devd.baselineIgnoreTask': { ru: 'Игнорировать на задачу', en: 'Ignore for this task' },
  'devd.baselinePermanent': { ru: 'В постоянный игнор', en: 'Ignore permanently' },
  'devd.baselineLater': {
    ru: 'Отложить задачу до починки',
    en: 'Hold the task until they are fixed',
  },
  'devd.noRightBaseline': {
    ru: 'Решение принимает автор задачи или участник с правом решать по чужим тестам.',
    en: 'The task author, or a member allowed to decide on others’ tests, decides.',
  },
  'devd.rework': { ru: 'Доработать', en: 'Rework' },
  'devd.reject': { ru: 'Отклонить', en: 'Reject' },
  'devd.reworkPlaceholder': {
    ru: 'Уточнение: что переделать…',
    en: 'Clarification: what to redo…',
  },
  'devd.sendRework': { ru: 'Отправить на доработку', en: 'Send for rework' },
  'devd.rejectTitle': { ru: 'Отклонить формулировку?', en: 'Reject the formulation?' },
  'devd.rejectText': {
    ru: 'Задача будет закрыта без выполнения — это действие необратимо.',
    en: 'The task closes without being done — this cannot be undone.',
  },
  'devd.rejectReason': { ru: 'Причина (необязательно)', en: 'Reason (optional)' },
  'devd.rejectConfirm': { ru: 'Да, отклонить', en: 'Yes, reject' },
  'devd.noRightClarify': {
    ru: 'Ответить может автор задачи или участник с правом отвечать на чужие уточнения.',
    en: 'Only the task author or a member allowed to answer others’ clarifications can answer.',
  },
  'devd.noRightGate': {
    ru: 'Решение принимает автор задачи или участник с правом утверждать чужие формулировки.',
    en: 'The task author or a member allowed to approve others’ formulations decides.',
  },
  'devd.sentClarify': {
    ru: 'Ответы отправлены — ждём, пока аналитик их примет',
    en: 'Answers sent — waiting for the analyst to take them',
  },
  'devd.sentGate': {
    ru: 'Решение отправлено — ждём, пока пайплайн его примет',
    en: 'Decision sent — waiting for the pipeline to take it',
  },
  'devd.subtasksDone': { ru: '{done} из {n} выполнено', en: '{done} of {n} done' },
  'devd.wave': { ru: 'Волна {n}', en: 'Wave {n}' },
  'devd.after': { ru: 'после {list}', en: 'after {list}' },
  'devd.subDone': { ru: 'выполнено', en: 'done' },
  'devd.subActive': { ru: 'выполняется сейчас', en: 'running now' },
  'devd.subWaiting': { ru: 'ожидает', en: 'waiting' },
})
