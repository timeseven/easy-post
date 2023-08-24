"use client";
import axios from "axios";
import AddPost from "./components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostType } from "./types/Post";

//Fetch all posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostType[]>({ queryFn: allPosts, queryKey: ["posts"] });
  if (error) return error;
  if (isLoading) return "Loading...";
  return (
    <main>
      <AddPost />
      {data?.map((item) => (
        <Post
          key={item.id}
          comments={item.comments}
          name={item.user.name}
          avatar={item.user.image}
          title={item.title}
          id={item.id}
        />
      ))}
    </main>
  );
}
