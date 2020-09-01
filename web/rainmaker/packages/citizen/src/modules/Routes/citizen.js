import React from "react";
import Loadable from "react-loadable";
import frameworkScreens from "./frameworkScreens";
import pgrRoutes from "pgr-citizen/Routes/pgr-routes";
import ptRoutes from "pt-citizen/Routes/pt-routes";

const Loading = () => <div />;

// user routes
const Register = Loadable({
  loader: () => import("modules/citizen/User/Register"),
  loading: Loading,
});
// import Register from "modules/citizen/User/Register";

const Login = Loadable({
  loader: () => import("modules/citizen/User/Login"),
  loading: Loading,
});
// import Login from "modules/citizen/User/Login";

const OTP = Loadable({
  loader: () => import("modules/citizen/User/OTP"),
  loading: Loading,
});
// import OTP from "modules/citizen/User/OTP";

const LanguageSelection = Loadable({
  loader: () => import("modules/citizen/User/LanguageSelection"),
  loading: Loading,
});
// import LanguageSelection from "modules/citizen/User/LanguageSelection";

const Profile = Loadable({
  loader: () => import("modules/citizen/User/Profile"),
  loading: Loading,
});
// import Profile from "modules/citizen/User/Profile";

// common screens

//import LandingPage from "modules/citizen/LandingPage";
const CitizenDashboard = Loadable({
  loader: () => import("modules/citizen/CitizenDashboard"),
  loading: Loading,
});
// import CitizenDashboard from "modules/citizen/CitizenDashboard";

const HowItWorks = Loadable({
  loader: () => import("modules/citizen/HowItWorks"),
  loading: Loading,
});
// import HowItWorks from "modules/citizen/HowItWorks";

const ContactUs = Loadable({
  loader: () => import("modules/citizen/ContactUs"),
  loading: Loading,
});
// import ContactUs from "modules/citizen/ContactUs";

const MyNotifications = Loadable({
  loader: () => import("modules/citizen/MyNotifications"),
  loading: Loading,
});
// import MyNotifications from "modules/citizen/MyNotifications";

const WhatsNew = Loadable({
  loader: () => import("modules/citizen/WhatsNew"),
  loading: Loading,
});
// import WhatsNew from "modules/citizen/WhatsNew";

const { EventDetails } = Loadable({
  loader: () => import("modules/common"),
  loading: Loading,
});
// import { EventDetails } from "modules/common";

const Events = Loadable({
  loader: () => import("modules/citizen/Events"),
  loading: Loading,
});
// import Events from "modules/citizen/Events";

const MyCity = Loadable({
  loader: () => import("modules/citizen/MyCity"),
  loading: Loading,
});
// import MyCity from "modules/citizen/MyCity";

const { ImageModalDisplay } = Loadable({
  loader: () => import("modules/common"),
  loading: Loading,
});
// import { ImageModalDisplay } from "modules/common";

// pgr specific screens
const { TrackLocation } = Loadable({
  loader: () => import("modules/common"),
  loading: Loading,
});
// import { TrackLocation } from "modules/common";

const { PrivacyPolicy } = Loadable({
  loader: () => import("modules/common"),
  loading: Loading,
});
// import { PrivacyPolicy } from "modules/common";

const TLHowItWorks = Loadable({
  loader: () => import("../../ui-views/HowItWorks"),
  loading: Loading,
});
// import TLHowItWorks from "../../ui-views/HowItWorks";

//Whatsapp Screen
const WhatsAppCity = Loadable({
  loader: () => import("modules/citizen/WhatsAppScreen/City"),
  loading: Loading,
});
// import  WhatsAppCity from "modules/citizen/WhatsAppScreen/City";

const WhatsAppLocality = Loadable({
  loader: () => import("modules/citizen/WhatsAppScreen/Locality"),
  loading: Loading,
});
// import  WhatsAppLocality from "modules/citizen/WhatsAppScreen/Locality";

const routes = [
  {
    path: "user/register",
    component: Register,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "language-selection",
    component: LanguageSelection,
    needsAuthentication: false,
    redirectionUrl: "/user/register",
  },

  {
    path: "privacy-policy",
    component: PrivacyPolicy,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/profile",
    component: Profile,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HOME_HEADER_PROFILE" },
  },
  // {
  //   path: "pgr-home",
  //   component: PGRHome,
  //   needsAuthentication: true,
  //   options: { isHomeScreen: true, title: "Home", hideTitle: true, redirectionUrl: "/user/register" },
  // },
  {
    path: "/",
    component: CitizenDashboard,
    needsAuthentication: true,
    options: {
      isHomeScreen: true,
      title: "CS_HOME_HEADER_HOME",
      hideTitle: true,
      redirectionUrl: "/user/login",
      notificationButton: true,
    },
  },
  {
    path: "image",
    component: ImageModalDisplay,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      hideHeader: true,
    },
  },
  {
    path: "contact-us",
    component: ContactUs,
    needsAuthentication: true,
    options: { title: "CS_HOME_HEADER_CONTACT_US", hideFooter: true },
  },
  {
    path: "map",
    component: TrackLocation,
    needsAuthentication: true,
    options: { hideHeader: true, hideFooter: true, title: "CS_HEADER_TRACK_LOCATION", hideTitle: true, hideActionMenu: true },
  },
  {
    path: "how-it-works",
    component: HowItWorks,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HOME_HEADER_HOW_IT_WORKS",
      titleBackground: true, // Use this if you need white background for title in web version
    },
  },
  {
    path: "trade-license/how-it-works",
    component: TLHowItWorks,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      title: "TL_HOW_IT_WORKS",
    },
  },
  {
    path: "notifications",
    component: MyNotifications,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_NOTIFICATIONS",
      helpButton: true,
    },
  },
  {
    path: "my-city",
    component: MyCity,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_MYCITY",
      helpButton: true,
    },
  },
  {
    path: "whats-new",
    component: WhatsNew,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_WHATSNEW",
      helpButton: true,
    },
  },
  {
    path: "events",
    component: Events,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_EVENTS",
      helpButton: true,
    },
  },
  {
    path: "event-details",
    component: EventDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_EVENT_DETAILS",
    },
  },
  {
    path: "openlink/whatsapp/city",
    component:  WhatsAppCity ,
    needsAuthentication: false,
    options: {
      hideFooter: true,
      title: "",
    },
  },
  {
    path: "openlink/whatsapp/locality",
    component:  WhatsAppLocality ,
    needsAuthentication: false,
    options: {
      hideFooter: true,
      title: "",
    },
  },
  ...pgrRoutes,
  ...ptRoutes,
  ...frameworkScreens,
];

export default routes;
