// vite.config.js
import { sveltekit } from "file:///home/vc/projects/justinvoice/node_modules/.pnpm/@sveltejs+kit@1.5.0_svelte@3.55.1+vite@4.1.1/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { extractorSvelte, presetIcons, presetWebFonts } from "file:///home/vc/projects/justinvoice/node_modules/.pnpm/unocss@0.49.4_vite@4.1.1/node_modules/unocss/dist/index.mjs";
import Unocss from "file:///home/vc/projects/justinvoice/node_modules/.pnpm/unocss@0.49.4_vite@4.1.1/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///home/vc/projects/justinvoice/node_modules/.pnpm/unplugin-auto-import@0.13.0/node_modules/unplugin-auto-import/dist/vite.js";

// package.json
var package_default = {
  name: "justinvoice",
  version: "2.2.4",
  scripts: {
    dev: "vite dev",
    build: "vite build",
    package: "svelte-kit package",
    preview: "vite preview",
    test: "playwright test",
    check: "svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
    lint: "prettier --check --plugin-search-dir=. . && eslint .",
    format: "prettier --write --plugin-search-dir=. ."
  },
  devDependencies: {
    "@babel/core": "^7.20.12",
    "@iconify-json/mdi": "^1.1.46",
    "@iconify/json": "^2.2.18",
    "@playwright/test": "^1.30.0",
    "@sveltejs/adapter-auto": "^2.0.0",
    "@sveltejs/kit": "^1.5.0",
    "@types/bcryptjs": "^2.4.2",
    "@types/lodash-es": "^4.17.6",
    "@typescript-eslint/eslint-plugin": "^5.51.0",
    "@typescript-eslint/parser": "^5.51.0",
    autoprefixer: "^10.4.13",
    daisyui: "^2.50.0",
    eslint: "^8.33.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-svelte3": "^4.0.0",
    postcss: "^8.4.21",
    "postcss-load-config": "^4.0.1",
    "postcss-nested": "^6.0.0",
    prettier: "^2.8.3",
    "prettier-plugin-organize-imports": "^3.2.2",
    "prettier-plugin-prisma": "^4.9.0",
    "prettier-plugin-svelte": "^2.9.0",
    "prettier-plugin-tailwindcss": "^0.2.2",
    prisma: "^4.10.0",
    svelte: "^3.55.1",
    "svelte-check": "^3.0.3",
    "svelte-preprocess": "^5.0.1",
    tailwindcss: "^3.2.4",
    tslib: "^2.5.0",
    typescript: "^4.9.5",
    "unplugin-auto-import": "^0.13.0",
    "unplugin-icons": "^0.15.2",
    vite: "^4.1.1"
  },
  type: "module",
  dependencies: {
    "@prisma/client": "^4.10.0",
    "@unocss/reset": "^0.49.4",
    bcryptjs: "^2.4.3",
    clsx: "^1.2.1",
    devalue: "^4.2.3",
    "lodash-es": "^4.17.21",
    "number-to-words": "^1.2.4",
    "svelte-local-storage-store": "^0.4.0",
    unocss: "^0.49.4",
    zod: "^3.20.2",
    "zod-fetch": "^0.1.0"
  }
};

