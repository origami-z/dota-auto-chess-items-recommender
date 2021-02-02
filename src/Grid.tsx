import { ReactText, useEffect, useMemo, useState } from "react";
import { ActionGroup, Item } from "@adobe/react-spectrum";

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
  const [obtainedItemIds, setObtainedItemIds] = useState<number[]>([]);

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

  const handleAction = (action: ReactText) => {
    if (action === "add" && selectedItem) {
      setObtainedItemIds([...obtainedItemIds, selectedItem.id]);
    } else if (action === "remove" && selectedItem) {
      const index = obtainedItemIds.indexOf(selectedItem.id);
      if (index > -1) {
        const newIds = [...obtainedItemIds];
        newIds.splice(index, 1);
        setObtainedItemIds(newIds);
      }
    }
  };

  useEffect(() => {
    console.log(obtainedItemIds);
  }, [obtainedItemIds]);

  const getObtainedItems = () => {
    if (obtainedItemIds.length) {
      return obtainedItemIds.map((id, index) => {
        const obtainedItem = idToItemMap.get(id)!;
        return (
          <GridItem
            key={`obtained-item-${index}`}
            onClick={handleItemClick}
            item={obtainedItem}
            idToItemMap={idToItemMap}
            highlight={obtainedItem.id === selectedItem?.id}
            hideDetails
          />
        );
      });
    } else {
      return "Nothing yet. Good luck. 🥳";
    }
  };

  return (
    <div>
      <h4>Obtained items</h4>
      <div style={{ display: "flex" }}>{getObtainedItems()}</div>
      <h4>Select items below</h4>
      <div>
        <ActionGroup onAction={handleAction}>
          <Item key="add">Add</Item>
          <Item key="remove">Remove</Item>
          {/* <Item key="optimise">Optimise</Item> */}
        </ActionGroup>
      </div>
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
    </div>
  );
}

export default Grid;
