const contextData = {
  os: Deno.build.os,
  user: Deno.env.get('USER'),
};

const context = `I am using the ${contextData.os} OS (username is ${contextData.user}).`;

export const buildPrompt = (howTo: string) => {
  return `Generate a shell command to: ${howTo}\nContext: ${context}\n$`;
};
