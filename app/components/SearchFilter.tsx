import React, {useRef, useEffect, Suspense} from 'react';
import {Signal, useSignal} from '@preact/signals-react';
import type {SearchQuery} from 'storefrontapi.generated';
import {useLocation, useNavigate} from '@remix-run/react';
import {Aside} from './Aside';

type SearchFilterProps = {
  handleFilterChange: (
    arg0: string,
    arg1: string,
    arg2: boolean,
    arg3: string[],
  ) => void;
  searchResults: SearchQuery | null;
  searchTerm: string;
  sortOption: Signal<string>;
  typeFilters: Signal<string[]>;
  availabilityFilters: Signal<string>;
};

type FilterCounts = {
  [key: string]: number;
};

export const typeList = [
  {label: 'All', value: ''},
  {label: 'EXCLUSIVES', value: 'Exclusive'},
  {label: 'Limited Edition', value: 'Limited Edition'},
  {label: 'Adult Figures', value: 'Adult Figures'},
  {label: 'Apparel', value: 'Apparel'},
  {label: 'Accessories', value: 'Accessories'},
  {label: 'Board Games', value: 'Board Games'},
  {label: 'Card Games', value: 'Card Games'},
  {label: 'Cosplay', value: 'Cosplay'},
  {label: 'Figures / Toys', value: 'FIGURES_TOYS'},
  {label: 'Gacha', value: 'Gacha'},
  {label: 'Home Goods', value: 'Homegoods'},
  {label: 'Model Kits', value: 'Model Kit'},
  {label: 'Plush', value: 'Plush'},
  {label: 'Replicas', value: 'Props'},
  // {label: 'Replicas', value: 'Replicas'},  // Uncomment this and comment the other Replicas label to use the product tag of "Replicas" as the qualifier for this filter option.
  {label: 'Trading Cards', value: 'Trading Cards'},
];

const Availability = [
  {label: 'All', value: ''},
  {label: 'In Stock', value: 'In Stock'},
  {label: 'Pre-Order', value: 'Pre-Order'},
];

