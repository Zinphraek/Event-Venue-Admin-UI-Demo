import React from "react";
import PropTypes from "prop-types";
import AddOnCard from "./AddOnCard";
import Constants from "../../utils/constants/Constants";
import MultipleSelect from "../../utils/components/MultipleSelect";
import style from "./AddOnsList.module.css";

/**
 * @param {object} param0
 * @returns The list of all addOns present in the database
 */
const AddonsList = ({
  categoryFilters,
  searchQuery,
  onCategoryFilterChange,
  onSearchQueryChange,
  onItemQuantityChange,
  requestedAddOns,
  addOnsData,
}) => {
  const seenCategories = new Set();
  const categories = addOnsData
    .filter((item) => item.category !== Constants.CATEGORY_FACILITY)
    .reduce((uniqueCategories, item) => {
      const categoryValue = item.category;
      const categoryLabel =
        item.category.charAt(0).toUpperCase() + item.category.slice(1);

      // Check if the category is already in the seenCategories Set
      if (!seenCategories.has(categoryValue)) {
        uniqueCategories.push({ value: categoryValue, label: categoryLabel });
        seenCategories.add(categoryValue);
      }

      return uniqueCategories;
    }, []);

  const filterItems = (items, categoryFilters, searchQuery) => {
    return items.filter((item) => {
      if (
        categoryFilters.length > 0 &&
        !categoryFilters.includes(item.category)
      ) {
        return false;
      }
      if (
        searchQuery !== "" &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredItems = filterItems(addOnsData, categoryFilters, searchQuery);

  return (
    <div>
      <div className="mt-4">
        <label className="font-semibold">Categories </label>
        <br />
        <MultipleSelect
          options={categories}
          toggleOption={onCategoryFilterChange}
          selectedOptions={categoryFilters}
        />
      </div>
      <br />
      <div>
        <label
          htmlFor="search"
          className="bg-gray-300 font-semibold border-r-2 border-gray-300 rounded-l px-2 pb-1"
        >
          Search{}
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search add-on here..."
          className="rounded-r pb-1 px-1"
        />
      </div>
      <div className={`h-auto ${style["div-grid"]}`}>
        {filteredItems
          .filter((item) => item.active === true)
          .map((item) => (
            <div key={item.id} className="w-48 p-3">
              <AddOnCard addOn={item} />
              <div>
                <label>
                  Quantity:
                  <input
                    type="number"
                    min="0"
                    className="w-48 rounded border border-gray-300 px-2 py-1"
                    defaultValue={
                      requestedAddOns.find(
                        (requestedAddOn) =>
                          requestedAddOn.addOn.name === item.name
                      )?.quantity
                    }
                    onChange={(event) =>
                      onItemQuantityChange(item, event.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

AddonsList.propTypes = {
  categoryFilters: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onCategoryFilterChange: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onItemQuantityChange: PropTypes.func.isRequired,
  requestedAddOns: PropTypes.array.isRequired,
  addOnsData: PropTypes.array.isRequired,
};

export default AddonsList;
