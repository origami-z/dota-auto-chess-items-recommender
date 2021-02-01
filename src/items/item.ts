export interface DACItem {
  localized_name: string;
  localized_name_zh: string;
  name: string;
  url_image: string;
  id: number;
  tier: number;
  recipe: Array<number>;
  hidden?: boolean;
}

export interface DACExtendedItem extends DACItem {
  extendedRecipe: Array<number>;
}
