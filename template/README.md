# TK

## Setup

0. Make sure you have first done the setup instructions for [Spectate](https://github.com/spec-journalism/spectate).

1. Clone the repository
```
git clone git@github.com:spec-journalism/TK.git
```

2. Go into the repository: `cd TK`

3. Run `npm install`

## Deploy

0. Set the slug values in `make upload-assets`. In `package.json`, set `--public-url` to the S3 link. Delete `div#spectate-dev-footer`.

1. Uncomment the stylesheet for The Eye or News in `styles.scss`.

1. Run `make deploy`.

2. Copy the contents of `dist/index.html` into Ellipsis.
