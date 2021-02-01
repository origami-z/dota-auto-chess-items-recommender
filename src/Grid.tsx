import { useMemo, useState } from "react";

import itemsDataCN from "./items/items_auto_chess_zh-CN.json";
import { DACItem, DACExtendedItem } from "./items/item";

import GridItem from "./components/GridItem";

function getExtendedRecipe(
  item: DACItem,
  idToItemMap: Map<number, DACItem>
): number[] {
  return [
    ...item.recipe,
    ...item.recipe.reduce((all: number[], id: number) => {
      if (idToItemMap.has(id)) {
        all.push(...getExtendedRecipe(idToItemMap.get(id)!, idToItemMap));
      }
      return all;
    }, []),
  ];
}

function Grid() {
  const itemsData = useMemo<Array<DACItem>>(() => itemsDataCN, []);
  const idToItemMap = useMemo<Map<number, DACItem>>(() => {
    const itemMap = new Map();
    itemsData.forEach((item) => itemMap.set(item.id, item));
    return itemMap;
  }, [itemsData]);

  const itemsGroupByTier = useMemo(() => {
    return itemsData.reduce(
      (group, item) => {
        group.get(item.tier)?.push({
          ...item,
          extendedRecipe: getExtendedRecipe(item, idToItemMap),
        });
        return group;
      },
      new Map<number, DACExtendedItem[]>([
        [0, []],
        [1, []],
        [2, []],
        [3, []],
        [4, []],
        [5, []],
      ])
    );
  }, [idToItemMap, itemsData]);

  const [selectedItem, setSelectedItem] = useState<DACItem | null>(null);

  const tierList = [1, 2, 3, 4, 5];

  const handleItemClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: DACItem
  ) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {tierList.map((tier: number) => (
        <div key={`tier-${tier}-column`} id={`tier-${tier}-column`}>
          <h2>Tier {tier}</h2>
          {itemsGroupByTier.get(tier)?.map((item, index) => {
            if (item.hidden) return null;
            return (
              <GridItem
                key={`grid-item-${index}`}
                onClick={handleItemClick}
                item={item}
                idToItemMap={idToItemMap}
                highlight={
                  item.id === selectedItem?.id ||
                  item.extendedRecipe.includes(selectedItem?.id || 0)
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;
