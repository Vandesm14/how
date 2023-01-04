import { OpenAI } from 'https://deno.land/x/openai@v1.1.0/mod.ts';

// Replace `YOUR_API_KEY` with your API key
const api = new OpenAI('HIDDEN BY REBASE');
const args = Deno.args;

async function generateShellCommands(
  prompt: string,
  context: string
): Promise<string> {
  const model = 'text-davinci-003';

  const response = await api.createCompletion(
    `Generate a shell command to: ${prompt}\nContext: ${context}\n$`,
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

const contextData = {
  os: Deno.build.os,
  user: Deno.env.get('USER'),
};

let mainPrompt = '';
if (args.length === 0) {
  // Example usage
  mainPrompt = prompt('What do you want to do:') ?? '';
} else {
  mainPrompt = args.join(' ');
}

const context =
  `I am using the ${contextData.os} OS (username is ${contextData.user}).\n` +
  `If you need more info, you can run a command like "gpt_conditional ls -la" to get the output of the "ls -la" command. Once you have enough info, provide the finished command after the "$"`;
const shellCommand = await generateShellCommands(mainPrompt, context);

const confirmRun = confirm(
  `Do you want to run the following command(s)?\n${shellCommand}`
);

if (confirmRun) {
  console.log(`$ ${shellCommand.trim()}`);

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
