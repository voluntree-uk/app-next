"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { clientData } from "@data/supabase";

interface IProps {
  url: string;
  isMe: boolean;
  onUpload: (url: string) => void;
}

export default function AccountAvatar({ url, isMe, onUpload }: IProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const url = await clientData.getAvatarUrl(path);
      setAvatarUrl(url ? url : null);
    } catch (error: any) {
      console.error("Error downloading profile image: ", error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          title: "Failed to upload avatar",
          description: "You must select an image to upload",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const success = await clientData.uploadAvatar(filePath, file);
      if (success) onUpload(filePath);
    } catch (error: any) {
      console.error(`Failed to upload avatar ${error.message}`);
      toast({
        title: "Failed to upload avatar",
        description: "Please try again later",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  }

  const avatarForm = (
    <FormLabel
      htmlFor="single"
      boxShadow={"lg"}
      style={{
        cursor: "pointer",
        borderRadius: "100%",
      }}
    >
      {avatarUrl ? <Avatar size={"2xl"} src={avatarUrl} /> : null}
    </FormLabel>
  );

  const uploadInput = (
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
  );

  return (
    <Box>
      <Box pos={"relative"} display="flex" justifyContent={"center"}>
        {avatarForm}
      </Box>
      <Box>{isMe ? uploadInput : null}</Box>
    </Box>
  );
}
