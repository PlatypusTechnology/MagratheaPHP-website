import {highlight} from './highlight';

describe('highlight', () => {
  it('escapes HTML in every language', () => {
    for (const lang of ['php', 'ini', 'sql', 'json', 'term', 'md'] as const) {
      const html = highlight('<script>alert(1)</script> & "x"', lang);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&amp;');
    }
  });

  it('tokenizes PHP', () => {
    const html = highlight('<?php\n$api = new MagratheaApi(); // go\n$api->Run("x");', 'php');
    expect(html).toContain('<span class="text-violet-400">&lt;?php</span>');
    expect(html).toContain('<span class="text-sky-300">$api</span>');
    expect(html).toContain('<span class="text-violet-400">new</span>');
    expect(html).toContain('<span class="text-brand-200">MagratheaApi</span>');
    expect(html).toContain('<span class="text-brand-400">Run</span>');
    expect(html).toContain('<span class="text-emerald-300">"x"</span>');
    expect(html).toContain('<span class="text-stone-500 italic">// go</span>');
  });

  it('keeps the original text when tags are stripped', () => {
    const code = 'class A extends B {\n\tprotected $x = ["a" => 1];\n}';
    const div = document.createElement('div');
    div.innerHTML = highlight(code, 'php');
    expect(div.textContent).toBe(code);
  });

  it('colors terminal prompts, levels and fixes', () => {
    const html = highlight('$ magrathea check\nERROR   [schema] bad\n        ALTER TABLE x;\nmagrathea: nope', 'term');
    expect(html).toContain('text-white font-semibold">magrathea check</span>');
    expect(html).toContain('text-red-400 font-semibold">ERROR</span>');
    expect(html).toContain('text-stone-500">[schema]</span>');
    expect(html).toContain('text-brand-300/80">        ALTER TABLE x;</span>');
    expect(html).toContain('<span class="text-red-400">magrathea: nope</span>');
  });
});
