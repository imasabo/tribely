import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: { container: 'bg-primary', text: 'text-primary-foreground' },
  secondary: { container: 'bg-accent', text: 'text-white' },
  outline: { container: 'bg-card border border-border', text: 'text-foreground' },
  ghost: { container: 'bg-transparent', text: 'text-muted-foreground' },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: { container: 'px-4 py-2.5 rounded-xl', text: 'text-sm' },
  md: { container: 'px-6 py-4 rounded-2xl', text: 'text-base' },
  lg: { container: 'px-8 py-4 rounded-2xl', text: 'text-lg' },
};

export const Button = forwardRef<View, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'md',
      loading,
      fullWidth,
      disabled,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const v = variantStyles[variant];
    const s = sizeStyles[size];
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={`flex-row items-center justify-center gap-2 ${s.container} ${v.container} ${
          fullWidth ? 'w-full' : ''
        } ${isDisabled ? 'opacity-50' : 'active:opacity-90'} ${className ?? ''}`}
        {...props}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#fff' : '#0F766E'} />
        ) : (
          <>
            {icon}
            <Text className={`font-semibold ${s.text} ${v.text}`}>{title}</Text>
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
