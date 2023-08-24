"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type PostProps = {
  id?: string;
};

type Comment = {
  postId?: string;
  title: string;
};

export default function AddComment({ id }: PostProps) {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [toastCommentID, setToastCommentID] = useState("");
  const queryClient = useQueryClient();
  const { mutate } = useMutation(async (data: Comment) => axios.post("/api/posts/addComment", { data }), {
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.message, { id: toastCommentID });
      }
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Comment has been made.", { id: toastCommentID });
      queryClient.invalidateQueries(["detail-post"]); // fetch comment
      setTitle("");
      setIsDisabled(false);
    },
  });
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastCommentID(toast.loading("Creating your comment.", { id: toastCommentID }));
    setIsDisabled(true);
    mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitComment} className="my-8">
      <h3>Add a comment</h3>
      <div className="flex flex-col my-4">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          name="title"
          className="p-4 text-lg rounded-md my-2"
        />
      </div>
      <div className="flex items-cent justify-end gap-2">
        <p
          className={`font-bold mt-2 text-sm ${title.length > 150 ? "text-red-700" : "text-gray-700"}`}
        >{`${title.length}/150`}</p>
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Add Comment 🚀
        </button>
      </div>
    </form>
  );
}
