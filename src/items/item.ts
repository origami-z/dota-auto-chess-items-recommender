export interface DACItem {
  localized_name: string;
  localized_name_zh: string;
  name: string;
  url_image: string;
  id: number;
  tier: number;
  /**
   * Direct recipe of items id
   */
  recipe: Array<number>;
  /**
   * Items id that could combine to this item
   */
  extensions: Array<number>;
  /**
   * Fully disassembled items id
   */
  extendedRecipe?: Array<number>;
  /**
   * Items id that this item could combine into
   */
  dependencyOf: Array<number>;
  hidden?: boolean;
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
