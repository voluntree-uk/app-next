"use server";

import AboutPageClient from "@components/About/AboutPage";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: "About Voluntree",
    description: "Learn more about Voluntree, a completely volunteer-run platform helping people share skills, stories, and support through free community workshops.",
  };
}

export default async function AboutPage() {
  const meetLink = process.env.NEXT_PUBLIC_COMMUNITY_MEET_LINK || "";
  
  return (
    <AboutPageClient
      meetLink={meetLink}
    />
  );
}


