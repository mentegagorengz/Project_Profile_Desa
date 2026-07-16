# Frontend Visual Polish Design

## Overview
This document specifies the overarching frontend visual refresh for the Profile Desa application, aiming to align the current UI with the newly established `DESIGN.md` rules ("The Green Harmony").

## Core Architecture & Layout
- **Alternating Sections:** The landing page sections will alternate backgrounds between clean white (`#FFFFFF`) and `bg-light-silver` (`#CEE5D6`) to provide vertical rhythm and reduce cognitive load.
- **Responsive Spacing:** Maintain consistent vertical padding (`py-16` to `py-24` on desktop, `py-12` on mobile).

## Components Mapping

### 1. Global Typography
- **Headings (Hero, Section Titles):** Space Grotesk (sans-serif) for a modern, approachable feel.
- **Body Text:** Inter (sans-serif) for high legibility, enforcing a maximum character length for reading comfort where applicable.
- **Data Labels (Pricing, Stats):** Monospace font applied strictly to numbers requiring quick scannability.

### 2. Navbar & Footer
- **Navbar:** Sticky positioning with `backdrop-blur-md` (Glassmorphism effect). Background will be `bg-white/80` with a subtle bottom border (`border-pastel-blue`). Text links will use `text-prussian` for high contrast.
- **Footer:** Deep background using `bg-prussian`, with text in `text-pastel-blue` and `text-light-silver` to maintain the "Green Harmony" theme while ensuring high contrast for accessibility.

### 3. Action Elements (Buttons)
- **Primary CTA:** Uses `bg-mughal-green` with `text-white`. 
- **Shape:** Soft rounded corners (`rounded-lg` / ~10px).
- **Hover States:** Smooth transition to `bg-prussian` with a slight upward translation (`-translate-y-0.5`) and an expanded soft shadow (`shadow-md`).

### 4. Cards (Berita, Produk, Galeri)
- **Elevation Strategy (The Soft Lift Rule):** Cards will use a diffused `shadow-sm` on rest, removing harsh borders.
- **Hover Strategy:** Interactive cards will elevate to `shadow-md` and slightly scale or translate upwards on hover.
- **Backgrounds:** Cards placed on `bg-light-silver` sections will have a crisp `bg-white` fill to pop out.

## Verification
- Accessibility: Ensure the contrast ratio between `text-prussian` and background colors (`bg-light-silver` or `bg-white`) passes WCAG standards.
- Responsiveness: Ensure glassmorphism performs well without lagging on mobile views.
- No harsh dropshadows or brutalist borders exist in the final polished UI.
