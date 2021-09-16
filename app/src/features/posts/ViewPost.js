import React, { useState, useEffect } from "react";
import { useContracts } from "../../hooks/useContracts";
import BlogPost from "../blog/BlogPost";
import Container from "@mui/material/Container";

function ViewPost({
  match: {
    params: { id },
  },
}) {
  const [postState, setPostState] = useState({
    post: null,
    state: "loading",
  });
  const {
    contracts: { Blog },
  } = useContracts();

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await Blog.api.getPostWithAuthorProfile(id);
        setPostState({
          post,
          state: "loaded",
        });
      } catch (e) {
        console.log(e);
        setPostState({
          state: "notFound",
        });
      }
    }
    loadPost();
  }, [id, Blog.api]);

  switch (postState.state) {
    case "loading": {
      return <div>Loading Post...</div>;
    }
    case "loaded": {
      return (
        <Container
          maxWidth="lg"
          sx={{
            padding: "1rem",
          }}
        >
          <BlogPost post={postState.post} />
        </Container>
      );
    }
    case "notFound": {
      return <div>Post not found</div>;
    }
    default: {
    }
  }
  return <></>;
}

export default ViewPost;
