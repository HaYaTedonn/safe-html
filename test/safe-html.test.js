import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, raw, SafeString, escapeHtml, safeUrl } from '../index.js';

test('テキスト位置はHTMLエスケープされる', () => {
  assert.equal(html`<p>${'<script>alert(1)</script>'}</p>`.toString(),
    '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});

test('属性値（ダブルクオート）はエスケープされる', () => {
  assert.equal(html`<input title="${'a" onmouseover="x'}">`.toString(),
    '<input title="a&quot; onmouseover=&quot;x">');
});

test('URL属性: javascript: は無害化される', () => {
  assert.equal(html`<a href="${'javascript:alert(1)'}">x</a>`.toString(),
    '<a href="#">x</a>');
  assert.equal(html`<a href="${'  JaVaScript:alert(1)'}">x</a>`.toString(),
    '<a href="#">x</a>');
});

test('URL属性: 正常なURLは & などをエスケープして通す', () => {
  assert.equal(html`<a href="${'https://example.com/?a=1&b=2'}">x</a>`.toString(),
    '<a href="https://example.com/?a=1&amp;b=2">x</a>');
});

test('引用符なし属性値も安全に', () => {
  // 通常のクエリ文字列は読みやすく（= はそのまま、& はエスケープ）
  assert.equal(html`<a href=${'/path?a=1&b=2'}>x</a>`.toString(),
    '<a href=/path?a=1&amp;b=2>x</a>');
  // 値に空白が混ざっても、空白がエンコードされ新しい属性を作れない（タグを壊さない）
  const bad = html`<a href=${'/x onload=alert(1)'}>y</a>`.toString();
  assert.ok(!/ onload=/.test(bad), '生の空白で属性が分割されてはいけない');
  assert.match(bad, /&#32;onload/);
});

test('SafeString は二重エスケープされず合成できる', () => {
  const item = html`<b>${'A&B'}</b>`;
  assert.ok(item instanceof SafeString);
  assert.equal(html`<div>${item}</div>`.toString(), '<div><b>A&amp;B</b></div>');
});

test('配列はそれぞれ処理して連結', () => {
  const lis = ['x<', 'y&'].map((t) => html`<li>${t}</li>`);
  assert.equal(html`<ul>${lis}</ul>`.toString(),
    '<ul><li>x&lt;</li><li>y&amp;</li></ul>');
});

test('raw はそのまま埋め込む', () => {
  assert.equal(html`<p>${raw('<br>')}</p>`.toString(), '<p><br></p>');
});

test('null / false / undefined は空文字', () => {
  assert.equal(html`<p>${null}${undefined}${false}</p>`.toString(), '<p></p>');
});

test('タグ名・属性名への埋め込みは拒否', () => {
  assert.throws(() => html`<${'div'}>x`.toString(), /安全のため/);
  assert.throws(() => html`<a ${'onclick'}="x">`.toString(), /安全のため/);
});

test('ユーティリティ', () => {
  assert.equal(escapeHtml('<a>&"\''), '&lt;a&gt;&amp;&quot;&#39;');
  assert.equal(safeUrl('javascript:x'), '#');
  assert.equal(safeUrl('https://ok'), 'https://ok');
});
