import { Avatar, Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { supabase } from "../utils/supabaseClient";

export default function AccountAvatar({ url, onUpload }: any) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data as any);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box>
      <Box pos={"relative"} display="flex" justifyContent={"center"}>
        <FormLabel
          htmlFor="single"
          boxShadow={"lg"}
          style={{
            cursor: "pointer",
            borderRadius: "100%",
          }}
        >
          {avatarUrl ? <Avatar size={"lg"} src={avatarUrl} /> : null}
        </FormLabel>
      </Box>
      <Box>
        <Input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          style={{
            display: "none",
          }}
        />
      </Box>
    </Box>
  );
}
