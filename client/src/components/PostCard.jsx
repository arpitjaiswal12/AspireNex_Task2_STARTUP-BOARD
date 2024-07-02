import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
 

  return (
    <div className="border border-gray-500 shadow-lg h-[350px] rounded-xl sm:w-[350px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[180px] w-full object-cover rounded-t-xl"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-medium text-gray-800 line-clamp-2">
          {post.title}
        </p>
        <span className="text-sm text-gray-500">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="border border-gray-600 text-gray-700 hover:bg-gray-300 hover:text-gray-900 text-center py-2 rounded-md transition-colors duration-300"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
