# Z-Index Hierarchy Reference

**Last Updated:** 2025-01-12

## Purpose
Central documentation of all z-index values to prevent layering conflicts and maintain consistent UI hierarchy across the entire site.

---

## Z-Index Scale (0-100)

### Layer 7: Toast/Notification Layer (z-100+)
**Purpose:** System-wide notifications that must appear above everything

- `z-[100]` - Toast notifications (`src/components/ui/toast.tsx`)
  - Radix UI Toast component
  - Must be visible above all other UI elements including modals

---

### Layer 6: Mobile Navigation (z-60 to z-80)
**Purpose:** Mobile menu system with proper backdrop/content/button layering

- `z-[80]` - Mobile hamburger toggle button (`src/components/Header.tsx` line 103)
  - Always clickable to close menu
  - Positioned above all mobile menu layers

- `z-[70]` - Mobile menu content panel (`src/components/Header.tsx` line 125)
  - Navigation links, CTAs, buttons
  - Fixed positioning with backdrop blur

- `z-[60]` - Mobile menu backdrop (`src/components/Header.tsx` line 116)
  - Full-screen backdrop with blur/dim effect
  - Clickable to dismiss menu

- `z-[60]` - Exit intent modal content (`src/components/conversion/ExitIntentLeadCapture.tsx` line 130)
  - Centered modal for exit intent capture
  - Grid-based centering approach

- `z-[60]` - Exit popup modal content (`src/components/conversion/ExitPopup.tsx` line 96)
  - Legacy exit popup content layer

- `z-[60]` - Lead magnet modal content (`src/components/conversion/LeadMagnetModal.tsx` line 89)
  - Resource download modal content

---

### Layer 5: Conversion/Interaction Layer (z-50 to z-59)
**Purpose:** Modals, dropdowns, engagement CTAs, and interactive overlays

- `z-[55]` - SmartCTAEngine (`src/components/conversion/SmartCTAEngine.tsx` line 182)
  - Behavior-triggered conversion CTAs
  - Positioned between modals and mobile menu
  - Fixed bottom-right with `bottom-24` to avoid FloatingContactMenu overlap

- `z-50` - All Radix UI Components (Modal Backdrops & Content)
  - AlertDialog, Dialog, Drawer, DropdownMenu
  - ContextMenu, HoverCard, Menubar, NavigationMenu
  - Popover, Select, Sheet, Tooltip
  - Radix handles internal modal stacking automatically

- `z-50` - Header bar (`src/components/Header.tsx` line 63)
  - Fixed desktop header with backdrop blur

- `z-50` - Exit popup backdrop (`src/components/conversion/ExitPopup.tsx` line 88)
  - Legacy exit popup backdrop layer

- `z-50` - Exit intent backdrop (`src/components/conversion/ExitIntentLeadCapture.tsx`)
  - Full-screen backdrop for exit intent modal

- `z-50` - Lead magnet backdrop (`src/components/conversion/LeadMagnetModal.tsx` line 81)
  - Backdrop for resource download modal

- `z-50` - FloatingContactMenu (`src/components/FloatingContactMenu.tsx` line 103)
  - Bottom-right floating chat/call buttons
  - Always accessible but below mobile menu

---

### Layer 4: Support Widgets (z-40 to z-49)
**Purpose:** Chat widgets, secondary CTAs, social proof notifications

- `z-40` - ChatLeadCapture (`src/components/ChatLeadCapture.tsx` line 130)
  - Lead capture form before chat activation

- `z-40` - ChatPanel (`src/components/ChatPanel.tsx` line 39)
  - Active chat conversation panel

- `z-40` - SmartUpsellCTA (DEPRECATED - `src/components/conversion/SmartUpsellCTA.tsx` line 423)
  - Old conversion component, no longer in use
  - Replaced by SmartCTAEngine

- `z-40` - SocialProof notifications (DEPRECATED - `src/components/conversion/SocialProof.tsx` line 79)
  - Old social proof component, no longer in use
  - Replaced by research-backed approach

---

### Layer 3: Elevated Content (z-20 to z-39)
**Purpose:** Content elements that need to appear above standard content

- `z-20` - Timeline connectors (`src/components/HowItWorks.tsx` line 126)
  - Visual connectors between timeline steps

---

### Layer 2: Standard Content (z-10 to z-19)
**Purpose:** Regular page content containers and interactive elements

- `z-10` - Content containers across multiple components:
  - FAQ, Hero sections, HowItWorks, ImplementationTimeline
  - IndustryFAQ, IndustryResearchSection, Newsletter
  - NicheDirectory, ServicesShowcase, SocialProof
  - Stats sections, UrgencySection, BeforeAfter, Footer

