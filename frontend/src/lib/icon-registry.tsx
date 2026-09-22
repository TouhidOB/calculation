import * as React from "react"
import type { SvgIconProps } from "@mui/material/SvgIcon"

// Top curated high-frequency icons (107 icons covering all categories + popular calcs)
import AcUnit from "@mui/icons-material/AcUnit"
import AccessTime from "@mui/icons-material/AccessTime"
import Accessibility from "@mui/icons-material/Accessibility"
import AccountBalance from "@mui/icons-material/AccountBalance"
import Adjust from "@mui/icons-material/Adjust"
import Agriculture from "@mui/icons-material/Agriculture"
import Apartment from "@mui/icons-material/Apartment"
import Architecture from "@mui/icons-material/Architecture"
import Article from "@mui/icons-material/Article"
import Assessment from "@mui/icons-material/Assessment"
import Assignment from "@mui/icons-material/Assignment"
import AttachMoney from "@mui/icons-material/AttachMoney"
import Badge from "@mui/icons-material/Badge"
import Balance from "@mui/icons-material/Balance"
import BarChart from "@mui/icons-material/BarChart"
import Biotech from "@mui/icons-material/Biotech"
import BlenderTwoTone from "@mui/icons-material/BlenderTwoTone"
import Bolt from "@mui/icons-material/Bolt"
import BoltTwoTone from "@mui/icons-material/BoltTwoTone"
import Build from "@mui/icons-material/Build"
import BusinessCenter from "@mui/icons-material/BusinessCenter"
import Cake from "@mui/icons-material/Cake"
import Calculate from "@mui/icons-material/Calculate"
import CalendarMonth from "@mui/icons-material/CalendarMonth"
import Checkroom from "@mui/icons-material/Checkroom"
import Circle from "@mui/icons-material/Circle"
import Code from "@mui/icons-material/Code"
import CompareArrows from "@mui/icons-material/CompareArrows"
import Construction from "@mui/icons-material/Construction"
import CreditCard from "@mui/icons-material/CreditCard"
import CropSquare from "@mui/icons-material/CropSquare"
import CurrencyExchange from "@mui/icons-material/CurrencyExchange"
import DateRange from "@mui/icons-material/DateRange"
import Delete from "@mui/icons-material/Delete"
import DirectionsBoat from "@mui/icons-material/DirectionsBoat"
import DirectionsCar from "@mui/icons-material/DirectionsCar"
import DirectionsRun from "@mui/icons-material/DirectionsRun"
import Discount from "@mui/icons-material/Discount"
import Domain from "@mui/icons-material/Domain"
import DomainAdd from "@mui/icons-material/DomainAdd"
import Elderly from "@mui/icons-material/Elderly"
import ElderlyWoman from "@mui/icons-material/ElderlyWoman"
import EventRepeat from "@mui/icons-material/EventRepeat"
import Favorite from "@mui/icons-material/Favorite"
import FindInPage from "@mui/icons-material/FindInPage"
import FitnessCenter from "@mui/icons-material/FitnessCenter"
import Functions from "@mui/icons-material/Functions"
import Gavel from "@mui/icons-material/Gavel"
import HealthAndSafety from "@mui/icons-material/HealthAndSafety"
import HolidayVillage from "@mui/icons-material/HolidayVillage"
import Hotel from "@mui/icons-material/Hotel"
import House from "@mui/icons-material/House"
import Image from "@mui/icons-material/Image"
import Insights from "@mui/icons-material/Insights"
import Landscape from "@mui/icons-material/Landscape"
import Language from "@mui/icons-material/Language"
import LocalBar from "@mui/icons-material/LocalBar"
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment"
import LocalGasStation from "@mui/icons-material/LocalGasStation"
import LocalShipping from "@mui/icons-material/LocalShipping"
import Lock from "@mui/icons-material/Lock"
import Medication from "@mui/icons-material/Medication"
import MenuBook from "@mui/icons-material/MenuBook"
import MilitaryTech from "@mui/icons-material/MilitaryTech"
import MonitorHeart from "@mui/icons-material/MonitorHeart"
import Paid from "@mui/icons-material/Paid"
import Payments from "@mui/icons-material/Payments"
import People from "@mui/icons-material/People"
import Percent from "@mui/icons-material/Percent"
import Pets from "@mui/icons-material/Pets"
import PieChart from "@mui/icons-material/PieChart"
import PregnantWoman from "@mui/icons-material/PregnantWoman"
import Receipt from "@mui/icons-material/Receipt"
import RecyclingTwoTone from "@mui/icons-material/RecyclingTwoTone"
import RequestQuote from "@mui/icons-material/RequestQuote"
import Restaurant from "@mui/icons-material/Restaurant"
import Savings from "@mui/icons-material/Savings"
import Scale from "@mui/icons-material/Scale"
import Schedule from "@mui/icons-material/Schedule"
import School from "@mui/icons-material/School"
import Science from "@mui/icons-material/Science"
import SettingsBackupRestore from "@mui/icons-material/SettingsBackupRestore"
import ShowChart from "@mui/icons-material/ShowChart"
import Shuffle from "@mui/icons-material/Shuffle"
import SpaceDashboard from "@mui/icons-material/SpaceDashboard"
import Speaker from "@mui/icons-material/Speaker"
import Speed from "@mui/icons-material/Speed"
import SquareFoot from "@mui/icons-material/SquareFoot"
import Storage from "@mui/icons-material/Storage"
import Straighten from "@mui/icons-material/Straighten"
import Subscriptions from "@mui/icons-material/Subscriptions"
import SwapHoriz from "@mui/icons-material/SwapHoriz"
import TableChart from "@mui/icons-material/TableChart"
import Terrain from "@mui/icons-material/Terrain"
import Timeline from "@mui/icons-material/Timeline"
import Timer from "@mui/icons-material/Timer"
import Today from "@mui/icons-material/Today"
import Translate from "@mui/icons-material/Translate"
import TrendingDown from "@mui/icons-material/TrendingDown"
import TrendingUp from "@mui/icons-material/TrendingUp"
import Tv from "@mui/icons-material/Tv"
import VerifiedUser from "@mui/icons-material/VerifiedUser"
import ViewInAr from "@mui/icons-material/ViewInAr"
import WaterDamage from "@mui/icons-material/WaterDamage"
import WaterDrop from "@mui/icons-material/WaterDrop"
import Work from "@mui/icons-material/Work"
import Yard from "@mui/icons-material/Yard"

