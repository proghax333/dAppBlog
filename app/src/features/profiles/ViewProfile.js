import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";

import { useContracts } from "../../hooks/useContracts";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";

function ViewProfile({
  match: {
    params: { id },
  },
}) {
  const [profileState, setProfileState] = useState({
    state: "loading",
  });
  const { account } = useWeb3React();
  const history = useHistory();

  const {
    contracts: { Blog },
  } = useContracts();

  useEffect(() => {
    async function loadProfile() {
      let profileId = id;
      if (profileId.toString().toLowerCase() === "me") {
        profileId = account;
      }
      const profile = await Blog.api.getProfile(profileId);

      if (profile) {
        setProfileState({
          state: "loaded",
          profile,
        });
      } else {
        setProfileState({
          state: "notFound",
        });
      }
    }
    loadProfile();
  }, [Blog.api, account, id]);

  switch (profileState.state) {
    case "loading": {
      return <div>Loading Profile</div>;
    }
    case "loaded": {
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
              <Typography variant="h4">
                Profile
                {(id === account || id === "me") && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => history.push("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                )}
              </Typography>
              <Divider />
              <div
                style={{
                  margin: "0.5rem 0rem",
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Typography>
                    <b>Name:</b>
                  </Typography>
                  <div>{profileState.profile.name}</div>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography>
                    <b>Address:</b>
                  </Typography>
                  <div>
                    <span
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {id === "me" ? account : id}
                    </span>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Paper>
        </Container>
      );
    }
    case "notFound": {
      return <div>Profile not found</div>;
    }
    default: {
    }
  }
  return <></>;
}

export default ViewProfile;
