// @flow
import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  CHANGE_TOPBAR_THEME,
  SHOW_RIGHT_SIDEBAR,
  CHANGE_SIDEBAR_THEME_IMAGE,
  CHANGE_PRELOADER,
  TOGGLE_LEFTMENU,
  SHOW_SIDEBAR,
  CHANGE_LAYOUT_MODE
<<<<<<< HEAD
} from "./actionTypes";
=======
} from "./actionTypes"
>>>>>>> master

//constants
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftBarThemeImageTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from "../../constants/layout";

const INIT_STATE = {
  layoutType: layoutTypes.VERTICAL,
  layoutModeType: layoutModeTypes.LIGHT,
  layoutWidth: layoutWidthTypes.FLUID,
<<<<<<< HEAD
  leftSideBarTheme: leftSideBarThemeTypes.DARK,
=======
  leftSideBarTheme: leftSideBarThemeTypes.LIGHT,
>>>>>>> master
  leftSideBarThemeImage: leftBarThemeImageTypes.NONE,
  leftSideBarType: leftSidebarTypes.DEFAULT,
  topbarTheme: topBarThemeTypes.LIGHT,
  isPreloader: false,
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
}
<<<<<<< HEAD
=======

>>>>>>> master
const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      }
    case CHANGE_PRELOADER:
      return {
        ...state,
        isPreloader: action.payload,
      }
<<<<<<< HEAD

=======
>>>>>>> master
    case CHANGE_LAYOUT_MODE:
      return {
        ...state,
        layoutModeType: action.payload,
      }
<<<<<<< HEAD

=======
>>>>>>> master
    case CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidth: action.payload,
      }
    case CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSideBarTheme: action.payload,
      }
    case CHANGE_SIDEBAR_THEME_IMAGE:
      return {
        ...state,
        leftSideBarThemeImage: action.payload,
      }
    case CHANGE_SIDEBAR_TYPE:
      return {
        ...state,
        leftSideBarType: action.payload.sidebarType,
      }
    case CHANGE_TOPBAR_THEME:
      return {
        ...state,
        topbarTheme: action.payload,
      }
    case SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: action.payload,
      }
    case SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: action.payload,
      }
    case TOGGLE_LEFTMENU:
      return {
        ...state,
        leftMenu: action.payload,
      }

    default:
      return state
  }
}

export default Layout
