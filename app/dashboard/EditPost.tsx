"use client";

import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface EditPost {
  avatar: string;
  name: string;
  title: string;
  id: string;
  comments?: {
    createdAt: string;
    id: string;
    postId: string;
    userId: string;
  }[];
}

export default function EditPost({ avatar, name, title, id, comments }: EditPost) {
  //Toggle
  const [toggle, setToggle] = useState(false);
  const [deleteToastID, setDeleteToastID] = useState("");
  const queryClient = useQueryClient();
  // Delete post
  const { mutate } = useMutation(async (id: string) => await axios.delete("/api/posts/deletePosts", { data: id }), {
    onError: (error) => {
      toast.error("Error deleting that post", { id: deleteToastID });
    },
    onSuccess: (data) => {
      toast.success("Post has been deleted.", { id: deleteToastID });
      queryClient.invalidateQueries(["auth-posts"]);
    },
  });

  const deletePost = () => {
    setDeleteToastID(toast.loading("Deleting your post.", { id: deleteToastID }));
    mutate(id);
  };

  return (
    <>
      <div className="bg-white my-8 p-8 rounded-lg">
        <div className="flex items-center gap-2">
          <Image className="rounded-full" width={32} height={32} src={avatar} alt="avatar" />
          <h3 className="font-bold text-gray-700">{name}</h3>
        </div>
        <div className="my-8">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex gap-4 cursor-pointer items-center">
          <p className="text-sm font-bold text-gray-700">{comments?.length} Comment</p>
          <button
            onClick={() => {
              setToggle(true);
            }}
            className="text-sm font-bold text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  );
}
