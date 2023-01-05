import * as path from 'https://deno.land/std@0.170.0/path/mod.ts';

const HOME_DIR = Deno.env.get('HOME') || Deno.env.get('USERPROFILE') || '';

if (!HOME_DIR) {
  throw new Error('Unable to determine home directory');
}

export const PATH = {
  ROOT: path.join(HOME_DIR, '.config', 'how'),
  get CONFIG() {
    return path.join(PATH.ROOT, 'config.json');
  },
};

export type Config = {
  key: string;
  anonymous: boolean;
  'history-file': string;
};

export const defaultConfig: Config = {
  key: '',
  anonymous: false,
  'history-file': path.join(PATH.ROOT, '.how_history'),
};

function upsertConfigPath() {
  // create the config directory (upserts)
  Deno.mkdirSync(PATH.ROOT, { recursive: true });

  // if config file doesn't exist, create it
  try {
    Deno.readTextFileSync(PATH.CONFIG);
  } catch {
    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(defaultConfig));
  }

  // if history file doesn't exist, create it
  try {
    Deno.readTextFileSync(defaultConfig['history-file']);
  } catch {
    Deno.writeTextFileSync(defaultConfig['history-file'], '');
  }
}

upsertConfigPath();

export const config = {
  get(): Config {
    return JSON.parse(Deno.readTextFileSync(PATH.CONFIG));
  },
  getKey(key: keyof Config): any {
    const obj = config.get();
    return obj[key];
  },
  setKey(key: keyof Config, value: any) {
    const obj = config.get();
    // @ts-expect-error: This is fine, we're just setting a key
    obj[key] = value;

    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(obj));
  },
  setAll(obj: Config) {
    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(obj));
  },
  reset() {
    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(defaultConfig));
  },
};
