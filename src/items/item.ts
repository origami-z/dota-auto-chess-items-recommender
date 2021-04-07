/**
 * Source for items, can be used for computing other properties in `DACItem`
 */
export interface DACItemBase {
  localized_name: string;
  localized_name_zh: string;
  name: string;
  url_image: string;
  id: number;
  tier: number;
  /**
   * Whether an item should be hidden in the tier list
   */
  hidden?: boolean;
  /**
   * Direct recipe of items id. What's shown in the game.
   */
  recipe: Array<number>;
}
export interface DACItem extends DACItemBase {
  /**
   * Unique item ids that could combine into current item. Contains all decedents.
   */
  extensions: Array<number>;
  /**
   * Fully disassembled item ids for leaf items. Will be itself for leaf level items.
   * Would contain duplicates to show number of items needed.
   */
  extendedRecipe?: Array<number>;
  /**
   * Unique items id that this item could combine into. Contains all ascendent. Reverse idea of `extensions`.
   */
  dependencyOf: Array<number>;
}

export interface DACExtendedItem extends Omit<DACItem, "extendedRecipe"> {
  extendedRecipe: Array<number>;
}

export function getExtendedRecipe(
  item: DACItem,
  idToItemMap: Map<number, DACItem>
): number[] {
  return [
    ...item.recipe.reduce((all: number[], id: number) => {
      if (idToItemMap.has(id)) {
        const extendedRecipe = getExtendedRecipe(
          idToItemMap.get(id)!,
          idToItemMap
        );
        all.push(id);
        // if (extendedRecipe.length > 0) {
        all.push(...extendedRecipe);
        // } else {
        //   all.push(id);
        // }
      }
      return all;
    }, []),
  ];
}

// const idToItemMap = useMemo<Map<number, DACExtendedItem>>(() => {
//   const itemMap = new Map();
//   itemsData.forEach((item) => itemMap.set(item.id, item));
//   return itemMap;
// }, [itemsData]);

// const itemToDependenciesMap = itemsData.map((item) => ({
//   id: item.id,
//   deps: getExtendedRecipe(item, idToItemMap),
// }));
// // "extensions": [131,31,56,27],
// console.log(itemToDependenciesMap);
// const reverseMap = itemToDependenciesMap.reduce((map, item) => {
//   Array.from(new Set(item.deps)).forEach((d) => {
//     if (map.has(d)) {
//       map.get(d)!.push(item.id);
//     } else {
//       map.set(d, [item.id]);
//     }
//   });
//   return map;
// }, new Map<number, number[]>());
// // "dependencyOf": [],
// console.log(reverseMap);
