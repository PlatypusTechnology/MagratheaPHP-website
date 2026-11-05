/**
 * Everything the page says about MagratheaPHP 3: code samples, CLI output, links.
 * Code samples follow the 3.0 docs (docs/mds) and skills.MD; CLI and check output
 * uses the framework's real message formats (Cli\Text::Findings, SchemaCheck, ProjectCheck).
 */
import {Lang} from './highlight';

export const LINKS = {
  docs: 'https://www.platypusweb.com.br/magratheaphp3/docs/',
  gettingStarted: 'https://www.platypusweb.com.br/magratheaphp3/docs/?p=getting-started/getting-started',
  setupWizard: 'https://www.platypusweb.com.br/magratheaphp3/docs/?p=getting-started/setup-wizard',
  cli: 'https://www.platypusweb.com.br/magratheaphp3/docs/?p=core/cli',
  adminDatabase: 'https://www.platypusweb.com.br/magratheaphp3/docs/?p=admin/admin-database',
  migration: 'https://www.platypusweb.com.br/magratheaphp3/docs/?p=migrations/migrate-3.0',
  magrathea2: 'https://www.platypusweb.com.br/magratheaphp2',
  mdFiles:'https://www.platypusweb.com.br/magratheaphp3/docs/?p=md-files',
  github: 'https://github.com/PlatypusTechnology/MagratheaPHP3',
  githubTags: 'https://api.github.com/repos/PlatypusTechnology/MagratheaPHP3/tags',
  platypus: 'https://platypusweb.com.br',
};

/** Shipped version (MagratheaPHP3/src/version); replaced by the latest GitHub tag when there is one. */
export const FALLBACK_VERSION = 'v3.0.0';

export interface Snippet {
  id: string;
  file: string;
  lang: Lang;
  code: string;
}

// ---------------------------------------------------------------- hero

export const HERO_SNIPPETS: Snippet[] = [
  {
    id: 'api',
    file: 'index.php',
    lang: 'php',
    code: `<?php
// public/index.php
require __DIR__."/../app/_inc.php";

use Magrathea\\MagratheaApi;
use App\\Api\\PlanetApiControl;

$api = new MagratheaApi();
$api->AllowFromFile();   // configs/cors-origins.txt

$planets = new PlanetApiControl();
// GET planets · POST planets · GET|PUT|DELETE planet/:id
$api->Crud("planet", $planets);
$api->Add("GET", "planet/:id/moons", $planets, "Moons");

$api->Run();`,
  },
  {
    id: 'model',
    file: 'Planet.php',
    lang: 'php',
    code: `<?php
// app/features/Planet/Planet.php — written by you, or your agent
namespace App\\Planet;

use Magrathea\\MagratheaModel;

class Planet extends MagratheaModel {
	protected $dbTable = "planets";
	protected $dbPk = "id";
	protected $dbValues = [
		"id"        => "int",
		"name"      => "string",
		"diameter"  => "float",
		"habitable" => "boolean",
	];
	public $id, $name, $diameter, $habitable;
}`,
  },
  {
    id: 'config',
    file: 'magrathea.conf',
    lang: 'ini',
    code: `[general]
	use_environment = "dev"

[dev]
	db_host = "localhost"
	db_name = "galaxy"
	db_user = "root"
	db_pass = "secret"
	timezone = "America/Sao_Paulo"

[production]
	db_host = "10.0.0.8"
	db_name = "galaxy_prod"
	db_user = "deep_thought"
	db_pass = "$=DB_PASSWORD"   ; from the environment
	timezone = "America/Sao_Paulo"`,
  },
  {
    id: 'check',
    file: 'terminal',
    lang: 'term',
    code: `$ vendor/bin/magrathea check
OK      [config] PHP 8.3.14.
OK      [config] Environment: \`dev\`.
OK      [config] Database configured: \`galaxy\` on \`localhost\`.
OK      [folders] Logs: \`/srv/galaxy/logs\` exists and is writable.
OK      [database] Connected to the database.
OK      [timezone] PHP and MySQL are in sync (UTC-03:00).
INFO    [schema] No model maps the table \`orbits\`.
ERROR   [schema] \`moons\`.\`updated_at\` has no \`ON UPDATE CURRENT_TIMESTAMP\` (updates don't change it).
        ALTER TABLE \`moons\` MODIFY \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

1 error, 1 info, 6 ok`,
  },
];

// ---------------------------------------------------------------- what's new

export interface NewItem {
  icon: string;
  title: string;
  body: string;
  tags: string[];
}

