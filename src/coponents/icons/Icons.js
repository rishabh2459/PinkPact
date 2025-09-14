import React from 'react';
import Initial from '../../assets/svgs/initial.svg';
import Back from '../../assets/svgs/back.svg';
import OpenPassword from '../../assets/svgs/openPassword.svg';
import ClosedPassword from '../../assets/svgs/closedPassword.svg';
import GoogleIcon from '../../assets/svgs/googleIcon.svg';
import AppleIcon from '../../assets/svgs/appleIcon.svg';
import HomeTab from '../../assets/svgs/homeTab.svg';
import HomeTabUnselect from '../../assets/svgs/homeTabUnselect.svg';
import CommunityTab from '../../assets/svgs/communityTab.svg';
import CommunityTabUnselect from '../../assets/svgs/communityTabUnselect.svg';
import NotificationTab from '../../assets/svgs/notificationTab.svg';
import NotificationTabUnselect from '../../assets/svgs/notificationTabUnselect.svg';
import RageRoomTab from '../../assets/svgs/rageRoomTab.svg';
import ProfileTab from '../../assets/svgs/profileTab.svg';
import ProfileTabUnselect from '../../assets/svgs/profileTabUnselect.svg';
import Gallery from '../../assets/svgs/gallery.svg';
import Camera from '../../assets/svgs/camera.svg';
import Help from '../../assets/svgs/help.svg';
import AddUser from '../../assets/svgs/addUser.svg';
import AddUserPink from '../../assets/svgs/addUserPink.svg';
import MessageIcon from '../../assets/svgs/messageIcon.svg';
import SendButton from '../../assets/svgs/sendButton.svg';


// Map icon names to SVG components
const icons = {
  initial: Initial,
  back: Back,
  openPassword: OpenPassword,
  closedPassword: ClosedPassword,
  googleIcon: GoogleIcon,
  appleIcon: AppleIcon,
  homeTab: HomeTab,
  homeTabUnselect: HomeTabUnselect,
  communityTab: CommunityTab,
  communityTabUnselect: CommunityTabUnselect,
  notificationTab: NotificationTab,
  notificationTabUnselect: NotificationTabUnselect,
  rageRoomTab: RageRoomTab,
  profileTab: ProfileTab,
  profileTabUnselect: ProfileTabUnselect,
  Gallery,
  Camera,
  Help,
  AddUser,
  MessageIcon,
  AddUserPink,
  SendButton

};

const SvgIcon = ({ name, width, height, ...props }) => {
  const IconComponent = icons[name]; // <-- different name

  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={width} height={height} {...props} />;
};

export default SvgIcon;
