# Spectate

Spectate provides a workflow for building freeform stories. It allows users to code locally while writing stories in Google Docs, and can bundle several kinds of visual assets.

Check out these examples: [University responses to COVID-19](https://www.columbiaspectator.com/news/2020/04/13/the-us-and-ivy-league-schools-were-late-to-respond-to-covid-19-data-shows-international-universities-did-better/); [EOAA investigation](https://www.columbiaspectator.com/eye-lead/2019/11/15/students-and-faculty-say-gender-based-harassment-and-discrimination-at-columbia-is-systemic-why-are-they-turning-away-from-the-system-built-to-address-it/); [Union Theological Seminary](https://github.com/graphicsdesk/uts).

## Prerequisites

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and make a [GitHub](https://github.com) account. Ask Jason, Charlotte, Jessica, Jenny or Raeedah to add you to the `graphicsdesk` organization.

2. To be able to write to our repositories, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

3. Install [Node](https://nodejs.org/en/).

4. Install a code editor. [Visual Studio Code](https://code.visualstudio.com) is a great option. (If you use VS Code, I highly recommend going through the First Steps in the [documentation](https://code.visualstudio.com/docs)).

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

4. Lastly, to authorize Spectate to download Google Docs, click the ["Enable the Google Docs API"](https://developers.google.com/docs/api/quickstart/nodejs) button. Click "Create", and save the client configuration as `credentials.json` inside the `~/spectate/keys/` directory.

## Creating a Spectate project

1. In the terminal, create a new directory with the article slug as the name and move into it. (This directory should be outside of the `~/spectate` folder.)

<pre>
$ mkdir <var>SLUG</var>
$ cd <var>SLUG</var>
</pre>

2. Next, run:

```
$ spectate create
```

3. On GitHub, create a new repository in the `graphicsdesk` organization with _`SLUG`_ as the name.

4. Run `spectate init`. It will first prompt you for the article slug. If you leave the answer blank, it will use the project directory name by default. It will then ask you for a Google Docs link for the project. Open the [Spectate Doc template](https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit) by inputting `o` into the prompt. Clone it. Paste the new Doc's link into the prompt.

5. `spectate create` has already created an initial commit for you. Push it to GitHub:

```
$ git push -u origin master
```

6. See [Usage](#usage).

## Cloning a Spectate project

Make sure you have first completed the [prerequisites and setup instructions](#prerequisites).

To clone a Spectate project, run:

<pre>
$ spectate clone <var>SLUG</var>
</pre>

This will clone the repository `git@github.com:graphicsdesk/SLUG.git` into a new directory named _`SLUG`_ and install the project's dependencies. See [Usage](#usage).

## Usage

To start the development server, run:

```
$ npm start
```

To re-download the Google Doc or update the project's [configuration](https://github.com/graphicsdesk/spectate/wiki/API-Documentation#spectate-config), run:

```
$ spectate download
```

For an explanation of the project structure, see the [this page](https://github.com/graphicsdesk/spectate/wiki/Project-Structure). For a detailed reference of the Spectate API, see the [API Documentation](https://github.com/graphicsdesk/spectate/wiki/API-Documentation).

### Illustrator and [ai2html](http://ai2html.org/)

Illustrator files must be kept in the `ai/` directory. Each file should represent one graphic. Each file can (and should) have multiple artboards for different screen sizes. Every graphic must have a `300` (an artboard named "300" with width 300px) for mobile screens. A `600` will fit inline with Spectate text. Larger sizes include `960`, `1050`, and `1200`.

When the ai2html script is run, the output HTML and images will be put into `src/` (this is configured in `ai/ai2html-config.json`). You can include those files in your HTML with [`<include>`](https://github.com/posthtml/posthtml-include) tags.

### Assets

Assets like fonts and video should be kept in an `assets/` directory. All images should be uploaded to Arc's [Photo Center](https://spectator.arcpublishing.com/photo/). Their public links can then be put directly in the code or in the Spectate Doc.

## Publishing on GitHub Pages

Just run `spectate gh-publish`.

Go to the Settings tab in the repository's GitHub page. Scroll down to the GitHub Pages section. You should see this:

<img height="60px" src="https://i.imgur.com/PUywcxK.png" />

That means GitHub is starting up the page, but it's not ready yet. Keep refreshing the page. Once you see this screen…

<img height="60px" src="https://i.imgur.com/YCMCrzu.png" />

…the link should work. It will show the build that was generated in the `dist/` directory.

## Publishing on Arc

1. Run `spectate prepublish`, which will help you set up the S3 URL. Make sure you have completed the [AWS setup](https://github.com/graphicsdesk/spectate/wiki/API-Documentation#aws-setup). Uncomment the appropriate override stylesheet at the top of `src/styles.scss`.

2. Run `spectate publish`. (Whenever you want to update JS or CSS assets after publication, just run this command again.)

3. Copy the contents of `dist/index.html` into an HTML block in an Ellipsis story.
