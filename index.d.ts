/** 安全と分かっている HTML 文字列のラッパー。 */
export class SafeString {
  constructor(value: string);
  value: string;
  toString(): string;
}

/** HTML テキストのエスケープ。 */
export function escapeHtml(s: string): string;

/** URL として危険なスキーム（javascript: 等）を無害化する。 */
export function safeUrl(value: string): string;

/** 文脈（テキスト / 属性 / URL）に応じて自動エスケープするタグ付きテンプレート。 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeString;

/** エスケープせずそのまま埋め込む（信頼できる文字列のみ）。 */
export function raw(value: string): SafeString;

declare const _default: {
  html: typeof html;
  raw: typeof raw;
  SafeString: typeof SafeString;
  escapeHtml: typeof escapeHtml;
  safeUrl: typeof safeUrl;
};
export default _default;
