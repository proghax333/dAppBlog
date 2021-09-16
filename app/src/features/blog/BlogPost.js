import React, { useState } from "react";
import Markdown from "./Markdown";
import { dateFromTimestamp } from "../../utils/DateUtils";
import { Link } from "react-router-dom";
import { Typography, Button, Stack, Snackbar } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";

function BlogPost({ post, preview = false, ...props }) {
  const { account, library } = useWeb3React();
  const web3 = library;
  const history = useHistory();
  const {
    contracts: { Blog },
  } = useContracts();

  const [open, setOpen] = useState(false);
  const [tipState, setTipState] = useState({
    state: "none",
  });
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const deletePost = async () => {
    try {
      console.log(post);
      await Blog.api.deletePost(parseInt(post.postId));
      alert("Deleted post successfully!");
    } catch (e) {
      console.log(e);
      alert("Failed to delete post!");
    }
    history.push(`/`);
  };

  const editPost = async () => {
    history.push(`/posts/edit/${post.postId}`);
  };

  const tipPost = () => {
    setTipState("Sending the tip");
    async function sendTip() {
      try {
        const amount = "0.1";
        await Blog.api.tipPost(post.postId, web3.utils.toWei(amount, "ether"));
        setTipState("Tip sent successfully!");
      } catch (e) {
        console.log(e);

        setTipState("Unable to tip. Try again later.");
      }
      handleClick();
    }
    sendTip();
  };

  return (
    <div>
      <Typography variant={preview ? "h4" : "h2"}>{post.title}</Typography>
      <Stack
        sx={{
          margin: "0 0 0.75rem 0",
        }}
        direction="row"
        alignItems="center"
      >
        <p
          style={{
            fontSize: "0.80rem",
          }}
        >
          {dateFromTimestamp(post.createdAt)}

          <Link to={`/profile/${post.extras.author._address}`}>
            <span
              style={{
                fontSize: "0.95em",
                margin: "0 0.25rem",
              }}
            >
              by {post.extras.author.name} ({post.extras.author._address})
            </span>
          </Link>
        </p>
        {post.extras.author._address === account ? (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: "0.25rem",
                marginRight: "0.25rem",
              }}
              onClick={editPost}
            >
              Edit Post
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: "0.25rem",
                marginRight: "0.25rem",
              }}
              color="error"
              onClick={deletePost}
            >
              Delete Post
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            size="small"
            sx={{
              marginLeft: "0.25rem",
              marginRight: "0.25rem",
            }}
            onClick={tipPost}
          >
            Tip 0.1ETH
          </Button>
        )}
      </Stack>
      <div style={{}}>
        <Markdown className="markdown">
          {preview ? `${post.content.substring(0, 40)}...` : post.content}
        </Markdown>
      </div>
      {preview && (
        <Link
          to={`posts/${post.postId}`}
          style={{
            fontSize: "0.95em",
          }}
        >
          Read more...
        </Link>
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={<>{tipState}</>}
      />
    </div>
  );
}

export default BlogPost;
