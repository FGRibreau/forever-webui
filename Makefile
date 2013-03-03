PROJECT 	= "Forever WebUI"
REPORTER 	= spec

update: ;@echo "Updating ${PROJECT}. Please hang on!!"; \
	git pull --rebase; \
	npm install
 
clean: ;
	rm -rf node_modules

test: ;@echo "${PROJECT} : Executing Functional Tests\n"; \
	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		test/*.js

build: ;@echo "Building ${PROJECT}. Please hang on!!"; \
	grunt; \
	make test

start: ;@echo "Building ${PROJECT}. Please hang on!!\n"; \
	grunt; \
	echo ""; \
	echo "Deploying ${PROJECT}. Please hang on!!\n"; \
	node app.js;

.PHONY: update clean build start test