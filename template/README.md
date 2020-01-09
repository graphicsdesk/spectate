# SLUG

This story was created with [Spectate](https://github.com/spec-journalism/spectate).

## Usage

Make sure you have completed the setup and creation instructions for Spectate. To start the development server, run:
```
npm run dev
```

To download the Google Doc again, run:
```
make download
```

## Deploying to Arc

1. Set the slug values in `make upload-assets`. In `package.json`, set `--public-url` to the S3 link. Delete `div#spectate-dev-footer`.

2. Uncomment the appropriate override stylesheet in `styles.scss`.

3. Run `make deploy`.

4. Copy the contents of `dist/index.html` into Ellipsis.
