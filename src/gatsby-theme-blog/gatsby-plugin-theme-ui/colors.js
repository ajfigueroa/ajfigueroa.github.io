import merge from "deepmerge"
import defaultThemeColors from "gatsby-theme-blog/src/gatsby-plugin-theme-ui/colors"

const darkBlue = `#007acc`
const blueGray = `#282c35`

export default merge(defaultThemeColors, {
  text: blueGray,
  primary: darkBlue,
  heading: blueGray,
  modes: {
    dark: {
      background: blueGray,
      primary: darkBlue,
      highlight: darkBlue,
    },
  },
})
