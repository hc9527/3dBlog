import { defineConfig } from "windicss/helpers"

export default defineConfig({
	darkMode: "class",
	shortcuts: {
		'flex-between-center': 'flex justify-between items-center'
	},
	theme: {
		extend: {
			colors: {
				white: '#ffffff',
				black: '#000000',
        success: '#66CDA5',
				warning: '#EC4C42',
				error: '#EEBA00',
				primary: '#409EFF',
      },
		}
  }
})
