import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Header(props) {
  const { sections, title } = props;
  const history = useHistory();

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Button size="small">Subscribe</Button>

        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            {title}
          </Link>
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <Button
          variant="outlined"
          size="small"
          sx={{
            marginLeft: "0.25rem",
            marginRight: "0.25rem",
          }}
          onClick={() => history.push("/posts/create")}
        >
          Create Post
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            marginLeft: "0.25rem",
            marginRight: "0.25rem",
          }}
          onClick={() => history.push("/profile/me")}
        >
          Profile
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: "space-between", overflowX: "auto" }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            nowrap="true"
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
            to={"#"}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;
