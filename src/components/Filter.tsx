interface Products {
  name: string;
  image: string;
  id: string;
}

interface Categories {
  id: string;
  name: string;
  products: Products[];
}

const Filter: React.FC<{
  categories: Categories[];
  selectedCategory: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ categories, selectedCategory, onCategoryChange, onSearchChange }) => {
  const uniqueCategories = Array.from(
    new Set(categories.map((category) => category.name))
  ).map((name) => categories.find((category) => category.name === name));

  return (
    <>
      <div className="flex items-end justify-end gap-4 mb-4">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            onChange={onSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Category</span>
          </div>
          <select
            className="select select-bordered"
            value={selectedCategory}
            onChange={onCategoryChange}
          >
            <option value="">All</option>
            {uniqueCategories.map(
              (category) =>
                category && (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                )
            )}
          </select>
        </label>
      </div>
    </>
  );
};

export default Filter;
