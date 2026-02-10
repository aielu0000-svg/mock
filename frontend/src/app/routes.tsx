import { RouteObject } from 'react-router-dom';
import { SignupPage } from '../features/signup/pages/SignupPage';
import { MemberEditPage } from '../features/signup/pages/MemberEditPage';

export const routes: RouteObject[] = [
  { path: '/', element: <SignupPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/member/:id/edit', element: <MemberEditPage /> }
];
