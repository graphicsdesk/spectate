# Spectate

Spectate is a generator for scaffolding a development environment to build freeform Spectator stories. This README documentation is all ideation — check out these [Spectate](https://github.com/spec-journalism/biomedical-money) [examples](https://github.com/spec-journalism/linguistics-major).

Spectate usage:
```
spectate          build and serve a rendered template
spectate create   create a project in the current directory from a template
```

## Setup

### 1. Git and GitHub permissions

Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

Make a [GitHub](https://github.com) account. Ask Jason Kao or Raeedah Wahid to add you to this `spec-journalism` organization.

Next, to be able to contribute to the repositories in this organization, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh) (from "Checking for existing SSH keys" to "Testing your SSH connection").

### 2. Install Node

Install Node from https://nodejs.org/en/.

### 3. Install Python and pipenv

Make sure you have [Python 3](https://www.python.org/downloads/) installed.

Then, install [pipenv](https://pipenv.readthedocs.io/en/latest/).

### 4. Install Spectate

Clone Spectate by running this command in the Terminal:
```
git clone git@github.com:spec-journalism/spectate.git ~/spectate
```

Go to the Spectate directory:
```
cd ~/spectate
```

Make the `spectate` command available everywhere:
```
npm link
```