// Icon registry map
export const ICON_REGISTRY: Record<string, React.ComponentType<SvgIconProps>> = {
  AcUnit,
  AccessTime,
  Accessibility,
  AccountBalance,
  Adjust,
  Agriculture,
  Apartment,
  Architecture,
  Article,
  Assessment,
  Assignment,
  AttachMoney,
  Badge,
  Balance,
  BarChart,
  Biotech,
  BlenderTwoTone,
  Bolt,
  BoltTwoTone,
  Build,
  BusinessCenter,
  Cake,
  Calculate,
  CalendarMonth,
  Checkroom,
  Circle,
  Code,
  CompareArrows,
  Construction,
  CreditCard,
  CropSquare,
  CurrencyExchange,
  DateRange,
  Delete,
  DirectionsBoat,
  DirectionsCar,
  DirectionsRun,
  Discount,
  Domain,
  DomainAdd,
  Elderly,
  ElderlyWoman,
  EventRepeat,
  Favorite,
  FindInPage,
  FitnessCenter,
  Functions,
  Gavel,
  HealthAndSafety,
  HolidayVillage,
  Hotel,
  House,
  Image,
  Insights,
  Landscape,
  Language,
  LocalBar,
  LocalFireDepartment,
  LocalGasStation,
  LocalShipping,
  Lock,
  Medication,
  MenuBook,
  MilitaryTech,
  MonitorHeart,
  Paid,
  Payments,
  People,
  Percent,
  Pets,
  PieChart,
  PregnantWoman,
  Receipt,
  RecyclingTwoTone,
  RequestQuote,
  Restaurant,
  Savings,
  Scale,
  Schedule,
  School,
  Science,
  SettingsBackupRestore,
  ShowChart,
  Shuffle,
  SpaceDashboard,
  Speaker,
  Speed,
  SquareFoot,
  Storage,
  Straighten,
  Subscriptions,
  SwapHoriz,
  TableChart,
  Terrain,
  Timeline,
  Timer,
  Today,
  Translate,
  TrendingDown,
  TrendingUp,
  Tv,
  VerifiedUser,
  ViewInAr,
  WaterDamage,
  WaterDrop,
  Work,
  Yard,
}

export const CATEGORY_FALLBACK_ICONS: Record<string, React.ComponentType<SvgIconProps>> = {
  finance: AttachMoney,
  business_investment: TrendingUp,
  health: Favorite,
  construction: Construction,
  basic: Functions,
  conversion: SwapHoriz,
  date_time: Schedule,
  education: School,
  real_estate: House,
  event_budget: Cake,
}

export function getIconComponent(name: string, category?: string): React.ComponentType<SvgIconProps> {
  if (name && ICON_REGISTRY[name]) {
    return ICON_REGISTRY[name]
  }
  if (category && CATEGORY_FALLBACK_ICONS[category]) {
    return CATEGORY_FALLBACK_ICONS[category]
  }
  return Calculate
}
