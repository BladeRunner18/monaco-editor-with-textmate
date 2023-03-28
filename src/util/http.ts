export default async (url: string) => {
  try {
    const res = await fetch(`${url}`);
    return res.text();
  } catch (error) {
    throw new Error(`Get file: ${url} failed！`);
  }
};
