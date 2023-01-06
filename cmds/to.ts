import { Cli, OpenAI } from '../deps.ts';
import { CONFIG, context } from '../util.ts';

const MODEL = 'text-davinci-003';

// TODO(@leonskidev): look into adding aliases for more prompt variations
export default new Cli.Command()
  .description('Prompts OpenAI to generate a shell command.')
  .arguments('<prompt...:string>')
  .action(async (_, ...args) => {
    const input = args.join(' ');
    const prompt =
      `Generate a shell command to: ${input}.\n${await context()}$`;

    const response = await new OpenAI(await CONFIG.KEY.get())
      .createCompletion(
        prompt,
        MODEL,
        0.5,
        1024,
        1,
        0,
        0,
      );
    // @ts-expect-error: `response.choices` is not defined in the type definition
    const command = response.choices[0].text.trim();

    const shouldRun = await Cli.Confirm.prompt({
      message: 'Would you like to run the command(s)? (Check before you do!)',
      hint: command,
    });

    if (shouldRun) {
      // save the command to a temporary file, then use bash to run the file
      const file = Deno.makeTempFileSync();
      await Deno.writeTextFile(file, command);

      // run the command in the foreground
      const result = Deno.run({
        // TODO(@leonskidev): add a configuration option to choose the shell to use
        cmd: ['bash', file],
        stdout: 'inherit',
        stderr: 'inherit',
      });

      await result.status();
      // await saveConfig();

      // TODO(@leonskidev): re-add this as a configuration option
      // const histfile = config.getKey('history-file');
      // if (histfile) {
      //   try {
      //     await Deno.writeTextFile(histfile, `${Date.now()};${shellCommand}\n`, {
      //       append: true,
      //     });
      //   } catch {
      //     console.warn('Could not write to history file.');
      //   }
      // }
    }
  });
