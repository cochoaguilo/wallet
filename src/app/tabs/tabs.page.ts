import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from 'src/interfaces/users';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class TabsPage implements OnInit {

  public user!: User | null;
  public menuController = inject(MenuController);
  public sidebarCollapsed = false;
  private router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem("USER");
    this.user = userData ? JSON.parse(userData) : null;

    const storedCollapsed = localStorage.getItem("SIDEBAR_COLLAPSED");
    this.sidebarCollapsed = storedCollapsed === "true";
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem("SIDEBAR_COLLAPSED", String(this.sidebarCollapsed));
  }

  closeSession() {
    sessionStorage.clear()
    this.router.navigate(["log-in"])
  }

}
