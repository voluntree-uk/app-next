"use server";

import AboutPageClient from "@components/About/AboutPage";
import { AboutValue, Collaborator, EngagementPath, TeamMember } from "@schemas";
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

  const aboutVolunteerStatement =
  "Voluntree is run entirely by volunteers. There are no salaries, no director fees, and no hidden perks — everyone, including the core team and directors, gives their time for free.";

  const transparencyBullets: string[] = [
  "Every pound donated goes back into the community — things like keeping the platform online, event logistics, and essential admin.",
  "You can review every transaction on our Finances page, so you always know how money is being used.",
  "We iterate in public and invite feedback from the community on how Voluntree should grow.",
  ];

  const engagementPaths: EngagementPath[] = [
  {
    id: "learn",
    title: "Join a workshop",
    description:
      "Learn something new and meet like-minded people. Browse free community-led workshops, book a session that fits your life, and grow together.",
    href: "/workshops",
    ctaText: "Browse workshops",
  },
  {
    id: "host",
    title: "Host a workshop",
    description:
      "Share your expertise and make a real difference. Create a workshop around a skill, story, or lived experience — you set the topic, format, and timing.",
    href: "/workshops/new",
    ctaText: "Start hosting",
  },
  {
    id: "platform",
    title: "Help run the platform",
    description:
      "Use your skills to scale impact. Contribute in tech, design, community organising, or operations to help Voluntree reach more people.",
    href: "/login",
    ctaText: "Join the team",
  },
  {
    id: "donate",
    title: "Support financially",
    description:
      "Keep workshops free for everyone. Your donation covers running costs so we can continue building stronger communities together.",
    href: "/finances",
    ctaText: "Donate now",
  },
  ];

  const aboutTeam: TeamMember[] = [
  {
    name: "Volunteer contributors",
    role: "Core team & wider community",
    bio: "Voluntree is built and run by volunteers who donate their time in roles ranging from software and design to community outreach, workshop facilitation, and governance.",
  },
  ];

  const aboutCollaborators: Collaborator[] = [];
  
  // Google Meet link for bi-weekly meetings (Mondays at 6pm)
  // TODO: Replace with your actual Google Meet link
  const meetLink = process.env.NEXT_PUBLIC_COMMUNITY_MEET_LINK || "";
  
  return (
    <AboutPageClient
      volunteerStatement={aboutVolunteerStatement}
      transparencyBullets={transparencyBullets}
      engagementPaths={engagementPaths}
      team={aboutTeam}
      collaborators={aboutCollaborators}
      meetLink={meetLink}
    />
  );
}


