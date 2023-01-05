import { PATH } from './const.ts';
import { Command } from 'https://deno.land/x/cliffy@v0.25.6/command/mod.ts';
import to from './cmds/to.ts';
import { config } from './lib/config.ts';

await new Command()
  .name('how')
  .version('0.1.0')
  .description('A command-line tool to generate shell commands')
  // NOTE: this doesn't work (on arch)
  .allowEmpty(false)
  // Configuration
  .command('config')
  .description('Manage the configuration.')
  .arguments('<key:string> [value:string]')
  .action((_, key, value) => {
    if (value) {
      config.setKey(key, value);
    } else {
      console.log(config.getKey(key));
    }
  })
  // Generate shell commands
  .command('to')
  .description('Prompts the AI to generate a command.')
  .option('--debug', 'Enable debug mode')
  .env('HOW_OPENAI_KEY=<value:string>', 'The API key for OpenAI')
  .arguments('<prompt...:string>')
  .action(async (opts, ...args) => {
    const prompt = args.join(' ');
    const API_KEY = Deno.env.get('HOW_OPENAI_KEY') ?? config.getKey('apiKey');

    if (!API_KEY || API_KEY === '') {
      console.log(
        'No API key found. Use `how set-key <key>` or set the `HOW_OPENAI_KEY` env var'
      );
      Deno.exit(0);
    }

    await to(API_KEY, prompt, opts.debug);
  })
  .parse(Deno.args);
