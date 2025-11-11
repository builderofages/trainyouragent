# Technology Partner Logo Sourcing Guide

## Where to Get Official Brand Logos

### 1. VAPI
- **Website**: https://vapi.ai
- **Brand Assets**: Look for "Press Kit", "Brand Assets", or "Media Resources" page (usually in footer)
- **Preferred Format**: SVG (vector format)
- **Brand Color**: Blue (#3B82F6 or similar)
- **Contact**: support@vapi.ai if brand assets are not publicly available
- **Save As**: `public/logos/vapi-logo.svg`

### 2. ElevenLabs
- **Website**: https://elevenlabs.io
- **Brand Assets**: Check footer for "Press" or "Brand" link
- **Preferred Format**: SVG
- **Brand Color**: Purple/Violet
- **Alternative**: Search "ElevenLabs logo SVG" with `site:elevenlabs.io` filter
- **Save As**: `public/logos/elevenlabs-logo.svg`

### 3. Apollo.io
- **Website**: https://apollo.io
- **Brand Assets**: Usually in footer under "Press" or "About"
- **Preferred Format**: SVG
- **Brand Color**: Indigo blue
- **Save As**: `public/logos/apollo-logo.svg`

### 4. OpenAI
- **Website**: https://openai.com
- **Brand Guidelines**: https://openai.com/brand
- **Preferred Format**: SVG
- **Brand Color**: Emerald/Teal
- **Note**: OpenAI has **strict brand usage guidelines**. Review their terms before using.
- **Save As**: `public/logos/openai-logo.svg`

### 5. Anthropic
- **Website**: https://anthropic.com
- **Brand Assets**: Press/Media section for official assets
- **Preferred Format**: SVG
- **Brand Color**: Orange
- **Alternative**: Contact press@anthropic.com for official assets
- **Save As**: `public/logos/anthropic-logo.svg`

### 6. Twilio
- **Website**: https://twilio.com
- **Brand Assets**: https://www.twilio.com/brand
- **Preferred Format**: SVG
- **Brand Color**: Red (#F22F46 official)
- **Note**: Comprehensive brand guidelines available with usage rules
- **Save As**: `public/logos/twilio-logo.svg`

---

## Logo Specifications

### Technical Requirements
- **Size**: Optimize to maximum 200x200px (will scale responsively)
- **Format**: SVG preferred (scales perfectly at any size, small file size)
- **Fallback**: PNG at 2x resolution (400x400px) for high-DPI displays if SVG unavailable
- **Color**: Full-color versions (grayscale filter applied via CSS on hover)
- **Background**: **Transparent background required** (no white or colored backgrounds)

### File Naming Convention
- Use lowercase, hyphenated format
- Examples: `vapi-logo.svg`, `elevenlabs-logo.svg`, `openai-logo.svg`

### Directory Structure
```
public/
  logos/
    vapi-logo.svg
    elevenlabs-logo.svg
    apollo-logo.svg
    openai-logo.svg
    anthropic-logo.svg
    twilio-logo.svg
```

---

## Licensing & Usage Rights

### Important Legal Considerations
1. **Partner/Integration Display**: Most companies allow logo usage for partner/integration pages
2. **Endorsement**: Do NOT imply endorsement or partnership beyond technical integration
3. **Modification**: Do NOT modify logos (colors, shapes, proportions)
4. **Trademark Guidelines**: Review each company's trademark usage guidelines

### Usage Context
Our site displays these logos to indicate:
- Technology integrations we support
- Infrastructure partners powering our platform
- Third-party services we connect with

This is generally allowed under "partner display" or "powered by" clauses in brand guidelines.

---

## Implementation Checklist

### Before Launching
- [ ] Download official SVG logos from each partner's brand assets page
- [ ] Save in `public/logos/` directory with correct naming convention
- [ ] Verify transparent backgrounds (no white boxes around logos)
- [ ] Test grayscale → color hover effect on dark and light backgrounds
- [ ] Confirm logos display correctly at different screen sizes
- [ ] Review licensing terms for each partner (ensure allowed usage)
- [ ] Test fallback to text logos if images fail to load
- [ ] Optimize SVG file sizes (remove unnecessary metadata)

### Quality Assurance
- [ ] Logos render sharply at all sizes (no pixelation)
- [ ] Hover effects work smoothly (grayscale to color transition)
- [ ] Colors match official brand guidelines
- [ ] No layout shifts when logos load
- [ ] Accessible alt text provided for each logo
- [ ] Mobile responsive (logos stack correctly)

---

## Fallback System

The `TechnologyPartners` component includes automatic fallback to text-based logos if image files don't exist or fail to load. This ensures:
- **Zero broken images**: Site always looks professional
- **Graceful degradation**: Text logos use brand colors as backup
- **No functionality loss**: Hover effects still work on text logos

**Note**: Real logo images should be prioritized for maximum credibility with enterprise clients.

---

## Alternative: Icon Libraries

If official logos cannot be obtained, consider using:
- **Lucide Icons**: Professional icon alternatives for each service type
- **Custom SVGs**: Simple geometric representations of each brand
- **Typography-based logos**: Stylized text with brand colors

However, **real brand logos are strongly preferred** for B2B credibility and professional appearance.

---

## Support Contacts

If you encounter issues obtaining official brand assets:

- **VAPI**: support@vapi.ai
- **ElevenLabs**: support@elevenlabs.io
- **Apollo.io**: support@apollo.io
- **OpenAI**: Go through official brand guidelines page
- **Anthropic**: press@anthropic.com
- **Twilio**: Brand guidelines page has contact form

Most B2B companies are happy to provide assets for integration partners.
