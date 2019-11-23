.PHONY: download build upload-assets deploy clean

download:
	node process/download-doc.js

build:
	rm -rf dist/*
	npm run build

# upload-assets:
# 	aws s3 rm s3://spectator-static-assets/TK/ --recursive --exclude "*" --include "*" --profile=spec
# 	aws s3 cp dist/ s3://spectator-static-assets/TK/ --recursive --exclude "*" --include "*" --acl=public-read --profile=spec

# deploy: build upload-assets
deploy: build
	cd dist && git add . && git commit -m 'Deploy to gh-pages' && git push origin gh-pages

clean:
	rm -rf dist
	git worktree prune
	mkdir dist
	git worktree add dist gh-pages
