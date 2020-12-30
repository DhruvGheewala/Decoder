import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Ace Editor
import * as ace from 'ace-builds';

// Languages
import 'ace-builds/src-min-noconflict/mode-c_cpp';
import 'ace-builds/src-min-noconflict/mode-java';
import 'ace-builds/src-min-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/mode-python';

// Themes
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-clouds';
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-crimson_editor';
import 'ace-builds/src-noconflict/theme-dawn';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-dreamweaver';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/theme-idle_fingers';
import 'ace-builds/src-noconflict/theme-iplastic';
import 'ace-builds/src-noconflict/theme-katzenmilch';
import 'ace-builds/src-noconflict/theme-kr_theme';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-merbivore';
import 'ace-builds/src-noconflict/theme-merbivore_soft';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-mono_industrial';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-vibrant_ink';
import 'ace-builds/src-noconflict/theme-xcode';

// External Features
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

// Services
import { AdminService } from "src/app/service/admin.service";
import { UserService } from "src/app/service/user.service";

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit {
  @ViewChild('codeEditor', { static: true }) private codeEditorElemRef: ElementRef;

  private codeEditor: ace.Ace.Editor;
  private editorBeautify: any;
  private codeEditorElem: any;

  availableModes: any;
  availableThemes: any;
  preferedMode: any;
  preferedTheme: any;

  selectedLang: any;
  hitCompile: boolean;
  fileContent: any = '';

  constructor(private adminData: AdminService, private userData: UserService) { }
  ngOnInit(): void {
    this.hitCompile = false;
    // Pre-Requisites
    this.availableModes = this.adminData.getModes();
    this.availableThemes = this.adminData.getThemes();


    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');

    this.codeEditorElem = this.codeEditorElemRef.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = this.getEditorOptions();

    // Configuration
    this.codeEditor = ace.edit(this.codeEditorElem, editorOptions);

    // Theme
    this.preferedTheme = this.userData.getTheme();
    this.setTheme(this.preferedTheme);

    // Mode
    this.preferedMode = this.userData.getMode();
    this.setMode(this.preferedMode, "");

    // for the scope fold feature
    this.codeEditor.setShowFoldWidgets(true);

    // Font-Size
    this.codeEditorElem.style.fontSize = '18px';
  }

  /**
   * Give Configuration Options for IDE
   */
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 20,
      maxLines: 20,
      wrap: 1
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      autoScrollEditorIntoView: true,
    };
    const mergedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    return mergedOptions;
  }

  /**
   * Sets the theme of IDE to provided theme, default if null
   * @param theme - selected theme of type any
   */
  setTheme(theme: any) {
    if (!theme)
      theme = this.userData.getTheme();
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }

  /**
   * Sets the mode of editor to provided mode, default if null
   * @param mode - this is selected programming language mode
   */
  setMode(mode: any, lang: any) {
    console.log(lang);
    if (!mode)
      mode = this.userData.getMode();
    this.selectedLang = lang;
    this.codeEditor.getSession().setMode(`ace/mode/${mode}`);
  }

  /**
   * Beautify the content of editor
   */
  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  /**
   * Clear the editor
   */
  public clearCode() {
    const code = this.getCode();
    this.codeEditor.setValue('');
    return code;
  }

  /**
   * @returns - code written by user inside code-editor
   */
  public getCode() { return this.codeEditor.getValue(); }

  public setUserChoice() {
    let mode = this.getCurrentMode();
    let theme = this.getCurretTheme();
    this.userData.setMode(mode);
    this.userData.setTheme(theme);
  }

  private loadFileToEditor(file: File) {
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onload = function (x) {
      self.fileContent = fileReader.result;
      self.codeEditor.setValue(self.fileContent);
    }
    fileReader.readAsText(file);
  }

  public onChangeFile(fileList: FileList): void {
    let file = fileList[0];
    let curExtension = "." + file.name.split(".").pop();
    let reqExtension = this.findExtension(this.getCurrentMode());
    console.log(curExtension + " " + reqExtension);
    if (curExtension != reqExtension) {
      if (confirm("File extension does not match selected language! Are you sure?")) {
        this.loadFileToEditor(file);
      } else {
        alert("File upload discarded! Upload new file..");
      }
    } else {
      this.loadFileToEditor(file);
    }


  }
  public findExtension(mode) {
    let filename = '';
    if (mode === "c_cpp") {
      if (this.selectedLang == "C") {
        filename += ".c";
      } else {
        filename += ".cpp";
      }
    } else if (mode === "python") {
      filename += ".py"
    } else if (mode === "javascript") {
      filename += ".js"
    } else {
      filename += ".java";
    }
    return filename;
  }
  public getCurrentMode() {
    let mode: any = this.codeEditor.getSession().getMode();
    mode = mode.$id;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    return mode;
  }
  public getCurretTheme() {
    let theme: any = this.codeEditor.getSession().getMode();
    theme = theme.$id;
    theme = theme.substr(theme.lastIndexOf('/') + 1);
    return theme;
  }
  public downloadCode() {
    let code = this.getCode();
    let filename = "code" + this.findExtension(this.getCurrentMode());
    let a = document.createElement('a');
    let blob = new Blob([code], { type: 'text' });
    let url = URL.createObjectURL(blob);
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click()
    document.body.removeChild(a);
  }

  public runClicked(runButton, inputArea, outputArea) {
    this.hitCompile = true;

    let mode = this.getCurrentMode();
    const code = this.getCode();
    runButton.disabled = true;
    inputArea.disabled = true;

    // Todo: fetch output or error
    setTimeout(() => {
      runButton.disabled = false;
      inputArea.disabled = false;

      outputArea.value = this.userData.getOutput({ code, mode });
      this.hitCompile = false;
      // this.sizeChanged(outputArea);
    }, 5000);

  }

  // public sizeChanged(textArea) {
  //   const maxHeight = 100;
  //   textArea.style.height = 'auto';
  //   textArea.style.height = `${Math.min(textArea.scrollHeight, maxHeight)}px`;
  // }
}
