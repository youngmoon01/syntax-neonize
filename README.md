# syntax-neonize
A package which *neonizes* your syntax theme in atom.
Texts of your syntax theme will glow like neon lights!

Important notes:
* **This package is not a syntax theme itself**: You should choose your syntax theme and this package will *neonize* the theme.
* **This package is designed for dark syntax themes**(themes with dark background). *Neonization* to a light syntax theme might harm the visibility of texts.

## Screenshots
The syntax theme used in the screenshots is 'one-dark', which is one of built-in syntax themes of atom.

### Before apply of neonization
![Screenshot](https://github.com/youngmoon01/syntax-neonize/blob/master/docs/before_neonize.png)

### After apply of neonization
![Screenshot](https://github.com/youngmoon01/syntax-neonize/blob/master/docs/after_neonize.png)

## Usages
The *neonization* will be automatically applied after package install.
Turn on/off the *neonization* through either the Command Palette or shortcut below.

## Commands & shortcuts
* Toggle *neonization* through Command Palette: 'Syntax Neonize: Toggle'
* Toggle *neonization* through shortcut: Ctrl-Alt-Shift-N

## Notes & issues
* The background color of syntax theme will get darker to maximize glow effect.
* *Neonization* won't work if 'textShadow' property is already used by either the syntax theme or any other packages. For example the theme [neon-syntax](https://atom.io/packages/neon-syntax) will not be *neonized*.

## References
This package was inspired by the [neon-syntax](https://atom.io/packages/neon-syntax).
