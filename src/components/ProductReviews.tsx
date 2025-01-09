import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewsCard from "./ReviewsCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface ProductReviewsProps {
  productId: string;
  categoryId: string;
}

interface Review {
  id: string;
  productId: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  content: string;
  rating: string;
  title: string;
  verified: boolean;
  likes: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  categoryId,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [overallRating, setOverallRating] = useState<string>("0");
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get(
        `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/reviews?productId=${productId}`
      )
      .then((response) => {
        const filteredData = response.data.filter(
          (review: Review) => review.productId === productId
        );
        const sortedReviews = filteredData.sort(
          (a: Review, b: Review) => b.likes - a.likes
        );
        setReviews(sortedReviews);
        setFilteredReviews(sortedReviews);
        setOverallRating(calculateOverallRating(sortedReviews));
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [productId]);

  const normalizeRating = (rating: number) => {
    if (rating >= 90000) return 5;
    if (rating >= 70000) return 4;
    if (rating >= 50000) return 3;
    if (rating >= 30000) return 2;
    return 1;
  };

  const calculateOverallRating = (reviews: Review[]) => {
    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      const totalRatings = reviews.reduce(
        (sum, review) => sum + normalizeRating(Number(review.rating)),
        0
      );
      return (totalRatings / reviews.length).toFixed(2);
    }
    return "0";
  };

  const handleFilterChange = (rating: string) => {
    setSelectedRating(rating);
    if (rating === "All") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (review) => normalizeRating(Number(review.rating)) === parseInt(rating)
      );
      setFilteredReviews(filtered);
    }
  };

  const countRating = (rating: string) => {
    return reviews.filter(
      (review) => normalizeRating(Number(review.rating)) === parseInt(rating)
    ).length;
  };

  const mapRatingToRawValue = (normalizedRating: number): number => {
    switch (normalizedRating) {
      case 1:
        return 12925;
      case 2:
        return 30000;
      case 3:
        return 50000;
      case 4:
        return 70000;
      case 5:
        return 92139;
      default:
        return 12925; // Default case, if something unexpected occurs
    }
  };

  //   const handleSubmitReview = (event: React.FormEvent) => {
  //     event.preventDefault();

  //     const formData = new FormData(event.target as HTMLFormElement);
  //     const name = formData.get("name") as string;
  //     const email = formData.get("email") as string;
  //     const title = formData.get("title") as string;
  //     const content = formData.get("content") as string;
  //     const rating = formData.get("rating") as string;

  //     const normalizedRating = parseInt(rating);
  //     const rawRating = mapRatingToRawValue(normalizedRating);

  //     const newReview = {
  //       productId: productId,
  //       createdAt: new Date().toISOString(),
  //       name: name,
  //       avatar:
  //         "https://img.freepik.com/free-vector/hand-drawn-cartoon-monkey-face-illustration_23-2150497743.jpg",
  //       email: email,
  //       content: content,
  //       rating: rawRating,
  //       title: title,
  //       verified: true,
  //       likes: 0,
  //     };

  //     axios
  //       .post(
  //         `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/categories/${categoryId}/products/${productId}/reviews`,
  //         newReview
  //       )
  //       .then((response) => {
  //         setReviews([response.data, ...reviews]);
  //         setFilteredReviews([response.data, ...filteredReviews]);
  //         setOverallRating(calculateOverallRating([response.data, ...reviews]));
  //         const modal = document.getElementById(
  //           "add_review_modal"
  //         ) as HTMLDialogElement | null;
  //         modal?.close();
  //       })
  //       .catch((error) => {
  //         setError(true);
  //         console.error("Error submitting review:", error);
  //       });
  //   };

  const handleSubmitReview = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const rating = formData.get("rating") as string;

    const normalizedRating = parseInt(rating);
    const rawRating = mapRatingToRawValue(normalizedRating);

    const newReview = {
      productId: productId,
      createdAt: new Date().toISOString(),
      name: name,
      avatar:
        "https://img.freepik.com/free-vector/hand-drawn-cartoon-monkey-face-illustration_23-2150497743.jpg",
      email: email,
      content: content,
      rating: rawRating,
      title: title,
      verified: true,
      likes: 0,
    };

    axios
      .post(
        `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/categories/${categoryId}/products/${productId}/reviews`,
        newReview
      )
      .then((response) => {
        setReviews([response.data, ...reviews]);
        setFilteredReviews([response.data, ...filteredReviews]);
        setOverallRating(calculateOverallRating([response.data, ...reviews]));

        const reviewIds = JSON.parse(localStorage.getItem("reviewId") || "[]");
        reviewIds.push(response.data.id);
        localStorage.setItem("reviewId", JSON.stringify(reviewIds));

        const modal = document.getElementById(
          "add_review_modal"
        ) as HTMLDialogElement | null;
        modal?.close();
      })
      .catch((error) => {
        setError(true);
        console.error("Error submitting review:", error);
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Product Reviews</h1>
      <div className="flex items-center justify-between bg-base-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold">{overallRating} out of 5</h2>
          <span className="flex space-x-1 text-warning">
            {Array.from({ length: Math.round(Number(overallRating)) }).map(
              (_, index) => (
                <FontAwesomeIcon key={index} icon={faStar} />
              )
            )}
            {Array.from({ length: 5 - Math.round(Number(overallRating)) }).map(
              (_, index) => (
                <FontAwesomeIcon
                  key={index + 5}
                  icon={faStar}
                  className="text-gray-400"
                />
              )
            )}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <ul className="flex space-x-2">
            {["5", "4", "3", "2", "1"].map((rating) => (
              <li key={rating}>
                <button
                  className={`btn btn-sm btn-outline ${
                    selectedRating === rating ? "btn-active" : ""
                  }`}
                  onClick={() => handleFilterChange(rating)}
                >
                  {rating} Star ({countRating(rating)})
                </button>
              </li>
            ))}
          </ul>
          {/* --------------------------------------------------------- */}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              const modal = document.getElementById(
                "add_review_modal"
              ) as HTMLDialogElement | null;
              modal?.showModal();
            }}
          >
            Add Review
          </button>
          <dialog
            id="add_review_modal"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              {error && (
                <div role="alert" className="alert alert-error mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Unable to save data, limit reached.</span>
                </div>
              )}
              <h3 className="font-bold text-lg text-center">Add Review Form</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-control">
                  <label className="label">Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Title</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Review Title"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Content</label>
                  <textarea
                    name="content"
                    placeholder="Your Review"
                    className="textarea textarea-bordered"
                    required
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label">Rating</label>
                  <select
                    name="rating"
                    className="select select-bordered"
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn">
                    Submit
                  </button>
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </form>
            </div>
          </dialog>

          {/* --------------------------------------------------------- */}
        </div>
      </div>
      {filteredReviews.map((review) => (
        <ReviewsCard
          key={review.id}
          review={{
            id: review.id,
            authorName: review.name,
            authorEmail: review.email,
            authorImage: review.avatar,
            title: review.title,
            content: review.content,
            rating: normalizeRating(Number(review.rating)),
            verified: review.verified,
            likes: review.likes,
          }}
        />
      ))}
    </div>
  );
};

export default ProductReviews;
