import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: {
    'chrome-mv3/filter': 'filter.ts',
    'chrome-mv3-dev/filter': 'filter.ts',
    'firefox-mv2/filter': 'filter.ts',
    'firefox-mv2-dev/filter': 'filter.ts',
    'brave-mv3-dev/filter': 'filter.ts',
  },
  outdir: '.output',
  bundle: true,
  minify: true,
  target: 'esnext',
  platform: 'browser',
  plugins: [
    {
      name: 'on-end',
      setup({ onStart, onEnd }) {
        var t;
        onStart(() => {
          t = Date.now();
        });
        onEnd(() => {
          console.log('build finished in', Date.now() - t, 'ms');
        });
      },
    },
  ],
});

await ctx.watch();
