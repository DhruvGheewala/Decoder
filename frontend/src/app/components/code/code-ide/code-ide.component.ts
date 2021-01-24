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
import { ActivatedRoute, Router } from '@angular/router';
import { viewClassName } from '@angular/compiler';
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
  @ViewChild('error', { static: true }) private errorElemRef: ElementRef;
  @ViewChild('runButton', { static: true }) private runButtonElemRef: ElementRef;
  @ViewChild('title', { static: true }) private titleElemRef: ElementRef;

  // ace editors
  private codeEditor: ace.Ace.Editor;
  private inputEditor: ace.Ace.Editor;
  private outputEditor: ace.Ace.Editor;
  private editorBeautify: any;

  private errorEditorElem: any;
  private runButtonElem: any;
  private titleElem: any;

  availableLanguages: any;
  availableThemes: any;
  selectedLanguage: any;
  selectedTheme: any;
  languageTemplate: any;

  isError: boolean;
  fileContent: any = '';

  code_id: string = null;
  constructor(
    private adminData: AdminService,
    private userData: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.code_id = route.snapshot.params.id;
  }
  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
    this.isError = false;

    // ace editor
    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');

    // frontend elements
    let codeEditorElem = this.codeEditorElemRef.nativeElement;
    let inputEditorElem = this.inputEditorElemRef.nativeElement;
    let outputEditorElem = this.outputEditorElemRef.nativeElement;

    this.errorEditorElem = this.errorElemRef.nativeElement;
    this.runButtonElem = this.runButtonElemRef.nativeElement;
    this.titleElem = this.titleElemRef.nativeElement;

    const editorOptions: Partial<ace.Ace.EditorOptions> = this.getEditorOptions();

    // Configuration
    this.codeEditor = ace.edit(codeEditorElem, editorOptions);
    this.inputEditor = ace.edit(inputEditorElem, {
      highlightActiveLine: true,
      minLines: 12.1,
      maxLines: 12.1,
      wrap: 50
    });
    this.outputEditor = ace.edit(outputEditorElem, {
      highlightActiveLine: true,
      minLines: 12.1,
      maxLines: 12.1,
      wrap: 50
    });

    // for the scope fold feature
    this.codeEditor.setShowFoldWidgets(true);

    // Font-Size
    codeEditorElem.style.fontSize = '18px';
    inputEditorElem.style.fontSize = '18px';
    outputEditorElem.style.fontSize = '18px';

    // Pre-Requisites
    this.availableLanguages = this.adminData.getLanguages();
    this.availableThemes = this.adminData.getThemes();

    this.userData.getDefaultTemplates().subscribe((data) => {
      this.languageTemplate = data.result;

      // Theme
      this.selectedTheme = this.userData.getTheme();
      this.setTheme(this.selectedTheme);

      // Mode
      this.selectedLanguage = this.userData.getLanguage();
      this.setMode(this.selectedLanguage);
    });

    if (this.code_id) {
      this.editCodeMode();
    }
  }

  editCodeMode() {
    this.userData.getCodeById(this.code_id).subscribe((data) => {
      if (data && data.result) {
        data = data.result;
        console.log(data);

        this.codeEditor.setValue(data.content);
        this.inputEditor.setValue(data.stdin);
        this.outputEditor.setValue(data.stdout);
        if (data.stderr) {
          this.errorEditorElem.val = data.stderr;
          this.isError = true;
        }
        this.setTheme("monokai");
        const mode = this.availableLanguages[data.language].mode;
        this.codeEditor.getSession().setMode(`ace/mode/${mode}`);

        this.titleElemRef.nativeElement.value = data.title;
      }
      else {
        this.code_id = null;
      }
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

  setTheme(theme: string) {
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }
  setMode(language: string) {
    this.selectedLanguage = language;
    const mode = this.availableLanguages[language].mode;
    this.codeEditor.setValue(this.languageTemplate[language]);
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
  public getCode(editor = this.codeEditor) { return editor.getValue(); }

  public setUserChoice() {
    this.userData.setLanguage(this.selectedLanguage);
    this.userData.setTheme(this.selectedTheme);
  }

  public copyToClipboard(editor) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';

    let txt: string = '';
    if (editor == "code") {
      txt = this.codeEditor.getValue();
    } else if (editor == "input") {
      txt = this.inputEditor.getValue();
    } else if (editor == "output") {
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

  uploadFileClick() { $('#codeUpload').click(); }

  /**
   * @param fileList - list of file uploaded
   * @description -listen to change file event whenever user changes
   * file function will validate file and acts according to user's selection
   */
  public onChangeFile(fileList: FileList): void {
    if (!fileList[0]) {
      alert("You haven't uploaded a file.")
      return;
    }
    const file = fileList[0];

    const fileExtension = `.${file.name.split('.').pop()}`;
    const reqExtension = this.availableLanguages[this.selectedLanguage].extension;

    if (fileExtension != reqExtension) {
      for (const key in this.availableLanguages) {
        const element = this.availableLanguages[key];
        if (element.extension === fileExtension) {
          this.loadFileToEditor(file);
          this.setMode(key);
          return;
        }
      }
      alert(`You can't upload this file: ${file.name}`);
      return;
    }
    this.loadFileToEditor(file);
  }

  /**
   * @description - downloads code inside code editor into
   * user machine. (sample.[extension] file)
   */
  public downloadCode() {
    let code = this.codeEditor.getValue();
    let filename = `code${this.availableLanguages[this.selectedLanguage].extension}`;
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

  public async runClicked() {
    const codeObj = {
      content: this.codeEditor.getValue(),  // Todo: Dhiraj getter for each editor, same as in view
      language: this.selectedLanguage,
      stdin: this.inputEditor.getValue()
    }

    this.isError = false;
    this.runButtonElem.disabled = true;
    this.outputEditor.setValue("Running your code ...");

    let data: any = {};
    const observer = this.userData.compileRun(codeObj);
    try {
      data = await observer.toPromise();
    } catch (err) {
      data.err = err;
    }
    this.runButtonElem.disabled = false;

    let err = '';
    if (data.err) {
      const errData = data.err;
      err = `- Killed : ${errData.killed}\n`;
      err += `- Signal : ${errData.siganl}\n`;
      err += `${errData.stderr}`;
      this.isError = true;
      this.outputEditor.setValue("error occured !!");
      return;
    }

    data = data.result;
    if (data.stderr) {
      err = `${data.stderr}`;
      this.isError = true;
    }

    this.errorEditorElem.value = err;
    this.outputEditor.setValue(data.stdout);
  }

  public async shareCodeClick() {
    await this.runClicked();
    let codeObj = {
      title: this.titleElem.value,
      content: this.codeEditor.getValue(),
      language: this.selectedLanguage,
      stdin: this.inputEditor.getValue(),
      stdout: this.outputEditor.getValue(),
      stderr: this.errorEditorElem.value,
      theme: this.selectedTheme,
      author: localStorage.getItem('currentUserName') || 'Guest',  // Todo: security issue
      visibility: 'public'  // Todo
    };

    this.userData.saveCode(codeObj).subscribe((data) => {
      if (!data.err) this.router.navigate(['/code/view/' + data.result.id]);
    });
  }
}