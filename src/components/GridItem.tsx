import { DOMAttributes, MouseEventHandler } from "react";
import cn from "classnames";
import { DACItem } from "../items/item";

import classes from "./GridItem.module.css";

function GridItem(
  props: {
    item: DACItem;
    idToItemMap: Map<number, DACItem>;
    onClick?: (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      item: DACItem
    ) => void;
    highlight?: boolean;
  } & Omit<DOMAttributes<HTMLDivElement>, "onClick">
) {
  const { item, idToItemMap, onClick, highlight } = props;

  const handleItemClick: MouseEventHandler<HTMLDivElement> = (e) => {
    onClick?.(e, item);
  };

  return (
    <div
      style={{ display: "flex" }}
      className={cn(classes.item, {
        [classes.gridItemHighlight]: highlight,
      })}
      onClick={handleItemClick}
    >
      <img
        className={classes.image}
        src={item.url_image}
        alt={item.localized_name + "_image"}
      />
      <div>
        <div>{item.localized_name_zh}</div>
        <div>
          {item.recipe.map((id: number, index: number) => {
            const mappedItem = idToItemMap.get(id) as DACItem;

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
    </div>
  );
}
export default GridItem;
