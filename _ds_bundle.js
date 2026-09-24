/* @ds-bundle: {"format":4,"namespace":"RHMStaffingDesignSystem_7f6616","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"SectionHeading","sourcePath":"components/brand/SectionHeading.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"bee62d09f60a","components/actions/IconButton.jsx":"c4eb98422ff7","components/brand/Icon.jsx":"a99f328b1cd5","components/brand/Logo.jsx":"23f95b778f31","components/brand/SectionHeading.jsx":"5c1076aefd19","components/display/Badge.jsx":"be4d31e1cf01","components/display/Card.jsx":"6461bb21e9ab","components/display/Tag.jsx":"cf6ef93e0497","components/feedback/Dialog.jsx":"dd107039f57e","components/feedback/Toast.jsx":"c021dada69c0","components/feedback/Tooltip.jsx":"852ae0f2b9c7","components/forms/Checkbox.jsx":"d5ee52bbec09","components/forms/Input.jsx":"4f4f15dc0af6","components/forms/Radio.jsx":"3776bea3d06f","components/forms/Select.jsx":"ed7b3200d88c","components/forms/Switch.jsx":"74d2d99bfaa8","components/navigation/Tabs.jsx":"66109bf19a7f","ui_kits/website/CareersScreen.jsx":"5821f507a2ae","ui_kits/website/Chrome.jsx":"5fbdcd41f350","ui_kits/website/ClientsScreen.jsx":"5d77862f9155","ui_kits/website/ContactScreen.jsx":"3fefc0a2385a","ui_kits/website/ContractorsScreen.jsx":"00c4919911c1","ui_kits/website/HomeScreen.jsx":"49b2ccafe596"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RHMStaffingDesignSystem_7f6616 = window.RHMStaffingDesignSystem_7f6616 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  style,
  ...rest
}) {
  const s = Number(size) || 20;
  const url = 'https://unpkg.com/lucide-static@0.460.0/icons/' + name + '.svg';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: s,
      height: s,
      flex: 'none',
      background: color,
      WebkitMask: 'url(' + url + ') center/contain no-repeat',
      mask: 'url(' + url + ') center/contain no-repeat',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  primary: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    fg: '#fff',
    bd: 'transparent'
  },
  accent: {
    bg: 'var(--action-accent)',
    hover: 'var(--action-accent-hover)',
    fg: 'var(--rhm-ink)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'transparent',
    hover: 'var(--blue-50)',
    fg: 'var(--rhm-navy)',
    bd: 'var(--rhm-navy)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'var(--blue-50)',
    fg: 'var(--rhm-blue)',
    bd: 'transparent'
  },
  inverse: {
    bg: '#fff',
    hover: 'var(--sky-100)',
    fg: 'var(--rhm-navy)',
    bd: 'transparent'
  },
  outlineInverse: {
    bg: 'transparent',
    hover: 'rgba(255,255,255,0.12)',
    fg: '#fff',
    bd: 'rgba(255,255,255,0.7)'
  }
};
const S = {
  sm: {
    h: 36,
    px: 14,
    fs: 14,
    ic: 16
  },
  md: {
    h: 44,
    px: 20,
    fs: 15,
    ic: 18
  },
  lg: {
    h: 52,
    px: 26,
    fs: 16,
    ic: 20
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  children,
  style,
  onClick,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const v = V[variant] || V.primary,
    s = S[size] || S.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: s.fs,
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      color: v.fg,
      background: h && !disabled ? v.hover : v.bg,
      border: '1.5px solid ' + v.bd,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transform: p && !disabled ? 'translateY(1px)' : 'none',
      transition: 'background var(--dur-base) var(--ease-standard),transform var(--dur-fast)',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.ic
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.ic
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 40,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const map = {
    ghost: ['transparent', 'var(--blue-50)', 'var(--rhm-navy)', 'transparent'],
    solid: ['var(--action-primary)', 'var(--action-primary-hover)', '#fff', 'transparent'],
    outline: ['transparent', 'var(--blue-50)', 'var(--rhm-navy)', 'var(--border-strong)'],
    inverse: ['transparent', 'rgba(255,255,255,0.12)', '#fff', 'rgba(255,255,255,0.4)']
  };
  const [bg, hv, fg, bd] = map[variant] || map.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px solid ' + bd,
      background: h ? hv : bg,
      color: fg,
      cursor: 'pointer',
      padding: 0,
      transition: 'background var(--dur-base)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.48)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SRC = {
  blue: 'assets/logo/rhm-horizontal-blue.png',
  white: 'assets/logo/rhm-horizontal-white.png'
};
function Logo({
  tone = 'blue',
  width = 220,
  basePath = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: basePath + SRC[tone],
    alt: "RHM Staffing Solutions",
    style: {
      width,
      height: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  titleFace = 'display',
  style
}) {
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === 'center' ? 760 : 680,
      margin: align === 'center' ? '0 auto' : 0,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--fs-eyebrow)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: dark ? 'var(--rhm-sky)' : 'var(--rhm-blue)',
      marginBottom: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: titleFace === 'title' ? {
      fontFamily: 'var(--font-title)',
      fontWeight: 400,
      fontSize: 'var(--fs-h1)',
      lineHeight: 1,
      letterSpacing: 'var(--ls-title)',
      textTransform: 'uppercase',
      margin: 0,
      color: dark ? '#fff' : 'var(--rhm-navy)'
    } : {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-heading)',
      margin: 0,
      color: dark ? '#fff' : 'var(--rhm-ink)',
      textWrap: 'balance'
    }
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-lead)',
      lineHeight: 1.5,
      margin: '14px 0 0',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, lead));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const T = {
  info: ['var(--status-info-bg)', 'var(--status-info)'],
  success: ['var(--status-success-bg)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--status-warning)'],
  error: ['var(--status-error-bg)', 'var(--status-error)'],
  neutral: ['var(--gray-100)', 'var(--gray-700)'],
  brand: ['var(--rhm-navy)', '#fff'],
  sky: ['var(--rhm-sky)', 'var(--rhm-ink)']
};
function Badge({
  tone = 'info',
  dot = false,
  children,
  style
}) {
  const [bg, fg] = T[tone] || T.info;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-xs)',
      background: bg,
      color: fg,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  icon,
  eyebrow,
  title,
  children,
  footer,
  variant = 'outline',
  interactive = false,
  style,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const dark = variant === 'dark',
    glass = variant === 'glass';
  const base = {
    outline: {
      background: '#fff',
      border: '1px solid var(--border-subtle)'
    },
    elevated: {
      background: '#fff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-md)'
    },
    tint: {
      background: 'var(--surface-tint)',
      border: '1px solid transparent'
    },
    dark: {
      background: 'var(--rhm-navy)',
      border: '1px solid var(--border-on-dark)'
    },
    glass: {
      background: 'var(--surface-glass)',
      border: '1px solid var(--border-on-dark)',
      backdropFilter: 'blur(var(--blur-glass))',
      WebkitBackdropFilter: 'blur(var(--blur-glass))'
    }
  }[variant];
  const light = dark || glass;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      boxSizing: 'border-box',
      padding: 28,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...base,
      ...(interactive && h ? {
        boxShadow: 'var(--shadow-lg)',
        transform: 'translateY(-2px)',
        borderColor: light ? 'rgba(255,255,255,0.35)' : 'var(--blue-200)'
      } : {}),
      cursor: interactive ? 'pointer' : 'default',
      transition: 'box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard),border-color var(--dur-base)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-sm)',
      background: light ? 'rgba(82,192,228,0.16)' : 'var(--blue-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: light ? 'var(--rhm-sky)' : 'var(--rhm-blue)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22
  })), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: light ? 'var(--rhm-sky)' : 'var(--rhm-blue)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--fs-h4)',
      lineHeight: 1.2,
      color: light ? '#fff' : 'var(--rhm-ink)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: light ? 'var(--text-on-dark-muted)' : 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 8
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  icon,
  selected = false,
  onClick,
  tone = 'light',
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  const dark = tone === 'dark';
  const bg = selected ? dark ? '#fff' : 'var(--rhm-navy)' : h && onClick ? dark ? 'rgba(255,255,255,0.14)' : 'var(--blue-50)' : 'transparent';
  const fg = selected ? dark ? 'var(--rhm-navy)' : '#fff' : dark ? '#fff' : 'var(--rhm-navy)';
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 36,
      padding: '0 16px',
      borderRadius: 'var(--radius-pill)',
      border: '1.5px solid ' + (selected ? 'transparent' : dark ? 'rgba(255,255,255,0.45)' : 'var(--border-strong)'),
      background: bg,
      color: fg,
      fontSize: 14,
      fontWeight: 500,
      cursor: onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  children,
  actions,
  onClose,
  width = 520,
  inline = false
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 28,
      position: 'relative'
    }
  }, onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    size: 36,
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 14,
      right: 14
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 24,
      color: 'var(--rhm-ink)',
      paddingRight: 40,
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-body)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 24
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(6,15,26,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 1000
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const T = {
  success: ['circle-check', 'var(--status-success)'],
  info: ['info', 'var(--rhm-sky)'],
  warning: ['triangle-alert', '#E3A93B'],
  error: ['circle-alert', '#E86A6A']
};
function Toast({
  tone = 'success',
  title,
  children,
  onClose,
  style
}) {
  const [ic, col] = T[tone] || T.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      width: 360,
      maxWidth: '100%',
      boxSizing: 'border-box',
      padding: '14px 16px',
      background: 'var(--rhm-ink)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: col,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-on-dark-muted)',
      marginTop: 2
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      opacity: .7,
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = 'top',
  open
}) {
  const [h, setH] = React.useState(false);
  const show = open !== undefined ? open : h;
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--rhm-ink)',
      color: '#fff',
      fontSize: 13,
      lineHeight: 1.4,
      padding: '7px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      zIndex: 50,
      pointerEvents: 'none'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  style
}) {
  const [c, setC] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : c;
  const t = () => {
    if (disabled) return;
    const n = !on;
    setC(n);
    onChange && onChange(n);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 15,
      color: 'var(--text-strong)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    style: {
      width: 20,
      height: 20,
      flex: 'none',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-xs)',
      border: '1.5px solid ' + (on ? 'var(--rhm-blue)' : 'var(--border-strong)'),
      background: on ? 'var(--rhm-blue)' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 10,
      borderRight: '2px solid #fff',
      borderBottom: '2px solid #fff',
      transform: 'translateY(-1px) rotate(45deg)'
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const lab = {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-strong)',
  marginBottom: 6
};
const hintS = err => ({
  fontSize: 13,
  marginTop: 6,
  color: err ? 'var(--status-error)' : 'var(--text-muted)'
});
function Input({
  label,
  hint,
  error,
  multiline = false,
  rows = 4,
  id,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const _id = id || React.useId();
  const Tag = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: _id,
    style: lab
  }, label), /*#__PURE__*/React.createElement(Tag, _extends({
    id: _id,
    rows: multiline ? rows : undefined,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: multiline ? 'auto' : 44,
      padding: multiline ? '10px 12px' : '0 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-strong)',
      background: rest.disabled ? 'var(--gray-50)' : '#fff',
      border: '1.5px solid ' + (error ? 'var(--status-error)' : f ? 'var(--rhm-blue)' : 'var(--border-strong)'),
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: f ? 'var(--shadow-focus)' : 'none',
      resize: 'vertical',
      transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("div", {
    style: hintS(error)
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  direction = 'column',
  style
}) {
  const [v, setV] = React.useState(defaultValue);
  const cur = value !== undefined ? value : v;
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 20 : 10,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value,
      lab = typeof o === 'string' ? o : o.label,
      on = cur === val;
    return /*#__PURE__*/React.createElement("label", {
      key: val,
      onClick: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        fontSize: 15,
        color: 'var(--text-strong)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      role: "radio",
      "aria-checked": on,
      style: {
        width: 20,
        height: 20,
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: '1.5px solid ' + (on ? 'var(--rhm-blue)' : 'var(--border-strong)'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--rhm-blue)'
      }
    })), lab);
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const lab = {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-strong)',
  marginBottom: 6
};
const hintS = err => ({
  fontSize: 13,
  marginTop: 6,
  color: err ? 'var(--status-error)' : 'var(--text-muted)'
});
function Select({
  label,
  hint,
  error,
  options = [],
  placeholder,
  id,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const _id = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: _id,
    style: lab
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: _id,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    defaultValue: placeholder ? '' : undefined,
    style: {
      width: '100%',
      height: 44,
      padding: '0 38px 0 12px',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-strong)',
      background: '#fff',
      border: '1.5px solid ' + (error ? 'var(--status-error)' : f ? 'var(--rhm-blue)' : 'var(--border-strong)'),
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: f ? 'var(--shadow-focus)' : 'none'
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '2px solid var(--rhm-navy)',
      borderBottom: '2px solid var(--rhm-navy)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("div", {
    style: hintS(error)
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  style
}) {
  const [c, setC] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : c;
  const t = () => {
    if (disabled) return;
    const n = !on;
    setC(n);
    onChange && onChange(n);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 15,
      color: 'var(--text-strong)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    style: {
      width: 40,
      height: 24,
      borderRadius: 999,
      background: on ? 'var(--rhm-blue)' : 'var(--gray-300)',
      position: 'relative',
      transition: 'background var(--dur-base)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  tone = 'light',
  style
}) {
  const [v, setV] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const cur = value !== undefined ? value : v;
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 28,
      borderBottom: '1px solid ' + (dark ? 'var(--border-on-dark)' : 'var(--border-subtle)'),
      ...style
    }
  }, tabs.map(t => {
    const val = t.value ?? t,
      lab = t.label ?? t,
      on = cur === val;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: {
        background: 'none',
        border: 'none',
        padding: '12px 0',
        marginBottom: -1,
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: on ? 600 : 500,
        color: on ? dark ? '#fff' : 'var(--rhm-navy)' : dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
        borderBottom: '3px solid ' + (on ? dark ? 'var(--rhm-sky)' : 'var(--rhm-blue)' : 'transparent'),
        transition: 'color var(--dur-fast)'
      }
    }, lab);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CareersScreen.jsx
