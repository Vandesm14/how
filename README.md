# How?

An AI-powered tool to create tailored commands just when you need them!

## Installation

You can download the binary from the [latest release](https://github.com/vandesm14/how/releases/latest).

Or you can build from source (requires [Deno](https://deno.land/)):

```bash
git clone https://github.com/vandesm14/how.git
cd how

chmod +x build.sh
./build.sh
```

## Usage

### Prerequisites

You will need to get an API key from [OpenAI](https://openai.com/). Once you have that, you can either:

**Use the environment variable**

```bash
HOW_OPENAI_KEY=<your key> how to <your prompt>
```

**Use the config editor**

```bash
how config key <your key>
```

### Prompting the AI

```bash
# how to <your prompt>

$ how to create a new file
# Do you want to run the following command(s)?
# touch shane.txt [y/N] y
# $ touch shane.txt
```

## Contributing

Pull requests are welcome. For major changes, please open an issue to discuss what you would like to change.
