import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface ProductCardProps {
  productId: string;
  imageUrl: string;
  productName: string;
  rating: string;
  category: string;
  price: string;
  description: string;
  dateCreated: string;
}

const ProductCard = ({
  imageUrl,
  productName,
  rating,
  category,
  price,
  description,
  dateCreated,
}: ProductCardProps) => {
  return (
    <div className="flex justify-center mt-10">
      <div className="card lg:card-side bg-base-100 shadow-xl rounded-lg overflow-hidden w-full max-w-6xl h-full">
        <figure className="w-full lg:w-1/2 p-8">
          <img
            className="object-cover w-full h-full rounded-md"
            src={imageUrl}
            alt="Album"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = "/no-image-available.jpg";
            }}
          />
        </figure>
        <div className="card-body flex flex-col justify-between w-full lg:w-1/2 p-8 space-y-6">
          <h2 className="card-title text-3xl font-semibold">{productName}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  style={{
                    color:
                      index < Math.round(parseInt(rating)) ? "gold" : "gray",
                  }}
                />
              ))}
            </span>
            <p className="text-sm underline">{rating}</p>
          </div>
          <p className="text-sm ">
            Category: <br />
            {category}
          </p>
          <p className="text-3xl font-bold ">{`${price}`}</p>
          <p className="text-sm ">
            Details: <br />
            {description}
          </p>
          <p className="text-xs ">Date Created: {dateCreated}</p>
          <div className="card-actions">
            <Link to={`/payment/${price}`} className="btn btn-wide btn-primary">
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
