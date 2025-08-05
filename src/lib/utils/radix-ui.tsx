"use client";

// Re-export all Radix UI components used in the project
// This fixes the "React7.createContext is not a function" error
// by ensuring all Radix UI components are treated as client components

export {
	// Accordion
	Accordion,
	// Alert Dialog
	AlertDialog,
	// Aspect Ratio
	AspectRatio,
	// Avatar
	Avatar,
	// Checkbox
	Checkbox,
	// Collapsible
	Collapsible,
	// Context Menu
	ContextMenu,
	// Dialog
	Dialog,
	// Dropdown Menu
	DropdownMenu,
	// Hover Card
	HoverCard,
	// Label
	Label,
	// Menubar
	Menubar,
	// Navigation Menu
	NavigationMenu,
	// Popover
	Popover,
	// Progress
	Progress,
	// Radio Group
	RadioGroup,
	// Scroll Area
	ScrollArea,
	// Select
	Select,
	// Separator
	Separator,
	// Slider
	Slider,
	// Slot
	Slot,
	// Switch
	Switch,
	// Tabs
	Tabs,
	// Toggle
	Toggle,
	// Toggle Group
	ToggleGroup,
	// Tooltip
	Tooltip,
} from "radix-ui";
