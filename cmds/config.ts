import { Cli } from '../deps.ts';
import { doWizard } from '../util.ts';

export default new Cli.Command()
  .description('Subcommands for updating the configuration.')
  .command('wizard', 'Runs the configuration wizard.')
  .action(async () => {
    await doWizard();
    // await saveConfig();
  });
