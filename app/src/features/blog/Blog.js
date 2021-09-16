import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

import Main from "./Main";
import Sidebar from "./Sidebar";
import GitHubIcon from "@mui/icons-material/GitHub";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";

import { useContracts } from "../../hooks/useContracts";

const sidebar = {
  title: "About",
  description:
    "dAppBlog is a decentralized blog website where any entity can create blog posts without censoring. Authors can be appreciated by tipping them with Ether(ETH).",
  archives: [
    { title: "March 2020", url: "#" },
    { title: "February 2020", url: "#" },
    { title: "January 2020", url: "#" },
    { title: "November 1999", url: "#" },
    { title: "October 1999", url: "#" },
    { title: "September 1999", url: "#" },
    { title: "August 1999", url: "#" },
    { title: "July 1999", url: "#" },
    { title: "June 1999", url: "#" },
    { title: "May 1999", url: "#" },
    { title: "April 1999", url: "#" },
  ],
  social: [
    { name: "GitHub", icon: GitHubIcon, link: "https://github.com/proghax333" },
  ],
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const {
    contracts: { Blog },
  } = useContracts();

  useEffect(() => {
    async function loadPosts() {
      let posts = await Blog.api.getPosts();
      posts = posts.map((post) => {
        return {
          ...post,
        };
      });

      for (const post of posts) {
        post.extras = {
          author: await Blog.api.getProfile(post.author),
        };
      }

      setPosts(posts);
    }
    loadPosts();
  }, [Blog.api]);

  return (
    <Grid container spacing={5} sx={{ mt: 3 }}>
      <Main title="All Posts" posts={posts} />
      <Sidebar
        title={sidebar.title}
        description={sidebar.description}
        archives={sidebar.archives}
        social={sidebar.social}
      />
    </Grid>
  );
}
