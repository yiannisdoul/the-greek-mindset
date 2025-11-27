// src/components/ui/navigation-menu.tsx
"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

// Greek Mindset Enhanced Navigation Components

interface GreekNavigationMenuProps {
  children: React.ReactNode
  className?: string
}

/**
 * Greek Mindset themed navigation menu with marble styling
 */
const GreekNavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  GreekNavigationMenuProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenu
    ref={ref}
    className={cn(
      "bg-white/90 backdrop-blur-sm border border-marble-200 rounded-lg shadow-lg",
      "marble-texture",
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenu>
))
GreekNavigationMenu.displayName = "GreekNavigationMenu"

/**
 * Greek themed navigation trigger with enhanced styling
 */
const GreekNavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuTrigger
    ref={ref}
    className={cn(
      "text-greek-blue hover:text-greek-gold hover:bg-greek-gold/10",
      "data-[active]:bg-greek-gold/20 data-[state=open]:bg-greek-gold/20",
      "transition-all duration-300 font-medium",
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenuTrigger>
))
GreekNavigationMenuTrigger.displayName = "GreekNavigationMenuTrigger"

/**
 * Greek themed navigation content with enhanced styling
 */
const GreekNavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuContent
    ref={ref}
    className={cn(
      "bg-white/95 backdrop-blur-sm border-marble-200 shadow-xl",
      "marble-texture",
      className
    )}
    {...props}
  />
))
GreekNavigationMenuContent.displayName = "GreekNavigationMenuContent"

// Specialized Navigation Components for Greek Mindset

interface NavItemProps {
  title: string
  description?: string
  href?: string
  icon?: React.ReactNode
  badge?: string
  onClick?: () => void
  className?: string
}

/**
 * Navigation item with enhanced styling and optional features
 */
const NavigationItem: React.FC<NavItemProps> = ({
  title,
  description,
  href,
  icon,
  badge,
  onClick,
  className
}) => (
  <NavigationMenuLink
    href={href}
    onClick={onClick}
    className={cn(
      "group flex items-start gap-4 rounded-lg p-4 transition-all hover:bg-greek-gold/10",
      "focus:bg-greek-gold/10 focus:outline-none",
      className
    )}
  >
    {icon && (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-greek-gold/20 text-greek-gold group-hover:bg-greek-gold group-hover:text-white transition-all">
        {icon}
      </div>
    )}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-greek-blue group-hover:text-greek-gold transition-colors">
          {title}
        </h3>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-greek-gold px-2 py-1 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors line-clamp-2">
          {description}
        </p>
      )}
    </div>
  </NavigationMenuLink>
)

/**
 * Mind section navigation menu
 */
interface MindNavigationProps {
  onItemClick?: (section: string) => void
}

const MindNavigation: React.FC<MindNavigationProps> = ({ onItemClick }) => (
  <GreekNavigationMenuContent className="w-[600px] p-4">
    <div className="grid grid-cols-2 gap-4">
      <NavigationItem
        title="Philosophy"
        description="Explore the wisdom of Socrates, Plato, and Aristotle. Learn timeless principles for ethical living."
        href="/mind/philosophy"
        icon={<span className="text-lg">🤔</span>}
        onClick={() => onItemClick?.('philosophy')}
      />
      <NavigationItem
        title="History"
        description="Journey through ancient Greek civilization from Bronze Age to Roman conquest."
        href="/mind/history"
        icon={<span className="text-lg">🏛️</span>}
        onClick={() => onItemClick?.('history')}
      />
      <NavigationItem
        title="Geography"
        description="Navigate ancient Greek lands and discover how geography shaped civilization."
        href="/mind/geography"
        icon={<span className="text-lg">🗺️</span>}
        onClick={() => onItemClick?.('geography')}
      />
      <NavigationItem
        title="Mythology"
        description="Immerse yourself in epic tales of gods, heroes, and legendary creatures."
        href="/mind/mythology"
        icon={<span className="text-lg">⚡</span>}
        badge="Popular"
        onClick={() => onItemClick?.('mythology')}
      />
    </div>
    <div className="mt-6 border-t border-marble-200 pt-4">
      <NavigationItem
        title="Learning Paths"
        description="Structured courses combining all aspects of Greek intellectual tradition"
        href="/mind/learning-paths"
        icon={<span className="text-lg">📚</span>}
        onClick={() => onItemClick?.('learning-paths')}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
      />
    </div>
  </GreekNavigationMenuContent>
)

/**
 * Body section navigation menu
 */
interface BodyNavigationProps {
  onItemClick?: (section: string) => void
}

const BodyNavigation: React.FC<BodyNavigationProps> = ({ onItemClick }) => (
  <GreekNavigationMenuContent className="w-[600px] p-4">
    <div className="grid grid-cols-2 gap-4">
      <NavigationItem
        title="Spartan Workouts"
        description="Build functional strength with bodyweight exercises inspired by ancient warriors."
        href="/body/spartan-workout"
        icon={<span className="text-lg">⚔️</span>}
        onClick={() => onItemClick?.('spartan-workout')}
      />
      <NavigationItem
        title="Greek Dancing"
        description="Learn traditional dances that combine cardio, coordination, and cultural joy."
        href="/body/greek-dancing"
        icon={<span className="text-lg">💃</span>}
        onClick={() => onItemClick?.('greek-dancing')}
      />
      <NavigationItem
        title="Greek Cooking"
        description="Nourish your body with authentic Mediterranean recipes for optimal health."
        href="/body/greek-cooking"
        icon={<span className="text-lg">🥗</span>}
        onClick={() => onItemClick?.('greek-cooking')}
      />
      <NavigationItem
        title="Wellness Practices"
        description="Ancient Greek approaches to health, including breathing and meditation."
        href="/body/wellness"
        icon={<span className="text-lg">🧘</span>}
        badge="New"
        onClick={() => onItemClick?.('wellness')}
      />
    </div>
    <div className="mt-6 border-t border-marble-200 pt-4">
      <NavigationItem
        title="Fitness Plans"
        description="Comprehensive training programs combining all aspects of Greek physical culture"
        href="/body/fitness-plans"
        icon={<span className="text-lg">💪</span>}
        onClick={() => onItemClick?.('fitness-plans')}
        className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
      />
    </div>
  </GreekNavigationMenuContent>
)

