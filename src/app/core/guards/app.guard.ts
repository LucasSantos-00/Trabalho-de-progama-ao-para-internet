import { CanActivateChildFn } from '@angular/router';

export const appGuard: CanActivateChildFn = () => {
  return true;
};

