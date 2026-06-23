import React from 'react';
import { User } from './data';
interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}
export function Avatar({ user, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  };
  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium text-white shadow-sm bg-gradient-to-br ${user.color} ${sizeClasses[size]}`}
      title={user.name}>
      
      {user.initials}
    </div>);

}