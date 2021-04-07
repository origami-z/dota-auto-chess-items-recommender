# Dota 2 Auto Chess Items Recommender

This project aims to help players not familiar with items combination the advice for optimizing items.

## Auto Chess Version Update

When items information updates after an Auto Chess version update

- Update core item information in `src/items/items_auto_chess_zh-CN.json`, e.g. `name`, `recipe`, `tier`
- run `scripts/generateSource.ts` file, which updates computed properties, e.g. `extendedRecipe`, `dependencyOf`, `extensions`
- compare changes to `src/items/items_auto_chess_zh-CN.json`
