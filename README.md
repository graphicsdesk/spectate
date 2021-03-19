# Spectate

Spectate provides a workflow for building and publishing freeform stories. It allows reporters to code locally while writing stories in Google Docs.

Check out these examples: [University responses to COVID-19](https://www.columbiaspectator.com/news/2020/04/13/the-us-and-ivy-league-schools-were-late-to-respond-to-covid-19-data-shows-international-universities-did-better/); [EOAA investigation](https://www.columbiaspectator.com/eye-lead/2019/11/15/students-and-faculty-say-gender-based-harassment-and-discrimination-at-columbia-is-systemic-why-are-they-turning-away-from-the-system-built-to-address-it/); [Union Theological Seminary](https://github.com/graphicsdesk/uts).

## Prerequisites

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and make a [GitHub](https://github.com) account. Ask Charlotte, Jessica, Jenny or Hong to add you to the graphicsdesk or newsdev organization.

2. To be able to write to our repositories, set up an SSH key. Follow the instructions in the first five sections of [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh).

3. Install [Node](https://nodejs.org/en/).

4. Install a code editor. [Visual Studio Code](https://code.visualstudio.com) is a great option. (If you use VS Code, I highly recommend going through the First Steps in the [documentation](https://code.visualstudio.com/docs)).

5. You should be [comfortable](https://docs.google.com/document/d/1qC8zC7lfk4TyNe2XIGwAVOa-oVDxmbnvwOGkqkguaZA/edit#) coding in HTML, CSS, and JavaScript. You should also be familiar with using `git` and version control.

## Install Spectate

Spectate is a [command line tool](https://vgkits.org/blog/what-is-a-terminal) (just like `ls` and `javac`). The following steps download Spectate onto your computer and make it available on the command line.

1. Clone the Spectate repository into your home directory and move into it:

```sh
$ git clone git@github.com:graphicsdesk/spectate.git ~/spectate
$ cd ~/spectate
```

2. Install the necessary Node packages:

```
$ npm install
```

3. Make the `spectate` command available everywhere:

```
$ npm link
```

4. Lastly, to authorize Spectate to download Google Docs, click the ["Enable the Google Docs API"](https://developers.google.com/docs/api/quickstart/nodejs) button (make sure you're signed into Google with your Spec account). Click "Create", and save the client configuration as `credentials.json` inside the `~/spectate/keys/` directory.

## Creating a Spectate project

Read about [how a Spectate project works](https://github.com/graphicsdesk/spectate/wiki/How-a-Spectate-project-works).

1. In the terminal, create a new directory for your project. The name of the directory should be [the slug of your article]((https://github.com/graphicsdesk/spectate/wiki/API-Documentation#slug)). The slug you choose will hereafter be referred to as _`SLUG`_. Move into the directory.

<pre>
$ mkdir <var>SLUG</var>
$ cd <var>SLUG</var>
</pre>

2. Next, run `$ spectate create`. This copies the template files of a Spectate project, like boilerplate HTML/CSS and ai2html configuration, into your directory.

3. On GitHub, create a new repository in the `NewsroomDevelopment` organization with _`SLUG`_ as the name.

4. Run `$ spectate init`, which helps set up the remote connections necessary to your project. It will first prompt you for the article slug. If you leave the answer blank, it will use the name of your project directory by default. It will then ask you for a Google Docs link for the project. To create a Spectate template Google Doc, open the [Spectate Doc template](https://docs.google.com/document/d/1JV2fVhKWMo1MHIJqL3oq10mRSOrWPO_iRnRkmD92N5g/edit) by inputting `o` into the prompt. Clone the Doc. Paste the new Doc's link into the prompt.

5. `spectate create` has already created an initial commit for you. Push it to GitHub by doing:

```
$ git push -u origin main
```

6. See [Usage](#usage) for further instructions.

## Cloning a Spectate project

Make sure you have first completed the [prerequisites and installation instructions](#prerequisites).

To clone a Spectate project, run:

<pre>
$ spectate clone <var>SLUG</var>
</pre>

This will clone the repository `git@github.com:NewsroomDevelopment/SLUG.git` into a new directory named _`SLUG`_ and install the project's dependencies. See [Usage](#usage) for further instructions.

## Usage

Read about [how a Spectate project works](https://github.com/graphicsdesk/spectate/wiki/How-a-Spectate-project-works).

To start developing, run:
```
$ npm start
```
This starts a local web server at http://localhost:1234 that shows you what your page looks like. If you edit and save any code, the page automatically rebuilds and refreshes.

To re-download the Google Doc or update the project's [configuration](https://github.com/graphicsdesk/spectate/wiki/API-Documentation#spectate-config), run:
```
$ spectate download
```
Running this command in a terminal tab other than the one you ran `npm start` in also automatically refreshes the page with the updated content.

To add a graphic to your story (i.e. custom HTML), read [this](https://github.com/graphicsdesk/spectate/wiki/Adding-a-Graphic). To add Illustrator artwork (using ai2html), read [this](https://github.com/graphicsdesk/spectate/wiki/Illustrator-and-ai2html).

To add a scrollytelling interactive, read [this](https://github.com/graphicsdesk/spectate/wiki/Scrollytelling).

The primary file for [SCSS](https://sass-lang.com/) goes into `src/styles.scss` (SCSS is just CSS with better features, like nested selectors and variables). `style.scss` can reference/import other styling files from the `src/styles/` directory. It's highly recommended that you make a separate styling file for each major chunk of your project. (For instance, if your story has two big graphics that don't have much to do with each other, your code is more organized/navigable if the styling for those graphics are in separate files.) If you have a stylesheet `src/styles/scatter-plot.scss`, you can import it in `src/styles.scss` with the line `@import styles/scatter-plot`.

The primary file for JavaScript is `src/script.js`. Again, it's recommended that you make separate files for each major feature of your project, and that you organize all these files in the `src/scripts/` folder. Don't forget to import it in the main `script.js` file by adding `import './scripts/file-name.js` somewhere at the top of `script.js`. If you're using D3, rather than loading all of D3 as a script or package, opt to install the different libraries of d3 individually. For instance, if you only need `select`, install just the `d3-selection` library. This makes JavaScript builds much smaller.

A well-organized project will minimally modify `src/index.html`, `src/styles.scss`, and `src/script.js`. Instead, those files should import/reference small, feature-bounded components.

Here are some other resources:
* [Import data to use in JavaScript](https://github.com/graphicsdesk/spectate/wiki/Importing-data))
* [Add a cover image to the story](https://github.com/graphicsdesk/spectate/wiki/Add-a-cover)
* [Detailed reference of the Spectate API](https://github.com/graphicsdesk/spectate/wiki/API-Documentation).
* Publish a Spectate story (scroll down)

Note: All images and videos should be uploaded to Arc's [Photo Center](https://spectator.arcpublishing.com/photo/). Their public links can then be put directly in the code or in the Spectate Doc.

## Publishing on GitHub Pages

Just run `spectate gh-publish`.

Go to the Settings tab in the repository's GitHub page. Make sure the repository visibility is set to Public. Scroll down to the GitHub Pages section. You should see this:

<img height="60px" src="https://i.imgur.com/PUywcxK.png" />

That means GitHub is starting up the page, but it's not ready yet. Keep refreshing the page. Once you see this screen…

<img height="60px" src="https://i.imgur.com/YCMCrzu.png" />

…the link should work. It will show the build that was generated in the `dist/` directory.

## Publishing on Arc

1. Run `spectate prepublish`, which will help you set up the S3 URL. Make sure you have completed the [AWS setup](https://github.com/graphicsdesk/spectate/wiki/API-Documentation#aws-setup). Uncomment the appropriate override stylesheet at the top of `src/styles.scss`.

2. Run `spectate publish`. (Whenever you want to update JS or CSS assets after publication, just run this command again.)

3. Copy the contents of `dist/index.html` into an HTML block in an Ellipsis story. (More detailed instructions [here](https://github.com/graphicsdesk/spectate/wiki/Putting-a-Spectate-project-on-Arc).)
