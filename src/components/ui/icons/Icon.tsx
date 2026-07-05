import { IconProps, IconName } from './types';
import ArrowIcon from './icons/ArrowIcon';
import CloseIcon from './icons/CloseIcon';
import SearchIcon from './icons/SearchIcon';
import MenuIcon from './icons/MenuIcon';
import AttachmentIcon from './icons/AttachmentIcon';
import BellIcon from './icons/BellIcon';
import CalendarIcon from './icons/CalendarIcon';
import CameraIcon from './icons/CameraIcon';
import ChatIcon from './icons/ChatIcon';
import CheckIcon from './icons/CheckIcon';
import {
  ChevronIconLeft,
  ChevronIconRight,
  ChevronIconTop,
  ChevronIconBottom,
} from './icons/ChevronIcon';
import CircleIcon from './icons/CircleIcon';
import ClockIcon from './icons/ClockIcon';
import DownloadIcon from './icons/DownloadIcon';
import HeartIcon from './icons/HeartIcon';
import HomeIcon from './icons/HomeIcon';
import InfoIcon from './icons/InfoIcon';
import { ExternalLinkIcon, ExternalLinkIcon2 } from './icons/LinkIcon';
import { Loader, LoaderCircle } from './icons/LoaderSpinner';
import LockIcon from './icons/LockIcon';
import MinusIcon from './icons/MinusIcon';
import MoonIcon from './icons/MoonIcon';
import PlusIcon from './icons/PlusIcon';
import SettingsIcon from './icons/SettingsIcon';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  GitHubIcon,
  WhatsAppIcon,
} from './icons/SocialIcon';
import StarIcon from './icons/StarIcon';
import SunIcon from './icons/SunIcon';
import TrashIcon from './icons/TrashIcon';
import { TrendingUpIcon, TrendingDownIcon } from './icons/TrendingIcon';
import UnlockIcon from './icons/UnlockIcon';
import UploadIcon from './icons/UploadIcon';
import { UserIcon, UsersIcon, UserRoundIcon } from './icons/UserIcon';
import WarningIcon from './icons/WarningIcon';
import { ZoomInIcon, ZoomOutIcon } from './icons/ZoomIcon';

const icons: Record<string, React.FC<IconProps>> = {
  ArrowIcon,
  AttachmentIcon,
  BellIcon,
  CalendarIcon,
  CameraIcon,
  ChatIcon,
  CheckIcon,
  ChevronIconLeft,
  ChevronIconRight,
  ChevronIconTop,
  ChevronIconBottom,
  CircleIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  ExternalLinkIcon,
  ExternalLinkIcon2,
  Loader,
  LoaderCircle,
  LockIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  GitHubIcon,
  WhatsAppIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UnlockIcon,
  UploadIcon,
  UserIcon,
  UserRoundIcon,
  UsersIcon,
  WarningIcon,
  ZoomInIcon,
  ZoomOutIcon,
};

interface Props extends IconProps {
  name: IconName;
}

const Icon: React.FC<Props> = ({ name, ...props }) => {
  const Component = icons[name];
  if (!Component) return null;
  return <Component {...props} />;
};

export default Icon;
