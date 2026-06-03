# safe-html

A tiny, **zero-dependency** tagged-template that **auto-escapes by context** (HTML text / attribute / URL). Build HTML strings safely without a framework.

文脈（テキスト・属性・URL）を理解して**自動でエスケープ**する、依存ゼロのタグ付きテンプレートです。フレームワークなしでXSSを防げます。

- Text position → HTML-escaped
- Attribute value → attribute-escaped
- URL attributes (`href`, `src`, …) → dangerous schemes like `javascript:` are neutralized
- `SafeString` values are **not double-escaped**, so fragments compose
- Interpolating into a tag name or attribute name is **rejected** (safety)
- Zero dependencies, typed, ESM — works in Node / Deno / Bun / browser

## Install
```bash
npm install @suzukihayate/safe-html
```

## Usage
```js
import { html, raw } from '@suzukihayate/safe-html';

html`<p>${'<script>alert(1)</script>'}</p>`.toString();
// "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>"

html`<a href="${'javascript:alert(1)'}">x</a>`.toString();
// '<a href="#">x</a>'   (neutralized)

html`<a href="${'https://example.com/?a=1&b=2'}">ok</a>`.toString();
// '<a href="https://example.com/?a=1&amp;b=2">ok</a>'

// Compose fragments without double-escaping
const items = ['a<', 'b&'].map((t) => html`<li>${t}</li>`);
html`<ul>${items}</ul>`.toString();
// '<ul><li>a&lt;</li><li>b&amp;</li></ul>'

// Opt-in raw (trusted strings only)
html`<p>${raw('<br>')}</p>`.toString(); // '<p><br></p>'
```

## API
- `` html`...` `` — context-aware auto-escaping tagged template, returns a `SafeString`
- `raw(str)` — wrap a trusted string (no escaping)
- `escapeHtml(str)` / `safeUrl(str)` — the underlying helpers
- `SafeString` — branded safe-HTML wrapper (`.toString()`)

## Why
Most escaping helpers escape the same way everywhere, so developers must remember which context they are in (and `href="javascript:..."` slips through plain HTML escaping). `safe-html` tracks the parsing context across the static template parts and escapes each interpolation correctly — including neutralizing dangerous URL schemes — in a few hundred bytes.

> Note: assumes reasonably well-formed templates (double/single-quoted or unquoted attribute values). For full untrusted-HTML sanitization, use a dedicated sanitizer.

## Test
```bash
node --test
```

## License
MIT © 2026 Hayate Suzuki
