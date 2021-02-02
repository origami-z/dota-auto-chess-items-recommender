import { DOMAttributes, MouseEventHandler } from "react";
import cn from "classnames";
import { DACExtendedItem } from "../items/item";

import classes from "./GridItem.module.css";

function GridItem(
  props: {
    item: DACExtendedItem;
    idToItemMap: Map<number, DACExtendedItem>;
    onClick?: (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      item: DACExtendedItem
    ) => void;
    highlight?: boolean;
    available?: boolean;
    hideDetails?: boolean;
  } & Omit<DOMAttributes<HTMLDivElement>, "onClick">
) {
  const {
    item,
    idToItemMap,
    onClick,
    highlight,
    available,
    hideDetails,
  } = props;

  const handleItemClick: MouseEventHandler<HTMLDivElement> = (e) => {
    onClick?.(e, item);
  };
  return (
    <div
      style={{ display: "flex" }}
      className={cn(classes.item, {
        [classes.gridItemHighlight]: highlight,
        [classes.gridItemAvailable]: available,
        [classes.itemHideDetail]: hideDetails,
      })}
      onClick={handleItemClick}
    >
      <img
        className={classes.image}
        src={item.url_image}
        alt={item.localized_name + "_image"}
      />
      {!hideDetails && (
        <div>
          <div className={classes[`tier${item.tier}`]}>
            {item.localized_name_zh}
          </div>
          <div>
            {item.recipe.map((id: number, index: number) => {
              const mappedItem = idToItemMap.get(id) as DACExtendedItem;

              return (
                <img
                  className={classes.thumbnailImage}
                  src={mappedItem.url_image}
                  alt={mappedItem.localized_name + "_image"}
                  key={`thumbnail-image-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.(e, mappedItem);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default GridItem;
