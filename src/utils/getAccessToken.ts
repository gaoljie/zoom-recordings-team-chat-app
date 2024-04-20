import { btoa } from "buffer";

export async function getAccessToken() {
  const { access_token } = await (
    await fetch("https://zoom.us/oauth/token?grant_type=client_credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${process.env.ZOOM_CLIENT_ID as string}:${process.env.ZOOM_CLIENT_SECRET as string}`)}`,
      },
    })
  ).json();

  return access_token;
}
