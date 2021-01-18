import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  constructor(private adminData: AdminService) { }

  button: any = null;
  ngOnInit(): void { }

  private classList = ['active', 'btn-secondary'];
  changeButtonState(btn: any) {
    if (this.button) this.classList.forEach(c => this.button.classList.remove(c));
    this.button = btn;
    this.classList.forEach(c => this.button.classList.add(c));
  }

  authenticateClicked(e: any) {
    this.changeButtonState(e.srcElement);
  }

  addClicked(e: any) {
    this.changeButtonState(e.srcElement);
  }

  seeClicked(e: any) {
    this.changeButtonState(e.srcElement);
  }
}
