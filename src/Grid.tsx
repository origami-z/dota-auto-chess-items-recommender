import { useMemo, useState } from "react";
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  MenuItemProps,
} from "react-contextmenu";

import itemsDataCN from "./items/items_auto_chess_zh-CN.json";
import { DACExtendedItem, DACItem } from "./items/item";

import GridItem from "./components/GridItem";

import classes from "./Grid.module.css";

const CONTEXT_MENU_ID = "CONTEXT_MENU_ID";

const canAssembleItem = (availableIds: number[], extendedRecipe: number[]) => {
  if (availableIds.length === 0) return false;
  const remainingIds = [...availableIds];

  for (let i = 0; i < extendedRecipe.length; i++) {
    const idToCheck = extendedRecipe[i];
    const index = remainingIds.indexOf(idToCheck);
    if (index > -1) {
      remainingIds.splice(index, 1);
    } else {
      return false;
    }
  }
  return true;
};

function Grid() {
  const itemsData = useMemo<Array<DACExtendedItem>>(
    () =>
      itemsDataCN.map((i) => ({
        ...i,
        extendedRecipe: i.extendedRecipe || [i.id],
      })),
    []
  );
  const idToItemMap = useMemo<Map<number, DACExtendedItem>>(() => {
    const itemMap = new Map();
    itemsData.forEach((item) => itemMap.set(item.id, item));
    return itemMap;
  }, [itemsData]);

  const itemsGroupByTier = useMemo(() => {
    return itemsData.reduce(
      (group, item) => {
        group.get(item.tier)?.push(item);
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
  }, [itemsData]);

  const [selectedItem, setSelectedItem] = useState<DACExtendedItem | null>(
    null
  );
  const [obtainedItemIds, setObtainedItemIds] = useState<number[]>([]);
  const [showPossibility, setShowPossibility] = useState(false);
  // const [disassembledItemIds, setOptimizedItemIds] = useState<number[]>([]);

  const tierList = [1, 2, 3, 4, 5];

  const handleItemClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: DACExtendedItem
  ) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const getOptimizedItemIds = (
    ids: number[],
    idToItemMap: Map<number, DACExtendedItem>
  ): number[] => {
    const disassembledIds = ids.reduce((all: number[], id) => {
      all.push(...idToItemMap.get(id)!.extendedRecipe);
      return all;
    }, []);

    return disassembledIds;
  };

  const handleItemChange = (action: "add" | "remove", item: DACItem) => {
    if (action === "add") {
      setObtainedItemIds([...obtainedItemIds, item.id]);
    } else if (action === "remove") {
      const index = obtainedItemIds.indexOf(item.id);
      if (index > -1) {
        const newIds = [...obtainedItemIds];
        newIds.splice(index, 1);
        setObtainedItemIds(newIds);
      }
    } else if (action === "clear") {
      setObtainedItemIds([]);
    }
  };

  const disassembledItemIds = useMemo(
    () => getOptimizedItemIds(obtainedItemIds, idToItemMap),
    [idToItemMap, obtainedItemIds]
  );

  const renderItemsFromId = (ids: number[], emptyMessage?: string) => {
    if (ids.length) {
      return ids.map((id, index) => {
        const obtainedItem = idToItemMap.get(id)!;
        return (
          <ContextMenuTrigger
            key={`grid-item-trigger-${index}`}
            id={CONTEXT_MENU_ID}
            collect={(props) => {
              return { ...props, item: obtainedItem };
            }}
          >
            <GridItem
              key={`obtained-item-${index}`}
              onClick={handleItemClick}
              item={obtainedItem}
              idToItemMap={idToItemMap}
              highlight={obtainedItem.id === selectedItem?.id}
              hideDetails
            />
          </ContextMenuTrigger>
        );
      });
    } else {
      return emptyMessage;
    }
  };

  const handleContextMenuClick: MenuItemProps["onClick"] = (e, data) => {
    const { action, item } = data as any;
    handleItemChange(action, item);
  };

  const togglePossibility = () => {
    // setSelectedItem(null);
    setShowPossibility((preValue) => !preValue);
  };

  const visibilityToggleText =
    (showPossibility ? "Hide" : "Show") + " Possibility";

  return (
    <>
      <div>
        <h4>Obtained items</h4>
        <div className={classes.obtainedItems}>
          {renderItemsFromId(
            obtainedItemIds,
            "Nothing yet. Right click items below to add. Good luck. 🥳"
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowY: "auto",
          minWidth: 850,
        }}
      >
        {tierList.map((tier: number) => (
          <div key={`tier-${tier}-column`} id={`tier-${tier}-column`}>
            <h2>Tier {tier}</h2>
            {itemsGroupByTier.get(tier)?.map((item, index) => {
              if (item.hidden) return null;
              return (
                <ContextMenuTrigger
                  key={`grid-item-trigger-${index}`}
                  id={CONTEXT_MENU_ID}
                  collect={(props) => {
                    return { ...props, item };
                  }}
                >
                  <GridItem
                    key={`grid-item-${index}`}
                    onClick={handleItemClick}
                    item={item}
                    idToItemMap={idToItemMap}
                    selected={item.id === selectedItem?.id}
                    highlight={item.extensions.includes(selectedItem?.id || 0)}
                    available={
                      showPossibility &&
                      canAssembleItem(disassembledItemIds, item.extendedRecipe)
                    }
                  />
                </ContextMenuTrigger>
              );
            })}
          </div>
        ))}
        <ContextMenu id={CONTEXT_MENU_ID} className={classes.contextMenu}>
          <MenuItem
            data={{ action: "add" }}
            onClick={handleContextMenuClick}
            className={classes.contextMenuItem}
          >
            Add
          </MenuItem>
          <MenuItem
            data={{ action: "remove" }}
            onClick={handleContextMenuClick}
            className={classes.contextMenuItem}
          >
            Remove
          </MenuItem>
          <MenuItem divider className={classes.contextMenuItemDivider} />
          <MenuItem
            data={{ action: "clear" }}
            onClick={handleContextMenuClick}
            className={classes.contextMenuItem}
          >
            Clear
          </MenuItem>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={togglePossibility}
            className={classes.contextMenuItem}
          >
            {visibilityToggleText}
          </MenuItem>
        </ContextMenu>
      </div>
    </>
  );
}

export default Grid;
