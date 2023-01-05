import { OpenAI } from 'https://deno.land/x/openai@v1.1.0/mod.ts';
import { config } from '../lib/config.ts';
import { buildPrompt } from '../lib/prompt.ts';

export default async function to(
  API_KEY: string,
  question: string,
  debug?: boolean
) {
  const api = new OpenAI(API_KEY);

  async function generateShellCommands(): Promise<string> {
    const model = 'text-davinci-003';
    const fullPrompt = buildPrompt(question);

    if (debug) {
      console.log('generated prompt:', fullPrompt);
    }

    const response = await api.createCompletion(
      fullPrompt,
      model,
      0.5,
      1024,
      1,
      0,
      0
    );

    // @ts-expect-error: `choices` is not defined in the type definition
    const choices = response.choices;

    return choices[0].text.trim();
  }

  const shellCommand = await generateShellCommands();

  const confirmRun = confirm(
    `Do you want to run the following command(s)?\n${shellCommand}`
  );

  if (confirmRun) {
    console.log(`$ ${shellCommand.trim()}`);

    const histfile = config.getKey('history-file');

    if (histfile) {
      try {
        await Deno.writeTextFile(histfile, shellCommand, { append: true });
      } catch {
        console.warn('Could not write to history file.');
      }
    }

    // save the command to a temp file, then use bash to run the file
    const file = Deno.makeTempFileSync();
    await Deno.writeTextFile(file, shellCommand);

    // run the command in the foreground
    const result = Deno.run({
      cmd: ['bash', file],
      stdout: 'inherit',
      stderr: 'inherit',
    });

    await result.status();
  }
}
