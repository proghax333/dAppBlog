import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Container from "@mui/material/Container";
import Header from "./features/blog/Header";
import Footer from "./features/blog/Footer";

import { useContracts } from "./hooks/useContracts";

import HomeLayout from "./features/home/HomeLayout";

import CreatePost from "./features/posts/CreatePost";
import ViewPost from "./features/posts/ViewPost";
import EditPost from "./features/posts/EditPost";

import ViewProfile from "./features/profiles/ViewProfile";
import EditProfile from "./features/profiles/EditProfile";

const sections = [
  { title: "Technology", url: "#" },
  { title: "Design", url: "#" },
  { title: "Culture", url: "#" },
  { title: "Business", url: "#" },
  { title: "Politics", url: "#" },
  { title: "Opinion", url: "#" },
  { title: "Science", url: "#" },
  { title: "Health", url: "#" },
  { title: "Style", url: "#" },
  { title: "Travel", url: "#" },
];

function AppRouter() {
  // eslint-disable-next-line
  const [blogInfo, setBlogInfo] = useState({
    owner: {},
    name: "Loading Blog Name",
  });

  const {
    contracts: { Blog },
  } = useContracts();

  useEffect(() => {
    async function loadBlogInfo() {
      let blogOwnerAddress = await Blog.api.owner();
      let blogOwner = await Blog.api.getProfile(blogOwnerAddress);
      let blogName = await Blog.api.blogName();

      setBlogInfo({
        owner: blogOwner,
        name: blogName,
      });
    }
    loadBlogInfo();
  }, [Blog.api]);

  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Header title={blogInfo.name} sections={sections} />
        <main>
          <Switch>
            <Route exact path="/">
              <HomeLayout />
            </Route>

            {/** Posts */}
            <Route exact path="/posts/create">
              <CreatePost />
            </Route>
            <Route path="/posts/edit/:id" component={EditPost}></Route>
            <Route path="/posts/:id" component={ViewPost}></Route>

            {/** Profile */}
            <Route exact path="/profile/edit" component={EditProfile}></Route>
            <Route path="/profile/:id" component={ViewProfile}></Route>
          </Switch>
        </main>
      </Container>
      <Footer
        title="The dApp Blog"
        description={`Decentralized Blog written in Solidity and React.
  Material UI Blog Template for UI elements.`}
      />
    </BrowserRouter>
  );
}

export default AppRouter;
