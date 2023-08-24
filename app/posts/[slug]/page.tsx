"use client";

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Post";
import { PostDetail } from "@/app/types/PostDetail";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import moment from "moment";

interface URL {
  params: {
    slug: string;
  };
}

const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const { data, isLoading } = useQuery<PostDetail>({
    queryFn: () => fetchDetails(url.params.slug),
    queryKey: ["detail-post"],
  });
  if (isLoading) return "Loading...";
  return (
    <div>
      {data && (
        <>
          <Post
            id={data.id}
            key={data.id}
            name={data.user.name}
            avatar={data.user.image}
            title={data.title}
            comments={data.comments}
          />
          <AddComment id={data.id} />
          {data.comments?.map((comment) => (
            <div key={comment.id} className="bg-white my-8 p-8 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="rounded-full" width={32} height={32} src={comment?.user.image} alt="avatar" />
                <h3 className="font-bold ">{comment?.user?.name}</h3>
                <h2 className="text-sm">{moment(comment.createdAt).format("hh:mm DD-MMM-yyyy")}</h2>
              </div>
              <div className="my-8">
                <p className="break-all">{comment.message}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
