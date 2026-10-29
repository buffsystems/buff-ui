<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo.svg" alt="Buff Development" width="420">
  </picture>
</p>

<p align="center">
  <b>@buff/ui — дизайн-система интерфейсов Buff.</b><br>
  Один облик у приложения, админки, мастера установки, десктопа Buff Code и коннектора.
</p>

<p align="center">
  <a href="https://github.com/buffsystems/buff-ui/tags"><img alt="Версия" src="https://img.shields.io/github/v/tag/buffsystems/buff-ui?label=%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F&color=2563eb"></a>
  <a href="LICENSE"><img alt="Лицензия" src="https://img.shields.io/badge/лицензия-MIT-64748b"></a>
  <a href="https://buff.systems"><img alt="Buff" src="https://img.shields.io/badge/buff.systems-0b0d12"></a>
</p>

<p align="center">
  <a href="#что-внутри">Что внутри</a> ·
  <a href="#как-подключить">Как подключить</a> ·
  <a href="#правила">Правила</a> ·
  <a href="README.en.md">English</a>
</p>

---

## Что внутри

- **Токены** — `src/tokens/tokens.ts`: данные без привязки к платформе (светлая и тёмная палитра, скругления, шрифты). Вебу из них генерируются `styles/tokens.css` (обычные CSS-переменные) и `styles/theme.css` (цвета для Tailwind); нативный клиент импортирует сам объект.
- **Составные классы** — `styles/components/*.css`: весь облик каждого компонента классами `ui-*` (BEM: `ui-btn ui-btn--ghost ui-btn--sm`, `ui-card__title`). Обычный CSS в `@layer components` — любая страница может их использовать, а утилита по-прежнему побеждает в раскладке.
- **Компоненты React** — `src/react/*`: тонкие обёртки, которые ставят эти классы на нужные элементы; поведение (фокус, клавиатура, порталы) — от Radix.
- **Нативный слой** — `src/native/*` (`@buff/ui/native`, #629): те же токены для React Native — тема, примитивы и презентационные экраны мобильного приложения Buff (сопряжение, «Домой», разделы кабинета, Buff Code, уведомления, настройки). Иконки приложение передаёт само (`<NativeProvider icons=…>`: `lucide-react-native`), поэтому пакет не тянет нативных зависимостей. В Storybook экраны показываются через `react-native-web` в рамке телефона (раздел `Mobile`, тумблеры устройства и языка в тулбаре).

## Как подключить

```jsonc
// package.json
"@buff/ui": "git+https://github.com/buffsystems/buff-ui.git#v0.1.4"
```

Приложение на Tailwind v4:

```css
@import 'tailwindcss';
@import '@buff/ui/tailwind.css';
```

```tsx
import { Button } from '@buff/ui/react'
```

Страница без сборки (обычный HTML): подключите `styles/ui.css` и пишите те же классы.

Пакет поставляется исходниками TypeScript, а не сборкой: Vite приложения компилирует их как есть.

## Правила

- Экраны складываются из компонентов; утилиты только раскладывают их (`flex`, `gap-2`, `mt-4`). Повторяющийся облик — это компонент или модификатор здесь, а не длинная строка утилит на экране.
- Цвета, скругления и шрифты — только из токенов: никаких сырых hex и `blue-500`.

## Иконки

Иконки — [lucide-react](https://lucide.dev), выбор приложений; свои глифы (шевроны, галочки, знак поиска) пакет рисует из него же. Набора иконок и компонента `<Icon name>` в пакете нет: компоненты принимают `LucideIcon` (`leadingIcon`, `icon`) или любой узел, а экраны импортируют нужные глифы из `lucide-react`. Знаки, которые не глифы, — логотипы, иконки типов файлов, провайдеров и редакторов — принадлежат приложению, которое их показывает.

## Как поменять токены

Правьте `src/tokens/tokens.ts`, затем `make gen`. Тест падает, если сгенерированный CSS устарел.

## Проверки

`make ci` — типы, линт, тесты. `make storybook` — все компоненты в светлой и тёмной теме.

## Участие и лицензия

Issues и pull request'ы приветствуются — см. [CONTRIBUTING.md](CONTRIBUTING.md) (включая работу с ИИ-помощниками). Репозиторий публикуется снимком на каждый выпуск: принятые изменения выходят в следующем. Лицензия — [MIT](LICENSE).
