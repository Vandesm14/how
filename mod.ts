import { CONFIG } from './const.ts';
import { Command } from 'https://deno.land/x/cliffy@v0.25.6/command/mod.ts';
import to from './cmd/to.ts';
import { getConfigValue, updateConfig } from './lib/config.ts';

await new Command()
  .name('how')
  .version('0.1.0')
  .description('A command-line tool to generate shell commands')
  // Set the API key
  .command('set-key')
  .arguments('<api-key>')
  .action((opts, ...args) => {
    const [key] = args;

    Deno.mkdirSync(CONFIG.PATH, { recursive: true });

    Deno.writeTextFileSync(CONFIG.FILE.API_KEY, key);
    console.log('API key saved');
  })
  // Set config options
  .command('set')
  .arguments('<key> <value>')
  .action((opts, ...args) => {
    const [key, value] = args;

    updateConfig(key, value);
  })
  // Get config options
  .command('get')
  .arguments('<key>')
  .action((opts, ...args) => {
    const [key] = args;

    console.log('key:', getConfigValue(key));
  })
  // Generate shell commands
  .command('to')
  .option('--debug', 'Enable debug mode')
  .env('HOW_OPENAI_KEY=<value:string>', 'The API key for OpenAI')
  .arguments('<prompt...:string>')
  .action(async (opts, ...args) => {
    const prompt = args.join(' ');
    let API_KEY = Deno.env.get('HOW_OPENAI_KEY');

    if (!API_KEY || API_KEY === '') {
      try {
        API_KEY = Deno.readTextFileSync(CONFIG.FILE.API_KEY);
      } catch (e) {
        console.log(
          'No API key found. Use `how set-key <key>` to set your API key'
        );
        Deno.exit(0);
      }
    }

    await to(API_KEY, prompt, opts.debug);
  })
  .parse(Deno.args);

let API_KEY = Deno.readTextFileSync(CONFIG.FILE.API_KEY);

if (!API_KEY || API_KEY === '') {
  console.log('No API key found. Use `how set-key <key>` to set your API key');
  Deno.exit(0);
}
