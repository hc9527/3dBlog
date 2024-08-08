import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import WindiCSS from "vite-plugin-windicss"
import dynamicImport from "vite-plugin-dynamic-import"
import eslintPlugin from "vite-plugin-eslint"
import DefineOptions from 'unplugin-vue-define-options/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import mkcert from "vite-plugin-mkcert"
const path = require("path")
const pkg = require("./package.json")

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb'],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  base: './',
  plugins: [
    mkcert(),
    vue(),
    dynamicImport(),
    DefineOptions(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'],
      exclude: ['./node_modules/**'],
      cache: false
    }),
    WindiCSS({
      scan: {
        dirs: [__dirname], // all files in the cwd
        fileExtensions: ["vue", "js", "ts"], // also enabled scanning for js/ts
      },
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ['src/components', 'src/biz-components'],
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    viteCompression()
  ],
  server: {
    https: true,
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  build: {
    // 消除打包大小超过 500kb 警告,放宽至 1M
    chunkSizeWarningLimit: 1024,
    assetsDir: 'static/assets',
    // 静态资源打包到 dist下的不同目录
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
