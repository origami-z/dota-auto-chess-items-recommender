export interface DACItem {
  localized_name: string;
  localized_name_zh: string;
  name: string;
  url_image: string;
  id: number;
  tier: number;
  recipe: Array<number>;
  extendedRecipe?: Array<number>;
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
        if (extendedRecipe.length > 0) {
          all.push(...extendedRecipe);
        } else {
          all.push(id);
        }
      }
      return all;
    }, []),
  ];
}