const SearchFilter: React.FC<SearchFilterProps> = ({
  handleFilterChange,
  searchResults,
  sortOption,
  typeFilters,
  availabilityFilters,
}) => {
  const vendorFilters = useSignal<string[]>([]);
  const showVendorFilters = useSignal(false);

  // Signal to store the dynamically filtered typeList based on search results
  const availableTypeList = useSignal(typeList);
  const showTypeFilters = useSignal(false);

  const showSortFilters = useSignal(false);

  const showAvailabilityFilters = useSignal(false);

  const popupPosition = useSignal({top: 0, left: 0});
  const navigate = useNavigate(); // to trigger Sort via query re-run

  // Define the sort options
  const sortOptions = [
    {label: 'Relevance', value: 'RELEVANCE'},
    {label: 'Name: A - Z', value: 'NAME_ASC'},
    {label: 'Name: Z - A', value: 'NAME_DESC'},
    {label: 'Newest First', value: 'NEWEST_FIRST'},
    {label: 'Oldest First', value: 'OLDEST_FIRST'},
    {label: 'Price Low To High', value: 'PRICE_LOW_TO_HIGH'},
    {label: 'Price High to Low', value: 'PRICE_HIGH_TO_LOW'},
  ];

  const vendorList = useSignal<string[]>([]);
  const location = useLocation();
  // Extract the search term from the URL query parameters
  const searchTerm = new URLSearchParams(location.search).get('q') || '';

  // A ref to track the previous search term
  const prevSearchTerm = useRef<string>();

  const resetFilters = () => {
    typeFilters.value = ['']; // '' represents the 'All' filter
    sortOption.value = 'RELEVANCE'; //  'RELEVANCE' is the default sort option
    availabilityFilters.value = ''; // '' represents the 'All' availability filter
    // Reset vendor filters by unchecking all vendors
    vendorList.value.forEach((vendor) => {
      handleVendorChange(vendor, false);
    });
  };

  useEffect(() => {
    // Reset filters whenever the search term changes
    resetFilters();
    // Additionally, if you need to perform any other actions when the search term changes, you can do so here
  }, [searchTerm]); // This effect depends on searchTerm, so it runs whenever searchTerm changes

  // Dynamically generate vendorList from searchResults
  useEffect(() => {
    // This effect populates the vendor list when the component mounts
    // and when a new search term is detected
    if (!prevSearchTerm.current || prevSearchTerm.current !== searchTerm) {
      const newVendors = new Set<string>();
      searchResults?.products?.nodes.forEach((product) => {
        if (product.vendor) {
          newVendors.add(product.vendor);
        }
      });
      vendorList.value = Array.from(newVendors).sort();
      prevSearchTerm.current = searchTerm;
    }
  }, [searchTerm, searchResults]); // Depend on searchTerm and searchResults

  // Signal for keeping track of counts for each filter
  const filterCounts = useSignal<FilterCounts>({});
  // Update filter counts based on search results
  useEffect(() => {
    const newCounts: FilterCounts = {};
    // Initialize counts
    typeList.forEach((type) => {
      newCounts[type.value] = 0;
    });

    // Calculate counts
    searchResults?.products?.nodes.forEach((product) => {
      product.tags.forEach((tag) => {
        if (newCounts.hasOwnProperty(tag)) {
          newCounts[tag] = (newCounts[tag] || 0) + 1;
        }
      });
    });

    filterCounts.value = newCounts;
  }, [searchResults]);

  // Dynamically update availableTypeList based on search results
  useEffect(() => {
    if (searchResults && searchResults.products) {
      const allTags = new Set(
        searchResults.products.nodes.flatMap((product) => product.tags),
      );
      // Determine if there are any tags outside of those defined in typeList (excluding '' and 'Figures / Toys')
      const predefinedTypeValues = typeList
        .map((type) => type.value)
        .filter((value) => value && value !== 'FIGURES_TOYS');
      const hasExtraTags = [...allTags].some(
        (tag) => !predefinedTypeValues.includes(tag),
      );

      // Filter typeList to include types with matching tags or always include '' (All)
      const filteredTypeList = typeList.filter(
        (type) => allTags.has(type.value) || type.value === '',
      );

      // If there are extra tags, ensure "Figures / Toys" is included
      if (hasExtraTags) {
        const figuresToysType = typeList.find(
          (type) => type.value === 'FIGURES_TOYS',
        );
        if (figuresToysType && !filteredTypeList.includes(figuresToysType)) {
          filteredTypeList.push(figuresToysType);
        }
      }

      availableTypeList.value = filteredTypeList;
    }
  }, [searchResults]);

  const toggleAvailabilityFilters = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    showAvailabilityFilters.value = !showAvailabilityFilters.value;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    // Set the popup position to the bottom right of the button
    popupPosition.value = {
      top: buttonRect.bottom,
      left: buttonRect.right - buttonRect.width,
    };
    // Close other filters
    showVendorFilters.value = false;
    showTypeFilters.value = false;
    showSortFilters.value = false;
  };

  const toggleVendorFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    showVendorFilters.value = !showVendorFilters.value;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    // Set the popup position to the bottom right of the button
    popupPosition.value = {
      top: buttonRect.bottom,
      left: buttonRect.right - buttonRect.width,
    };
    // Close other filters
    showSortFilters.value = false;
    showTypeFilters.value = false;
    showAvailabilityFilters.value = false;
  };

  const toggleSortFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    showSortFilters.value = !showSortFilters.value;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    // Set the popup position to the bottom right of the button
    popupPosition.value = {
      top: buttonRect.bottom,
      left: buttonRect.right - buttonRect.width,
    };
    // Close other filters
    showVendorFilters.value = false;
    showTypeFilters.value = false;
    showAvailabilityFilters.value = false;
    console.log(showSortFilters.value);
  };

  const toggleTypeFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    showTypeFilters.value = !showTypeFilters.value;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    // Set the popup position to the bottom right of the button
    popupPosition.value = {
      top: buttonRect.bottom,
      left: buttonRect.right - buttonRect.width,
    };
    // Close other filters
    showVendorFilters.value = false;
    showSortFilters.value = false;
    showAvailabilityFilters.value = false;
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Check if the clicked element is not within the dropdownRef and not a toggle button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        // Add checks for toggle buttons, e.g., ensure event.target is not one of the toggle buttons
        !event.target.matches('.filter-toggle')
      ) {
        showAvailabilityFilters.value = false;
        showVendorFilters.value = false;
        showSortFilters.value = false;
        showTypeFilters.value = false;
      }
    };

    // Listen for clicks on the entire document
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => document.removeEventListener('click', handleClickOutside);
  }, []); // Dependency array is empty, so this effect runs once on mount and cleanup on unmount

  // Adjusted handle change functions to update signals directly
  const handleVendorChange = (value: string, isChecked: boolean) => {
    // Update the vendor filters based on selection without modifying the vendorList
    const updatedFilters = isChecked
      ? [...vendorFilters.value, value]
      : vendorFilters.value.filter((v) => v !== value);
    vendorFilters.value = updatedFilters;

    // Call the provided filter change handler, which should manage applying the filters
    handleFilterChange('vendor', value, isChecked, updatedFilters);
  };

  // When a sort option is selected, update the sortOption signal passed as a prop
  const handleSortChange = (selectedSortValue: string) => {
    sortOption.value = selectedSortValue; // Update the signal directly with the new value

    // Prepare the new URL with updated sort parameter
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('sort', selectedSortValue);
    const newPath = `${window.location.pathname}?${searchParams.toString()}`;

    // Use navigate to update the URL without reloading the page
    navigate(newPath, {replace: true});
  };

  const handleTypeChange = (typeValue: string, isSelected: boolean) => {
    if (typeValue === '' && isSelected) {
      // Selecting "All" clears all filters except "All" itself
      typeFilters.value = [''];
    } else if (typeValue === 'FIGURES_TOYS') {
      if (isSelected) {
        // Add "Figures / Toys" without removing other filters
        if (!typeFilters.value.includes(typeValue)) {
          typeFilters.value.push(typeValue);
        }
      } else {
        // Remove "Figures / Toys" if deselected
        typeFilters.value = typeFilters.value.filter(
          (value) => value !== typeValue,
        );
      }
    } else {
      if (isSelected) {
        // Deselect "All" if currently selected
        const indexAll = typeFilters.value.indexOf('');
        if (indexAll !== -1) {
          typeFilters.value.splice(indexAll, 1);
        }

        // Add the selected filter
        if (!typeFilters.value.includes(typeValue)) {
          typeFilters.value.push(typeValue);
        }
      } else {
        // Remove the deselected filter
        typeFilters.value = typeFilters.value.filter(
          (value) => value !== typeValue,
        );
      }
    }

    // Trigger update
    typeFilters.value = [...typeFilters.value];
  };

  const handleAvailabilityChange = (value: string, isChecked: boolean) => {
    // Directly set the availabilityFilters to the selected value if checked,
    // or reset to an empty string if "All" is selected or the current filter is deselected
    availabilityFilters.value = isChecked ? value : '';
    // Trigger the filter change with the updated availability filter
    handleFilterChange('Availability', value, isChecked, [value]);
  };

  //********* Filter Aside  *********//
  // ** Toggle Filter Aside visibility
  function FilterAsideToggle() {
    const currentHash = window.location.hash;
    if (currentHash !== '#filter-aside') {
      // Set the hash to open the aside
      window.location.hash = '#filter-aside';
    } else {
      // Remove the hash to close the aside
      window.location.hash = '';
    }
  }

  // Remember to handle the case where the user navigates away from the aside using browser back button or clicks outside
  useEffect(() => {
    // Function to handle clicks outside
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.matches('.filter-toggle') // Assuming all toggle buttons have this class
      ) {
        // Close all dropdowns
        showAvailabilityFilters.value = false;
        showVendorFilters.value = false;
        showSortFilters.value = false;
        showTypeFilters.value = false;
      }
    };

    // Determine if any dropdown is currently active
    const isAnyDropdownActive =
      showAvailabilityFilters.value ||
      showVendorFilters.value ||
      showSortFilters.value ||
      showTypeFilters.value;

    // Add event listener if any dropdown is active
    if (isAnyDropdownActive) {
      document.addEventListener('click', handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [
    showAvailabilityFilters.value,
    showVendorFilters.value,
    showSortFilters.value,
    showTypeFilters.value,
  ]); // Dependency array includes all dropdown state signals

  // ********** ASIDE Functions *************
  // Sort Aside
  const showAsideSort = useSignal(false);
  const toggleSortFiltersAside = () => {
    showAsideSort.value = !showAsideSort.value;
  };
  // Vendor Aside
  const showAsideVendor = useSignal(false);
  const toggleVendorFiltersAside = () => {
    showAsideVendor.value = !showAsideVendor.value;
  };
  // Type Aside
  const showAsideType = useSignal(false);
  const toggleTypeFiltersAside = () => {
    showAsideType.value = !showAsideType.value;
  };
  // Availability Aside
  const showAsideAvailability = useSignal(false);
  const toggleAvailabilityFiltersAside = () => {
    showAsideAvailability.value = !showAsideAvailability.value;
  };

  return (
    <div className=" justify-between mlg:justify-start mlg:gap-16 flex items-center text-lg text-nowrap p-2 rounded-lg border-2 border-gray-600 bg-white w-full">
      {/* Animation set */}
      <style>
        {`
        @keyframes slideDown {
          from {
            transform: scaleY(0);
            opacity: 0;
            transform-origin: top;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
            transform-origin: top;
          }
        }
        .slide-down-enter {
          animation: slideDown 0.3s ease forwards;
        }
      `}
      </style>

      {/* Filter Reset Button */}
      <div>
        <button
          onClick={resetFilters}
          className="hidden sm:block bg-gray-900 text-slate-50 px-2 py-3 rounded-md text-base hover:scale-105 active:scale-95 transition-transform duration-[50ms] ease-in-out"
        >
          Reset Filters
        </button>
      </div>
      {/* Sort Filter */}
      <div className="block relative">
        <button
          className="filter-toggle font-bold hover:scale-105 transition-transform duration-[50ms] ease-in-out"
          aria-expanded={showSortFilters.value}
          onClick={toggleSortFilters}
        >
          Sort {showSortFilters.value ? ' ▲ ' : ' ▼ '}
        </button>
        {showSortFilters.value && (
          <div
            className="absolute mt-1 bg-blue-950 border-2 border-gray-500 px-3 pt-2 min-w-fit w-52 border-r-gray-900 border-b-gray-900 border-b-[5px] border-r-[5px] z-50 rounded-b-xl place-content-center "
            ref={dropdownRef}
          >
            {sortOptions.map((option) => (
              <div key={option.value} className=" mt-1 mb-3 ">
                <label
                  className="flex flex-row font-medium text-base gap-2 hover:scale-105 border-2 hover:border-amber-500 border-gray-500 bg-slate-200 px-2 py-1 rounded-md cursor-pointer slide-down-enter"
                  htmlFor={option.value}
                >
                  <input
                    type="checkbox"
                    className="mt-1 hover:scale-105 hover:bg-blue-600 hover:opacity-50 rounded-sm cursor-pointer"
                    id={option.value}
                    name="sort"
                    value={option.value}
                    checked={sortOption.value === option.value}
                    onChange={(e) => handleSortChange(e.target.value)}
                  />
                  {' ' + option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vendor Filter */}
      <div className="block relative">
        <button
          className="filter-toggle font-bold hover:scale-105 transition-transform duration-[50ms] ease-in-out"
          aria-expanded={showSortFilters.value}
          onClick={toggleVendorFilters}
        >
          Brand {showVendorFilters.value ? ' ▲ ' : ' ▼ '}
        </button>
        {showVendorFilters.value && (
          <div
            className="absolute mt-1 bg-blue-950 border-2 border-gray-500 px-3 pt-2 min-w-fit w-52 border-r-gray-900 border-b-gray-900 border-b-[5px] border-r-[5px] z-50 rounded-b-xl place-content-center "
            ref={dropdownRef}
          >
            {vendorList.value.map((vendor) => (
              <div key={vendor} className=" mt-1 mb-3">
                <label
                  className="flex flex-row font-medium text-base gap-2 hover:scale-105 border-2 hover:border-amber-500 border-gray-500 bg-slate-200 px-2 py-1 rounded-md cursor-pointer slide-down-enter"
                  htmlFor={vendor}
                >
                  {' '}
                  <input
                    type="checkbox"
                    className="mt-1 hover:scale-105 hover:bg-blue-600 hover:opacity-50 rounded-sm cursor-pointer"
                    id={vendor}
                    value={vendor}
                    checked={vendorFilters.value.includes(vendor)}
                    onChange={(e) =>
                      handleVendorChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + vendor}
                  {<br />}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="hidden sm:block relative">
        <button
          className="filter-toggle font-bold hover:scale-105 transition-transform duration-[50ms] ease-in-out"
          aria-expanded={showTypeFilters.value}
          onClick={toggleTypeFilters}
        >
          Type {showTypeFilters.value ? ' ▲ ' : ' ▼ '}
        </button>
        {showTypeFilters.value && (
          <div
            className="absolute mt-1 bg-blue-950 border-2 border-gray-500 px-3 pt-2 min-w-fit w-52 border-r-gray-900 border-b-gray-900 border-b-[5px] border-r-[5px] z-50 rounded-b-xl place-content-center "
            ref={dropdownRef}
          >
            {availableTypeList.value.map(({label, value}) => {
              const productCount = filterCounts.value[value] || 0;
              const displayCount = value === '' ? '' : '(' + productCount + ')';

              // Only render filter if count is greater than 0, or it's the "All" filter
              if (productCount > 0 || value === '') {
                return (
                  <div key={value} className=" mt-1 mb-3">
                    <label className="flex flex-row font-medium text-base gap-2 hover:scale-105 border-2 hover:border-amber-500 border-gray-500 bg-slate-200 px-2 py-1 rounded-md cursor-pointer slide-down-enter">
                      <input
                        type="checkbox"
                        className="mt-1 hover:scale-105 hover:bg-blue-600 hover:opacity-50 rounded-sm cursor-pointer"
                        id={value}
                        value={value}
                        checked={
                          typeFilters.value.length === 0
                            ? value === ''
                            : typeFilters.value.includes(value)
                        }
                        onChange={(e) =>
                          handleTypeChange(e.target.value, e.target.checked)
                        }
                      />
                      {` ${label} ${displayCount}`}
                      <br />
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="hidden sm:block relative">
        <button
          className="filter-toggle py-2 px-1 bg-transparent font-bold hover:scale-105 transition-transform duration-[50ms] ease-in-out"
          aria-expanded={showAvailabilityFilters.value}
          onClick={toggleAvailabilityFilters}
        >
          Availability {showAvailabilityFilters.value ? ' ▲ ' : ' ▼ '}
        </button>
        {showAvailabilityFilters.value && (
          <div
            className="absolute mt-1 bg-blue-950 border-2 border-gray-500 px-3 pt-2 min-w-fit w-52 border-r-gray-900 border-b-gray-900 border-b-[5px] border-r-[5px] z-50 rounded-b-xl place-content-center "
            ref={dropdownRef}
          >
            {Availability.map(({label, value}) => (
              <div key={value} className=" mt-1 mb-3">
                <label
                  className="flex flex-row font-medium text-base gap-2 hover:scale-105 hover:border-amber-500 border-2 border-gray-500 bg-slate-200 px-2 py-1 rounded-md cursor-pointer slide-down-enter"
                  // htmlFor={value}
                >
                  {' '}
                  <input
                    type="checkbox"
                    className="mt-1 hover:scale-105 hover:bg-blue-600 hover:opacity-50 rounded-sm cursor-pointer"
                    id={value}
                    value={value}
                    checked={availabilityFilters.value === value}
                    onChange={(e) =>
                      handleAvailabilityChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + label}
                  {<br />}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={FilterAsideToggle}
        className="bg-gray-900 text-slate-50 px-2 py-3 rounded-md text-base hover:scale-105 active:scale-95 transition-transform duration-[50ms] ease-in-out"
      >
        All Filters
      </button>
      {/* =============================================== */}
      {/* ============== Filter Aside =================== */}
      {/* =============================================== */}
      <Aside id="filter-aside" heading="Select Filters">
        <div className="flex flex-col w-[80%] mx-auto xxs:w-full gap-4 max-h-screen max-w-screen min-w-0 p-2 shadow-md">
          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="text-left px-4 py-2 w-full shadow-sm shadow-black hover:scale-105 hover:bg-red-100 active:scale-95 transition-transform duration-[50ms] ease-in-out"
          >
            Reset Filters
          </button>
          {/* Sort Filter */}
          <div className="w-full py-2">
            <button
              className="text-left px-4 py-2 w-full shadow-sm shadow-black active:scale-100 hover:bg-gray-100 hover:scale-105 transition-transform duration-[50ms] ease-in-out"
              onClick={toggleSortFiltersAside} // Use the new toggle function here
            >
              Sort By {showAsideSort.value ? '▲' : '▼'}
            </button>
            {showAsideSort.value && (
              <div className="flex flex-col ml-4 px-4 py-2 transition-all duration-300 ease-in-out overflow-hidden slide-down-enter shadow-md shadow-black">
                {sortOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex flex-row items-center gap-2 mt-1 mb-3 px-2 py-1 hover:bg-gray-100 rounded-lg hover:border-gray-400 hover:scale-105 cursor-pointer transition-all duration-150 ease-in-out border-2 border-transparent"
                  >
                    <input
                      type="checkbox"
                      className="hover:bg-blue-600 hover:opacity-50 rounded-sm"
                      id={option.value}
                      name="sort"
                      value={option.value}
                      checked={sortOption.value === option.value}
                      onChange={(e) => handleSortChange(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Vendor Filter */}
          <div className="w-full py-2">
            <button
              className="text-left px-4 py-2 w-full shadow-sm shadow-black active:scale-100 hover:bg-gray-100 hover:scale-105 transition-transform duration-[50ms] ease-in-out"
              onClick={toggleVendorFiltersAside}
            >
              Brand {showAsideVendor.value ? '▲' : '▼'}
            </button>
            {showAsideVendor.value && (
              <div className="flex flex-col ml-4 px-4 py-2 transition-all duration-300 ease-in-out overflow-hidden slide-down-enter shadow-md shadow-black">
                {vendorList.value.map((vendor) => (
                  <label
                    key={vendor}
                    className="flex flex-row items-center gap-2 mt-1 mb-3 px-2 py-1 hover:bg-gray-100 rounded-lg hover:border-gray-400 hover:scale-105 cursor-pointer transition-all duration-150 ease-in-out border-2 border-transparent"
                  >
                    <input
                      type="checkbox"
                      className="hover:bg-blue-600 hover:opacity-50 rounded-sm"
                      id={vendor}
                      name="vendor"
                      value={vendor}
                      checked={vendorFilters.value.includes(vendor)}
                      onChange={(e) =>
                        handleVendorChange(e.target.value, e.target.checked)
                      }
                    />
                    {vendor}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="w-full py-2">
            <button
              className="text-left px-4 py-2 w-full shadow-sm shadow-black active:scale-100 hover:bg-gray-100 hover:scale-105 transition-transform duration-[50ms] ease-in-out"
              onClick={toggleTypeFiltersAside}
            >
              Type {showAsideType.value ? '▲' : '▼'}
            </button>
            {showAsideType.value && (
              <div className="flex flex-col ml-4 px-4 py-2 transition-all duration-300 ease-in-out overflow-hidden slide-down-enter shadow-md shadow-black">
                {availableTypeList.value.map(({label, value}) => (
                  <label
                    key={value}
                    className="flex flex-row items-center gap-2 mt-1 mb-3 px-2 py-1 hover:bg-gray-100 rounded-lg hover:border-gray-400 hover:scale-105 cursor-pointer transition-all duration-150 ease-in-out border-2 border-transparent"
                  >
                    <input
                      type="checkbox"
                      className="hover:bg-blue-600 hover:opacity-50 rounded-sm"
                      id={value}
                      name="type"
                      value={value}
                      checked={typeFilters.value.includes(value)}
                      onChange={(e) =>
                        handleTypeChange(e.target.value, e.target.checked)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div className="w-full py-2">
            <button
              className="text-left px-4 py-2 w-full shadow-sm shadow-black active:scale-100 hover:bg-gray-100 hover:scale-105 transition-transform duration-[50ms] ease-in-out"
              onClick={toggleAvailabilityFiltersAside}
            >
              Availability {showAsideAvailability.value ? '▲' : '▼'}
            </button>
            {showAsideAvailability.value && (
              <div className="flex flex-col ml-4 px-4 py-2 transition-all duration-300 ease-in-out overflow-hidden slide-down-enter shadow-md shadow-black">
                {Availability.map(({label, value}) => (
                  <label
                    key={value}
                    className="flex flex-row items-center gap-2 mt-1 mb-3 px-2 py-1 hover:bg-gray-100 rounded-lg hover:border-gray-400 hover:scale-105 cursor-pointer transition-all duration-150 ease-in-out border-2 border-transparent"
                  >
                    <input
                      type="checkbox"
                      className="hover:bg-blue-600 hover:opacity-50 rounded-sm"
                      id={value}
                      name="availability"
                      value={value}
                      checked={availabilityFilters.value === value}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          e.target.value,
                          e.target.checked,
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </Aside>
    </div>
  );
};

export default SearchFilter;

// UNUSED CODE:
//Pre Return Statement:
// const ColFilters = useSignal<string[]>([]);
// const showColFilters = useSignal(false);
// const ExFilters = useSignal<string[]>([]);
// const showExFilters = useSignal(false);
// const toggleColFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
//   showColFilters.value = !showColFilters.value;
//   const buttonRect = event.currentTarget.getBoundingClientRect();
//   // Set the popup position to the bottom right of the button
//   popupPosition.value = {
//     top: buttonRect.bottom,
//     left: buttonRect.right - buttonRect.width,
//   };
// };

// const toggleExFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
//   showExFilters.value = !showExFilters.value;
//   const buttonRect = event.currentTarget.getBoundingClientRect();
//   // Set the popup position to the bottom right of the button
//   popupPosition.value = {
//     top: buttonRect.bottom,
//     left: buttonRect.right - buttonRect.width,
//   };
// };

// const handleExChange = (value: string, isChecked: boolean) => {
//   const updatedFilters = isChecked
//     ? [...ExFilters.value, value]
//     : ExFilters.value.filter((filter) => filter !== value);
//   ExFilters.value = updatedFilters;
//   handleFilterChange('Exclusives', value, isChecked, updatedFilters);
// };

// const handleColChange = (value: string, isChecked: boolean) => {
//   const updatedFilters = isChecked
//     ? [...ColFilters.value, value]
//     : ColFilters.value.filter((filter) => filter !== value);
//   ColFilters.value = updatedFilters;
//   handleFilterChange('Collection', value, isChecked, updatedFilters);
// };

//Return (
{
  /* Collection Filter */
}
{
  /* <div className="block">
        <button
          className="filter-toggle"
          aria-expanded={showColFilters.value}
          onClick={toggleColFilters}
          style={{fontWeight: 'bold'}}
        >
          Collections {showColFilters.value ? '▲' : '▼'}
        </button>
        {showColFilters.value && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.value.top}px`,
              left: `${popupPosition.value.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >
            {CollectionsList.map((col) => (
              <React.Fragment key={col}>
                <label
                  htmlFor={col}
                  style={{
                    fontSize: '12px',
                    marginBottom: '1px',
                  }}
                >
                  <input
                    type="checkbox"
                    id={col}
                    value={col}
                    checked={typeFilters.value.includes(col)}
                    onChange={(e) =>
                      handleColChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + col}
                  {<br />}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div> */
}

{
  /* Exclusive Filter
      <div className="block">
        <button
          className="filter-toggle"
          aria-expanded={showExFilters.value}
          onClick={toggleExFilters}
          style={{fontWeight: 'bold'}}
        >
          Exclusivity {showExFilters.value ? '▲' : '▼'}
        </button>
        {showExFilters.value && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.value.top}px`,
              left: `${popupPosition.value.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >
            {exclusives.map((ex) => (
              <React.Fragment key={ex}>
                <label
                  htmlFor={ex}
                  style={{
                    fontSize: '12px',
                    marginBottom: '1px',
                  }}
                >
                  <input
                    type="checkbox"
                    id={ex}
                    value={ex}
                    checked={ExFilters.value.includes(ex)}
                    onChange={(e) =>
                      handleExChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + ex}
                  {<br />}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div> */
}
