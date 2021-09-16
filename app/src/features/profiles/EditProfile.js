import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
} from "@mui/material";

import LoadingStatus from "../../ui/LoadingStatus";

import { useContracts } from "../../hooks/useContracts";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

function EditProfile() {
  const [profileState, setProfileState] = useState({
    state: "loading",
  });
  const { account } = useWeb3React();
  const {
    contracts: { Blog },
  } = useContracts();
  const { register, handleSubmit } = useForm();
  // eslint-disable-next-line
  const history = useHistory();

  useEffect(() => {
    async function loadProfile() {
      let profileId = account;
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
  }, [Blog.api, account]);

  const onSubmit = (data) => {
    setProfileState({
      ...profileState,
      state: "updating",
    });
    async function updateProfile() {
      try {
        await Blog.api.updateProfile({
          name: data.name,
        });
        setProfileState({
          ...profileState,
          state: "updated",
        });
      } catch (e) {
        setProfileState({
          ...profileState,
          state: "updateFailed",
        });
      }
    }
    updateProfile();
  };

  if (profileState.state === "updated") {
    setTimeout(() => {
      // history.push("/profile/me");
    }, 3000);
  }

  switch (profileState.state) {
    case "loading": {
      return <div>Loading Profile</div>;
    }
    case "loaded":
    case "updated":
    case "updateFailed":
    case "updating": {
      let UpdatingStatus = null;
      switch (profileState.state) {
        case "updating": {
          UpdatingStatus = (
            <LoadingStatus message="Updating profile..." severity="info" />
          );
          break;
        }
        case "updated": {
          UpdatingStatus = (
            <LoadingStatus
              message="Profile updated successfully!"
              severity="success"
              done={true}
            />
          );
          break;
        }
        case "updateFailed": {
          UpdatingStatus = (
            <LoadingStatus
              message="Profile not updated!"
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
              <Typography variant="h4">Edit Profile</Typography>
              <Divider />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div
                  style={{
                    margin: "0.5rem 0rem",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    marginY={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Name"
                      color="primary"
                      focused
                      defaultValue={profileState.profile.name}
                      size="small"
                      sx={{
                        width: "32ch",
                      }}
                      {...register("name")}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} marginY={2}>
                    <Button type="submit" variant="contained">
                      Submit
                    </Button>
                  </Stack>
                </div>
              </form>
            </Stack>
            {UpdatingStatus}
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

export default EditProfile;
