import { Cli } from './deps.ts';
import { VERSION } from './util.ts';
import ToCommand from './cmds/to.ts';
import ConfigCommand from './cmds/config.ts';

// if (!await loadConfig()) {
//   await doWizard();
//   await saveConfig();
// }

await new Cli.Command()
  .name('how')
  .description('A commald-line tool to generate shell commands.')
  .version(VERSION.toString())
  //
  .command('to', ToCommand)
  .command('config', ConfigCommand)
  //
  .parse(Deno.args);

////////////////////////////////////////////////////////////////////////////////

// import { Command } from 'https://deno.land/x/cliffy@v0.25.6/command/mod.ts';
// import to from './cmds/to.ts';
// import { config, defaultConfig } from './lib/config.ts';

// await new Command()
//   .name('how')
//   .version('0.1.0')
//   .description('A command-line tool to generate shell commands.')
//   // NOTE: this doesn't work (on arch)
//   .allowEmpty(false)
//   // Configuration
//   .command('config')
//   .description(
//     `Manage the configuration.\nValid keys: ${Object.keys(defaultConfig)}`
//   )
//   .arguments('<key:string> [value:string]')
//   .action((_, key, value) => {
//     if (value) {
//       // @ts-expect-error: TODO: Use types instead of "<key:string>" because TS doesn't want us using a string as a key
//       config.setKey(key, value);
//     } else {
//       // @ts-expect-error: Same as a bove
//       console.log(config.getKey(key));
//     }
//   })
//   // Reset config
//   .command('config-reset')
//   .description('Resets the configuration.')
//   .action(() => {
//     const sure = confirm('Are you sure you want to reset the config?');
//     if (sure) {
//       config.reset();

//       console.log('Config reset.');
//     }
//   })
//   // Fix config
//   .command('config-fix')
//   .description('Fixes the configuration.')
//   .action(() => {
//     // fills in missing keys
//     const obj = config.get();
//     const newConfig = Object.assign(defaultConfig, obj);

//     config.setAll(newConfig);
//   })
//   // View history
//   .command('history')
//   .description('View the history of commands.')
//   .arguments('[limit:number]')
//   .action((_, rawLimit) => {
//     const limit = rawLimit ?? 10;

//     const history = Deno.readTextFileSync(config.getKey('history-file'));
//     console.log(history.split('\n').reverse().slice(0, limit).join('\n'));
//   })
//   // Clear history
//   .command('history-clear')
//   .description('Clears the history of commands.')
//   .action(() => {
//     const sure = confirm('Are you sure you want to clear the history?');
//     if (sure) {
//       Deno.writeTextFileSync(config.getKey('history-file'), '');
//     }
//   })
//   // Generate shell commands
//   .command('to')
//   .description('Prompts the AI to generate a command.')
//   .option('--debug', 'Enable debug mode')
//   .env('HOW_OPENAI_KEY=<value:string>', 'The API key for OpenAI')
//   .arguments('<prompt...:string>')
//   .action(async (opts, ...args) => {
//     const prompt = args.join(' ');
//     const API_KEY = Deno.env.get('HOW_OPENAI_KEY') || config.getKey('key');

//     if (!API_KEY || API_KEY === '') {
//       console.log(
//         'No API key found. Use `how config key <api key>` or set the `HOW_OPENAI_KEY` env var'
//       );
//       Deno.exit(0);
//     }

//     await to(API_KEY, prompt, opts.debug);
//   })
//   .parse(Deno.args);
