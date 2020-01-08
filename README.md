# Spectate

Spectate provides a complete workflow for building Graphics stories. Reporters write code and develop interactives locally, and then publish the HTML on Composer. Spectate uploads CSS and JS files separately.

Every story is a repository on GitHub and is created from Spectate's template. The template uses a Google Doc to drive the content of the story.

Check out these examples: [EOAA](https://www.columbiaspectator.com/eye-lead/2019/11/15/students-and-faculty-say-gender-based-harassment-and-discrimination-at-columbia-is-systemic-why-are-they-turning-away-from-the-system-built-to-address-it/) (interactive), [Linguistics Major](https://github.com/spec-journalism/linguistics-major) (multimedia), [Union Theological Seminary](https://github.com/spec-journalism/uts) (_The Eye_)

## Prerequisites

0. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

1. Make a [GitHub](https://github.com) account. Ask Jason or Raeedah to add you to the `spec-journalism` organization.

2. To be able to write to our repositories, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

3. Install [Node](https://nodejs.org/en/)

4. Clone the Spectate repository and move into it:
```
git clone git@github.com:spec-journalism/spectate.git ~/spectate
```

5. Move into the Spectate directory, install the necessary dependencies, and make the `spectate` command available everywhere:
```
cd ~/spectate
npm install
npm link
```

6. Lastly, we need to configure Google Docs access. Follow Step 1 of the [Node Google Docs quickstart](https://developers.google.com/docs/api/quickstart/nodejs), saving `credentials.json` into the `keys/` directory in the Spectate directory. Then, run:
```
spectate config-docs
```

## Creating a Spectate project

1. In the terminal, create a new directory with the article slug as the name.

2. Move into the directory, and run:
```
spectate create
```

3. Configure `config.yml` and `package.json`. Then, you can run `npm run dev`.

4. Create a new repository in **@spec-journalism** with the article slug as its name. Then, set up the remotes and push (make sure there is an initial commit).
```
spectate init # you will be prompted to enter the name of the new repository
git push -u origin master
```

## ai2html

1. Name each artboard the width it represents.
