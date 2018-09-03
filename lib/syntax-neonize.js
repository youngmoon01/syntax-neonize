'use babel';

import { CompositeDisposable } from 'atom';

class SyntaxNeonize {
  constructor() {
    SyntaxNeonize.subscriptions = null;
    SyntaxNeonize.activated = true;
    SyntaxNeonize.BRIGHTER_DIV = 2;
    SyntaxNeonize.DARKER_DIV = 2;
    SyntaxNeonize.BLUR = "20px";
  }

  // activate neonization
  neonize() {

    if(!SyntaxNeonize.activated)
      return;

    // constants
    var BRIGHTER_DIV = SyntaxNeonize.BRIGHTER_DIV;
    var DARKER_DIV = SyntaxNeonize.DARKER_DIV;
    var BLUR = SyntaxNeonize.BLUR;

    // find all css-rules with class name 'syntax--*'
    sheets = document.styleSheets;
    for(var i = 0; i < sheets.length; i++) {
      rules = sheets[i].cssRules;
      for(var j = 0; j < rules.length; j++) {
        rule = rules[j];

        if(!(rule instanceof CSSStyleRule))
          continue;

        // make the background darker
        if(rule.selectorText.includes("atom-text-editor")) {
          if(rule.style.backgroundColor != "") {
            // pseudo-check whether the synax is already neonized
            if(rule.style.textShadow != "") // assume already neonized
              continue;

            if(rule.style.backgroundColor.includes("rgb")) {
              color_string = rule.style.backgroundColor;
              split_list = color_string.split(/[rgb(), ]+/)
              red = parseInt(split_list[1]);
              green = parseInt(split_list[2]);
              blue = parseInt(split_list[3]);

              // apply new color
              new_red = parseInt(red/DARKER_DIV);
              new_green = parseInt(green/DARKER_DIV);
              new_blue = parseInt(blue/DARKER_DIV);
              new_color_string = "rgb(" + new_red + ", " + new_green + ", " + new_blue + ")";
              rule.style.backgroundColor = new_color_string;

              // apply shadow to remember original color for deneonize
              rule.style.textShadow = "0px 0px 0px " + "rgb(" + red + ", " + green + ", " + blue + ")";
            }
          }
        }
        else if(rule.selectorText.includes(".syntax--")) { // make the font color brighter and add shadow effect
          // pseudo-check whether the synax is already neonized
          if(rule.style.textShadow != "") // assume already neonized
            continue;

          if(rule.style.color.includes("rgb")) {
            color_string = rule.style.color;
            split_list = color_string.split(/[rgb(), ]+/)
            red = parseInt(split_list[1]);
            green = parseInt(split_list[2]);
            blue = parseInt(split_list[3]);

            // calculate new r g b
            red_diff = 255 - red;
            green_diff = 255 - green;
            blue_diff = 255 - blue;

            red_diff = parseInt(red_diff/BRIGHTER_DIV);
            green_diff = parseInt(green_diff/BRIGHTER_DIV);
            blue_diff = parseInt(blue_diff/BRIGHTER_DIV);

            new_red = 255 - red_diff;
            new_green = 255 - green_diff;
            new_blue = 255 - blue_diff;

            // apply new color
            new_color_string = "rgb(" + new_red + ", " + new_green + ", " + new_blue + ")";
            rule.style.color = new_color_string;

            // apply backgrounds
            rule.style.textShadow = "0px 0px " + BLUR  + " rgb(" + red + ", " + green + ", " + blue + ")";
          }
          else if(rule.style.color == "white") {
            rule.style.color = "white";
            rule.style.textShadow = "0px 0px " + BLUR  + " rgb(255, 255, 255)";
          }
        }
      }
    }
  }

  // cancel the neonization
  deneonize() {
    // find all css-rules with class name 'syntax--*'
    sheets = document.styleSheets;
    for(var i = 0; i < sheets.length; i++) {
      rules = sheets[i].cssRules;
      for(var j = 0; j < rules.length; j++) {
        rule = rules[j];

        if(!(rule instanceof CSSStyleRule))
          continue;

        if(rule.selectorText.includes("atom-text-editor")) {
          if(rule.style.textShadow != "") {
            if(rule.style.backgroundColor.includes("rgb")) {
              shadow_string = rule.style.textShadow;
              split_list = shadow_string.split(/[rgb(), ]+/)
              original_red = parseInt(split_list[1]);
              original_green = parseInt(split_list[2]);
              original_blue = parseInt(split_list[3]);

              // restore original color
              original_color_string = "rgb(" + original_red + ", " + original_green + ", " + original_blue + ")";
              rule.style.backgroundColor = original_color_string;

              // disable shadow
              rule.style.textShadow = "";
            }
          }
        }
        else if(rule.selectorText.includes(".syntax--")) {
          // pseudo-check whether the synax is already neonized
          if(rule.style.textShadow.includes("rgb")) {
            shadow_string = rule.style.textShadow;
            split_list = shadow_string.split(/[rgb(), ]+/)
            original_red = parseInt(split_list[1]);
            original_green = parseInt(split_list[2]);
            original_blue = parseInt(split_list[3]);

            // restore original color
            original_color_string = "rgb(" + original_red + ", " + original_green + ", " + original_blue + ")";
            rule.style.color = original_color_string;

            // disable shadows
            rule.style.textShadow = "";
          }
        }
      }
    }
  }

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.neonize();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'syntax-neonize:toggle': () => this.toggle()
    }));

    // update whenever style element is updated
    atom.styles.onDidUpdateStyleElement(this.neonize);
  }

  deactivate() {
    this.subscriptions.dispose();
    this.deneonize();
  }

  toggle() {
    if(SyntaxNeonize.activated) {
      SyntaxNeonize.activated = false;
      this.deneonize();
    }
    else {
      SyntaxNeonize.activated = true;
      this.neonize();
    }
  }
}

module.exports = new SyntaxNeonize();
