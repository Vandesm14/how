const contextData = {
  OS: Deno.build.os,
  username: Deno.env.get('USER'),
  shell: Deno.env.get('SHELL'),
};

const context = `I am using the ${contextData.OS} OS with the ${contextData.shell} shell, and my username is ${contextData.username}}`;

export const buildPrompt = (howTo: string) => {
  return `Generate a shell command to: ${howTo}\nContext: ${context}\n$`;
};

// "key, key, and key"
export const dataCollectedString = Object.keys(contextData)
  .join(', ')
  .replace(/, ([^,]*)$/, ' and $1');
