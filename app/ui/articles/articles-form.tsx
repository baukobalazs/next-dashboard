"use client";

import { useState, useActionState, useContext } from "react";
import { Article, ArticleWithTags, Tag } from "@/app/lib/definitions";
import { saveArticle, ArticleState } from "@/app/lib/articles-actions";
import TipTapEditor from "./tiptap-editor";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeContext } from "@/app/ThemeRegistry";

type ArticleFormProps = {
  userId: string;
  article?: ArticleWithTags;
  existingTags: Tag[];
};

export default function ArticleForm({
  userId,
  article,
  existingTags,
}: ArticleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    cover_image_url: article?.cover_image_url || "",
    status: article?.status || "draft",
    is_public: article?.is_public ? true : false,
  });

  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";

  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags?.map((t) => t.name) || []
  );

  const [previewImage, setPreviewImage] = useState<string | null>(
    article?.cover_image_url || null
  );

  const saveArticleWithUserId = saveArticle.bind(
    null,
    userId,
    article?.id || null
  );

  const [state, formAction, isPending] = useActionState<ArticleState, FormData>(
    saveArticleWithUserId,
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
    router.push("/dashboard/articles");
  };

  return (
    <Card>
      <CardContent className={`${bg}`}>
        <form action={formAction}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Cover Image */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cover Image
              </Typography>
              {previewImage && (
                <Box
                  component="img"
                  src={previewImage}
                  alt="Cover preview"
                  sx={{
                    maxWidth: 500,
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              )}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  disabled={isPending}
                >
                  Upload Cover Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    name="cover_image"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  or enter URL below
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Image URL"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={(e) => {
                  setFormData({ ...formData, cover_image_url: e.target.value });
                  setPreviewImage(e.target.value);
                }}
                disabled={isPending}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Title */}
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isPending}
              required
              error={!!state.errors?.title}
              helperText={state.errors?.title?.[0]}
            />

            {/* Excerpt */}
            <TextField
              fullWidth
              label="Excerpt (short description)"
              name="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              disabled={isPending}
              multiline
              rows={2}
              error={!!state.errors?.excerpt}
              helperText={
                state.errors?.excerpt?.[0] || "Brief summary for cards"
              }
            />

            {/* Content Editor */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Content
              </Typography>
              <TipTapEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
              <input type="hidden" name="content" value={formData.content} />
              {state.errors?.content && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {state.errors.content[0]}
                </Typography>
              )}
            </Box>

            {/* Tags */}
            <Autocomplete
              multiple
              freeSolo
              options={existingTags.map((t) => t.name)}
              value={selectedTags}
              onChange={(event, newValue) => {
                setSelectedTags(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  helperText="Add or select multiple tags"
                />
              )}
            />
            <input type="hidden" name="tags" value={selectedTags.join(",")} />

            {/* Status & Visibility */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  disabled={isPending}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_public}
                    onChange={(e) =>
                      setFormData({ ...formData, is_public: e.target.checked })
                    }
                    disabled={isPending}
                  />
                }
                label="Public"
              />
              <input
                type="hidden"
                name="is_public"
                value={formData.is_public.toString()}
              />
            </Box>

            {/* Success/Error Messages */}
            {state.message && (
              <Alert
                severity={
                  state.errors && Object.keys(state.errors).length > 0
                    ? "error"
                    : "success"
                }
              >
                {state.message}
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending}
                startIcon={
                  isPending ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {isPending
                  ? "Saving..."
                  : article
                  ? "Update Article"
                  : "Create Article"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCancel}
                disabled={isPending}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
