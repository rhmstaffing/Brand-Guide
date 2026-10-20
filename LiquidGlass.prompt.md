Liquid glass surface for floating UI (nav bars, toolbars, notifications, overlays) placed over photos or grain gradients.

```jsx
<LiquidGlass tone="dark" shape="pill" interactive>Request talent</LiquidGlass>
<LiquidGlass tone="brand" style={{width:360}}>
  <strong>New match</strong><div>CNC Machinist, Elgin IL</div>
</LiquidGlass>
```

- `tone`: `dark` (default), `light`, `brand` (blue tint).
- `shape`: `panel` (28px radius), `pill`, `circle` (give it width/height).
- `refract`: displacement refraction in Chromium; other browsers get blur + saturate only.
- `interactive`: hover lift and springy press.
- Only over imagery or texture. On flat white it reads as a gray box; use `Card` instead.
- Tokens: `tokens/glass.css` (`--glass-*`).
