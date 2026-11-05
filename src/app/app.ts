import {ChangeDetectionStrategy, Component, OnInit, computed, signal} from '@angular/core';
import {highlight} from './highlight';
import {
  AGENTS_MD, AGENT_TERMINAL, CHECK_CMD, CHECK_GROUPS, CONTROL_SNIPPET, EXPLORER_TABLES, FALLBACK_VERSION,
  HERO_SNIPPETS, INSTALL_CMD, LINKS, QUERY_EDITOR, SETUP_SNIPPET, TREE_V2, TREE_V3, WHATS_NEW,
} from './content';

type BenchmarkModeId = 'throughput' | 'time' | 'memory';
type Level = 'ok' | 'info' | 'warning' | 'error';

interface BenchmarkInput {
  name: string;
  main?: boolean;
  /** average req/s over /hello and /planets */
  rps: number;
  /** peak memory per request, MB */
  memMb: number;
}

interface BenchmarkDetail {
  framework: string;
  endpoint: string;
  p50: string;
  p99: string;
  rps: string;
  mem: string;
  main?: boolean;
}

/**
 * Measured 2026-11-04 with the harness in /benchmark (MagratheaPHP 3.0.0, wrk -t2 -c50 -d30s,
 * 1 vCPU / 512MB containers, PHP 8.3 + OPcache; per-endpoint median of 3 runs, see benchmark/results.md).
 * CPU time per request = 1000 / req/s, since each container has exactly one vCPU.
 */
const BENCHMARK_DATE = 'November 2026';
const BENCHMARKS: BenchmarkInput[] = [
  {name: 'MagratheaPHP 3', main: true, rps: 1459.9, memMb: 0.3},
  {name: 'Slim Framework 4', rps: 1048.6, memMb: 0.4},
  {name: 'Symfony 7', rps: 400.8, memMb: 0.5},
  {name: 'Laravel 12', rps: 179.1, memMb: 0.6},
];
const BENCHMARK_DETAILS: BenchmarkDetail[] = [
  {framework: 'MagratheaPHP 3', endpoint: '/hello', p50: '50.87 ms', p99: '163.27 ms', rps: '1,464', mem: '0.3 MB', main: true},
  {framework: 'MagratheaPHP 3', endpoint: '/planets', p50: '51.34 ms', p99: '104.23 ms', rps: '1,456', mem: '0.3 MB', main: true},
  {framework: 'Slim 4', endpoint: '/hello', p50: '48.96 ms', p99: '201.84 ms', rps: '1,033', mem: '0.4 MB'},
  {framework: 'Slim 4', endpoint: '/planets', p50: '49.22 ms', p99: '192.52 ms', rps: '1,064', mem: '0.4 MB'},
  {framework: 'Symfony 7', endpoint: '/hello', p50: '102.22 ms', p99: '501.33 ms', rps: '386', mem: '0.5 MB'},
  {framework: 'Symfony 7', endpoint: '/planets', p50: '100.89 ms', p99: '499.30 ms', rps: '415', mem: '0.5 MB'},
  {framework: 'Laravel 12', endpoint: '/hello', p50: '295.37 ms', p99: '901.62 ms', rps: '176', mem: '0.6 MB'},
  {framework: 'Laravel 12', endpoint: '/planets', p50: '288.76 ms', p99: '899.71 ms', rps: '183', mem: '0.6 MB'},
];

