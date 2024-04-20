import { getAccessToken } from "@/utils/getAccessToken";

export async function POST(request: Request) {
  const res = await request.json();
  const {
    event,
    payload: { robotJid, toJid, accountId, userJid, cmd },
  } = res;

  console.log(JSON.stringify(res));

  if (event === "bot_notification") {
    const data = await (
      await fetch("https://api.zoom.us/v2/im/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          robot_jid: robotJid,
          to_jid: toJid,
          account_id: accountId,
          user_jid: userJid,
          content: {
            settings: {
              default_sidebar_color: "#0E72ED",
              is_split_sidebar: false,
            },
            head: {
              text: "I am a head text",
              sub_head: {
                text: "I am a sub head text",
              },
            },
            body: [
              {
                type: "section",
                sections: [
                  {
                    type: "message",
                    text: cmd,
                    style: {
                      bold: true,
                    },
                  },
                  {
                    type: "fields",
                    items: [
                      {
                        key: "Field item label",
                        value: "Field item value",
                        short: false,
                      },
                    ],
                  },
                ],
              },
              {
                type: "message",
                text: "I am a message text",
              },
              {
                type: "fields",
                items: [
                  {
                    key: "Field item label 1",
                    value: "value 1",
                    short: false,
                  },
                  {
                    key: "Field item label 2",
                    value: "value 2",
                    short: false,
                  },
                ],
              },
              {
                type: "actions",
                items: [
                  {
                    text: "Add",
                    value: "add",
                    style: "Primary",
                  },
                  {
                    text: "Update",
                    value: "update",
                    style: "Default",
                  },
                ],
              },
              {
                type: "select",
                text: "Select label",
                selected_item: {
                  text: "Item 1",
                  value: "value1",
                },
                select_items: [
                  {
                    text: "Item 1",
                    value: "value1",
                  },
                  {
                    text: "Item 2",
                    value: "value2",
                  },
                  {
                    text: "Item 3",
                    value: "value3",
                  },
                ],
              },
              {
                type: "select",
                text: "Your Members",
                static_source: "members",
              },
              {
                type: "timepicker",
                initial_time: "12:00",
                action_id: "timepicker123",
              },
              {
                type: "datepicker",
                initial_date: "2010/10/10",
                action_id: "datepicker123",
              },
              {
                type: "radio_buttons",
                initial_option: {
                  value: "A1",
                  text: "Radio1",
                },
                options: [
                  {
                    value: "A1",
                    text: "Radio1",
                  },
                  {
                    value: "A2",
                    text: "Radio2",
                  },
                ],
                action_id: "radio_buttons123",
              },
              {
                type: "checkboxes",
                options: [
                  {
                    text: "Blue",
                    value: "blue",
                    initial_selected: true,
                  },
                  {
                    text: "Green",
                    value: "green",
                  },
                ],
                action_id: "checkboxes123",
              },
              {
                type: "file",
                icon_url:
                  "https://d24cgw3uvb9a9h.cloudfront.net/static/93516/image/new/ZoomLogo.png",
                title: {
                  text: "I am a file card title",
                  file_url: "https://zoom.us",
                },
                description: {
                  text: "I am a file card description",
                },
              },
            ],
          },
        }),
      })
    ).json();
    console.log(data);
  }

  return Response.json({ res });
}
