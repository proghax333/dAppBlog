import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  Snackbar,
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
  const { account, library } = useWeb3React();
  const web3 = library;
  const history = useHistory();

  const {
    contracts: { Blog },
  } = useContracts();
  const isMe = id === account || id === "me";

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

  useEffect(() => {
    async function loadProfile() {
      let profileId = id;
      if (profileId.toString().toLowerCase() === "me") {
        profileId = account;
      }
      let profile = await Blog.api.getProfile(profileId);

      if (profile) {
        profile = {
          ...profile,
        };

        if (isMe) {
          try {
            const pendingTips = await Blog.api.myPendingTips();
            profile.extras = {
              pendingTips,
            };
            console.log(profile.extras);
          } catch (e) {
            console.log("tips error", e);
          }
        }
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
  }, [Blog.api, account, id, isMe]);

  const withdrawTips = () => {
    setTipState("Withdrawing the tips...");
    async function withdraw() {
      try {
        await Blog.api.withdrawTips();
        setTipState("Tips withdrawn successfully!");
      } catch (e) {
        console.log(e);

        setTipState("Unable to withdraw tips. Try again later.");
      }
      handleClick();
    }
    withdraw();
  };

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
                {isMe && (
                  <>
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

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        marginLeft: "0.5rem",
                        marginRight: "0.5rem",
                      }}
                      onClick={withdrawTips}
                    >
                      Withdraw Tips
                    </Button>
                  </>
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
                <Stack direction="row" spacing={1}>
                  <Typography>
                    <b>Pending Tip Withdrawals:</b>
                  </Typography>
                  {isMe && (
                    <div>
                      {web3.utils.fromWei(
                        profileState.profile.extras.pendingTips,
                        "ether"
                      )}
                      &nbsp;ETH
                    </div>
                  )}
                </Stack>
              </div>
            </Stack>
          </Paper>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={<>{tipState}</>}
          />
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
