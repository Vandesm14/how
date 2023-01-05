import { CONFIG } from '../const.ts';

export const getConfig = () => {
  try {
    const config = Deno.readTextFileSync(CONFIG.FILE.CONFIG);
    return JSON.parse(config);
  } catch (e) {
    return {};
  }
};

export const updateConfig = async <T>(key: string, value: T) => {
  const config = getConfig();
  config[key] = value;
  await Deno.writeTextFile(CONFIG.FILE.CONFIG, JSON.stringify(config));
};

export const getConfigValue = <T>(key: string): T => {
  const config = getConfig();
  return config[key];
};
