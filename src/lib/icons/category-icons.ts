import type { Component } from 'svelte';
import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
import Car from '@lucide/svelte/icons/car';
import Fuel from '@lucide/svelte/icons/fuel';
import Bus from '@lucide/svelte/icons/bus';
import Plane from '@lucide/svelte/icons/plane';
import Home from '@lucide/svelte/icons/home';
import Utensils from '@lucide/svelte/icons/utensils';
import Zap from '@lucide/svelte/icons/zap';
import Lightbulb from '@lucide/svelte/icons/lightbulb';
import Music from '@lucide/svelte/icons/music';
import Gamepad2 from '@lucide/svelte/icons/gamepad-2';
import Tv from '@lucide/svelte/icons/tv';
import Shirt from '@lucide/svelte/icons/shirt';
import HeartPulse from '@lucide/svelte/icons/heart-pulse';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import BookOpen from '@lucide/svelte/icons/book-open';
import Landmark from '@lucide/svelte/icons/landmark';
import Wallet from '@lucide/svelte/icons/wallet';
import Circle from '@lucide/svelte/icons/circle';
import { Film, Pizza } from '@lucide/svelte';

export const categoryIcons: Record<string, Component> = {
	'shopping-cart': ShoppingCart,
	'shopping-bag': ShoppingBag,
	car: Car,
	fuel: Fuel,
	bus: Bus,
	plane: Plane,
	home: Home,
	utensils: Utensils,
	zap: Zap,
	lightbulb: Lightbulb,
	music: Music,
	'gamepad-2': Gamepad2,
	tv: Tv,
	shirt: Shirt,
	'heart-pulse': HeartPulse,
	'graduation-cap': GraduationCap,
	'book-open': BookOpen,
	landmark: Landmark,
	wallet: Wallet,
	film: Film,
	pizza: Pizza,
};

export const defaultIcon = Circle;
