import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Rating from "react-rating-stars-component";
import StarRatings from 'react-star-ratings';
import NavTourist from "./NavTourist";

export default function MainTourist() {
  const location = useLocation();
  const { heading, img, para, website, webname,  location: touristLocation } = location.state;

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch reviews from the backend on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://navizitbackend.onrender.com/test/reviews/${touristLocation}`
        );
        setReviews(response.data); // Store the fetched reviews
        calculateAverageRating(response.data); // Calculate the average rating
      } catch (error) {
        console.log("Error fetching reviews:", error);
      }
    };

    fetchReviews(); // Call the fetch function
  }, [touristLocation]); // Re-fetch reviews whenever the touristLocation changes

  // Calculate average rating based on current reviews
  const calculateAverageRating = (reviewsData) => {
    if (reviewsData.length === 0) {
      setAverageRating(0);
      return;
    }

    const totalRating = reviewsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = (totalRating / reviewsData.length).toFixed(1);
    setAverageRating(parseFloat(avgRating));
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || comment === "") {
      alert("Please provide both a rating and a comment.");
      return;
    }

    // Get the user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("User not logged in. Please log in to submit a review.");
      return;
    }

    // Prepare the new review payload
    const newReview = {
      rating,
      comment,
      touristLocation,
      user: user.username, // Pass the username
      initial: user.username.charAt(0).toUpperCase(), // First letter of the username
    };

    try {
      const response = await axios.post(
        "https://navizitbackend.onrender.com/test/reviews",
        newReview
      );
      const updatedReviews = [response.data, ...reviews]; // Add new review to the beginning of the array
      setReviews(updatedReviews); // Update reviews state
      calculateAverageRating(updatedReviews); // Recalculate average rating after adding new review
      setRating(0); // Reset rating input
      setComment(""); // Reset comment input
    } catch (error) {
      console.error("Error submitting the review:", error);
    }
  };

  // Toggle description expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Render the description with "Read More"
  const renderDescription = () => {
    const shortText = para.slice(0, 150); // Show first 150 characters
    return isExpanded ? para : `${shortText}...`;
  };

  return (
    <>
      <NavTourist />

      <div className="container mx-auto p-6">
        <section className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="md:w-1/2">
              <img
                src={img}
                alt={heading}
                className="rounded-xl shadow-xl object-cover w-full h-[360px]"
              />
            </div>
            <div className="mt-4 md:mt-0 md:w-1/2">
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <div className="flex items-center mb-2 h-[30px]">
                  <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>
                  <p className="text-gray-700">{touristLocation}</p>
                </div>
                <hr />
                <div className="flex items-center mb-2 h-[30px]">
                  <i className="fa-solid fa-dollar-sign mr-2 text-gray-500"></i>
                  <p className="text-gray-700">Free</p>
                </div>
                <hr />
                <div className="flex items-center mb-2 h-[30px]">
                  <i className="fa-solid fa-clock mr-2 text-gray-500"></i>
                  <p className="text-gray-700">24/7</p>
                </div>
                <hr />
                <div className="flex items-center h-[30px]">
                  <i className="fa-solid fa-earth-americas text-gray-500"></i>
                  <p className="text-gray-700">
                    <a
                      href={website}
                      className="text-blue-600 ml-2"
                    >
                      {webname}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="flex flex-col mt-6">
            <div className="flex items-center">
            <StarRatings
              

                    rating={averageRating}
                    starRatedColor="gold" // Color for filled stars
                    starEmptyColor="gray" // Color for empty stars
                    numberOfStars={5}
                    starDimension="24px" // Star size
                    starSpacing="3px" // Space between stars
                    name='rating'
                />

              <span className="ml-2 text-gray-700">{averageRating} / 5</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-700">{renderDescription()}</p>
            <button className="text-blue-600" onClick={toggleExpanded}>
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <h2 className="text-lg font-semibold">Leave a Review</h2>
            <div className="flex items-center mb-4">
              <Rating
                count={5}
                onChange={handleRatingChange}
                size={24}
                activeColor="#ffd700"
                color="#d1d5db"
              />
            </div>
            <textarea
              className="w-full border rounded-lg p-2"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2"
            >
              Submit Review
            </button>
          </form>

          {/* Reviews Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Reviews</h2>
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex flex-col mb-2">
                  <div className="flex items-center mb-2 font-semibold">
                    <span className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mr-2">
                      {review.initial} {/* Display the initial */}
                    </span>
                    <span>{review.user}</span> {/* Display the username */}
                  </div>
                  <Rating
                    count={5}
                    value={parseFloat(review.rating)}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    color="#d1d5db"
                  />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
