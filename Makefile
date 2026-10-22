# @buff/ui — the Buff design system package (#561). Shipped as source: consumers pin a tag
# (`git+https://github.com/buffsystems/buff-ui.git#vX.Y.Z`) and their bundler compiles it.

.DEFAULT_GOAL := help
.PHONY: help install gen typecheck lint test ci storybook build-storybook

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dev dependencies
	npm ci

gen: ## Regenerate styles/tokens.css after editing src/tokens/tokens.ts
	npm run gen

typecheck: ## TypeScript, strict
	npm run typecheck

lint: ## ESLint + Prettier check
	npm run lint

test: ## Unit tests
	npm run test

ci: typecheck lint test ## The quality gate: typecheck + lint + test

storybook: ## Storybook dev server on :6006 (light/dark toolbar)
	npm run storybook

build-storybook: ## Static Storybook into storybook-static/
	npm run build-storybook
