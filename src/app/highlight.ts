/**
 * Tiny, dependency-free syntax highlighter for the snippets on this page.
 * Returns HTML made of <span class="…"> tokens; everything else is escaped.
 * Classes are spelled out in full here so Tailwind picks them up.
 */
export type Lang = 'php' | 'ini' | 'sql' | 'json' | 'term' | 'md';

const CLS = {
  comment: 'text-stone-500 italic',
  string: 'text-emerald-300',
  variable: 'text-sky-300',
  keyword: 'text-violet-400',
  type: 'text-brand-200',
  fn: 'text-brand-400',
  number: 'text-rose-300',
  section: 'text-brand-400 font-semibold',
  key: 'text-sky-300',
  punct: 'text-stone-500',
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const span = (cls: string, s: string): string => `<span class="${cls}">${escapeHtml(s)}</span>`;

/** Runs a regex whose numbered groups map to classes; unmatched text is escaped as-is. */
function tokenize(code: string, re: RegExp, groups: string[]): string {
  let out = '';
  let last = 0;
  for (const m of code.matchAll(re)) {
    const idx = m.index ?? 0;
    out += escapeHtml(code.slice(last, idx));
    const g = m.findIndex((v, i) => i > 0 && v !== undefined);
    out += g > 0 && groups[g - 1] ? span(groups[g - 1], m[0]) : escapeHtml(m[0]);
    last = idx + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

const PHP_RE = new RegExp(
  [
    String.raw`(\/\/[^\n]*)`,
    String.raw`("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')`,
    String.raw`(\$\w+)`,
    String.raw`(<\?php)`,
    String.raw`\b(use|namespace|class|extends|protected|public|private|static|function|return|new|require|if|try|catch|fn|true|false|null|self|array|echo)\b`,
    String.raw`\b(\d+(?:\.\d+)?)\b`,
    // method calls: Magrathea's methods are PascalCase, so catch them by the -> or :: before them
    String.raw`(?<=->|::)(\w+)`,
    String.raw`\b([A-Z]\w*)\b`,
    String.raw`\b(\w+)(?=\()`,
  ].join('|'),
  'g',
);
const PHP_GROUPS = [CLS.comment, CLS.string, CLS.variable, CLS.keyword, CLS.keyword, CLS.number, CLS.fn, CLS.type, CLS.fn];

const INI_RE = /(;[^\n]*)|(^[ \t]*\[[^\]\n]+\])|(^[ \t]*[\w.]+)(?=[ \t]*=)|("[^"\n]*")/gm;
const INI_GROUPS = [CLS.comment, CLS.section, CLS.key, CLS.string];

const SQL_RE = new RegExp(
  [
    String.raw`('(?:[^'\\]|\\.)*')`,
    String.raw`(\x60[^\x60]*\x60)`,
    String.raw`\b(SELECT|FROM|WHERE|AND|OR|ORDER|BY|LIMIT|DESC|ASC|DELETE|UPDATE|INSERT|INTO|SET|COUNT|ALTER|TABLE|MODIFY|DEFAULT|ON|NULL|NOT|CURRENT_TIMESTAMP|datetime)\b`,
    String.raw`\b(\d+)\b`,
  ].join('|'),
  'g',
);
const SQL_GROUPS = [CLS.string, CLS.key, CLS.keyword, CLS.number];

const JSON_RE = /("(?:[^"\\]|\\.)*")(?=\s*:)|("(?:[^"\\]|\\.)*")|\b(-?\d+(?:\.\d+)?)\b|\b(true|false|null)\b/g;
const JSON_GROUPS = [CLS.key, CLS.string, CLS.number, CLS.keyword];

const MD_RE = /(^#[^\n]*)|(\x60[^\x60\n]+\x60)/gm;
const MD_GROUPS = [CLS.section, CLS.key];

/** Terminal: `$ cmd` prompts, finding levels, fixes and errors, line by line. */
function terminal(code: string): string {
  return code
    .split('\n')
    .map(line => {
      if (line.startsWith('$ ')) {
        return span('text-brand-400 select-none', '$ ') + span('text-white font-semibold', line.slice(2));
      }
      if (/^\s*[{}[\]"]/.test(line)) return tokenize(line, JSON_RE, JSON_GROUPS);
      const level = /^(OK|INFO|WARNING|ERROR)(\s+)(\[[\w]+\])?(.*)$/.exec(line);
      if (level) {
        const color = {OK: 'text-emerald-400', INFO: 'text-sky-400', WARNING: 'text-amber-400', ERROR: 'text-red-400'}[level[1]]!;
        return span(`${color} font-semibold`, level[1]) + escapeHtml(level[2]) +
          (level[3] ? span('text-stone-500', level[3]) : '') + span('text-stone-200', level[4]);
      }
      if (line.startsWith('magrathea:')) return span('text-red-400', line);
      if (line.startsWith('        ')) return span('text-brand-300/80', line);
      if (/^\d+ (error|warning|info|ok)/.test(line)) return span('text-stone-400 font-semibold', line);
      return span('text-stone-300', line);
    })
    .join('\n');
}

export function highlight(code: string, lang: Lang): string {
  switch (lang) {
    case 'php': return tokenize(code, PHP_RE, PHP_GROUPS);
    case 'ini': return tokenize(code, INI_RE, INI_GROUPS);
    case 'sql': return tokenize(code, SQL_RE, SQL_GROUPS);
    case 'json': return tokenize(code, JSON_RE, JSON_GROUPS);
    case 'md': return tokenize(code, MD_RE, MD_GROUPS);
    case 'term': return terminal(code);
  }
}
