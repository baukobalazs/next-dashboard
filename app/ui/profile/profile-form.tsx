"use client";

import { useState, useActionState } from "react";
import { User } from "@/app/lib/definitions";
import {
  updateUserProfile,
  updatePassword,
  UserProfileState,
  PasswordState,
} from "@/app/lib/actions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

type ProfileFormProps = {
  user: User;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const updateUserProfileWithId: (
    prevState: UserProfileState,
    formData: FormData
  ) => Promise<UserProfileState> = updateUserProfile.bind(null, user.id);
  const updatePasswordWithId: (
    prevState: PasswordState,
    formData: FormData
  ) => Promise<PasswordState> = updatePassword.bind(null, user.id);

  const [profileState, profileAction, profilePending] = useActionState(
    updateUserProfileWithId,
    { errors: {}, message: null }
  );

  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePasswordWithId,
    { errors: {}, message: null }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2">
              Profile
            </Typography>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <form action={profileAction}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
              }}
            >
              {/* Profile Image */}
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewImage || user.image_url || undefined}
                  sx={{ width: 120, height: 120 }}
                />
                {isEditing && (
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "background.paper",
                      "&:hover": { backgroundColor: "background.paper" },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                )}
              </Box>

              {/* Name Field */}
              <TextField
                fullWidth
                label="Name"
                name="name"
                defaultValue={user.name}
                disabled={!isEditing || profilePending}
                required
                error={!!profileState.errors?.name}
                helperText={profileState.errors?.name?.[0]}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                defaultValue={user.email}
                disabled={!isEditing || profilePending}
                required
                error={!!profileState.errors?.email}
                helperText={profileState.errors?.email?.[0]}
              />

              {/* Role (read-only) */}
              <TextField
                fullWidth
                label="Role"
                value={user.role || "user"}
                disabled={user.role !== "admin"}
              />

              {/* Success/Error Messages */}
              {profileState.message && (
                <Alert
                  severity={profileState.errors ? "error" : "success"}
                  sx={{ width: "100%" }}
                >
                  {profileState.message}
                </Alert>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={profilePending}
                    startIcon={
                      profilePending ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SaveIcon />
                      )
                    }
                  >
                    {profilePending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCancel}
                    disabled={profilePending}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Change Password Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <form action={passwordAction}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                required
                disabled={passwordPending}
                error={!!passwordState.errors?.currentPassword}
                helperText={passwordState.errors?.currentPassword?.[0]}
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                required
                disabled={passwordPending}
                error={!!passwordState.errors?.newPassword}
                helperText={passwordState.errors?.newPassword?.[0]}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                required
                disabled={passwordPending}
                error={!!passwordState.errors?.confirmPassword}
                helperText={passwordState.errors?.confirmPassword?.[0]}
              />

              {passwordState.message && (
                <Alert severity={passwordState.errors ? "error" : "success"}>
                  {passwordState.message}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPasswordDialogOpen(false)}
              disabled={passwordPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={passwordPending}
              startIcon={
                passwordPending ? <CircularProgress size={20} /> : null
              }
            >
              {passwordPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
