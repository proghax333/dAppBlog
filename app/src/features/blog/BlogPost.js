import React from "react";
import Markdown from "./Markdown";
import { dateFromTimestamp } from "../../utils/DateUtils";
import { Link } from "react-router-dom";
import { Typography, Button, Stack } from "@mui/material";

import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";

function BlogPost({ post, preview = false, ...props }) {
  const { account } = useWeb3React();
  const history = useHistory();
  const {
    contracts: { Blog },
  } = useContracts();

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

  return (
    <div>
      <Typography variant={preview ? "h4" : "h2"}>{post.title}</Typography>
      <Stack
        xs={{
          margin: "0 0 1rem 0",
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
        {post.extras.author._address === account && (
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
        )}
      </Stack>
      <div>
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
    </div>
  );
}

export default BlogPost;
