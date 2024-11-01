import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: ['filter.ts'],
  outdir: '.output/chrome-mv3',
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
