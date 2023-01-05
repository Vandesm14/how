import { parse } from 'https://deno.land/x/properties@v1.0.1/mod.ts';
import { config } from './config.ts';

const contextData = {
  OS: parse(Deno.readTextFileSync('/etc/os-release'))?.NAME || 'unknown',
  username: Deno.env.get('USER'),
  shell: Deno.env.get('SHELL'),
};

const context = `Context: I am using the ${contextData.OS} OS with the ${contextData.shell} shell, and my username is ${contextData.username}\n`;

export const buildPrompt = (howTo: string) => {
  const isAnonymous = config.getKey('anonymous');

  return `Generate a shell command to: ${howTo}\n${
    !isAnonymous ? context : ''
  }$`;
};

// "key, key, and key"
export const dataCollectedString = Object.keys(contextData)
  .join(', ')
  .replace(/, ([^,]*)$/, ' and $1');
