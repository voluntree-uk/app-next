"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Stack, useToast, useDisclosure } from "@chakra-ui/react";
import { Profile, Slot, BookingDetails, Workshop } from "@schemas";
import { clientData } from "@data/supabase";
import ProfileHero from "@components/Profile/ProfileHero";
import ProfileImpact from "@components/Profile/ProfileImpact";
import ProfileAchievements from "@components/Profile/ProfileAchievements";
import ProfileWorkshops from "@components/Profile/ProfileWorkshops";
import { UserProfileSettingsModal } from "@components/Profile/UserProfileSettingsModal";

interface IProps {
  profile: Profile;
  isMe: boolean;
  bookings: BookingDetails[];
  workshops: Workshop[];
  allSlots: Slot[];
  allSessionBookings: BookingDetails[];
}

export default function UserProfile({
  profile,
  isMe,
  bookings,
  workshops,
  allSlots,
  allSessionBookings,
}: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    setValue,
    watch,
  } = useForm();

  const avatar_url: string = watch("avatar_url");

  async function updateAvatar({ avatar_url }: any) {
    try {
      const updates = {
        user_id: profile.user_id,
        email: profile.email,
        avatar_url: avatar_url,
      };

      await clientData.updateProfile(updates);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error(`Error updating profile: ${error.message}`);
      toast({
        title: "Failed to update profile",
        description: "Please try again later",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function updateVisibilitySettings(profile: Profile) {
    try {
      const updates = {
        user_id: profile.user_id,
        email: profile.email,
        share_full_name_consent: profile.share_full_name_consent,
        share_email_consent: profile.share_email_consent,
      };

      await clientData.updateProfile(updates);
      toast({
        title: "Settings updated",
        description: "Your privacy settings have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error(`Error updating profile: ${error.message}`);
      toast({
        title: "Failed to update profile",
        description: "Please try again later",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    setValue("avatar_url", profile.avatar_url);
  }, [profile, setValue]);

  const sessionsAttended = bookings.length;

  return (
    <Box bg="gray.50" minH="100vh">
      <Stack spacing={0}>
        <ProfileHero
          profile={profile}
          isMe={isMe}
          onAvatarUpload={(url: string) => {
            setValue("avatar_url", url);
            updateAvatar({ avatar_url: url });
          }}
          avatarUrl={avatar_url}
          onSettingsClick={onOpen}
        />
        <ProfileWorkshops workshops={workshops} isMe={isMe} />

        <ProfileImpact 
          profile={profile} 
          sessionsAttended={sessionsAttended} 
          isMe={isMe}
          allSlots={allSlots}
          allSessionBookings={allSessionBookings}
        />

        <ProfileAchievements
          profile={profile}
          allSlots={allSlots}
          allSessionBookings={allSessionBookings}
          sessionsAttended={sessionsAttended}
        />

        {isMe && (
          <UserProfileSettingsModal
            profile={profile}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={updateVisibilitySettings}
          />
        )}
      </Stack>
    </Box>
  );
}