- `z-10` - InputOTP focus states (`src/components/ui/input-otp.tsx` line 36)
  - Focused OTP input highlighting

- `z-10` - Calendar focus-within cells (`src/components/ui/calendar.tsx` line 31)
  - Date picker cell focus states

- `z-10` - Chat message sticky headers (`src/components/ChatPanel.tsx` line 42)
  - Sticky date headers in chat conversation

---

### Layer 1: Base Content (z-0)
**Purpose:** Default page content (implicit, no z-index declaration)

- All standard page elements
- Text, images, cards without explicit z-index
- Default stacking context

---

### Layer 0: Background Elements (negative z-index)
**Purpose:** Decorative elements that should appear behind all content

- `-z-10` - Background decorative elements (`src/components/3d/FloatingShapes.tsx` line 28)
  - 3D floating shapes for visual interest

- `-z-10` - SmartUpsellCTA gradient backgrounds (DEPRECATED - `src/components/conversion/SmartUpsellCTA.tsx` line 436)
  - Background gradients for old CTA component

---

## Design Principles

### 1. Never Use Arbitrary Z-Index Values
❌ **Bad:** `z-[9999]`, `z-[500]`, `z-[250]`  
✅ **Good:** Use documented scale values only (z-10, z-20, z-40, z-50, z-[55], z-[60], z-[70], z-[80], z-[100])

**Rationale:** Arbitrary high values make debugging impossible and create unpredictable layering behavior.

---

### 2. Layer Isolation
Each layer should have a 5-10 point buffer to allow for micro-adjustments within the layer.

**Example:**
- Layer 5: z-50 to z-59 (modals, dropdowns)
- Layer 6: z-60 to z-80 (mobile navigation)

This prevents components from different layers bleeding into each other.

---

### 3. Mobile-First Consideration
Mobile navigation (z-60 to z-80) must ALWAYS be above page content but below system notifications (z-100).

**Why:** Mobile menu must overlay all page content but never block critical toast notifications.

---

### 4. Modal Stacking
Multiple modals should use same z-50 layer. Radix UI handles internal stacking automatically through portal mounting order.

**Why:** Consistent z-index prevents conflicts. Radix UI's portal system manages the rest.

---

### 5. Conversion Elements Priority
SmartCTAEngine (z-55) sits between modals (z-50) and mobile menu (z-60) to ensure it never blocks navigation but appears above standard content.

**Why:** Engagement CTAs should be visible but never interfere with navigation or critical actions.

---

## Common Pitfalls to Avoid

### 1. Mobile Menu Bleed-Through
**Problem:** Page content (hero sections, stats, promotional elements) appearing through mobile menu backdrop

**Solution:**
- Mobile backdrop: `z-[60]`
- Mobile menu content: `z-[70]` with `fixed` positioning
- Hamburger button: `z-[80]`
- Solid background on menu: `bg-background/98 backdrop-blur-xl`

**Reference:** `src/components/Header.tsx` lines 103-125

---

### 2. Dropdown Transparency
**Problem:** Dropdowns appearing transparent or see-through, making content unreadable

**Solution:**
- All dropdowns at z-50 must have solid `bg-popover` or `bg-background`
- Use high opacity (95%+) with backdrop blur
- Ensure dropdown menu has proper background color from theme

**Reference:** All Radix UI components in `src/components/ui/`

---

### 3. Floating Button Conflicts
**Problem:** FloatingContactMenu (z-50) visually blocking SmartCTAEngine (z-55)

**Solution:**
- Position SmartCTAEngine with `bottom-24` (6rem) to avoid vertical overlap
- FloatingContactMenu stays at bottom-right with `bottom-4`
- Visual separation prevents UI crowding

**Reference:** `src/components/conversion/SmartCTAEngine.tsx`

---

### 4. Toast Blocking
**Problem:** Header, mobile menu, or modals blocking toast notifications

**Solution:**
- Toasts at z-[100] ensures they're always visible
- Never use z-index higher than 100 except for debugging
- Toast viewport positioned in corner away from other UI

**Reference:** `src/components/ui/toast.tsx`

---

### 5. Exit Intent Modal Centering
**Problem:** Modal not perfectly centered on screen, uses CSS transform which can drift

**Solution:**
- Use CSS Grid centering: `fixed inset-0 grid place-items-center p-4`
- Modal wrapper has `pointer-events-none`, content has `pointer-events-auto`
- Ensures pixel-perfect centering across all browsers and screen sizes

**Reference:** `src/components/conversion/ExitIntentLeadCapture.tsx` line 130

---

## Modal Z-Index Pattern (Standard)

All modals should follow this consistent pattern:

