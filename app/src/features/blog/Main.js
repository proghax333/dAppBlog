import * as React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import BlogPost from "./BlogPost";

function Main(props) {
  const { posts, title } = props;

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        "& .markdown": {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider
        sx={{
          margin: "0.25rem 0 1rem 0",
        }}
      />
      {posts.reverse().map((post) => {
        return (
          <React.Fragment key={post.content.substring(0, 40)}>
            <BlogPost post={post} preview={true} />
            <hr />
          </React.Fragment>
        );
      })}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