export const WHATS_NEW: NewItem[] = [
  {
    icon: 'edit_note',
    title: 'Code you write, not code it writes',
    body: 'The code generator, magrathea_objects.conf and the File Editor are gone. MagratheaModel now provides what the generator used to write into every Base class, so a model is just its properties and its table settings, and a Control is one line.',
    tags: ['MagratheaModel', '$model'],
  },
  {
    icon: 'smart_toy',
    title: 'Built for AI agents',
    body: 'Its manual ships in vendor/: skills.MD, a coding cookbook, and the full docs/mds reference. Point your project\'s AGENTS.md at them, and your agent has the same documentation as you.',
    tags: ['skills.MD', 'AGENTS.md'],
  },
  {
    icon: 'terminal',
    title: 'vendor/bin/magrathea',
    body: 'A CLI that shows the project\'s state as data: checks, schema, queries, dumps and admin users. Every command prints text, or one JSON document with --json. A write runs only with its flag, so there are no prompts an agent can\'t answer.',
    tags: ['--json', '--write', '--yes'],
  },
  {
    icon: 'rule',
    title: 'Models checked against tables',
    body: 'SchemaCheck compares every model to its table: missing columns, type mismatches, the wrong primary key, unmapped tables, and timestamps that break the contract, each with an ALTER TABLE fix.',
    tags: ['SchemaCheck', 'models:verify'],
  },
  {
    icon: 'storage',
    title: 'A Database section in the admin',
    body: 'Explorer, Queries (anything that isn\'t read-only waits for confirmation), a Query editor that builds a real Query and shows its PHP and its SQL, Dumps (mysqldump or pure PHP) and Checks.',
    tags: ['Explorer', 'Dumps', 'Checks'],
  },
  {
    icon: 'rocket_launch',
    title: 'A new Setup Wizard',
    body: 'public/setup.php works before any config exists. It writes magrathea.conf, checks the database, imports a dump, installs the admin and its first user, and runs the checks. A token only the server can read locks it.',
    tags: ['Bootstrap\\Start', '.setup-token'],
  },
  {
    icon: 'schedule',
    title: 'The database owns the timestamps',
    body: 'created_at and updated_at come from DEFAULT CURRENT_TIMESTAMP and ON UPDATE. Reload() reads a row back and Touch() bumps it on purpose. Strict types are on by default: ints, booleans and floats load as native PHP types.',
    tags: ['Reload()', 'Touch()', 'TYPES'],
  },
  {
    icon: 'shield',
    title: 'Hardened',
    body: 'Integer primary keys are validated before any query runs (closing an SQL injection in GetById), admin sessions store only the user id and regenerate on login, and a failed login no longer shows which e-mails are admins. CORS origins can live in a file that the admin edits.',
    tags: ['ValidateId()', 'AllowFromFile()'],
  },
];

/** Before/after: a model in 2.x vs 3.0 */
export const TREE_V2 = [
  {name: 'configs/magrathea_objects.conf', note: 'generator config', gone: true},
  {name: 'features/Planet/Base/PlanetBase.php', note: 'generated', gone: true},
  {name: 'features/Planet/Base/PlanetControlBase.php', note: 'generated', gone: true},
  {name: 'features/Planet/Planet.php', note: 'extends PlanetBase', gone: false},
  {name: 'features/Planet/PlanetControl.php', note: 'extends PlanetControlBase', gone: false},
];
export const TREE_V3 = [
  {name: 'features/Planet/Planet.php', note: 'extends MagratheaModel'},
  {name: 'features/Planet/PlanetControl.php', note: 'one line'},
];

export const CONTROL_SNIPPET = `class PlanetControl extends MagratheaModelControl {
	protected static $model = Planet::class;
}

$habitable = PlanetControl::GetWhere(["habitable" => 1]);
$earth = new Planet(3);       // strict types: $earth->id === 3
$earth->Save();               // updated_at? the database handles it
$earth->Reload();             // read the row back, timestamps included`;

// ---------------------------------------------------------------- agents

export const AGENTS_MD = `# AGENTS.md
This project runs on MagratheaPHP 3 (\`platypustechnology/magratheaphp\`, namespace \`Magrathea\`).
Before writing code, read \`vendor/platypustechnology/magratheaphp/skills.MD\`.
Class reference: \`vendor/platypustechnology/magratheaphp/docs/mds/index.md\`.
Verify your work with \`vendor/bin/magrathea check\` and \`vendor/bin/magrathea models:verify\`.`;

export interface TermTab {
  id: string;
  label: string;
  code: string;
}

