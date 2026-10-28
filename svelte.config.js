import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ pages: 'rendered', assets: 'rendered' }),
    alias: {
      '#lib': 'src/lib'
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path === '/kb') return;
        throw new Error(message);
      }
    }
  }
};

export default config;
