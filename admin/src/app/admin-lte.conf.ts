export const adminLteConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    {label: 'Dashboard', route: '/dashboard', iconClasses: 'fa fa-dashboard'},
    {label: 'Listing NAVIGATION', separator: true},   
    {label: 'Organizations Listing', route: 'organization-listing', iconClasses: 'fa fa-building-o'},
    {label: 'Categories Listing', route: 'category-listing', iconClasses: 'fa fa-list'},
    {label: 'Questionnaires', iconClasses: 'fa fa-th-list', children: [
      {label: 'Sections Listing', route: 'questionnaires/sections'},
      {label: 'Questions Listing', route: 'questionnaires/questions'}      
    ]},
    {label: 'Users Listing', route: 'user-listing', iconClasses: 'fa fa-users'},
    {label: 'FAQs Listing', route: 'faq-listing', iconClasses: 'fa fa-question-circle'},

    {label: 'Other NAVIGATION', separator: true},
    {label: 'Change Password', route: 'change-password', iconClasses: 'fa fa-key'},
    {label: 'Profile', route: 'update-profile', iconClasses: 'fa fa-edit'},
    {label: 'Settings', route: 'settings', iconClasses: 'fa fa-cog'},
    {label: 'Logout', route: 'logout', iconClasses: 'fa fa-sign-out'},
   
    /*{label: 'Other Actions', separator: true},
    {label: 'Profile', route: 'home/profile', iconClasses: 'fa fa-tasks'},
    {label: 'Change Password', route: 'home/change-password', iconClasses: 'fa fa-tasks'},*/
  ]
};
