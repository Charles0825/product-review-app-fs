import Card from "./Card.tsx";
import Navbar from "./Navbar.tsx";
import Filter from "./Filter.tsx";
import axios from "axios";
import { useEffect, useState } from "react";

interface Products {
  name: string;
  image: string;
  id: string;
  reviews: object[];
}

interface Categories {
  id: string;
  name: string;
  products: Products[];
}

function ProductListing() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Categories[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://5ffbed0e63ea2f0017bdb67d.mockapi.io/categories?sortBy=createdAt&order=desc"
      )
      .then((res) => {
        setCategories(res.data);
        setFilteredCategories(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://5ffbed0e63ea2f0017bdb67d.mockapi.io/reviews")
      .then((res) => {
        setReviews(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews", error);
      });
  }, []);

  useEffect(() => {
    let filtered = categories;

    if (selectedCategory) {
      filtered = filtered.filter(
        (category) => category.name === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.map((category) => ({
        ...category,
        products: category.products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
    }

    setFilteredCategories(filtered);
  }, [searchQuery, selectedCategory, categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getReviewCountForProduct = (productId: string): number => {
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );
    return productReviews.length;
  };

  return (
    <div className="container mx-auto">
      <Navbar />
      <Filter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />
      <div className="flex justify-center flex-wrap gap-4 mt-10">
        {filteredCategories.map(
          (category) =>
            category.products.length > 0 &&
            category.products.map((product) => (
              <Card
                key={product.id}
                productId={product.id}
                categoryId={category.id}
                productName={product.name}
                categoryName={category.name}
                numberOfReviews={getReviewCountForProduct(
                  product.id
                ).toString()}
                imageUrl={product.image}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default ProductListing;
