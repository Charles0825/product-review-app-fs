// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

// interface Product {
//   productName: string;
//   category: string;
//   numberOfReviews: string;
//   imageUrl: string;
// }

interface Product {
  productId: string;
  categoryId: string;
  productName: string;
  categoryName: string;
  numberOfReviews: string;
  imageUrl: string;
}

const Card: React.FC<Product> = ({
  productId,
  categoryId,
  productName,
  categoryName,
  numberOfReviews,
  imageUrl,
}) => {
  return (
    <Link
      to={`/${categoryId}/products/${productId}`}
      className="card bg-base-100 w-96 shadow-xl cursor-pointer opacity-100 hover:opacity-70 duration-300"
    >
      <figure>
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-60 object-cover rounded-t-lg"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/no-image-available.jpg";
          }}
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold">{productName}</h2>
        <p className="text-gray-500">{categoryName}</p>
        <span>{numberOfReviews} reviews</span>
      </div>
    </Link>
  );
};

export default Card;
