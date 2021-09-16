import React from "react";
import { useContracts } from "../../hooks/useContracts";
import BlogPage from "../blog/Blog";

function HomeLayout() {
  const { loaded } = useContracts();
  return loaded && <BlogPage />;
}

export default HomeLayout;
