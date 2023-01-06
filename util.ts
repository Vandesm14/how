import { Cli, Path } from './deps.ts';

/** Contains the version. */
export const VERSION = {
  MAJOR: 0,
  MINOR: 1,
  PATCH: 0,
  toString(): string {
    return `${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
  },
};

/** Contains the configuration and helpers. */
export const CONFIG = {
  PRIVACY: {
    USER: {
      type: Cli.Confirm,
      message: 'Should we include your user name as context to OpenAI?',
      hint: 'This is only sent to OpenAI.',
      default: false,
      // TODO(@leonskidev): add the ability to read from a configuration file
      async get() {
        return Boolean(
          Deno.env.get('HOW_PRIVACY_USER') ??
            await this.type.prompt(this),
        );
      },
    },
    OS: {
      type: Cli.Confirm,
      message: 'Should we include your operating system as context to OpenAI?',
      hint: 'This is only sent to OpenAI.',
      default: false,
      // TODO(@leonskidev): add the ability to read from a configuration file
      async get() {
        return Boolean(
          Deno.env.get('HOW_PRIVACY_OS') ??
            await this.type.prompt(this),
        );
      },
    },
    SHELL: {
      type: Cli.Confirm,
      message: 'Should we include your shell as context to OpenAI?',
      hint: 'This is only sent to OpenAI.',
      default: false,
      // TODO(@leonskidev): add the ability to read from a configuration file
      async get() {
        return Boolean(
          Deno.env.get('HOW_PRIVACY_SHELL') ??
            await this.type.prompt(this),
        );
      },
    },
    EDITOR: {
      type: Cli.Confirm,
      message: 'Should we include your text editor as context to OpenAI?',
      hint: 'This is only sent to OpenAI.',
      default: false,
      // TODO(@leonskidev): add the ability to read from a configuration file
      async get() {
        return Boolean(
          Deno.env.get('HOW_PRIVACY_EDITOR') ??
            await this.type.prompt(this),
        );
      },
    },
  },
  KEY: {
    type: Cli.Input,
    message: 'OpenAI API key:',
    // TODO(@leonskidev): add the ability to read from a configuration file
    async get() {
      return Deno.env.get('HOW_KEY') ?? await this.type.prompt(this);
    },
  },
};

export function configDirPath(): string {
  switch (Deno.build.os) {
    case 'linux':
      return Deno.env.get('XDG_CONFIG_HOME') ??
        Path.join(Deno.env.get('HOME') ?? '~', '.config');
    // TODO(@leonskidev): handle this, though it should be nigh impossible
    case 'windows':
      return Deno.env.get('APPDATA') ?? (() => {
        console.error('SOMETHING BROKE');
        Deno.exit(1);
      })();
    // TODO(@leonskidev): i'm not sure how macos does this just yet
    case 'darwin':
      return (() => {
        console.error('SOMETHING BROKE');
        Deno.exit(1);
      })();
    default:
      return (() => {
        console.error('SOMETHING BROKE');
        Deno.exit(1);
      })();
  }
}

export function configPath(): string | undefined {
  return Path.resolve(Path.join(
    configDirPath(),
    'how',
    'config.json',
  ));
}

// TODO(@leonskidev): fix this so that we can have a configuration file again

// export async function loadConfig(): Promise<boolean> {
//   const path = configPath();
//   if (path === undefined) return false;

//   return await Deno.readTextFile(path)
//     .then((text) => JSON.parse(text))
//     .then((config) => {
//       if (config?.privacy?.user) {
//         Deno.env.set('HOW_PRIVACY_USER', config.privacy.user);
//       }
//       if (config?.privacy?.os) {
//         Deno.env.set('HOW_PRIVACY_OS', config.privacy.os);
//       }
//       if (config?.privacy?.shell) {
//         Deno.env.set('HOW_PRIVACY_SHELL', config.privacy.shell);
//       }
//       if (config?.privacy?.editor) {
//         Deno.env.set('HOW_PRIVACY_EDITOR', config.privacy.editor);
//       }
//       if (config?.key) {
//         Deno.env.set('HOW_KEY', config.key);
//       }

//       return true;
//     })
//     .catch(() => false);
// }

// export async function saveConfig(): Promise<boolean> {
//   const path = configPath();
//   if (path === undefined) return false;

//   // await Deno.mkdir(configDirPath(), { recursive: true });
//   return await Deno.writeTextFile(
//     path,
//     JSON.stringify({
//       privacy: {
//         user: await CONFIG.PRIVACY.USER.get(),
//         os: await CONFIG.PRIVACY.OS.get(),
//         shell: await CONFIG.PRIVACY.SHELL.get(),
//         editor: await CONFIG.PRIVACY.EDITOR.get(),
//       },
//       key: await CONFIG.KEY.get(),
//     }),
//     {
//       create: true,
//       append: false,
//     },
//   ).then(() => true).catch(() => false);
// }

/** Runs a wizard for missing configuration. */
export async function doWizard() {
  Deno.env.set('HOW_PRIVACY_USER', String(await CONFIG.PRIVACY.USER.get()));
  Deno.env.set('HOW_PRIVACY_OS', String(await CONFIG.PRIVACY.OS.get()));
  Deno.env.set('HOW_PRIVACY_SHELL', String(await CONFIG.PRIVACY.SHELL.get()));
  Deno.env.set('HOW_PRIVACY_EDITOR', String(await CONFIG.PRIVACY.EDITOR.get()));
  Deno.env.set('HOW_KEY', await CONFIG.KEY.get());
}

/** Returns the context of the user. */
export async function context(): Promise<string> {
  const context = [];

  if (await CONFIG.PRIVACY.USER.get() && Deno.env.get('USER')) {
    context.push(`My username is ${Deno.env.get('USER')}`);
  }
  if (await CONFIG.PRIVACY.OS.get()) {
    context.push(`My operating system is ${Deno.build.os}`);
  }
  if (await CONFIG.PRIVACY.SHELL.get() && Deno.env.get('SHELL')) {
    context.push(`My shell is ${Deno.env.get('SHELL')}`);
  }
  if (await CONFIG.PRIVACY.EDITOR.get() && Deno.env.get('EDITOR')) {
    context.push(`My text editor is ${Deno.env.get('EDITOR')}`);
  }

  return context.join(', ');
}
