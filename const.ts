import * as path from 'https://deno.land/std@0.170.0/path/mod.ts';

const HOME_DIR = Deno.env.get('HOME') || Deno.env.get('USERPROFILE') || '';

if (!HOME_DIR) {
  throw new Error('Unable to determine home directory');
}

export const CONFIG = {
  PATH: path.join(HOME_DIR, '.config', 'how'),
  FILE: {
    get PRIVACY_AGREEMENT() {
      return path.join(CONFIG.PATH, 'privacy_agreement');
    },
    get CONFIG() {
      return path.join(CONFIG.PATH, 'config.json');
    },
    get API_KEY() {
      return path.join(CONFIG.PATH, 'api_key');
    },
  },
  HISTFILE: path.join(HOME_DIR, '.how_history'),
};
