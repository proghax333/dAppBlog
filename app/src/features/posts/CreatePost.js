import React, { useState } from "react";
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

function CreatePost() {
  const {
    contracts: { Blog },
  } = useContracts();

  const [postStatus, setPostStatus] = useState("none");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const postDto = {
      title,
      content,
    };

    async function addPost() {
      try {
        await Blog.api.addPost(postDto);
        setPostStatus("published");
      } catch (e) {
        setPostStatus("failed");
      }
    }

    addPost();
  };

  let PublishStatus = null;
  switch (postStatus) {
    case "publishing": {
      PublishStatus = (
        <LoadingStatus message="Publishing your post..." severity="info" />
      );
      break;
    }
    case "published": {
      PublishStatus = (
        <LoadingStatus
          message="Post published successfully!"
          severity="success"
          done={true}
        />
      );
      break;
    }
    case "failed": {
      PublishStatus = (
        <LoadingStatus
          message="Error! Post not published!"
          severity="error"
          done={true}
        />
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
          <Typography variant="h4">Add Post</Typography>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1} marginY={2} alignItems="center">
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
                Publish
              </Button>
            </Stack>
          </form>
        </Stack>
        {PublishStatus}
      </Paper>
    </Container>
  );
}

export default CreatePost;
