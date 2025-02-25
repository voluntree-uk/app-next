"use client";

import { Flex } from "@chakra-ui/react";
import LandingHowItWorksCard from "@components/Landing/LandingHowItWorksCard";

const howItWorksCardContent = [
  {
    title: "Host",
    description: `Create and share your expertise with the Voluntree community by
      hosting your own workshop. Design a session tailored to your skills
      and interests, covering topics that resonate with you. Engage
      participants with live sessions, interactive discussions, and
      hands-on learning experiences. Whether you've got a skill to teach,
      knowledge to share, or a community to grow, Voluntree offers a
      platform for you to make a meaningful impact and contribute to
      collective learning and growth.`,
    btn: {
      text: "Create workshop",
      target: "/workshops/new",
      inNewTab: false,
      background: "#6884CD",
      hoverColor:"#7C9EF5"
    },
  },
  {
    title: "Join",
    description: `Browse through a diverse selection of workshops hosted by other
      volunteers. When you find a workshop that interests you, simply join
      to participate in live sessions, interactive discussions, and
      hands-on learning activities. Whether you're looking to develop new
      skills, expand your knowledge, or connect with like-minded
      individuals, Voluntree provides a supportive environment for
      learning and growth.`,
    btn: {
      text: "Browse workshops",
      target: "/workshops",
      inNewTab: false,
      background: "#E3C46D",
      hoverColor:"#F4D376"
    },
  },
  {
    title: "Support",
    description: `Your donation, even as little as £1, helps sustain this project 
    and fosters community growth. At Voluntree, every team member is a volunteer,
    and we pride ourselves on full financial transparency. We believe it's
    essential for our donors to know exactly how their contributions are used.
    Visit our finances page to learn more and consider making a donation today.`,
    btn: {
      text: "Finances page",
      target: "https://voluntree.net/finances",
      inNewTab: true,
      background: "#9CC7AA",
      hoverColor:"#B5D1C5"
    },
  },
];

export default function LandingHowItWorks() {
  return (
    
    <Flex flexDir={{ base: "column", lg: "row" }} gap={{ base: "10" }} alignItems={"stretch"}> 
        {howItWorksCardContent.map(({ title, description, btn }) => (
          <LandingHowItWorksCard
            key={title}
            title={title}
            description={description}
            btn={btn}
          />
        ))}
    </Flex>
  );
}
