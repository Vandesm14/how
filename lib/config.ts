import { PATH } from '../const.ts';

export type Config = {
  apiKey: string;
  anonymous: boolean;
};

export const defaultConfig: Config = {
  apiKey: '',
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
};