/**
 * Community section navigation menu
 */
interface CommunityNavigationProps {
  onItemClick?: (section: string) => void
}

const CommunityNavigation: React.FC<CommunityNavigationProps> = ({ onItemClick }) => (
  <GreekNavigationMenuContent className="w-[500px] p-4">
    <div className="space-y-3">
      <NavigationItem
        title="Discussion Forums"
        description="Connect with fellow learners and share insights about Greek wisdom"
        href="/community/forums"
        icon={<span className="text-lg">💬</span>}
        onClick={() => onItemClick?.('forums')}
      />
      <NavigationItem
        title="Study Groups"
        description="Join organized learning circles for philosophy and historical studies"
        href="/community/study-groups"
        icon={<span className="text-lg">👥</span>}
        onClick={() => onItemClick?.('study-groups')}
      />
      <NavigationItem
        title="Events & Workshops"
        description="Participate in virtual and local events celebrating Greek culture"
        href="/community/events"
        icon={<span className="text-lg">📅</span>}
        badge="Live"
        onClick={() => onItemClick?.('events')}
      />
      <NavigationItem
        title="Mentorship"
        description="Connect with experienced practitioners for guidance on your journey"
        href="/community/mentorship"
        icon={<span className="text-lg">🎓</span>}
        onClick={() => onItemClick?.('mentorship')}
      />
    </div>
  </GreekNavigationMenuContent>
)

/**
 * Shop section navigation menu
 */
interface ShopNavigationProps {
  onItemClick?: (section: string) => void
}

const ShopNavigation: React.FC<ShopNavigationProps> = ({ onItemClick }) => (
  <GreekNavigationMenuContent className="w-[500px] p-4">
    <div className="space-y-3">
      <NavigationItem
        title="Books & Texts"
        description="Curated collection of Greek philosophy, history, and cultural texts"
        href="/shop/books"
        icon={<span className="text-lg">📖</span>}
        onClick={() => onItemClick?.('books')}
      />
      <NavigationItem
        title="Fitness Equipment"
        description="Tools and gear for authentic Greek-inspired physical training"
        href="/shop/fitness"
        icon={<span className="text-lg">🏋️</span>}
        onClick={() => onItemClick?.('fitness')}
      />
      <NavigationItem
        title="Art & Decor"
        description="Beautiful Greek-inspired artwork and home decorations"
        href="/shop/art"
        icon={<span className="text-lg">🎨</span>}
        onClick={() => onItemClick?.('art')}
      />
      <NavigationItem
        title="Apparel"
        description="Clothing and accessories celebrating Greek heritage and philosophy"
        href="/shop/apparel"
        icon={<span className="text-lg">👕</span>}
        badge="Sale"
        onClick={() => onItemClick?.('apparel')}
      />
    </div>
    <div className="mt-6 border-t border-marble-200 pt-4">
      <div className="bg-gradient-to-r from-greek-gold to-greek-blue rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2">Support Our Mission</h3>
        <p className="text-sm opacity-90 mb-3">
          Your purchases help us spread Greek wisdom worldwide
        </p>
        <NavigationMenuLink 
          href="/shop/donate"
          className="inline-flex items-center text-sm font-medium underline hover:no-underline"
        >
          Make a Donation →
        </NavigationMenuLink>
      </div>
    </div>
  </GreekNavigationMenuContent>
)

/**
 * Complete Greek Mindset Navigation Menu
 */
interface GreekMindsetNavigationProps {
  onSectionClick?: (section: string) => void
}

const GreekMindsetNavigation: React.FC<GreekMindsetNavigationProps> = ({ onSectionClick }) => (
  <GreekNavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <GreekNavigationMenuTrigger>Mind</GreekNavigationMenuTrigger>
        <MindNavigation onItemClick={onSectionClick} />
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <GreekNavigationMenuTrigger>Body</GreekNavigationMenuTrigger>
        <BodyNavigation onItemClick={onSectionClick} />
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <GreekNavigationMenuTrigger>Community</GreekNavigationMenuTrigger>
        <CommunityNavigation onItemClick={onSectionClick} />
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <GreekNavigationMenuTrigger>Shop</GreekNavigationMenuTrigger>
        <ShopNavigation onItemClick={onSectionClick} />
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NavigationMenuLink
          href="/about"
          className={cn(
            navigationMenuTriggerStyle(),
            "text-greek-blue hover:text-greek-gold hover:bg-greek-gold/10 transition-all duration-300"
          )}
        >
          About
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </GreekNavigationMenu>
)

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  // Greek Mindset specific components
  GreekNavigationMenu,
  GreekNavigationMenuTrigger,
  GreekNavigationMenuContent,
  NavigationItem,
  MindNavigation,
  BodyNavigation,
  CommunityNavigation,
  ShopNavigation,
  GreekMindsetNavigation
}