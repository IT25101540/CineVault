import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';

export const authGuard = () => {
  const userService = inject(UserService);
  const adminService = inject(AdminService);
  const router = inject(Router);

  // Allow access if either a normal user or an admin is logged in
  if (userService.currentUser || adminService.currentAdmin) {
    return true;
  }
  
  // Otherwise, redirect to login
  router.navigate(['/auth/login']);
  return false;
};
