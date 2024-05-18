import React from "react";
import { useRouter } from "next/router";
import { Image, Card, CardBody, Heading, Link } from "@chakra-ui/react";
import { Workshop } from "@schemas";

interface IProps {
  workshop: Workshop;
}

export default function HostedWorkshopCard({ workshop }: IProps) {
  const router = useRouter();

  const directToWorkshop = (workshop_id: string | undefined) => {
    if (workshop_id) router.push(`/workshops/${workshop_id}`);
  };

  return (
    <Link onClick={() => directToWorkshop(workshop.id)}>
      <Card variant="outline" maxW="sm">
        <CardBody>
          <Image
            src="https://thumbs.dreamstime.com/b/software-development-programming-coding-learning-information-technology-courses-courses-all-levels-computing-hi-tech-158671629.jpg"
            alt={workshop.category}
            borderRadius="lg"
          />
          <Heading size="sm">{workshop.name}</Heading>
        </CardBody>
      </Card>
    </Link>
  );
}
