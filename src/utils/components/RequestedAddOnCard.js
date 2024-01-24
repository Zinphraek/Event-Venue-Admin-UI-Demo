import React from "react";
import styles from "./RequestedAddOnCard.module.css";

const RequestedAddOnCard = (props) => {
  const { itemName, itemPrice, quantity } = props;
  return (
    <>
      <div class={styles["container"]}>
        <div class={styles["card-content"]}>
          <input class={styles["box-check"]} type="checkbox" min={1} />
          <div class={styles["item-name"]}>{itemName}</div>
          <div class={styles["item-price"]}>{itemPrice}</div>
          <input
            type="number"
            step="1"
            class={styles["quantity"]}
            value={quantity}
          />
        </div>
      </div>
    </>
  );
};

export default RequestedAddOnCard;
