// import React from "react";
// import { Box, Flex, Heading } from "@chakra-ui/react";
// import { Workshop } from "@schemas";
// import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from "react-share";

// interface IProps {
//   workshop: Workshop;
// }

// export default function WorkshopListingDescription({ workshop }: IProps) {
//   const shareUrl = `https://platform-dev.voluntree.net/workshops/${workshop.id}`;
//   const title = `Checkout this free workshop at Voluntree - ${workshop.name}: `
//   return (
//     <Box
//       borderBottomWidth={"1px"}
//       borderBottomColor="gray.200"
//       p="6"
//       px={{ base: "6", md: "16" }}
//       display="flex"
//       justifyContent={"space-between"}
//     >
//       <Flex alignItems={"center"}>
//         <Heading as="h2" size="md" pb="0.5em">
//           Share
//         </Heading>
//       </Flex>
//       <Flex alignItems={"center"}>
//         <FacebookShareButton url={shareUrl}>
//           <FacebookIcon size={32} round />
//         </FacebookShareButton>
//         <TwitterShareButton url={shareUrl} title={title}>
//           <XIcon size={32} round />
//         </TwitterShareButton>
//         <LinkedinShareButton url={shareUrl} title={title} summary={workshop.description} >
//           <LinkedinIcon size={32} round />
//         </LinkedinShareButton>
//         <WhatsappShareButton url={shareUrl} title={title}>
//           <WhatsappIcon size={32} round />
//         </WhatsappShareButton>
//       </Flex>
//     </Box>
//   );
// }

export {}
