import { initials, avatarGradient } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

const SIZES = {
  sm:  'w-8  h-8  text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-lg',
};

export default function PatientAvatar({ name = '', size = 'md', className }) {
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0',
      avatarGradient(name),
      SIZES[size],
      className
    )}>
      {initials(name)}
    </div>
  );
}