```tsx
{/* Backdrop - z-50 */}
<motion.div
  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
  onClick={onClose}
/>

{/* Modal Content - z-[60] */}
<motion.div
  className="fixed inset-0 z-[60] grid place-items-center p-4 pointer-events-none"
>
  <div className="pointer-events-auto w-full max-w-lg">
    {/* Modal content here */}
  </div>
</motion.div>
```

**Why this pattern:**
- Backdrop at z-50 blocks interaction with page content
- Modal content at z-[60] appears above backdrop
- Grid centering ensures perfect centering
- pointer-events pattern allows backdrop click-to-dismiss

---

## Adding New Z-Index Values

Before adding a new z-index:

1. ✅ **Check this document** for appropriate layer
2. ✅ **Use existing layer value** if possible (prefer z-50 for modals, z-10 for content)
3. ✅ **If new layer needed**, document rationale and update this file
4. ✅ **Update this file** with new value, location, and purpose
5. ✅ **Test on mobile** (iOS Safari, Android Chrome) to verify no conflicts
6. ✅ **Test with other layers** (open modal while menu is open, etc.)

---

## Testing Checklist

Before pushing z-index changes to production:

- [ ] Mobile menu doesn't show content bleed-through
- [ ] Mobile menu backdrop properly dims background
- [ ] Hamburger X button always clickable to close menu
- [ ] Dropdowns are opaque and readable (not transparent)
- [ ] Toast notifications appear above all content
- [ ] Exit intent modal centers perfectly on all screen sizes
- [ ] SmartCTAEngine doesn't block FloatingContactMenu
- [ ] Multiple modals stack correctly (test opening lead gate, then chat)
- [ ] Header remains visible and functional during scroll
- [ ] No console errors related to z-index or stacking context
- [ ] Tested on iOS Safari (iPhone 12+)
- [ ] Tested on Android Chrome (Samsung/Pixel)
- [ ] Tested in both light and dark modes
- [ ] Safe area insets respected (notch/home indicator)

---

## Component Quick Reference

| Component | Z-Index | File Location |
|-----------|---------|---------------|
| Toast Notifications | z-[100] | `src/components/ui/toast.tsx` |
| Mobile Hamburger Button | z-[80] | `src/components/Header.tsx:103` |
| Mobile Menu Content | z-[70] | `src/components/Header.tsx:125` |
| Mobile Menu Backdrop | z-[60] | `src/components/Header.tsx:116` |
| Exit Intent Modal Content | z-[60] | `src/components/conversion/ExitIntentLeadCapture.tsx` |
| Exit Popup Modal Content | z-[60] | `src/components/conversion/ExitPopup.tsx:96` |
| Lead Magnet Modal Content | z-[60] | `src/components/conversion/LeadMagnetModal.tsx:89` |
| SmartCTAEngine | z-[55] | `src/components/conversion/SmartCTAEngine.tsx:182` |
| Header Bar | z-50 | `src/components/Header.tsx:63` |
| All Radix Modals/Dropdowns | z-50 | `src/components/ui/*` |
| FloatingContactMenu | z-50 | `src/components/FloatingContactMenu.tsx:103` |
| ChatLeadCapture | z-40 | `src/components/ChatLeadCapture.tsx:130` |
| ChatPanel | z-40 | `src/components/ChatPanel.tsx:39` |
| Timeline Connectors | z-20 | `src/components/HowItWorks.tsx:126` |
| Standard Content | z-10 | Multiple components |
| Background Decorative | -z-10 | `src/components/3d/FloatingShapes.tsx:28` |

---

## Version History

### v1.0 - 2025-01-12
- Initial documentation created
- Comprehensive audit of 113 z-index instances across 70+ files
- Standardized mobile navigation layering (z-60/70/80)
- Fixed ExitPopup modal layering (backdrop z-50, content z-[60])
- Fixed LeadMagnetModal layering (backdrop z-50, content z-[60])
- Documented modal z-index pattern
- Created testing checklist
- Identified and documented deprecated components

---

## Maintenance Notes

**Review this document:**
- After adding any new modal components
- Before major UI refactoring
- When experiencing z-index conflicts
- Quarterly as part of code health reviews

**Document owner:** Development Team  
**Last reviewed:** 2025-01-12  
**Next review:** 2025-04-12  

---

## Additional Resources

- [MDN: Understanding CSS z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index)
- [Radix UI Portal Documentation](https://www.radix-ui.com/primitives/docs/utilities/portal)
- [Tailwind CSS Z-Index](https://tailwindcss.com/docs/z-index)
- Project Design System: `src/index.css` and `tailwind.config.ts`

---

**Questions or Issues?**  
If you encounter z-index problems not covered by this document, update this file with the solution for future reference.
