export const version = async (id: string) => {
  const url = `https://itunes.apple.com/lookup?bundleId=${id}&country=FR`;
  const res = await fetch(url).then((r) => r.json() as any);
  const data = res.results[0];

  return {
    title: data.trackName,
    version: data.version,
    updated: new Date(data.currentVersionReleaseDate),
    icon: new URL(
      data.artworkUrl512 || data.artworkUrl100 || data.artworkUrl60
    ),
  };
};
