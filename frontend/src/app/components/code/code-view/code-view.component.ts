import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
import { UserService } from "src/app/service/user.service";
import { AdminService } from 'src/app/service/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.css']
})
export class CodeViewComponent implements OnInit {

  @ViewChild('codeEditor', { static: true }) private codeEditorElemRef: ElementRef;
  @ViewChild('inputEditor', { static: true }) private inputEditorElemRef: ElementRef;
  @ViewChild('outputEditor', { static: true }) private outputEditorElemRef: ElementRef;
  @ViewChild('errArea', { static: true }) private errorAreaElemRef: ElementRef;

  private codeEditor: ace.Ace.Editor;
  private inputEditor: ace.Ace.Editor;
  private outputEditor: ace.Ace.Editor;

  availableLanguages: any;
  code_id: string = null;
  code_data: any = null;
  loadingMsg = '';

  constructor(
    private userData: UserService,
    private adminData: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { this.code_id = route.snapshot.params.id; }

  ngOnInit(): void {
    this.loadingMsg = 'Loading...';
    this.spinner.show();

    $('[data-toggle="tooltip"]').tooltip();
    console.log(this.code_id);
    this.userData.getCodeById({ id: this.code_id, currentUser: this.userData.currentUser }).subscribe((data) => {

      this.code_data = data.result;
      // console.log(this.code_data);

      if (!this.code_data) {
        this.router.navigate['/error'];
      }
      this.availableLanguages = this.adminData.getLanguages();

      { // editor configuration

        ace.require('ace/ext/language_tools');
        let editorBeautify = ace.require('ace/ext/beautify');

        // frontend elements
        let codeEditorElem = this.codeEditorElemRef.nativeElement;
        let inputEditorElem = this.inputEditorElemRef.nativeElement;
        let outputEditorElem = this.outputEditorElemRef.nativeElement;

        // Configuration
        this.codeEditor = ace.edit(codeEditorElem, {
          minLines: 28,
          maxLines: 28,
          wrap: 100
        });
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

        codeEditorElem.style.fontSize = '18px';
        inputEditorElem.style.fontSize = '18px';
        outputEditorElem.style.fontSize = '18px';

        if (environment.production) {
          this.spinner.hide();
        } else {
          setTimeout(() => this.spinner.hide(), 2000);
        }
      }

      this.setTheme(this.code_data.theme || "monokai");
      this.setMode(this.code_data.language);

      this.codeEditor.setValue(this.code_data.content);
      this.inputEditor.setValue(this.code_data.stdin);
      this.outputEditor.setValue(this.code_data.stdout);

      this.codeEditor.setReadOnly(true);
      this.inputEditor.setReadOnly(true);
      this.outputEditor.setReadOnly(true);

      this.errorAreaElemRef.nativeElement.value = this.code_data.stderr;
    });
  }

  setMode(language: any) {
    const mode = this.availableLanguages[language].mode;
    this.codeEditor.getSession().setMode(`ace/mode/${mode}`);
  }
  setTheme(theme: any) {
    this.codeEditor.setTheme(`ace/theme/${theme}`);
  }

  public findExtension(lang) {
    let extension = ".txt";
    if (lang === "C") {
      extension = ".c";
    } else if (lang === "C++") {
      extension = ".cpp";
    } else if (lang === "Python") {
      extension = ".py";
    } else if (lang === "Javascript") {
      extension = ".js";
    } else if (lang == "Java") {
      extension = ".java";
    }
    return extension;
  }

  public downloadCode() {
    let code = this.code_data.content;
    let filename = this.code_data.title + this.findExtension(this.code_data.language);

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
    else if (editor == "error") {
      txt = this.errorAreaElemRef.nativeElement.value;
    }
    else {
      return;
    }

    selBox.value = txt;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  isOk() {
    return this.code_data.author === this.userData.currentUser;
  }
  editButtonClick() {
    this.router.navigate([`/ide/edit/${this.code_data.id}`]);
  }
  deleteButtonClick() {
    this.userData.deleteCodeById(this.code_data.id).subscribe(data => {
      if (data) {
        console.log(data);
        this.router.navigate(['/code/' + this.userData.currentUser]);
      }
    });
  }
}