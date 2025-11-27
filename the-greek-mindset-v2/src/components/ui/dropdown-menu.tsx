// src/components/ui/dropdown-menu.tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// Enhanced Greek Mindset specific dropdown components

interface GreekDropdownMenuProps {
  children: React.ReactNode
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

/**
 * Greek Mindset themed dropdown menu with marble styling
 */
const GreekDropdownMenu = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  GreekDropdownMenuProps
>(({ children, align = "start", side = "bottom", className, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    align={align}
    side={side}
    className={cn(
      "bg-white/95 backdrop-blur-sm border-marble-200 shadow-xl",
      "marble-texture",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuContent>
))
GreekDropdownMenu.displayName = "GreekDropdownMenu"

/**
 * User profile dropdown menu
 */
interface UserDropdownProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick
}) => (
  <GreekDropdownMenu>
    <DropdownMenuLabel className="font-medium">
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
      <span>Profile</span>
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
      <span>Settings</span>
      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem 
      onClick={onLogoutClick} 
      className="cursor-pointer text-red-600 focus:text-red-600"
    >
      <span>Log out</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </GreekDropdownMenu>
)

/**
 * Navigation dropdown menu for sections
 */
interface NavDropdownProps {
  title: string
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
    badge?: string
    disabled?: boolean
  }>
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title, items }) => (
  <GreekDropdownMenu>
    <DropdownMenuLabel className="text-greek-blue font-semibold">
      {title}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    {items.map((item, index) => (
      <DropdownMenuItem
        key={index}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(
          "cursor-pointer flex items-center gap-2",
          item.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="ml-auto text-xs bg-greek-gold text-white px-1.5 py-0.5 rounded">
            {item.badge}
          </span>
        )}
      </DropdownMenuItem>
    ))}
  </GreekDropdownMenu>
)

/**
 * Filter dropdown menu for lists
 */
interface FilterDropdownProps {
  title: string
  options: Array<{
    value: string
    label: string
    count?: number
  }>
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  multiSelect?: boolean
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = true
}) => {
  const handleItemClick = (value: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      onSelectionChange(newValues)
    } else {
      onSelectionChange([value])
    }
  }

  return (
    <GreekDropdownMenu>
      <DropdownMenuLabel className="text-greek-blue font-semibold">
        {title}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {options.map((option) => (
        <DropdownMenuCheckboxItem
          key={option.value}
          checked={selectedValues.includes(option.value)}
          onCheckedChange={() => handleItemClick(option.value)}
          className="cursor-pointer"
        >
          <span className="flex-1">{option.label}</span>
          {option.count !== undefined && (
            <span className="ml-auto text-xs text-gray-500">
              ({option.count})
            </span>
          )}
        </DropdownMenuCheckboxItem>
      ))}
    </GreekDropdownMenu>
  )
}

/**
 * Sort dropdown menu
 */
interface SortDropdownProps {
  options: Array<{
    value: string
    label: string
  }>
  selectedValue: string
  onSelectionChange: (value: string) => void
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  selectedValue,
  onSelectionChange
}) => (
  <GreekDropdownMenu>
    <DropdownMenuLabel className="text-greek-blue font-semibold">
      Sort by
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value={selectedValue} onValueChange={onSelectionChange}>
      {options.map((option) => (
        <DropdownMenuRadioItem
          key={option.value}
          value={option.value}
          className="cursor-pointer"
        >
          {option.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  </GreekDropdownMenu>
)

/**
 * Actions dropdown menu with icons
 */
interface ActionsDropdownProps {
  actions: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'destructive'
    disabled?: boolean
  }>
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => (
  <GreekDropdownMenu>
    {actions.map((action, index) => (
      <React.Fragment key={index}>
        <DropdownMenuItem
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "cursor-pointer flex items-center gap-2",
            action.variant === 'destructive' && "text-red-600 focus:text-red-600",
            action.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {action.icon && <span className="w-4 h-4">{action.icon}</span>}
          <span>{action.label}</span>
        </DropdownMenuItem>
        {index < actions.length - 1 && action.variant === 'destructive' && (
          <DropdownMenuSeparator />
        )}
      </React.Fragment>
    ))}
  </GreekDropdownMenu>
)

/**
 * Language/Locale dropdown menu
 */
interface LanguageDropdownProps {
  languages: Array<{
    code: string
    name: string
    flag?: string
  }>
  selectedLanguage: string
  onLanguageChange: (code: string) => void
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange
}) => (
  <GreekDropdownMenu>
    <DropdownMenuLabel className="text-greek-blue font-semibold">
      Language
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value={selectedLanguage} onValueChange={onLanguageChange}>
      {languages.map((language) => (
        <DropdownMenuRadioItem
          key={language.code}
          value={language.code}
          className="cursor-pointer flex items-center gap-2"
        >
          {language.flag && <span>{language.flag}</span>}
          <span>{language.name}</span>
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  </GreekDropdownMenu>
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  // Greek Mindset specific components
  GreekDropdownMenu,
  UserDropdown,
  NavDropdown,
  FilterDropdown,
  SortDropdown,
  ActionsDropdown,
  LanguageDropdown
}