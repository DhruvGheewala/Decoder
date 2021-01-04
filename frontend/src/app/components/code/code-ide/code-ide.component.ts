import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';

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
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-ide',
  templateUrl: './code-ide.component.html',
  styleUrls: ['./code-ide.component.css']
})
export class CodeIdeComponent implements OnInit {

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.code == "KeyB") {
      document.getElementById("runButton").click();
    }
  }

  @ViewChild('codeEditor', { static: true }) private codeEditorElemRef: ElementRef;
  @ViewChild('inputEditor', { static: true }) private inputEditorElemRef: ElementRef;
  @ViewChild('outputEditor', { static: true }) private outputEditorElemRef: ElementRef;
  @ViewChild('modeSelect', { static: true }) private modeSelectElemRef: ElementRef;
  @ViewChild('error', { static: true }) private errorElemRef: ElementRef;

  // ace editors
  private codeEditor: ace.Ace.Editor;
  private inputEditor: ace.Ace.Editor;
  private outputEditor: ace.Ace.Editor;
  private editorBeautify: any;

  // launguage mode element
  private modeSelectElem: any;

  availableModes: any;
  availableThemes: any;
  preferedMode: any;
  preferedTheme: any;

  isError: boolean;
  fileContent: any = '';

  constructor(private adminData: AdminService, private userData: UserService, private router: Router) { }
  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
    this.isError = false;

    // Pre-Requisites
    this.availableModes = this.adminData.getModes();
    this.availableThemes = this.adminData.getThemes();

    // ace editor
    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');

    // frontend elements
    let codeEditorElem = this.codeEditorElemRef.nativeElement;
    let inputEditorElem = this.inputEditorElemRef.nativeElement;
    let outputEditorElem = this.outputEditorElemRef.nativeElement;
    this.modeSelectElem = this.modeSelectElemRef.nativeElement;

    const editorOptions: Partial<ace.Ace.EditorOptions> = this.getEditorOptions();

    // Configuration
    this.codeEditor = ace.edit(codeEditorElem, editorOptions);
    this.inputEditor = ace.edit(inputEditorElem, {
      highlightActiveLine: true,
      minLines: 13,
      maxLines: 13,
    });
    this.outputEditor = ace.edit(outputEditorElem, {
      highlightActiveLine: true,
      minLines: 13,
      maxLines: 13,
    });

    // for the scope fold feature
    this.codeEditor.setShowFoldWidgets(true);

    // Font-Size
    codeEditorElem.style.fontSize = '18px';
    inputEditorElem.style.fontSize = '18px';
    outputEditorElem.style.fontSize = '18px';

    // Theme
    this.preferedTheme = this.userData.getTheme();
    this.setTheme(this.preferedTheme);

    // Mode
    this.preferedMode = this.userData.getMode();
    this.availableModes.forEach(mode => {
      if (mode.caption === this.preferedMode)
        this.setMode(mode.name, this.preferedMode);
    });
  }

  /**
   * Give Configuration Options for IDE
   */
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 28,
      maxLines: 28,
      wrap: 150
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      autoScrollEditorIntoView: true,
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  /**
   * Sets the theme of IDE to provided theme, default if null
   * @param theme - selected theme of type any
   */
  setTheme(theme: any) {
    if (!theme) {
      theme = this.userData.getTheme();
    }
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }

  /**
   * Sets the mode of editor to provided mode, default if null
   * @param mode - this is selected programming language mode
   */
  setMode(mode: any, lang: any) {
    // Todo: mode will be caption, we have to obtain name from it
    // if (!mode) mode = this.userData.getMode();
    this.preferedMode = lang;
    this.codeEditor.getSession().setMode(`ace/mode/${mode}`);
  }

  // editor methods
  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }
  public clearCode(editor = this.codeEditor) {
    const code = this.getCode(editor);
    editor.setValue('');
    return code;
  }
  public getCode(editor = this.codeEditor) {
    return editor.getValue();
  }

  public setUserChoice() {
    let mode = this.getCurrentMode();
    let theme = this.getCurretTheme();
    this.userData.setMode(mode);
    this.userData.setTheme(theme);
  }

  public copyToClipboard(editor) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';

    let txt = "";
    if (editor == "code") {
      txt = this.codeEditor.getValue();
    }
    else if (editor == "input") {
      txt = this.inputEditor.getValue();
    }
    else if (editor == "output") {
      txt = this.outputEditor.getValue();
    }

    selBox.value = txt;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /**
   * @param file - file to be read and loaded into code editor
   * @description - reads the content of file and uplods it to code editor
   */
  private loadFileToEditor(file: File) {
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onload = function (x) {
      self.fileContent = fileReader.result;
      self.codeEditor.setValue(self.fileContent);
    }
    fileReader.readAsText(file);
  }

  /**
   * @param fileList - list of file uploaded
   * @description -listen to change file event whenever user changes
   * file function will validate file and acts according to user's selection
   */
  public onChangeFile(fileList: FileList): void {
    let file = fileList[0];
    let curExtension = "." + file.name.split(".").pop();
    let reqExtension = this.findExtension(this.getCurrentMode());
    if (curExtension != reqExtension) {
      let found: Boolean = false;
      this.availableModes.forEach(mode => {
        if (this.languageData[mode.caption].extension === curExtension) {
          found = true;
          this.loadFileToEditor(file);
          this.setMode(mode.name, mode.caption);
        }
      });
      if (!found) alert(`You can't upload this file: ${file.name}`);
      return;
    }
    this.loadFileToEditor(file);
  }

  private languageData = {
    'C': { 'extension': '.c' },
    'C++': { 'extension': '.cpp' },
    'Java': { 'extension': '.java' },
    'JavaScript': { 'extension': '.js' },
    'Python': { 'extension': '.py' }
  };

  /**
   * @param mode - current mode of code editor (i.e language)
   * @description - generates file extension according to current mode of
   * code editor
   * @returns - extension of file 
   */
  public findExtension(mode) {
    return this.languageData[this.preferedMode].extension;
  }

  public findMode(extension) {
    let mode = '';
    if (extension === ".c" || extension === '.cpp') {
      mode = "c_cpp";
    } else if (extension === ".py") {
      mode = "python";
    } else if (extension === ".js") {
      mode = "javascript";
    } else if (extension == ".java") {
      mode = "java";
    }
    return mode;
  }

  /**
   * @returns - current mode of code editor. (selected language)
   */
  public getCurrentMode() {
    let mode: any = this.codeEditor.getSession().getMode();
    mode = mode.$id;
    mode = mode.substr(mode.lastIndexOf('/') + 1);
    return mode;
  }

  /**
   * @returns - current theme of code editor.
   */
  public getCurretTheme() {
    let theme: any = this.codeEditor.getSession().getMode();
    theme = theme.$id;
    theme = theme.substr(theme.lastIndexOf('/') + 1);
    return theme;
  }

  /**
   * @description - downloads code inside code editor into
   * user machine. (sample.[extension] file)
   */
  public downloadCode() {
    let code = this.codeEditor.getValue();
    let filename = "code" + this.findExtension(this.getCurrentMode());
    let a = document.createElement('a');
    let blob = new Blob([code], { type: 'text' });
    let url = URL.createObjectURL(blob);
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public runClicked(runButton) {
    const codeObj = {
      code: this.codeEditor.getValue(),
      language: this.getCurrentMode(),
      stdin: this.inputEditor.getValue()
    }

    this.isError = false;
    runButton.disabled = true;

    this.userData.compileRun(codeObj).subscribe((data) => {
      runButton.disabled = false;
      let err = '';
      if (data.errorType) {
        this.isError = true;
        err += `- ${data.errorType} error\n`;
        err += `- Signal : ${data.signal}\n`;
        err += `- Exit Code : ${data.exitCode}\n\n`;
      }
      if (data.stderr) {
        this.isError = true;
        err += `${data.stderr}`;
      }
      this.errorElemRef.nativeElement.value = err;
      this.outputEditor.setValue(data.stdout);
    });
  }

  uploadFileClick() {
    document.getElementById("codeUpload").click();
  }

  shareCodeClick() {
    let code = {
      author: 'Guest',
      code: this.codeEditor.getValue(),
      input: this.inputEditor.getValue(),
      output: this.outputEditor.getValue(),
      error: this.errorElemRef.nativeElement.value,
      language: 'C++',
      theme: 'monokai',
      visibility: 'public'
    };

    this.userData.saveCode(code).subscribe((data) => {
      if (!data.err) {
        this.router.navigate(['/code/view/' + data.id]);
      }
    });
  }
}