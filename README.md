# Spectate

Spectate provides a workflow for building freeform stories. It allows users to write stories and code locally, and then publish the HTML in Arc. Spectate uploads CSS, JS, and other assets separately.

Every story is stored in a repository on GitHub and is based on a Spectate template. The template can use a Google Doc to drive the content of the story.

Check out these examples: [EOAA](https://www.columbiaspectator.com/eye-lead/2019/11/15/students-and-faculty-say-gender-based-harassment-and-discrimination-at-columbia-is-systemic-why-are-they-turning-away-from-the-system-built-to-address-it/) (interactive), [Linguistics Major](https://github.com/spec-journalism/linguistics-major) (multimedia), [Union Theological Seminary](https://github.com/spec-journalism/uts) (_The Eye_)

## Prerequisites

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Make a [GitHub](https://github.com) account. Ask Jason, Charlotte, or Raeedah to add you to the `spec-journalism` organization.

3. To be able to write to our repositories, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

4. Install [Node](https://nodejs.org/en/).

5. Install a text editor to work with plaintext files. [Sublime Text](https://www.sublimetext.com) is one good option (if you use Sublime, also check out the command line tool [`subl`](https://www.sublimetext.com/docs/3/osx_command_line.html)).

## Setup

1. Clone the Spectate repository and move into it:
```
$ git clone git@github.com:spec-journalism/spectate.git ~/spectate
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

3. On GitHub, create a new repository in the `spec-journalism` organization with _`SLUG`_ as the name.

4. Clone the [Spectate Doc template](https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit).

5. Run `spectate init`, which will ask you for the slug and the new Google Docs link.

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
This will clone the repository `git@github.com:spec-journalism/SLUG.git` into a new directory named _`SLUG`_, install node modules, and copy over Google Docs keys. See [Usage](#usage).

## Usage

To start the development server, run `npm run dev`.

To re-download the Google Doc, run `spectate download`.

## Project Structure

_In Progress._

### ai2html

Make sure [ai2html](http://ai2html.org/) is installed.

Keep Illustrator files in `ai/`. Name each artboard the width it represents. When the ai2html script is run, the output HTML and images will be put into `src/` (this is configured in `ai/ai2html-config.json`).

## Publishing on Arc

1. In the build script of `package.json`, set the value of `--public-url` to the S3 link, which should take this format:
<pre>
https://spectator-static-assets.s3.amazonaws.com/<var>SLUG</var>
</pre>
The final build script should look something like this:
<pre>
parcel build src/index.html --global script --public-url https://spectator-static-assets.s3.amazonaws.com/<var>SLUG</var> --no-content-hash
</pre>

2. If applicable, uncomment the appropriate override stylesheet in `styles.scss` (either for a News or Eye page).

3. Run `spectate publish`. (Whenever you want to update JS or CSS assets after publication, just run this command again.)

4. Copy the contents of `dist/index.html` into Ellipsis.

## Publishing on GitHub Pages

1. In the project directory, run `spectate gh-publish`.

2. Go to the repository's apge on GitHub. Go to the Settings tab. Scroll down to the GitHub Pages section. You should see this:

![](https://i.imgur.com/uNZsD8V.png)

That means GitHub is starting up the page, but it's not ready yet. Once you see this screen…

![](https://i.imgur.com/ZxcH7ES.png)

…the link should work. It will show whatever is in your `dist/` directory.

## Command line options

```
usage: spectate <command>

These are common Spectate commands:
  create        Create a Spectate project
  init          Set remote links for a newly created project
  clone         Clone an existing Spectate project
  download      Download the Google Doc
  build         Clear the contents of dist/ and npm run build
  publish       Build and upload assets
  gh-publish    Publish and push to a gh-pages branch
  config-docs   Reset Google Docs authentication
  update        Update Spectate itself
```

## AWS Setup

To be able to use `spectate publish` with a S3 public URL, you must create a credentials file.

1. In your home directory (`cd ~`), create a directory called `.aws` (`mkdir .aws`).

2. Write a file `.aws/credentials` with the contents below:
<pre>
[default]
aws_access_key_id = <var><YOUR_ACCESS_KEY_ID></var>
aws_secret_access_key = <var><YOUR_SECRET_ACCESS_KEY></var>
</pre>
See [this doc](https://docs.google.com/document/u/1/d/1C6WPRpabD6YXjQK3VnvjGy02fgxaARHbJTirm3Rzf8I/edit) for your access key.
