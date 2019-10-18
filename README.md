# Spectate

Spectate is a generator for scaffolding a development environment to build freeform Spectator stories. This README documentation is all ideation — check out these [Spectate](https://github.com/spec-journalism/biomedical-money) [examples](https://github.com/spec-journalism/linguistics-major).

Spectate usage:
```
spectate          build and serve a rendered template
spectate create   create a project in the current directory from a template
```

## Setup

0. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1. Make a [GitHub](https://github.com) account. Ask Jason or Raeedah to add you to this `spec-journalism` organization.

2. Set up an SSH key to be able to contribute to repositories. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

3. Install [Node](https://nodejs.org/en/).

4. Clone Spectate by running this command in the Terminal:
```
git clone git@github.com:spec-journalism/spectate.git ~/spectate
```

5. Go to the Spectate directory `cd ~/spectate`. Make the `spectate` command available everywhere:
```
npm link
```
