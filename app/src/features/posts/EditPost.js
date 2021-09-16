import React, { useState, useEffect } from "react";
import MarkdownEditor from "./MarkdownEditor";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  TextField,
  Button,
} from "@mui/material";

// import { useWeb3React } from '@web3-react/core';
import { useContracts } from "../../hooks/useContracts";
import LoadingStatus from "../../ui/LoadingStatus";

function CreatePost({
  match: {
    params: { id },
  },
}) {
  const {
    contracts: { Blog },
  } = useContracts();

  const [postState, setPostState] = useState({
    state: "loading",
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadPost() {
      let postId = id;
      const post = await Blog.api.getPost(postId);

      if (post) {
        setPostState({
          state: "loaded",
        });
        setTitle(post.title);
        setContent(post.content);
      } else {
        setPostState({
          state: "notFound",
        });
      }
    }
    loadPost();
  }, [Blog.api, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting...");
    const postDto = {
      title,
      content,
    };

    async function updatePost() {
      try {
        await Blog.api.updatePost(id, postDto);
        setPostState({
          ...postState,
          state: "updated",
        });
      } catch (e) {
        console.log(e);
        setPostState({
          ...postState,
          state: "failed",
        });
      }
    }

    updatePost();
  };

  let PublishStatus = null;
  switch (postState.state) {
    case "updating": {
      PublishStatus = (
        <LoadingStatus message="Updating your post..." severity="info" />
      );
      break;
    }
    case "updated": {
      PublishStatus = (
        <LoadingStatus
          message="Post updated successfully!"
          severity="success"
          done={true}
        />
      );
      break;
    }
    case "failed": {
      PublishStatus = (
        <LoadingStatus
          message="Error! Post not updated!"
          severity="error"
          done={true}
        />
      );
      break;
    }
    case "loading": {
      PublishStatus = (
        <LoadingStatus message="Loading post..." severity="info" done={true} />
      );
      break;
    }
    default: {
    }
  }

  return (
    <Container>
      <Paper
        sx={{
          margin: "0.5rem 0rem",
          padding: "1rem",
          width: "100%",
          height: "100%",
        }}
      >
        <Stack>
          <Typography variant="h4">Edit Post</Typography>

          <Divider />
          {postState.state !== "loading" && (
            <form onSubmit={handleSubmit}>
              <Stack
                direction="row"
                spacing={1}
                marginY={2}
                alignItems="center"
              >
                <TextField
                  label="Post title"
                  color="primary"
                  focused
                  size="small"
                  sx={{
                    width: "100%",
                  }}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </Stack>
              <div
                style={{
                  margin: "1rem 0",
                }}
              >
                <MarkdownEditor
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                  }}
                />
              </div>
              <Stack direction="row" spacing={1} marginY={2}>
                <Button type="submit" variant="contained">
                  Update Post
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
        {PublishStatus}
      </Paper>
    </Container>
  );
}

export default CreatePost;
