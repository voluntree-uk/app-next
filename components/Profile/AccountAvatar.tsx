import { ReactElement, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  FormLabel,
  HStack,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  Text,
  PopoverTrigger,
  PopoverArrow,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { data } from "@data/supabase";

interface IProps {
  url: string;
  isMe: boolean;
  onUpload: (url: string) => void;
}

export default function AccountAvatar({ url, isMe, onUpload }: IProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const url = await data.getAvatarUrl(path);
      setAvatarUrl(url ? url : null);
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

      const success = await data.uploadAvatar(filePath, file);
      if (success) onUpload(filePath);
    } catch (error: any) {
      console.log(error);
      alert(error.message);
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

  function avatar(): ReactElement {
    return isMe ? (
      <Popover trigger="hover">
        <PopoverTrigger>
          { avatarForm }
        </PopoverTrigger>
        <PopoverContent width="fit-content">
          <PopoverArrow />
          <PopoverBody>
            <HStack spacing={2}>
              <FaUpload />
              <Text>Upload new profile photo</Text>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    ) : (
        avatarForm
    )
  }

  return (
    <Box>
      <Box pos={"relative"} display="flex" justifyContent={"center"}>
        { avatar() }
      </Box>
      <Box>
        { isMe ? uploadInput : null}
      </Box>
    </Box>
  );
}
