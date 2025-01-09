import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Review {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  content: string;
  rating: number;
  verified: boolean;
  likes: number;
}

interface ReviewsCardProps {
  review: Review;
}

const ReviewsCard = ({ review }: ReviewsCardProps) => {
  const [likes, setLikes] = useState<number>(review.likes);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedReviewIds = JSON.parse(
      localStorage.getItem("reviewId") || "[]"
    );

    if (storedReviewIds.includes(review.id)) {
      setIsEditable(true);
    }
  }, [review.id]);

  const handleLike = async () => {
    try {
      const updatedReview = await axios.put(
        `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/reviews/${review.id}`,
        {
          ...review,
          likes: likes + 1,
        }
      );
      setLikes(updatedReview.data.likes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const reviewId = getReviewIdFromForm(form);
    const updatedReview = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement)
        .value,
      rating: normalizeRating(
        parseInt((form.elements.namedItem("rating") as HTMLSelectElement).value)
      ),
    };

    try {
      const response = await axios.put(
        `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/reviews/${reviewId}`,
        updatedReview
      );
      setReviewData(response.data);
      window.location.reload();
      const modal = document.getElementById(
        "edit_review_modal"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://5ffbed0e63ea2f0017bdb67d.mockapi.io/reviews`
        );
        setAllReviews(response.data);
      } catch (error) {
        console.error("Error fetching all reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleEditClick = (reviewId: string) => {
    const reviewToEdit = allReviews.find((r) => r.id === reviewId);
    if (reviewToEdit) {
      setReviewData(reviewToEdit);
      const modal = document.getElementById(
        "edit_review_modal"
      ) as HTMLDialogElement | null;
      modal?.showModal();
      const form = modal?.querySelector("form") as HTMLFormElement;
      form?.setAttribute("data-review-id", reviewId);
    }
  };

  const getReviewIdFromForm = (form: HTMLFormElement) => {
    return form.getAttribute("data-review-id")!;
  };

  const normalizeRating = (normalizedRating: number) => {
    if (normalizedRating === 5) return 90000;
    if (normalizedRating === 4) return 70000;
    if (normalizedRating === 3) return 50000;
    if (normalizedRating === 2) return 30000;
    return 1;
  };

  const normalizeRating2 = (rating: number) => {
    if (rating >= 90000) return 5;
    if (rating >= 70000) return 4;
    if (rating >= 50000) return 3;
    if (rating >= 30000) return 2;
    return 1;
  };

  useEffect(() => {
    if (reviewData) {
      const form = document.forms.namedItem(
        "edit_review_form"
      ) as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("name") as HTMLInputElement).value =
          reviewData.name;
        (form.elements.namedItem("email") as HTMLInputElement).value =
          reviewData.email;
        (form.elements.namedItem("title") as HTMLInputElement).value =
          reviewData.title;
        (form.elements.namedItem("content") as HTMLTextAreaElement).value =
          reviewData.content;
        (form.elements.namedItem("rating") as HTMLSelectElement).value =
          normalizeRating2(reviewData.rating).toString();
      }
    }
  }, [reviewData]);

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-base-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold">{review.name}</h3>
            <p className="text-sm text-gray-500">{review.email}</p>
          </div>
        </div>
        <div className="mt-2">
          <h4 className="text-xl font-semibold">{review.title}</h4>
          <p className="text-sm text-gray-600">{review.content}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-warning flex space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  className={
                    index < review.rating ? "text-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            </span>
            {review.verified ? (
              <span className="badge badge-success">Verified</span>
            ) : (
              <span className="badge badge-neutral">Not Verified</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{likes}</span>
            </button>
            {isEditable && (
              <button onClick={() => handleEditClick(review.id)}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <dialog
        id="edit_review_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Edit Review Form</h3>
          <form name="edit_review_form" onSubmit={handleSubmitReview}>
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
              <select name="rating" className="select select-bordered" required>
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
    </div>
  );
};

export default ReviewsCard;
