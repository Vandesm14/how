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
