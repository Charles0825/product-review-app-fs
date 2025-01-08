import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  products: Product[];
  category: Category;
  reviews: any[];
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

  return (
    <div>
      <h1>Product Details</h1>
      {productData ? (
        <>
          <p>Name: {productData.name}</p>
          <img src={productData.image} alt={productData.name} />
          <p>
            Price: {productData.currency} {productData.price}
          </p>
          <p>Details: {productData.details}</p>
          <p>Category: {productData.category.name}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
