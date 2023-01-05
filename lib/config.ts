import { CONFIG } from '../const.ts';

export const store = {
  getAll: () => {
    try {
      const config = Deno.readTextFileSync(CONFIG.FILE.CONFIG);
      return JSON.parse(config);
    } catch {
      return {};
    }
  },
  get: <T>(key: string): T => {
    const config = store.getAll();
    return config[key];
  },
  set: async <T>(key: string, value: T) => {
    const config = store.getAll();
    config[key] = value;
    await Deno.writeTextFile(CONFIG.FILE.CONFIG, JSON.stringify(config));
  },
  setPartial: async (partial: Record<string, any>) => {
    const config = store.getAll();
    Object.assign(config, partial);
    await Deno.writeTextFile(CONFIG.FILE.CONFIG, JSON.stringify(config));
  },
};
