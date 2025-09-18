import { app } from "../gplay";
import { readVersionFor, writeVersionFor } from "../version";

export const checkAndNotifyIzly = async (): Promise<void> => {
  const { version, updated, icon, title } = await app({
    appId: "fr.smoney.android.izly.REC",
    lang: "fr",
    country: "fr",
  });

  const previousVersion = readVersionFor("izly");
  if (previousVersion === version) return; // do nothing.

  // update listing!
  await writeVersionFor("izly", version);

  // send webhook with previous/new versions.
  const previousVersionEzly = previousVersion.split("_")[0];
  const versionEzly = version.split("_")[0];

  await fetch(Bun.env.IZLY_WEBHOOK!, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: null,
      embeds: [
        {
          title: "New version available!",
          description:
            "Make sure to update the constants of the following repositories to prevent issues when calling the API.",
          color: 6603247,
          fields: [
            {
              name: "JS/TS",
              value:
                "[`/src/core/constants.ts`](https://github.com/LiterateInk/Ezly.js/blob/main/src/core/constants.ts#L1)",
            },
            {
              name: "Old Version",
              value: `\`${previousVersionEzly}\``,
              inline: true,
            },
            {
              name: "New Version",
              value: `\`${versionEzly}\``,
              inline: true,
            },
          ],
          footer: {
            text: title,
            icon_url: icon,
          },
          timestamp: new Date(updated).toISOString(),
        },
      ],
      username: "Notifier",
      avatar_url: "https://avatars.githubusercontent.com/u/159587407?s=400",
      attachments: [],
    }),
    method: "POST",
  });
};