export const AGENT_TERMINAL: TermTab[] = [
  {
    id: 'verify',
    label: 'models:verify --json',
    code: `$ vendor/bin/magrathea models:verify Planet --json
{
    "command": "models:verify",
    "exit": 1,
    "data": {
        "class": "App\\\\Planet\\\\Planet",
        "level": "error",
        "counts": { "ok": 0, "info": 0, "warning": 1, "error": 1 },
        "findings": [
            {
                "level": "warning",
                "message": "\`App\\\\Planet\\\\Planet::$dbValues[diameter]\` is \`float\` on a \`decimal(12,2)\` column: it rounds under strict types. Use \`decimal\`.",
                "group": "schema",
                "model": "App\\\\Planet\\\\Planet",
                "table": "planets",
                "field": "diameter"
            },
            {
                "level": "error",
                "message": "\`App\\\\Planet\\\\Planet::$dbValues[moons]\` has no column in \`planets\`: writes fail.",
                "group": "schema",
                "model": "App\\\\Planet\\\\Planet",
                "table": "planets",
                "field": "moons"
            }
        ]
    }
}`,
  },
  {
    id: 'query',
    label: 'db:query',
    code: `$ vendor/bin/magrathea db:query "DELETE FROM planets WHERE name = 'Pluto'"
magrathea: [db:query] writes: it runs only with --write
Usage: magrathea db:query <sql> [--write]
$ vendor/bin/magrathea db:query "DELETE FROM planets WHERE name = 'Pluto'" --write
Affected rows: 1`,
  },
  {
    id: 'help',
    label: 'help',
    code: `$ vendor/bin/magrathea help
MagratheaPHP 3.0.0

Usage: magrathea <command> [arguments] [options]

Commands:
  help                  Lists the commands, or shows one command's usage
  check                 Checks the project: config, folders, database, timezone and schema (exit 1 on any ERROR)
  db:tables             Lists the database's tables and views
  db:describe           Describes a table: columns, indexes, CREATE TABLE, the models that map it and their findings
  db:query              Runs SQL: read-only SQL prints its rows; anything else needs --write
  db:dump               Exports the database to a .sql file in the backups folder
  db:import             Imports a .sql file from the backups folder into the database (needs --yes)
  models:verify         Checks the models against their tables (exit 1 on any ERROR)
  admin:create-user     Creates the admin's first user (a super admin), only while there are none
  admin:reset-password  Sets an admin user's password; without --password, generates one
  version               Shows the framework's, the app's and PHP's versions

Exit codes:
  0  ok
  1  an ERROR finding or a failed command
  2  a usage error`,
  },
];

// ---------------------------------------------------------------- admin mockup

export const EXPLORER_TABLES = [
  {name: 'planets', engine: 'InnoDB', rows: '~9', model: 'App\\Planet\\Planet', status: 'warning'},
  {name: 'moons', engine: 'InnoDB', rows: '~214', model: 'App\\Moon\\Moon', status: 'error'},
  {name: 'orbits', engine: 'InnoDB', rows: '~9', model: '—', status: 'info'},
  {name: 'inhabitants', engine: 'InnoDB', rows: '~8.1B', model: 'App\\Life\\Inhabitant', status: 'ok'},
];

/** Real QueryEditor::Build() output for this spec (run against a stub schema). */
export const QUERY_EDITOR = {
  php: `Query::Select("\`id\`, \`name\`, \`diameter\`")
	->Table("planets")
	->Where(["habitable" => "1"])
	->Where("\`diameter\` > '10000'")
	->Order("\`diameter\` DESC")
	->Limit(10)`,
  sql: `SELECT \`id\`, \`name\`, \`diameter\` FROM \`planets\` WHERE  \`habitable\` = '1'  AND \`diameter\` > '10000' ORDER BY \`diameter\` DESC LIMIT 0, 10`,
};

export interface CheckGroup {
  title: string;
  level: 'ok' | 'info' | 'warning' | 'error';
  findings: {level: 'ok' | 'info' | 'warning' | 'error'; message: string; fix?: string}[];
}

export const CHECK_GROUPS: CheckGroup[] = [
  {
    title: 'Configuration', level: 'ok', findings: [
      {level: 'ok', message: 'Environment: `dev`.'},
      {level: 'ok', message: 'The Setup Wizard is locked.'},
    ],
  },
  {
    title: 'Folders', level: 'warning', findings: [
      {level: 'warning', message: 'Cache: `cache_path` isn\'t set, so the cache can\'t be used.'},
    ],
  },
  {
    title: 'Timezone', level: 'ok', findings: [
      {level: 'ok', message: 'PHP and MySQL are in sync (UTC-03:00).'},
    ],
  },
  {
    title: 'Timestamps', level: 'error', findings: [
      {
        level: 'error',
        message: '`moons`.`updated_at` has no `ON UPDATE CURRENT_TIMESTAMP` (updates don\'t change it).',
        fix: 'ALTER TABLE `moons` MODIFY `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;',
      },
    ],
  },
  {
    title: 'Models', level: 'warning', findings: [
      {level: 'warning', message: '`App\\Planet\\Planet::$dbValues[diameter]` is `float` on a `decimal(12,2)` column: it rounds under strict types. Use `decimal`.'},
      {level: 'info', message: 'No model maps the table `orbits`.'},
    ],
  },
];

// ---------------------------------------------------------------- get started

export const INSTALL_CMD = 'composer require platypustechnology/magratheaphp';

export const SETUP_SNIPPET = `<?php
// public/setup.php
require __DIR__."/../vendor/autoload.php";
Magrathea\\Bootstrap\\Start::Instance()->AppPath(__DIR__."/../app")->Load();`;

export const CHECK_CMD = 'vendor/bin/magrathea check';
