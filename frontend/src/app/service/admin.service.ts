import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  // Available Themes, Format: [Theme Name, File Name, 'dark' if dark theme: else light]
  private themeData = [
    ["Chrome"],
    ["Clouds"],
    ["Crimson Editor"],
    ["Dawn"],
    ["Dreamweaver"],
    ["Eclipse"],
    ["GitHub"],
    ["IPlastic"],
    ["Solarized Light"],
    ["TextMate"],
    ["Tomorrow"],
    ["Xcode"],
    ["Kuroir"],
    ["KatzenMilch"],
    ["SQL Server", "sqlserver", "light"],
    ["Ambiance", "ambiance", "dark"],
    ["Chaos", "chaos", "dark"],
    ["Clouds Midnight", "clouds_midnight", "dark"],
    ["Dracula", "", "dark"],
    ["Cobalt", "cobalt", "dark"],
    ["Gruvbox", "gruvbox", "dark"],
    ["Green on Black", "gob", "dark"],
    ["idle Fingers", "idle_fingers", "dark"],
    ["krTheme", "kr_theme", "dark"],
    ["Merbivore", "merbivore", "dark"],
    ["Merbivore Soft", "merbivore_soft", "dark"],
    ["Mono Industrial", "mono_industrial", "dark"],
    ["Monokai", "monokai", "dark"],
    ["Nord Dark", "nord_dark", "dark"],
    ["Pastel on dark", "pastel_on_dark", "dark"],
    ["Solarized Dark", "solarized_dark", "dark"],
    ["Terminal", "terminal", "dark"],
    ["Tomorrow Night", "tomorrow_night", "dark"],
    ["Tomorrow Night Blue", "tomorrow_night_blue", "dark"],
    ["Tomorrow Night Bright", "tomorrow_night_bright", "dark"],
    ["Tomorrow Night 80s", "tomorrow_night_eighties", "dark"],
    ["Twilight", "twilight", "dark"],
    ["Vibrant Ink", "vibrant_ink", "dark"]
  ];

  // converting themeData into JSON
  private themes = this.themeData.map((data) => {
    let name = data[1] || data[0].replace(/ /g, '_').toLowerCase();
    let theme = {
      caption: data[0], // human readable name
      theme: 'ace/theme/' + name,  // file location
      isDark: (data[2] === 'dark'),  // true if dark theme, else false
      name: name  // name of file
    };
    return theme;
  });

  // JSON object for modes
  private modes = [
    {
      caption: 'C++',
      mode: 'ace/mode/c_cpp',
      name: 'c_cpp'
    },
    {
      caption: 'Java',
      mode: 'ace/mode/java',
      name: 'java'
    },
    {
      caption: 'JavaScript',
      mode: 'ace/mode/javascript',
      name: 'javascript'
    },
    {
      caption: 'Python',
      mode: 'ace/mode/python',
      name: 'python'
    }
  ];

  getThemes() { return this.themes };
  getModes() { return this.modes; }
}
