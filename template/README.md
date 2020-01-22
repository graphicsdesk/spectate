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

To update the Makefile, run:
```
spectate update
```

## Deploying to the web

### GitHub Pages

1. Create a `gh-pages` branch, return to `master`, and set up the worktree.
```
git checkout -b gh-pages
git checkout master
make clean
```

2. Run `make deploy-gh`.

### Arc

1. Set the value of `slug` in the Makefile. In `package.json`, set `--public-url` to the S3 link:
```
https://spectator-static-assets.s3.amazonaws.com/SLUG
```

2. Uncomment the appropriate override stylesheet in `styles.scss`.

3. Run `make deploy-arc`.

4. Copy the contents of `dist/index.html` into Ellipsis.
