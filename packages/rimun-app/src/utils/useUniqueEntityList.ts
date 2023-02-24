import React from "react";
import Rimun from "src/entities";

export default function useUniqueEntityList<T extends Rimun.UniqueEntity>(
  initialState: T[] = []
): [T[], React.Dispatch<React.SetStateAction<T[]>>, (i: T) => void, (i: T) => void] {
  const [items, setItems] = React.useState<T[]>(initialState);

  const updateItem = (item: T) => {
    const _items = [...items];
    console.log(_items);
    const idx = items.findIndex(({ id }) => id === item.id);
    if (idx === -1) return;
    _items[idx] = item;
    setItems(_items);
  };

  const deleteItem = (item: T) => {
    setItems(items.filter((other) => other.id !== item.id));
  };

  return [items, setItems, updateItem, deleteItem];
}
