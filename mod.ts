import { CONFIG } from './const.ts';
import { Command } from 'https://deno.land/x/cliffy@v0.25.6/command/mod.ts';
import to from './cmd/to.ts';

await new Command()
  .name('how')
  .version('0.1.0')
  .description('A command-line tool to generate shell commands')
  // Set the API key
  .command('set-key')
  .arguments('<api-key>')
  .action((opts, ...args) => {
    const [key] = args;
    Deno.writeTextFileSync(CONFIG.FILE.API_KEY, key);
    console.log('API key saved');
  })
  // Generate shell commands
  .command('to')
  .option('--debug', 'Enable debug mode')
  .arguments('<prompt...:string>')
  .action(async (opts, ...args) => {
    const prompt = args.join(' ');

    try {
      const API_KEY = Deno.readTextFileSync(CONFIG.FILE.API_KEY);

      await to(API_KEY, prompt, opts.debug);
    } catch (e) {
      console.log(
        'No API key found. Use `how set-key <key>` to set your API key'
      );
      Deno.exit(0);
    }
  })
  .parse(Deno.args);

let API_KEY = Deno.readTextFileSync(CONFIG.FILE.API_KEY);

if (!API_KEY || API_KEY === '') {
  console.log('No API key found. Use `how set-key <key>` to set your API key');
  Deno.exit(0);
}
