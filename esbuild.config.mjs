import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

// 監視対象のファイルパスを生成
const entryPoints = {
  'chrome-mv3/filter': 'filter.ts',
  'chrome-mv3-dev/filter': 'filter.ts',
  'firefox-mv2/filter': 'filter.ts',
  'firefox-mv2-dev/filter': 'filter.ts',
  'brave-mv3-dev/filter': 'filter.ts',
};

const outputFiles = Object.keys(entryPoints).map((key) =>
  path.join('.output', key + '.js')
);

// ファイル存在チェック関数
function checkOutputFiles() {
  const missingFiles = [];
  for (const file of outputFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }
  return missingFiles;
}

// 初期ビルドと監視開始
const ctx = await esbuild.context({
  entryPoints,
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
    {
      name: 'file-checker',
      setup(build) {
        // ビルド開始時にファイルチェック
        build.onStart(() => {
          const missing = checkOutputFiles();
          if (missing.length > 0) {
            console.log('Missing files detected:', missing);
          }
        });
      },
    },
  ],
});

// 初回ビルド実行
await ctx.rebuild();

// ファイル監視を開始
await ctx.watch();

// 定期的にファイル存在チェック
setInterval(() => {
  const missing = checkOutputFiles();
  if (missing.length > 0) {
    console.log('Missing files detected, rebuilding...');
    ctx.rebuild().catch(console.error);
  }
}, 5000); // 5秒ごとにチェック

console.log('Watching for missing files...');
