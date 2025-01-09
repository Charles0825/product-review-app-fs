import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";
import axios from "axios";
import ProductReviews from "./ProductReviews";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
interface Review {
  id: string;
  productId: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  content: string;
  rating: number;
  title: string;
  verified: boolean;
  likes: number;
}

interface Product {
  name: string;
  image: string;
  price: string;
  currency: string;
  details: string;
}

interface Category {
  createdAt: string;
  name: string;
  id: string;
  category: string;
  reviewCount: number;
}

interface ProductData {
  createdAt: string;
  name: string;
  image: string;
  price: string;
  currency: string;
  details: string;
  id: string;
  categoryId: string;
  products: Product;
  category: Category;
  reviews: Review[];
}

const ProductDetails: React.FC = () => {
  const { categoryId, productId } = useParams<{
    categoryId: string;
    productId: string;
  }>();
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    axios
      .get(
        `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/categories/${categoryId}/products/${productId}`
      )
      .then((response) => setProductData(response.data))
      .catch((error) => console.error(error));
  }, [productId]);

  const normalizeRating = (rating: number) => {
    if (rating >= 90000) return 5;
    if (rating >= 70000) return 4;
    if (rating >= 50000) return 3;
    if (rating >= 30000) return 2;
    return 1;
  };

  const calculateOverallRating = () => {
    if (
      productData?.reviews &&
      Array.isArray(productData.reviews) &&
      productData.reviews.length > 0
    ) {
      const totalRatings = productData.reviews.reduce(
        (sum, review) => sum + normalizeRating(review.rating),
        0
      );
      return (totalRatings / productData.reviews.length).toFixed(2);
    }
    return "0";
  };

  return (
    <div className="container mx-auto">
      {productData ? (
        <>
          <Navbar />
          <ul className="menu menu-horizontal bg-base-200 rounded-box mt-6">
            <li>
              <Link
                to={"/"}
                className="tooltip"
                data-tip="Go back to product list"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span> Back</span>
              </Link>
            </li>
          </ul>
          <ProductCard
            productId={productData.id}
            imageUrl={productData.image}
            productName={productData.name}
            rating={calculateOverallRating()}
            category={productData.category.name}
            price={productData.currency + productData.price}
            description={productData.details}
            dateCreated={new Date(productData.createdAt).toLocaleDateString()}
          />
          <ProductReviews
            productId={productData.id}
            categoryId={productData.category.id}
          />
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
