"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { clientData } from "@data/supabase";
import { HiCamera } from "react-icons/hi";

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

  return (
    <Box>
      <Box pos={"relative"} display="flex" justifyContent={"center"}>
        <VStack spacing={4} flexShrink={0}>
          <Box
            boxShadow={"lg"}
            style={{
              cursor: "default",
              borderRadius: "100%",
            }}
          >
            <Avatar size={"2xl"} src={avatarUrl || undefined} />
          </Box>
          {isMe && (
            <>
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
              <Button
                size="sm"
                variant="solid"
                colorScheme="blue"
                leftIcon={<HiCamera />}
                onClick={() => {
                  document.getElementById('single')?.click();
                }}
              >
                Change Photo
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