// vite.config.js
var config = {
  define: {
    __version__: JSON.stringify(package_default.version)
  },
  plugins: [
    AutoImport({
      imports: [
        "svelte",
        "svelte/store",
        "svelte/easing",
        "svelte/motion",
        "svelte/animate",
        "svelte/transition",
        {
          zod: ["z"],
          "svelte-local-storage-store": ["persisted"],
          clsx: ["clsx"]
        }
      ],
      dirs: ["./src/lib/", "./src/utils/"],
      dts: "src/auto-imports.d.ts"
    }),
    Unocss({
      extractors: [extractorSvelte],
      presets: [
        presetWebFonts({
          extendTheme: true,
          fonts: {
            sans: "Inter:400,500,600,700,800,900"
          }
        }),
        presetIcons({
          extraProperties: {
            color: "auto",
            display: "inline-block",
            "vertical-align": "middle"
          }
        })
      ]
    }),
    sveltekit()
  ]
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvdmMvcHJvamVjdHMvanVzdGludm9pY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3ZjL3Byb2plY3RzL2p1c3RpbnZvaWNlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3ZjL3Byb2plY3RzL2p1c3RpbnZvaWNlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xuaW1wb3J0IHsgZXh0cmFjdG9yU3ZlbHRlLCBwcmVzZXRJY29ucywgcHJlc2V0V2ViRm9udHMgfSBmcm9tICd1bm9jc3MnXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBwa2dKc29uIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG4vKiogQHR5cGUge2ltcG9ydCgndml0ZScpLlVzZXJDb25maWd9ICovXG5jb25zdCBjb25maWcgPSB7XG5cdGRlZmluZToge1xuXHRcdF9fdmVyc2lvbl9fOiBKU09OLnN0cmluZ2lmeShwa2dKc29uLnZlcnNpb24pXG5cdH0sXG5cdHBsdWdpbnM6IFtcblx0XHRBdXRvSW1wb3J0KHtcblx0XHRcdGltcG9ydHM6IFtcblx0XHRcdFx0J3N2ZWx0ZScsXG5cdFx0XHRcdCdzdmVsdGUvc3RvcmUnLFxuXHRcdFx0XHQnc3ZlbHRlL2Vhc2luZycsXG5cdFx0XHRcdCdzdmVsdGUvbW90aW9uJyxcblx0XHRcdFx0J3N2ZWx0ZS9hbmltYXRlJyxcblx0XHRcdFx0J3N2ZWx0ZS90cmFuc2l0aW9uJyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHpvZDogWyd6J10sXG5cdFx0XHRcdFx0J3N2ZWx0ZS1sb2NhbC1zdG9yYWdlLXN0b3JlJzogWydwZXJzaXN0ZWQnXSxcblx0XHRcdFx0XHRjbHN4OiBbJ2Nsc3gnXVxuXHRcdFx0XHR9XG5cdFx0XHRdLFxuXHRcdFx0ZGlyczogWycuL3NyYy9saWIvJywgJy4vc3JjL3V0aWxzLyddLFxuXHRcdFx0ZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJ1xuXHRcdH0pLFxuXHRcdFVub2Nzcyh7XG5cdFx0XHRleHRyYWN0b3JzOiBbZXh0cmFjdG9yU3ZlbHRlXSxcblx0XHRcdHByZXNldHM6IFtcblx0XHRcdFx0cHJlc2V0V2ViRm9udHMoe1xuXHRcdFx0XHRcdGV4dGVuZFRoZW1lOiB0cnVlLFxuXHRcdFx0XHRcdGZvbnRzOiB7XG5cdFx0XHRcdFx0XHRzYW5zOiAnSW50ZXI6NDAwLDUwMCw2MDAsNzAwLDgwMCw5MDAnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSxcblx0XHRcdFx0cHJlc2V0SWNvbnMoe1xuXHRcdFx0XHRcdGV4dHJhUHJvcGVydGllczoge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICdhdXRvJyxcblx0XHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRcdFx0J3ZlcnRpY2FsLWFsaWduJzogJ21pZGRsZSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRdXG5cdFx0fSksXG5cdFx0c3ZlbHRla2l0KClcblx0XVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWdcbiIsICJ7XG5cdFwibmFtZVwiOiBcImp1c3RpbnZvaWNlXCIsXG5cdFwidmVyc2lvblwiOiBcIjIuMi40XCIsXG5cdFwic2NyaXB0c1wiOiB7XG5cdFx0XCJkZXZcIjogXCJ2aXRlIGRldlwiLFxuXHRcdFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG5cdFx0XCJwYWNrYWdlXCI6IFwic3ZlbHRlLWtpdCBwYWNrYWdlXCIsXG5cdFx0XCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXG5cdFx0XCJ0ZXN0XCI6IFwicGxheXdyaWdodCB0ZXN0XCIsXG5cdFx0XCJjaGVja1wiOiBcInN2ZWx0ZS1jaGVjayAtLXRzY29uZmlnIC4vdHNjb25maWcuanNvblwiLFxuXHRcdFwiY2hlY2s6d2F0Y2hcIjogXCJzdmVsdGUtY2hlY2sgLS10c2NvbmZpZyAuL3RzY29uZmlnLmpzb24gLS13YXRjaFwiLFxuXHRcdFwibGludFwiOiBcInByZXR0aWVyIC0tY2hlY2sgLS1wbHVnaW4tc2VhcmNoLWRpcj0uIC4gJiYgZXNsaW50IC5cIixcblx0XHRcImZvcm1hdFwiOiBcInByZXR0aWVyIC0td3JpdGUgLS1wbHVnaW4tc2VhcmNoLWRpcj0uIC5cIlxuXHR9LFxuXHRcImRldkRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJAYmFiZWwvY29yZVwiOiBcIl43LjIwLjEyXCIsXG5cdFx0XCJAaWNvbmlmeS1qc29uL21kaVwiOiBcIl4xLjEuNDZcIixcblx0XHRcIkBpY29uaWZ5L2pzb25cIjogXCJeMi4yLjE4XCIsXG5cdFx0XCJAcGxheXdyaWdodC90ZXN0XCI6IFwiXjEuMzAuMFwiLFxuXHRcdFwiQHN2ZWx0ZWpzL2FkYXB0ZXItYXV0b1wiOiBcIl4yLjAuMFwiLFxuXHRcdFwiQHN2ZWx0ZWpzL2tpdFwiOiBcIl4xLjUuMFwiLFxuXHRcdFwiQHR5cGVzL2JjcnlwdGpzXCI6IFwiXjIuNC4yXCIsXG5cdFx0XCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuNlwiLFxuXHRcdFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNS41MS4wXCIsXG5cdFx0XCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjUuNTEuMFwiLFxuXHRcdFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTNcIixcblx0XHRcImRhaXN5dWlcIjogXCJeMi41MC4wXCIsXG5cdFx0XCJlc2xpbnRcIjogXCJeOC4zMy4wXCIsXG5cdFx0XCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjguNi4wXCIsXG5cdFx0XCJlc2xpbnQtcGx1Z2luLXN2ZWx0ZTNcIjogXCJeNC4wLjBcIixcblx0XHRcInBvc3Rjc3NcIjogXCJeOC40LjIxXCIsXG5cdFx0XCJwb3N0Y3NzLWxvYWQtY29uZmlnXCI6IFwiXjQuMC4xXCIsXG5cdFx0XCJwb3N0Y3NzLW5lc3RlZFwiOiBcIl42LjAuMFwiLFxuXHRcdFwicHJldHRpZXJcIjogXCJeMi44LjNcIixcblx0XHRcInByZXR0aWVyLXBsdWdpbi1vcmdhbml6ZS1pbXBvcnRzXCI6IFwiXjMuMi4yXCIsXG5cdFx0XCJwcmV0dGllci1wbHVnaW4tcHJpc21hXCI6IFwiXjQuOS4wXCIsXG5cdFx0XCJwcmV0dGllci1wbHVnaW4tc3ZlbHRlXCI6IFwiXjIuOS4wXCIsXG5cdFx0XCJwcmV0dGllci1wbHVnaW4tdGFpbHdpbmRjc3NcIjogXCJeMC4yLjJcIixcblx0XHRcInByaXNtYVwiOiBcIl40LjEwLjBcIixcblx0XHRcInN2ZWx0ZVwiOiBcIl4zLjU1LjFcIixcblx0XHRcInN2ZWx0ZS1jaGVja1wiOiBcIl4zLjAuM1wiLFxuXHRcdFwic3ZlbHRlLXByZXByb2Nlc3NcIjogXCJeNS4wLjFcIixcblx0XHRcInRhaWx3aW5kY3NzXCI6IFwiXjMuMi40XCIsXG5cdFx0XCJ0c2xpYlwiOiBcIl4yLjUuMFwiLFxuXHRcdFwidHlwZXNjcmlwdFwiOiBcIl40LjkuNVwiLFxuXHRcdFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xMy4wXCIsXG5cdFx0XCJ1bnBsdWdpbi1pY29uc1wiOiBcIl4wLjE1LjJcIixcblx0XHRcInZpdGVcIjogXCJeNC4xLjFcIlxuXHR9LFxuXHRcInR5cGVcIjogXCJtb2R1bGVcIixcblx0XCJkZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiQHByaXNtYS9jbGllbnRcIjogXCJeNC4xMC4wXCIsXG5cdFx0XCJAdW5vY3NzL3Jlc2V0XCI6IFwiXjAuNDkuNFwiLFxuXHRcdFwiYmNyeXB0anNcIjogXCJeMi40LjNcIixcblx0XHRcImNsc3hcIjogXCJeMS4yLjFcIixcblx0XHRcImRldmFsdWVcIjogXCJeNC4yLjNcIixcblx0XHRcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG5cdFx0XCJudW1iZXItdG8td29yZHNcIjogXCJeMS4yLjRcIixcblx0XHRcInN2ZWx0ZS1sb2NhbC1zdG9yYWdlLXN0b3JlXCI6IFwiXjAuNC4wXCIsXG5cdFx0XCJ1bm9jc3NcIjogXCJeMC40OS40XCIsXG5cdFx0XCJ6b2RcIjogXCJeMy4yMC4yXCIsXG5cdFx0XCJ6b2QtZmV0Y2hcIjogXCJeMC4xLjBcIlxuXHR9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlRLFNBQVMsaUJBQWlCO0FBQ25TLFNBQVMsaUJBQWlCLGFBQWEsc0JBQXNCO0FBQzdELE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjs7O0FDSHZCO0FBQUEsRUFDQyxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxTQUFXO0FBQUEsSUFDVixLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsSUFDVCxTQUFXO0FBQUEsSUFDWCxTQUFXO0FBQUEsSUFDWCxNQUFRO0FBQUEsSUFDUixPQUFTO0FBQUEsSUFDVCxlQUFlO0FBQUEsSUFDZixNQUFRO0FBQUEsSUFDUixRQUFVO0FBQUEsRUFDWDtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDbEIsZUFBZTtBQUFBLElBQ2YscUJBQXFCO0FBQUEsSUFDckIsaUJBQWlCO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIsMEJBQTBCO0FBQUEsSUFDMUIsaUJBQWlCO0FBQUEsSUFDakIsbUJBQW1CO0FBQUEsSUFDbkIsb0JBQW9CO0FBQUEsSUFDcEIsb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0IsY0FBZ0I7QUFBQSxJQUNoQixTQUFXO0FBQUEsSUFDWCxRQUFVO0FBQUEsSUFDViwwQkFBMEI7QUFBQSxJQUMxQix5QkFBeUI7QUFBQSxJQUN6QixTQUFXO0FBQUEsSUFDWCx1QkFBdUI7QUFBQSxJQUN2QixrQkFBa0I7QUFBQSxJQUNsQixVQUFZO0FBQUEsSUFDWixvQ0FBb0M7QUFBQSxJQUNwQywwQkFBMEI7QUFBQSxJQUMxQiwwQkFBMEI7QUFBQSxJQUMxQiwrQkFBK0I7QUFBQSxJQUMvQixRQUFVO0FBQUEsSUFDVixRQUFVO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixxQkFBcUI7QUFBQSxJQUNyQixhQUFlO0FBQUEsSUFDZixPQUFTO0FBQUEsSUFDVCxZQUFjO0FBQUEsSUFDZCx3QkFBd0I7QUFBQSxJQUN4QixrQkFBa0I7QUFBQSxJQUNsQixNQUFRO0FBQUEsRUFDVDtBQUFBLEVBQ0EsTUFBUTtBQUFBLEVBQ1IsY0FBZ0I7QUFBQSxJQUNmLGtCQUFrQjtBQUFBLElBQ2xCLGlCQUFpQjtBQUFBLElBQ2pCLFVBQVk7QUFBQSxJQUNaLE1BQVE7QUFBQSxJQUNSLFNBQVc7QUFBQSxJQUNYLGFBQWE7QUFBQSxJQUNiLG1CQUFtQjtBQUFBLElBQ25CLDhCQUE4QjtBQUFBLElBQzlCLFFBQVU7QUFBQSxJQUNWLEtBQU87QUFBQSxJQUNQLGFBQWE7QUFBQSxFQUNkO0FBQ0Q7OztBRHhEQSxJQUFNLFNBQVM7QUFBQSxFQUNkLFFBQVE7QUFBQSxJQUNQLGFBQWEsS0FBSyxVQUFVLGdCQUFRLE9BQU87QUFBQSxFQUM1QztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsV0FBVztBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxVQUNDLEtBQUssQ0FBQyxHQUFHO0FBQUEsVUFDVCw4QkFBOEIsQ0FBQyxXQUFXO0FBQUEsVUFDMUMsTUFBTSxDQUFDLE1BQU07QUFBQSxRQUNkO0FBQUEsTUFDRDtBQUFBLE1BQ0EsTUFBTSxDQUFDLGNBQWMsY0FBYztBQUFBLE1BQ25DLEtBQUs7QUFBQSxJQUNOLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxNQUNOLFlBQVksQ0FBQyxlQUFlO0FBQUEsTUFDNUIsU0FBUztBQUFBLFFBQ1IsZUFBZTtBQUFBLFVBQ2QsYUFBYTtBQUFBLFVBQ2IsT0FBTztBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxRQUNELENBQUM7QUFBQSxRQUNELFlBQVk7QUFBQSxVQUNYLGlCQUFpQjtBQUFBLFlBQ2hCLE9BQU87QUFBQSxZQUNQLFNBQVM7QUFBQSxZQUNULGtCQUFrQjtBQUFBLFVBQ25CO0FBQUEsUUFDRCxDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0QsQ0FBQztBQUFBLElBQ0QsVUFBVTtBQUFBLEVBQ1g7QUFDRDtBQUVBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
