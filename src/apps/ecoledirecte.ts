import * as appstore from "../appstore";
import { readVersionFor, writeVersionFor } from "../version";

const KEY = "ecoledirecte";

export const checkAndNotifyIzly = async (): Promise<void> => {
  const { version, title, updated, icon } = await appstore.version(
    "com.ecoledirecte.edmobile"
  );

  const previousVersion = readVersionFor(KEY);
  if (previousVersion === version) return; // do nothing.

  await writeVersionFor(KEY, version);

  await fetch(Bun.env.ECOLEDIRECTE_WEBHOOK!, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: null,
      embeds: [
        {
          title: "New version available!",
          // description:
          //   "Make sure to update the constants of the following repositories to prevent issues when calling the API.",
          color: 0x6f7af5,
          fields: [
            {
              name: "Old Version",
              value: `\`${previousVersion}\``,
              inline: true,
            },
            {
              name: "New Version",
              value: `\`${version}\``,
              inline: true,
            },
          ],
          footer: {
            text: title,
            icon_url: icon.href,
          },
          timestamp: updated.toISOString(),
        },
      ],
      username: "Notifier",
      avatar_url: "https://avatars.githubusercontent.com/u/159587407?s=400",
      attachments: [],
    }),
    method: "POST",
  });
};
