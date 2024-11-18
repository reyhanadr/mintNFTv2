import { IconType } from 'react-icons';
import { SiOpensea } from "react-icons/si";
import { PiHouseDuotone } from "react-icons/pi";
import { GrGallery } from "react-icons/gr";

import {
	HiChevronUp,
	HiChevronDown,
	HiChevronRight,
	HiChevronLeft,
	HiOutlineArrowPath,
	HiCheck,
	HiMiniQuestionMarkCircle,
	HiMiniMinus,
	HiMiniPlus,
	HiMiniUser,
	HiMiniXMark,
	HiEyeDropper,
	HiOutlineLink,
	HiExclamationTriangle,
	HiArrowUpRight,
	HiInformationCircle,
	HiExclamationCircle,
	HiCheckCircle,
	HiMiniMagnifyingGlass,
} from "react-icons/hi2";

import {
	FaDiscord,
	FaGithub
} from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
	chevronUp: HiChevronUp,
    chevronDown: HiChevronDown,
	chevronRight: HiChevronRight,
	chevronLeft: HiChevronLeft,
	refresh: HiOutlineArrowPath,
	check: HiCheck,
	helpCircle: HiMiniQuestionMarkCircle,
	infoCircle: HiInformationCircle,
	warningTriangle: HiExclamationTriangle,
	errorCircle: HiExclamationCircle,
	checkCircle: HiCheckCircle,
	eyeDropper: HiEyeDropper,
	person: HiMiniUser,
	close: HiMiniXMark,
	openLink: HiOutlineLink,
	discord: FaDiscord,
	github: FaGithub,
	arrowUpRight: HiArrowUpRight,
	minus: HiMiniMinus,
	plus: HiMiniPlus,
	HiMiniMagnifyingGlass: HiMiniMagnifyingGlass,
	opensea:SiOpensea,
	PiHouseDuotone:PiHouseDuotone,
	GrGallery:GrGallery,
};