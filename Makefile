currentversion=$(node -e "console.log(require(\"./package.json\").version)")

all:
	#npm run-script build
	npm run-script tag
	for f in `ls build/*.js`; do uglifyjs $$f -o $$f.min; rename 's/\.js\.min/.min.js/' build/*; done
	for f in `ls build/*.min.js`; do gzip -f -9 $$f; done
	for f in `ls build/*.min.js.gz`; do s3cmd put $$f s3://cdn.crowdprocess.com/`echo $$f | sed 's/build\///' | sed 's/min.js.gz/min.js/'` -M --add-header='Content-Encoding: gzip' --acl-public ; done

clean:
	rm -rf build/*
