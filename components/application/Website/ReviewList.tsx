import { FilePath } from "@/lib/ExportFiles";
import { Review } from "@/types/webAppDataType/types";
import React from "react";
import Image from 'next/image'
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoStar } from "react-icons/io5";
dayjs.extend(relativeTime);

interface ReviewListProps{
    review:Review;
}
const ReviewList = ({ review }:ReviewListProps) => {
  return (
    <div className="flex gap-5">
        <div className="w-[60px]">
            <Image src={review?.avatar?.url || FilePath.user.src} alt={"User Icon"} className="rounded-lg" width={55} height={55} />
        </div>
        <div className="w-[calc(100%-100px)]">
            <div>
                <h4 className="text-xl font-semibold">{review.title}</h4>
                <p className="flex gap-2 items-center">
                    <span className="font-medium">{review.reviewedBy}</span>
                    -
                    <span className="font-medium">{dayjs(review.createdAt).fromNow()}</span>
                    <span className="flex items-center text-xs gap-1 mb-1">({review.rating}   <IoStar className="text-yellow-500" />) </span>
                </p>
                <p className="mt-4 text-gray-600">{review.review}</p>
            </div>
        </div>
    </div>
  );
};

export default ReviewList;
