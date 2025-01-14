type FrameEmbed = {
  version: "next";
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: "launch_frame";
      name: string;
      url: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    };
  };
};

async function writeMetadata(data: FrameEmbed) {
  try {
    const jsonString = JSON.stringify(data).replace(/"/g, "&quot;");
    console.log(jsonString);
  } catch (error) {
    console.error("Error writing metadata:", error);
  }
}

const frameData: FrameEmbed = {
  version: "next",
  imageUrl:
    "https://github.com/jpfraneto/images/blob/main/hackathon-banner-.png?raw=true",
  button: {
    title: "join $hackathon",
    action: {
      type: "launch_frame",
      name: "weekly $hackathon",
      url: "https://weeklyhackathon.com",
      splashImageUrl:
        "https://github.com/jpfraneto/images/blob/main/hackathon.png?raw=true",
      splashBackgroundColor: "#141413",
    },
  },
};

writeMetadata(frameData);
