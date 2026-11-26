/** Prefix a /public path with the site base (needed when the site lives in a sub-folder, e.g. GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