const fmtInt = (n: number): string => Math.round(n).toLocaleString('en-US');
const cpuMs = (rps: number): number => 1000 / rps;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  readonly links = LINKS;
  readonly currentVersion = signal<string>(FALLBACK_VERSION);

  ngOnInit(): void {
    fetch(LINKS.githubTags)
      .then(response => response.json())
      .then(tags => {
        if (!Array.isArray(tags)) return;
        const versionTag = tags.find(t => t?.name && /^v?3\.\d+/.test(t.name));
        if (versionTag) {
          this.currentVersion.set(versionTag.name.startsWith('v') ? versionTag.name : `v${versionTag.name}`);
        }
      })
      .catch(() => { /* keep the shipped version */ });
  }

  // ------------------------------------------------------------ navigation
  readonly mobileMenuOpen = signal(false);
  readonly navItems = [
    {href: '#whats-new', label: "What's new"},
    {href: '#features', label: 'Features'},
    {href: '#agents', label: 'Agents'},
    {href: '#admin', label: 'Admin'},
    {href: '#benchmarks', label: 'Benchmarks'},
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  // ------------------------------------------------------------ hero
  readonly heroSnippets = HERO_SNIPPETS.map(s => ({...s, html: highlight(s.code, s.lang)}));
  readonly heroTab = signal('api');
  readonly heroSnippet = computed(() => this.heroSnippets.find(s => s.id === this.heroTab())!);

  // ------------------------------------------------------------ what's new
  readonly whatsNew = WHATS_NEW;
  readonly treeV2 = TREE_V2;
  readonly treeV3 = TREE_V3;
  readonly controlHtml = highlight(CONTROL_SNIPPET, 'php');

  // ------------------------------------------------------------ agents
  readonly agentsMd = AGENTS_MD;
  readonly agentsMdHtml = highlight(AGENTS_MD, 'md');
  readonly agentTerminal = AGENT_TERMINAL.map(t => ({...t, html: highlight(t.code, 'term')}));
  readonly agentTab = signal('verify');
  readonly agentTerm = computed(() => this.agentTerminal.find(t => t.id === this.agentTab())!);

  // ------------------------------------------------------------ admin mockup
  readonly adminTab = signal<'explorer' | 'queries' | 'editor' | 'checks'>('explorer');
  readonly adminMenu = [
    {id: 'explorer' as const, label: 'Explorer', icon: 'travel_explore'},
    {id: 'queries' as const, label: 'Queries', icon: 'terminal'},
    {id: 'editor' as const, label: 'Query editor', icon: 'tune'},
    {id: 'checks' as const, label: 'Checks', icon: 'fact_check'},
  ];
  readonly explorerTables = EXPLORER_TABLES;
  readonly queryEditorPhp = highlight(QUERY_EDITOR.php, 'php');
  readonly queryEditorSql = highlight(QUERY_EDITOR.sql, 'sql');
  readonly queryEditorBuilt = signal(false);
  readonly checkGroups = CHECK_GROUPS.map(g => ({
    ...g,
    findings: g.findings.map(f => ({...f, html: this.inlineCode(f.message)})),
  }));

  readonly queryPresets = [
    {id: 'select', sql: 'SELECT id, name, diameter FROM planets ORDER BY diameter DESC LIMIT 3'},
    {id: 'count', sql: 'SELECT COUNT(*) AS total FROM inhabitants'},
    {id: 'delete', sql: "DELETE FROM planets WHERE name = 'Pluto'"},
  ];
  readonly queryPreset = signal('select');
  /** idle → (writes) confirm → done */
  readonly queryState = signal<'idle' | 'confirm' | 'done'>('idle');

  setQueryPreset(event: Event): void {
    this.queryPreset.set((event.target as HTMLSelectElement).value);
    this.queryState.set('idle');
  }

  runQuery(): void {
    this.queryState.set(this.queryPreset() === 'delete' && this.queryState() === 'idle' ? 'confirm' : 'done');
  }

  levelDot(level: Level | string): string {
    return {
      ok: 'bg-emerald-400',
      info: 'bg-sky-400',
      warning: 'bg-amber-400',
      error: 'bg-red-400',
    }[level] ?? 'bg-stone-500';
  }

  levelBox(level: Level | string): string {
    return {
      ok: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
      info: 'border-sky-500/20 bg-sky-500/5 text-sky-200',
      warning: 'border-amber-500/25 bg-amber-500/5 text-amber-100',
      error: 'border-red-500/25 bg-red-500/5 text-red-100',
    }[level] ?? '';
  }

  /** Backtick spans as <code>, like AdminElements::Findings() */
  private inlineCode(message: string): string {
    const esc = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc.replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-black/40 text-brand-200">$1</code>');
  }

  // ------------------------------------------------------------ benchmarks
  readonly benchmarkDate = BENCHMARK_DATE;
  readonly benchmarkMode = signal<BenchmarkModeId>('throughput');
  readonly benchmarkModes: {id: BenchmarkModeId; label: string}[] = [
    {id: 'throughput', label: 'Throughput'},
    {id: 'time', label: 'CPU / req'},
    {id: 'memory', label: 'Memory'},
  ];
  readonly benchmarkHeaders: Record<BenchmarkModeId, {title: string; unit: string}> = {
    throughput: {title: 'Throughput — higher is better', unit: 'req/s'},
    time: {title: 'CPU time per request — lower is better', unit: 'ms'},
    memory: {title: 'Peak memory per request — lower is better', unit: 'MB'},
  };
  readonly benchmarkDetails = BENCHMARK_DETAILS;

  private readonly maxRps = Math.max(...BENCHMARKS.map(b => b.rps));
  private readonly maxCpu = Math.max(...BENCHMARKS.map(b => cpuMs(b.rps)));
  private readonly maxMem = Math.max(...BENCHMARKS.map(b => b.memMb));
  private readonly main = BENCHMARKS.find(b => b.main)!;

  readonly benchmarkRows = computed(() => {
    const mode = this.benchmarkMode();
    return BENCHMARKS.map(b => {
      const cpu = cpuMs(b.rps);
      const metric = mode === 'throughput'
        ? {value: `${fmtInt(b.rps)} req/s`, pct: (b.rps / this.maxRps) * 100}
        : mode === 'time'
          ? {value: `${cpu.toFixed(2)} ms`, pct: (cpu / this.maxCpu) * 100}
          : {value: `${b.memMb.toFixed(1)} MB`, pct: (b.memMb / this.maxMem) * 100};
      return {...b, ...metric};
    });
  });

  /** Headline numbers, derived from the same data */
  readonly stats = {
    rps: fmtInt(this.main.rps),
    cpu: cpuMs(this.main.rps).toFixed(2),
    mem: this.main.memMb.toFixed(1),
    vs: BENCHMARKS.filter(b => !b.main).map(b => ({
      name: b.name.replace(' Framework', ''),
      ratio: this.main.rps / b.rps,
    })),
  };

  ratioText(ratio: number): string {
    return ratio < 2 ? `${Math.round((ratio - 1) * 100)}% ahead of` : `${ratio.toFixed(1)}× the throughput of`;
  }

  // ------------------------------------------------------------ get started
  readonly installCmd = INSTALL_CMD;
  readonly checkCmd = CHECK_CMD;
  readonly setupSnippet = SETUP_SNIPPET;
  readonly setupHtml = highlight(SETUP_SNIPPET, 'php');
  readonly copied = signal<string | null>(null);

  copy(id: string, text: string): void {
    navigator?.clipboard?.writeText(text).then(() => {
      this.copied.set(id);
      setTimeout(() => this.copied.update(v => (v === id ? null : v)), 1800);
    }).catch(() => { /* clipboard blocked: nothing to do */ });
  }
}
