# Spectate

Spectate provides a workflow for building freeform stories. It allows users to code locally while writing stories in Google Docs, and can bundle several kinds of visual assets.

Check out these examples: [University responses to COVID-19](https://www.columbiaspectator.com/news/2020/04/13/the-us-and-ivy-league-schools-were-late-to-respond-to-covid-19-data-shows-international-universities-did-better/); [EOAA investigation](https://www.columbiaspectator.com/eye-lead/2019/11/15/students-and-faculty-say-gender-based-harassment-and-discrimination-at-columbia-is-systemic-why-are-they-turning-away-from-the-system-built-to-address-it/); [Union Theological Seminary](https://github.com/graphicsdesk/uts).

## Prerequisites

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Make a [GitHub](https://github.com) account. Ask Jason, Charlotte, or Raeedah to add you to the `graphicsdesk` organization.

3. To be able to write to our repositories, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

4. Install [Node](https://nodejs.org/en/).

5. Install a code editor. [Sublime Text](https://www.sublimetext.com) is a great option. (If you use Sublime, also set up the command line shortcut [`subl`](https://www.sublimetext.com/docs/3/osx_command_line.html)).

## Setup

1. Clone the Spectate repository and move into it:
```sh
$ git clone git@github.com:graphicsdesk/spectate.git ~/spectate
$ cd ~/spectate
```

2. Install the necessary dependencies:
```
$ npm install
```

3. Make the `spectate` command available everywhere:
```
$ npm link
```

4. Lastly, we need to configure Google Docs access. Follow Step 1 of the [Node Google Docs quickstart](https://developers.google.com/docs/api/quickstart/nodejs), saving `credentials.json` into the `~/spectate/keys/` directory. Then, run:
```
$ spectate config-docs
```

## Creating a Spectate project

1. In the terminal, create a new directory with the article slug as the name and move into it.
<pre>
$ mkdir <var>SLUG</var>
$ cd <var>SLUG</var>
</pre>

2. Next, run:
```
$ spectate create
```

3. On GitHub, create a new repository in the `graphicsdesk` organization with _`SLUG`_ as the name.

4. Clone the [Spectate Doc template](https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit).

5. Run `spectate init`. It will first prompt you for the article slug. If you leave the answer blank, it will use the project directory name by default. It will then ask you the new Google Docs link. To skip this step, input `s`.

6. Add all the new files, create the first commit, and push it to GitHub.
```
$ git add .
$ git commit -m "Initial commit"
$ git push -u origin master
```

7. See [Usage](#usage).

## Cloning a Spectate project

Make sure you have first completed the [prerequisites and setup instructions](#prerequisites).

To clone a Spectate project, run:
<pre>
$ spectate clone <var>SLUG</var>
</pre>
This will clone the repository `git@github.com:graphicsdesk/SLUG.git` into a new directory named _`SLUG`_ and install the project's node modules. See [Usage](#usage).

## Usage

To start the development server, run:
```
$ npm run dev
```

To re-download the Google Doc, run:
```
$ spectate download
```

For a detailed reference of the Spectate API, see the [API Documentation](https://github.com/graphicsdesk/spectate/wiki/API-Documentation).

### Illustrator and [ai2html](http://ai2html.org/)

Illustrator files must be kept in the `ai/` directory. Each file represents one graphic with one or more artboards for different screen sizes. Every graphic must have a `300` (an artboard named "300" with width 300px) for mobile screens. A `600` will fit inline with Spectate text. Larger sizes include `960`, `1050`, and `1200`.

When the ai2html script is run, the output HTML and images will be put into `src/` (this is configured in `ai/ai2html-config.json`). You can include those files in your HTML with [`<include>`](https://github.com/posthtml/posthtml-include) tags.

## Publishing on Arc

1. Run `spectate prepublish`, which will help you set up the S3 URL. Make sure you have completed the [AWS setup](#aws-setup).

2. Uncomment the appropriate override stylesheet at the top of `src/styles.scss`.

3. Run `spectate publish`. (Whenever you want to update JS or CSS assets after publication, just run this command again.)

4. Copy the contents of `dist/index.html` into Ellipsis.

## Publishing on GitHub Pages

1. In the project directory, run `spectate gh-publish`.

2. Go to the Settings tab in the repository's GitHub page. Scroll down to the GitHub Pages section. You should see this:

<img height="60px" src="https://i.imgur.com/EFYIIXa.png" />

That means GitHub is starting up the page, but it's not ready yet. Once you see this screen…

<img height="60px" src="https://i.imgur.com/UgxOXKJ.png" />

…the link should work. It will show whatever is in your `dist/` directory.

## AWS Setup

Write a new file at `~/.aws/credentials` with the contents below:
<pre>
[spectate]
aws_access_key_id = <var>YOUR_ACCESS_KEY_ID</var>
aws_secret_access_key = <var>YOUR_SECRET_ACCESS_KEY</var>
</pre>
See [this doc](https://docs.google.com/document/u/1/d/1C6WPRpabD6YXjQK3VnvjGy02fgxaARHbJTirm3Rzf8I/edit) for your access key.

Run `cat ~/.aws/credentials`. If the output is the contents of the file you just made, you should now be able to run any publish command.
