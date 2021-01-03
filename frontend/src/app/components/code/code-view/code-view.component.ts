import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
declare var $: any;

@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.css']
})
export class CodeViewComponent implements OnInit {

  @ViewChild('codeEditor', { static: true }) private codeEditorElemRef: ElementRef;
  @ViewChild('inputArea', { static: true }) private inputAreaElemRef: ElementRef;
  @ViewChild('outputArea', { static: true }) private outputAreaElemRef: ElementRef;
  @ViewChild('errArea', { static: true }) private errorAreaElemRef: ElementRef;

  private codeEditor: ace.Ace.Editor;

  code_data: any;
  code_id: string = null;

  constructor(
    private userData: UserService,
    private route: ActivatedRoute
  ) {
    this.code_id = route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.userData.getCodeById(this.code_id).subscribe((data) => {
      console.log(data);
    });

    $('[data-toggle="tooltip"]').tooltip();

    { // editor configuration

      ace.require('ace/ext/language_tools');
      let editorBeautify = ace.require('ace/ext/beautify');

      let codeEditorElem = this.codeEditorElemRef.nativeElement;
      const editorOptions: Partial<ace.Ace.EditorOptions> = this.getEditorOptions();

      // Configuration
      this.codeEditor = ace.edit(codeEditorElem, editorOptions);

      // for the scope fold feature
      this.codeEditor.setShowFoldWidgets(true);

      // Font-Size
      codeEditorElem.style.fontSize = '18px';
    }

    this.code_data = {
      author: "dhiraj-01",
      code: `#include <stdio.h>
int main() {
  
};`,
      input: "123",
      output: "345",
      error: "",
      theme: "monokai",
      language: "c_cpp",
    }

    // set data
    this.setTheme(this.code_data.theme);
    this.setMode(this.code_data.language);
    this.codeEditor.setValue(this.code_data.code);
    this.codeEditor.setReadOnly(true);
    this.inputAreaElemRef.nativeElement.value = this.code_data.input;
    this.outputAreaElemRef.nativeElement.value = this.code_data.output;
    this.errorAreaElemRef.nativeElement.value = this.code_data.error;
  }

  /**
   * Sets the mode of editor to provided mode, default if null
   * @param mode - this is selected programming language mode
   */
  setMode(mode: any) {
    this.codeEditor.getSession().setMode(`ace/mode/${mode}`);
  }

  /**
   * Sets the theme of IDE to provided theme, default if null
   * @param theme - selected theme of type any
   */
  setTheme(theme: any) {
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }

  /**
   * Give Configuration Options for IDE
   */
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 20,
      maxLines: 20,
      wrap: 150
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      autoScrollEditorIntoView: true,
    };
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  public findExtension(lang) {
    let extension = ".txt";
    if (lang === "c") {
      extension = ".c";
    } else if (lang === "c_cpp") {
      extension = ".cpp";
    } else if (lang === "python") {
      extension = ".py";
    } else if (lang === "javascript") {
      extension = ".js";
    } else if (lang == "java") {
      extension = ".java";
    }
    return extension;
  }

  public downloadCode() {
    let code = this.code_data.code;
    let filename = "code" + this.findExtension(this.code_data.language);

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

  public copyToClipboard(element) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    let txt;
    if (element === '') {
      txt = this.code_data.code;
    } else {
      txt = element.value;
    }
    selBox.value = txt;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-code-view',
//   templateUrl: './code-view.component.html',
//   styleUrls: ['./code-view.component.css']
// })
// export class CodeViewComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
