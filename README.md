# How?

An AI-powered tool to create tailored commands just when you need them!

## `how to <your prompt>`

You can use the `how to` command to create a tailored command for your prompt. For example, if you want to create a command to open a file in your favorite editor, you can use the following command:

```bash
$ how to open mod.ts in vim
```

Which results in:

```bash
Do you want to run the following command(s)?
nvim /home/shane/mod.ts [y/N]
```

If you answer `y`, **how** will create a bash file in the `/tmp` directory and execute it. The bash file will contain the command shown in the message.

You can also simply copy the command and hit enter in the **how** prompt to do nothing.

## `how set-key <GPT API Key>`

**How** is powered by GPT, so you will need to give it your API key to use it. You can get your API key from [OpenAI](https://beta.openai.com/).

If you try to use **how** without an API key, it will prompt you to set one.

### Environment variable

You can use the `HOW_OPENAI_KEY` environment variable to set your API key.
