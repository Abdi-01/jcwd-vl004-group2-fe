import { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { format } from 'date-fns';
import { AiFillStar } from 'react-icons/ai';
import { FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteReviewModal from './DeleteReviewModal';
import EditReviewModal from './EditReviewModal';

const ReviewCard = ({ data, userId, setTotalReviews, setAvgRating, setReviews, setMaxPage, currentPage, limit }) => {
  const [review, setReview] = useState(data);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [anonymus, setAnonymus] = useState(false);
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    setLikes(review.likes?.length);
    setIsLiked(review.likes?.some((like) => like.userId === userId));
    setRating(review.rating);
    setAnonymus(review.is_anonymus);
  }, [review]);

  const renderStars = (score) => {
    let stars = 0;
    const renderedStars = [];

    if (Number.isInteger(score)) {
      stars = score;
    } else {
      stars = Math.floor(score);
    }

    for (let i = 0; i < stars; i++) {
      renderedStars.push(<AiFillStar key={i} />);
    }

    return renderedStars;
  };

  return (
    <div className="w-full rounded-xl flex flex-col bg-white ring-1 ring-sky-200">
      <div className="w-full flex">
        <div className="h-full w-[30%] md:w-[25%] flex flex-col items-center">
          <div className="w-full pt-5 flex justify-center items-center">
            <div className="h-12 w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20 rounded-full bg-gradient-to-br from-sky-300 to-emerald-300 flex justify-center items-center">
              <div className="h-[90%] w-[90%] rounded-full overflow-hidden flex justify-center items-center">
                <img
                  src={anonymus ? `${API_URL}/public/images/profile/default.png` : `${API_URL}/${review.user?.profile_picture}`}
                  className="h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="w-full py-1 px-2 flex flex-col items-center">
            <span className="text-md xl:text-lg font-semibold text-gray-700 max-w-full truncate">
              {anonymus ? review.user?.name[0] + '*******' + review.user?.name[review.user?.name.length - 1] : review.user?.name}
            </span>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 py-1 px-1 sm:px-3 lg:px-1 lg:py-2 xl:py-0 xl:px-2 bg-sky-50 rounded-lg">
              <span className="text-2xl leading-tight xl:text-3xl xl:leading-normal text-sky-600">{likes}</span>
              <div className="flex flex-col justify-center text-xs leading-tight">
                <span>Users found this</span>
                <span>review helpful</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[70%] md:w-[75%] flex flex-col ">
          <div className="w-full flex items-center justify-between py-1">
            <span className="text-md md:text-lg xl:text-xl font-semibold line-clamp-1">{review.title}</span>
            <div className="flex items-center text-amber-300 px-5">{renderStars(rating)}</div>
          </div>
          <div className="h-full w-full pr-4">
            <div className="w-full h-28 rounded-xl bg-gray-100 p-2 text-sm lg:text-md xl:text-base">
              <span>{review.content}</span>
            </div>
          </div>
          <div className="w-full py-2 pr-5 flex gap-1 items-center justify-between text-xs xl:text-sm font-semibold text-gray-500">
            <div className="w-full md:w-1/2 flex justify-start items-center py-1">
              {review.createdAt !== review.updatedAt ? (
                <span>Posted: {format(new Date(review.updatedAt), 'PPP')} (edited)</span>
              ) : (
                <span>Posted: {format(new Date(review.createdAt), 'PPP')}</span>
              )}
            </div>
            {review.userId !== userId && userToken && !adminToken ? (
              <button
                onClick={async () => {
                  try {
                    const response = await Axios.post(`${API_URL}/review/like/${review.id}`, {
                      isLiked: isLiked ? false : true,
                      userId,
                    });

                    setLikes(response.data.totalLikes);
                    setIsLiked(!isLiked);
                  } catch (err) {
                    toast.error('Unable to set Liked!', { position: 'bottom-left', theme: 'colored' });
                  }
                }}
                className={`px-2 md:px-3 py-1 md:py-[6px] xl:py-2 flex justify-center items-center ring-1 ring-emerald-200 rounded-lg text-xs xl:text-sm hover:text-green-300 transition active:scale-95 ${
                  isLiked ? 'text-green-400' : 'text-gray-600'
                }`}
              >
                <FaThumbsUp />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {review.userId === userId || adminToken ? (
        <>
          <div className="w-[95%] h-px bg-emerald-200 mx-auto mb-1"></div>
          <div className="w-full flex justify-center md:justify-end gap-2 pt-1 md:pr-5 pb-3">
            <EditReviewModal review={review} setReview={setReview} setAvgRating={setAvgRating} />
            <DeleteReviewModal
              reviewId={review.id}
              productId={review.productId}
              setTotalReviews={setTotalReviews}
              setAvgRating={setAvgRating}
              setReviews={setReviews}
              setMaxPage={setMaxPage}
              currentPage={currentPage}
              limit={limit}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ReviewCard;
