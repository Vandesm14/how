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
  HISTFILE: path.join(HOME_DIR, '.how_history'),
};

export type Config = {
  key: string;
  anonymous: boolean;
};

export const defaultConfig: Config = {
  key: '',
  anonymous: false,
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
}

upsertConfigPath();

export const config = {
  get(): Config {
    return JSON.parse(Deno.readTextFileSync(PATH.CONFIG));
  },
  getKey(key: string): any {
    const obj = config.get();
    // @ts-expect-error: This is fine, we're just getting a key
    return obj[key];
  },
  setKey(key: string, value: any) {
    const obj = config.get();
    // @ts-expect-error: This is fine, we're just setting a key
    obj[key] = value;

    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(obj));
  },
  reset() {
    Deno.writeTextFileSync(PATH.CONFIG, JSON.stringify(defaultConfig));
  },
};