try { (() => {
function CareersScreen({
  go,
  notify
}) {
  const {
    Button,
    SectionHeading,
    Card,
    Badge
  } = window.RHM;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    bgImg: "glass-texture.jpg",
    wave: null,
    height: 500,
    eyebrow: "Careers at RHM \xB7 Now hiring recruiters",
    title: "No cap on commission. Seriously.",
    lead: "Zero to one year of experience? Perfect. We train you on the job and pay you for every win."
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => notify({
      title: "You're in the queue",
      body: 'Our team will reach out this week.'
    })
  }, "Apply to be a recruiter"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlineInverse",
    size: "lg",
    onClick: () => window.scrollTo({
      top: 560,
      behavior: 'smooth'
    })
  }, "What's in it for me?")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "The perks",
    title: "Base pay, plus a lot more."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: 16,
      marginTop: 40
    }
  }, [['banknote', 'Base + uncapped commission + bonus', 'You close it, you earn it. No ceiling.'], ['graduation-cap', 'On-the-job training', 'Learn sales and recruiting from people who crush it.'], ['rocket', 'Fast track to leadership', 'Hit your numbers and move up quick.'], ['plane', 'Incentive trips', 'Top performers travel. On us.'], ['heart-pulse', 'Full benefits', 'Medical, dental and vision from day one of eligibility.'], ['piggy-bank', '401(k) match', 'Future you says thanks.']].map(([i, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    icon: i,
    title: t,
    interactive: true
  }, d)))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--rhm-navy) url(' + A + 'backgrounds/fluted-glass.jpg) center/cover',
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "dark",
    titleFace: "title",
    eyebrow: "The vibe",
    title: "Build your future with a team that invests in your success."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "glass",
    title: "You'll talk to people all day"
  }, "Clients who need help and people who need work. You connect them."), /*#__PURE__*/React.createElement(Card, {
    variant: "glass",
    title: "Your wins are visible"
  }, "Turning potential into opportunity, one hire at a time."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: "sky"
  }, "Entry level \xB7 0 to 1 years"))))));
}
window.CareersScreen = CareersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CareersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Chrome.jsx
try { (() => {
const NAV = [['clients', 'For clients'], ['contractors', 'For contractors'], ['careers', 'Careers at RHM'], ['contact', 'Contact']];
function SiteHeader({
  page,
  go
}) {
  const {
    Logo,
    Button,
    IconButton
  } = window.RHM;
  const [s, setS] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [narrow, setNarrow] = React.useState(() => window.innerWidth < 1040);
  React.useEffect(() => {
    const f = () => setNarrow(window.innerWidth < 1040);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  React.useEffect(() => {
    const f = () => setS(window.scrollY > 10);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid ' + (s ? 'var(--border-subtle)' : 'transparent'),
      boxShadow: s ? 'var(--shadow-sm)' : 'none',
      transition: 'box-shadow .2s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      height: 76,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go('home'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    width: narrow ? 190 : 230,
    basePath: "../../"
  })), narrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('contact')
  }, "Request talent"), /*#__PURE__*/React.createElement(IconButton, {
    icon: open ? 'x' : 'menu',
    label: "Menu",
    onClick: () => setOpen(!open)
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28,
      marginLeft: 'auto'
    }
  }, NAV.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    onClick: () => go(k),
    style: {
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: 15,
      fontWeight: page === k ? 600 : 500,
      color: page === k ? 'var(--rhm-blue)' : 'var(--rhm-ink)',
      textDecoration: 'none',
      paddingBottom: 4,
      borderBottom: '2px solid ' + (page === k ? 'var(--rhm-blue)' : 'transparent')
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('contact')
  }, "Request talent"))), narrow && open && /*#__PURE__*/React.createElement("nav", {
    className: "wrap",
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 32px 16px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, NAV.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    onClick: () => {
      go(k);
      setOpen(false);
    },
    style: {
      cursor: 'pointer',
      padding: '12px 0',
      fontSize: 16,
      fontWeight: page === k ? 600 : 500,
      color: page === k ? 'var(--rhm-blue)' : 'var(--rhm-ink)'
    }
  }, l))));
}
function SiteFooter({
  go
}) {
  const {
    Logo,
    Icon
  } = window.RHM;
  const col = (h, items) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--rhm-sky)',
      marginBottom: 14
    }
  }, h), items.map(([l, p]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => p && go(p),
    style: {
      color: 'var(--text-on-dark-muted)',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, l))));
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--rhm-ink)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'lines/wave-white-wide-02.png',
    style: {
      position: 'absolute',
      right: -200,
      bottom: -60,
      width: 1100,
      opacity: .12,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      padding: '64px 32px 32px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    tone: "white",
    width: 230,
    basePath: "../../"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 14,
      color: 'var(--text-on-dark-muted)',
      maxWidth: 280
    }
  }, "The best talent won't come to you. We bring them to you.")), col('Clients', [['Industries', 'clients'], ['Staffing types', 'clients'], ['Request talent', 'contact']]), col('Contractors', [['Benefits', 'contractors'], ['Find a job', 'contractors'], ['Apply', 'contractors']]), col('Company', [['Careers at RHM', 'careers'], ['Contact', 'contact'], ['Offices', 'contact']])), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      padding: '20px 32px 28px',
      borderTop: '1px solid var(--border-on-dark)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: 'var(--text-on-dark-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 RHM Staffing Solutions"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "linkedin",
    size: 18
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 18
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "facebook",
    size: 18
  }))));
}
function Section({
  bg = '#fff',
  children,
  style,
  pad = 96
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg,
      padding: pad + 'px 0',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative'
    }
  }, children));
}
function Hero({
  bgImg,
  eyebrow,
  title,
  lead,
  children,
  wave = 'wave-white-02.png',
  height = 560
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: height,
      display: 'flex',
      alignItems: 'center',
      background: 'var(--rhm-navy) url(' + A + 'backgrounds/' + bgImg + ') center/cover',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--gradient-protect)'
    }
  }), wave && /*#__PURE__*/React.createElement("img", {
    src: A + 'lines/' + wave,
    style: {
      position: 'absolute',
      right: -120,
      bottom: -80,
      width: 900,
      opacity: .45,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      width: '100%',
      padding: '80px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--rhm-sky)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 400,
      fontSize: 'clamp(52px,7vw,84px)',
      lineHeight: .98,
      letterSpacing: '.03em',
      color: '#fff',
      margin: '14px 0 0',
      textTransform: 'uppercase'
    }
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.5,
      color: 'var(--text-on-dark-muted)',
      marginTop: 20,
      maxWidth: 520
    }
  }, lead), children && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, children))));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter,
  Section,
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ClientsScreen.jsx
try { (() => {
function ClientsScreen({
  go
}) {
  const {
    Button,
    SectionHeading,
    Card,
    Tag,
    Tabs
  } = window.RHM;
  const [tab, setTab] = React.useState('Retention');
  const C = {
    Retention: ['Regular check-ins, resume help, gifts and first day walk-ins keep people engaged.', 'We stay in touch with contractors after they start, not just before.'],
    'Conversion eligibility': ['Temp to hire lets you test the fit with no long-term risk.', 'We track attendance and performance so you know who is ready to convert.'],
    'Time to fill': ['Referrals, passive seekers, tech schools and community partners feed our pipeline.', 'We also partner with closing companies to reach skilled people fast.']
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    bgImg: "grain-cobalt-glow.jpg",
    wave: "wave-white-03.png",
    height: 460,
    eyebrow: "For clients",
    title: "Skilled people. Less hassle.",
    lead: "Partner with us today to build the workforce that powers your tomorrow."
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => go('contact')
  }, "Request talent")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Your top challenges",
    title: "We built our process around them."
  }), /*#__PURE__*/React.createElement(Tabs, {
    style: {
      marginTop: 32
    },
    tabs: Object.keys(C),
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 16,
      marginTop: 28
    }
  }, C[tab].map(t => /*#__PURE__*/React.createElement(Card, {
    key: t,
    icon: "check",
    variant: "tint"
  }, t)))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-subtle)"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "What you get",
    title: "Full service, start to finish."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: 16,
      marginTop: 40
    }
  }, [['clipboard-list', 'Full onboarding', 'Payroll, benefits, compliance and orientation.'], ['shield-check', 'Compliance support', "E-Verify, workers' comp, drug and background checks."], ['chart-line', 'Market insights', 'Salary benchmarks from labor analysis tools and contractor feedback.'], ['calendar-check', 'Weekly touchpoints', 'Regular check-ins and performance reviews.'], ['piggy-bank', 'Flexible cost', 'No large upfront fees. Scale up or down.'], ['users', 'Large-scale hiring', 'We have the capacity to staff big ramps.']].map(([i, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    icon: i,
    title: t
  }, d)))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Industries",
    title: "Where we staff."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, ['Light Industrial', 'Skilled Trades', 'Engineering', 'Embedded Engineering', 'Architecture Construction', 'Manufacturing', 'Life Sciences'].map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))))));
}
window.ClientsScreen = ClientsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ClientsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ContactScreen.jsx
try { (() => {
function ContactScreen({
  notify
}) {
  const {
    Button,
    SectionHeading,
    Input,
    Select,
    Radio,
    Checkbox,
    Card
  } = window.RHM;
  const [who, setWho] = React.useState("I'm hiring");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)',
      padding: '80px 0 96px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'lines/wave-blue-01.png',
    style: {
      position: 'absolute',
      left: -200,
      top: -40,
      width: 1100,
      opacity: .35,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Contact",
    title: "Tell us what you need.",
    lead: "A recruiter will get back to you within one business day."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Card, {
    icon: "phone",
    title: "Call us"
  }, "Talk to a recruiter at your nearest office."), /*#__PURE__*/React.createElement(Card, {
    icon: "map-pin",
    title: "Offices across the U.S."
  }, "Local teams who know your market."))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      notify({
        title: 'Request sent',
        body: 'A recruiter will reach out within one business day.'
      });
    },
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-md)',
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    direction: "row",
    options: ["I'm hiring", "I'm looking for work"],
    value: who,
    onChange: setWho
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "First and last"
  }), /*#__PURE__*/React.createElement(Input, {
    label: who === "I'm hiring" ? 'Work email' : 'Email',
    placeholder: "you@email.com"
  })), who === "I'm hiring" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Company"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Industry",
    placeholder: "Pick one",
    options: ['Light Industrial', 'Skilled Trades', 'Engineering', 'Embedded Engineering', 'Architecture Construction', 'Manufacturing', 'Life Sciences']
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-strong)',
      marginBottom: 8
    }
  }, "Staffing type"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Temporary"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Temp to hire",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Direct hire"
  })))) : /*#__PURE__*/React.createElement(Select, {
    label: "What kind of work?",
    placeholder: "Pick one",
    options: ['Light Industrial', 'Skilled Trades', 'Engineering', 'Manufacturing', 'Life Sciences']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Anything else?",
    multiline: true,
    rows: 3,
    placeholder: who === "I'm hiring" ? 'Roles, headcount, start date' : 'Skills, shifts, location'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    iconRight: "arrow-right"
  }, "Send"))))));
}
window.ContactScreen = ContactScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ContactScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ContractorsScreen.jsx
try { (() => {
const JOBS = [['Forklift Operator', 'Light Industrial', 'Aurora, IL', 'Temporary', '$19 to $21/hr'], ['Maintenance Technician', 'Skilled Trades', 'Elgin, IL', 'Temp to hire', '$28 to $34/hr'], ['Controls Engineer', 'Embedded Engineering', 'Schaumburg, IL', 'Direct hire', '$95k to $115k'], ['QC Lab Technician', 'Life Sciences', 'Lake Forest, IL', 'Temp to hire', '$24 to $27/hr']];
function ContractorsScreen({
  notify
}) {
  const {
    Button,
    SectionHeading,
    Card,
    Badge,
    Tag,
    Dialog,
    Input,
    Select
  } = window.RHM;
  const [f, setF] = React.useState('All');
  const [apply, setApply] = React.useState(null);
  const list = JOBS.filter(j => f === 'All' || j[1] === f);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    bgImg: "grain-cyan-streak.jpg",
    wave: "wave-white-01.png",
    height: 460,
    eyebrow: "For contractors",
    title: "Get paid every week.",
    lead: "Connecting passionate people with unlimited opportunities. Real benefits for anyone working 30+ hours."
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    iconRight: "arrow-down",
    onClick: () => window.scrollTo({
      top: 900,
      behavior: 'smooth'
    })
  }, "See open jobs")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Benefits at a glance",
    title: "Coverage that works for you.",
    lead: "Available to eligible full-time contractors working 30+ hours per week."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
      gap: 16,
      marginTop: 40
    }
  }, [['wallet', 'Weekly pay', 'Steady cash flow, every week.'], ['heart-pulse', 'Medical', 'Blue Cross Blue Shield of Illinois. HSA compatible plan available.'], ['smile', 'Dental', 'Guardian coverage for checkups, fillings, major work and ortho.'], ['eye', 'Vision', 'Eye exams, glasses, contacts and correction discounts.'], ['life-buoy', 'EAP, 24/7', 'Support for stress, money, legal and family needs.'], ['users', 'Dependents', 'Add a spouse and kids up to age 26.'], ['tag', 'Blue365 discounts', 'Deals on fitness, nutrition, hearing aids and more.'], ['handshake', 'We stay in touch', 'Check-ins after you start. Help with your resume.']].map(([i, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    icon: i,
    title: t
  }, d)))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-subtle)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Open jobs",
    title: "Find your next role."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['All', 'Light Industrial', 'Skilled Trades', 'Embedded Engineering', 'Life Sciences'].map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    selected: f === t,
    onClick: () => setF(t)
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 32
    }
  }, list.map(j => /*#__PURE__*/React.createElement("div", {
    key: j[0],
    style: {
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: 'minmax(200px,2fr) auto auto auto',
      gap: 20,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--rhm-ink)'
    }
  }, j[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, j[1], " \xB7 ", j[2])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: j[3] === 'Direct hire' ? 'brand' : j[3] === 'Temp to hire' ? 'sky' : 'neutral'
  }, j[3])), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--rhm-navy)'
    }
  }, j[4]), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => setApply(j)
  }, "Apply"))))), apply && /*#__PURE__*/React.createElement(Dialog, {
    title: 'Apply: ' + apply[0],
    onClose: () => setApply(null),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setApply(null)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setApply(null);
        notify({
          title: 'Application sent',
          body: "A recruiter will text you within 24 hours."
        });
      }
    }, "Send application"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "First and last"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Mobile",
    placeholder: "(555) 555-0100",
    hint: "We text first. It's faster."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "When can you start?",
    options: ['This week', 'In 2 weeks', 'In a month']
  }))));
}
window.ContractorsScreen = ContractorsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ContractorsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
const INDUSTRIES = [['hard-hat', 'Light Industrial', 'Warehouse, assembly, forklift, shipping and receiving.'], ['wrench', 'Skilled Trades', 'Electricians, welders, HVAC, maintenance techs.'], ['drafting-compass', 'Engineering', 'Mechanical, electrical, process and quality engineers.'], ['cpu', 'Embedded Engineering', 'Firmware, controls, PLC and hardware test.'], ['building-2', 'Architecture Construction', 'Project managers, estimators, superintendents.'], ['factory', 'Manufacturing', 'Machine operators, CNC, production leads.'], ['flask-conical', 'Life Sciences', 'Lab techs, QA and QC, validation specialists.']];
function HomeScreen({
  go
}) {
  const {
    Button,
    SectionHeading,
    Card,
    Badge
  } = window.RHM;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    bgImg: "grain-navy-sky.jpg",
    eyebrow: "Staffing for the trades and engineering",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "The best talent won't come to you.", /*#__PURE__*/React.createElement("br", null), "We bring them to you."),
    lead: "Temporary, temp to hire and direct hire staffing. Screened people who show up ready to work."
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => go('contact')
  }, "Request talent"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlineInverse",
    size: "lg",
    onClick: () => go('contractors')
  }, "Find a job")), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 64,
      alignItems: 'end',
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Industries we staff",
    title: "We know the work, so we know who fits."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: 'var(--text-body)'
    }
  }, "We learn the daily tasks and project scope of every role. That is how we match the right person to the right job, the first time.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
      gap: 16
    }
  }, INDUSTRIES.map(([i, t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    icon: i,
    title: t,
    interactive: true,
    onClick: () => go('clients')
  }, d)), /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    title: "Not sure where you fit?",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "sm",
      onClick: () => go('contact')
    }, "Talk to us")
  }, "Tell us the role. We'll tell you how we'd fill it."))), /*#__PURE__*/React.createElement(Section, {
    bg: "var(--surface-subtle)"
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "center",
    eyebrow: "How we screen",
    title: "Four steps. Every role.",
    lead: "Same process whether it's a forklift operator or a PLC engineer."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
      gap: 16,
      marginTop: 48
    }
  }, [['phone', 'Phone screen', 'We confirm skills, pay range and availability.'], ['users', 'In-person interview', 'We meet every candidate face to face.'], ['clipboard-check', 'Orientation', 'Safety, site rules and first day details.'], ['shield-check', 'Reference checks', 'We call past employers before you do.']].map(([i, t, d], n) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    variant: "elevated",
    icon: i,
    eyebrow: 'Step ' + (n + 1),
    title: t
  }, d)))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--rhm-ink) url(' + A + 'backgrounds/grain-midnight-arc.jpg) center/cover',
      padding: '96px 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 64,
      alignItems: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "dark",
    titleFace: "title",
    eyebrow: "Three ways to hire",
    title: "Hire how you need to."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [['Temporary', 'Cover peaks, projects and call-offs. Scale up or down week to week.'], ['Temp to hire', 'Try the fit first. Convert when you are ready.'], ['Direct hire', 'We find, screen and hand you a finalist. You hire them.']].map(([t, d]) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    variant: "glass",
    title: t
  }, d))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "tint",
    eyebrow: "For clients",
    title: "Need people fast?",
    footer: /*#__PURE__*/React.createElement(Button, {
      iconRight: "arrow-right",
      onClick: () => go('clients')
    }, "See how we work")
  }, "No large upfront fees. Weekly check-ins. Support for large-scale hiring."), /*#__PURE__*/React.createElement(Card, {
    variant: "tint",
    eyebrow: "For contractors",
    title: "Looking for steady work?",
    footer: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconRight: "arrow-right",
      onClick: () => go('contractors')
    }, "See benefits")
  }, "Weekly pay, medical, dental and vision. We check in after you start, too."))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
