export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Comms",
  description: "Tawk clone for learning purposes.",
  mainNav: [
    {
      title: "Comms",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/_kariuki_george",
    github: "https://github.com/kariuki-george",
  },
  nav: {
    auth: {
      login: "/auth/login",
      register: "/auth/getstarted",
    },
    dashboard: "/dashboard",
    settings: "/settings",
    chats: {
      unassigned: "/chats/unassigned",
      assigned: "/chats/assigned",
    },
  },
}