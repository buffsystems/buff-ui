import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = { title: 'Content/Prose' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const html = `
<h1>Аудит безопасности</h1>
<p>Проверено <strong>10 разделов</strong>, найдено <em>2 замечания</em>. Подробности — в <a href="#">отчёте</a>.</p>
<h2>Замечания</h2>
<ul><li>Секрет в <code>config/app.yml</code></li><li>Нет ограничения на размер запроса</li></ul>
<h3>Как исправить</h3>
<pre><code class="hljs"><span class="hljs-keyword">const</span> limit = <span class="hljs-number">1024</span> <span class="hljs-comment">// байт</span></code></pre>
<blockquote>Модель учитывает это в каждой задаче.</blockquote>
<h4>Таблица</h4>
<table><thead><tr><th>Раздел</th><th>Статус</th></tr></thead><tbody><tr><td>Сборка</td><td>готово</td></tr><tr><td>Тесты</td><td>устарело</td></tr></tbody></table>
<details><summary>Технические детали</summary><p>Скрытый текст.</p></details>
<hr><ol><li>Первый шаг</li><li>Второй шаг</li></ol>
`

export const Chat: Story = {
  render: () => (
    <div
      className="ui-prose ui-prose--chat"
      style={{ maxWidth: 560 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ),
}

export const Document: Story = {
  render: () => (
    <div
      className="ui-prose ui-prose--document"
      style={{ maxWidth: 720 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ),
}
