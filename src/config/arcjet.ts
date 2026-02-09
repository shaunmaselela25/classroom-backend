import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;

if (!arcjetKey && process.env.NODE_ENV !== "test") {
  throw new Error("ARCJET_KEY env is required");
}

const aj = arcjet({
  key: arcjetKey ?? "test-key",
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "60s",
      max: 60,
    }),
  ],
});

export default aj;
