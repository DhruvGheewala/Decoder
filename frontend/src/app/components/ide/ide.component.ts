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

  constructor(private adminData: AdminService, private userData: UserService) { }
  ngOnInit(): void {
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
    this.setMode(this.preferedMode);

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
      minLines: 14,
      maxLines: Infinity
    };
    const extraEditorOptions = { enableBasicAutocompletion: true };
    const mergedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    return mergedOptions;
  }

  /**
   * Sets the theme of IDE to provided theme, default if null
   * @param theme 
   */
  setTheme(theme: any) {
    if (!theme)
      theme = this.userData.getTheme();
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }

  /**
   * Sets the mode of editor to provided mode, default if null
   * @param mode 
   */
  setMode(mode: any) {
    if (!mode)
      this.userData.getMode();
    this.codeEditor.getSession().setMode(`ace/mode/${mode}`);
  }

  /**
   * This method will beautify the content of editor
   */
  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
      const session = this.codeEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  /**
   * This method will clear the editor, & returns the code
   */
  public clearCode() {
    const code = this.getCode();
    this.codeEditor.setValue('');
    return code;
  }

  /**
   * This method will retuns the code writen in editor
   */
  public getCode() { return this.codeEditor.getValue(); }

  public setUserChoice(mode: string, theme: string) {
    this.userData.setMode(mode);
    this.userData.setTheme(theme);
  }

  public runClicked(runButton, inputArea, outputArea, mode) {
    const code = this.getCode();
    runButton.disabled = true;
    inputArea.disabled = true;

    // Todo: fetch output or error
    setTimeout(() => {
      runButton.disabled = false;
      inputArea.disabled = false;

      outputArea.value = this.userData.getOutput({ code, mode });
      this.sizeChanged(outputArea);
    }, 5000);
  }

  public sizeChanged(textArea) {
    const maxHeight = 300;
    textArea.style.height = 'auto';
    textArea.style.height = `${Math.min(textArea.scrollHeight, maxHeight)}px`;
  }
}
