import { CONFIG } from './const.ts';
import { Command } from 'https://deno.land/x/cliffy@v0.25.6/command/mod.ts';
import to from './cmds/to.ts';

await new Command()
  .name('how')
  .version('0.1.0')
  .description('A command-line tool to generate shell commands')
  // NOTE: this doesn't work (on arch)
  .allowEmpty(false)
  // Set the API key
  .command('set-key')
  .description('Sets the OpenAI API key.')
  .arguments('<api-key>')
  .action((_, ...args) => {
    const [key] = args;

    Deno.mkdirSync(CONFIG.PATH, { recursive: true });

    Deno.writeTextFileSync(CONFIG.FILE.API_KEY, key);
    console.log('API key saved');
  })
  // Shows the API key
  .command('get-key')
  .description('Shows the OpenAI API key.')
  .action(() => {
    try {
      const key = Deno.readTextFileSync(CONFIG.FILE.API_KEY);

      console.log('key:', key);
    } catch {
      console.log('No API key found');
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
    let API_KEY = Deno.env.get('HOW_OPENAI_KEY');

    if (!API_KEY || API_KEY === '') {
      try {
        API_KEY = Deno.readTextFileSync(CONFIG.FILE.API_KEY);
      } catch {
        console.log(
          'No API key found. Use `how set-key <key>` or set the `HOW_OPENAI_KEY` env var'
        );
        Deno.exit(0);
      }
    }

    await to(API_KEY, prompt, opts.debug);
  })
  .parse(Deno.args);
