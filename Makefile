PROJECT 	= "Forever WebUI"
REPORTER 	= spec

update: ;@echo "Updating ${PROJECT}. Please hang on!!"; \
	git pull --rebase; \
	npm install
 
clean: ;
	rm -rf node_modules

test: ;@echo "${PROJECT} : Executing Functional Tests"; \
	./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		test/*.js

.PHONY: update clean test