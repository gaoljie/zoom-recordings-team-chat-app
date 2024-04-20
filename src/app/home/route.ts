import { getAppContext } from "@/utils/getAppContext";
import { userContext } from "@/utils/userContext";
import ky from "ky";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers);

  if (!requestHeaders.get("message_id")) {
    redirect("/form");
  }
  const { uid } = getAppContext(
    requestHeaders.get("x-zoom-app-context") as string,
  );

  console.log(
    uid,
    requestHeaders.get("message_id"),
    requestHeaders.get("session_id")?.split("@")[0],
    userContext,
  );
  const res = await ky
    .get(
      `https://api.zoom.us/v2/chat/users/me/messages/${requestHeaders.get("message_id")}`,
      {
        searchParams: {
          to_contact: requestHeaders.get("session_id")?.split("@")[0] as string,
        },
        headers: {
          Authorization: `Bearer ${userContext[uid].at}`,
        },
        hooks: {
          beforeRetry: [
            async () => {
              const tokenParams = new URLSearchParams();
              tokenParams.set("grant_type", "refresh_token");
              tokenParams.set("refresh_token", userContext[uid].rt);

              const { access_token, refresh_token } = await ky
                .post(`https://zoom.us/oauth/token`, {
                  body: tokenParams,
                  headers: {
                    Authorization: `Basic ${btoa(`${process.env.ZOOM_CLIENT_ID as string}:${process.env.ZOOM_CLIENT_SECRET as string}`)}`,
                  },
                })
                .json<{
                  access_token: string;
                  refresh_token: string;
                }>();

              userContext[uid] = {
                at: access_token,
                rt: refresh_token,
              };
            },
          ],
        },
        retry: {
          statusCodes: [401],
        },
      },
    )
    .json();

  /*
  {
  typ: 'chat',
  uid: 'pk3URrJlTDag0y5Qij0maQ',
  aud: 'ALKME_tkQu6JbDln9JPzcg',
  iss: 'marketplace.zoom.us',
  ts: 1713287411465,
  exp: 1713287531465,
  entitlements: [],
  sid: 'pk3urrjltdag0y5qij0maq@xmpp.zoom.us',
  msgid: '37F52456-6A39-4ED6-AD30-42A968A9EDA8',
  tid: '37F52456-6A39-4ED6-AD30-42A968A9EDA8',
  of: 'messageShortcut',
  actid: 'msg_remind',
  aid: 'msg_remind',
  chid: 'pk3urrjltdag0y5qij0maq@xmpp.zoom.us'
  }
   */

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
  });
}
