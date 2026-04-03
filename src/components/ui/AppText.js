import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { typography } from '../../theme';

/**
 * AppText - typed text component
 * variant: h1 | h2 | h3 | h4 | label | labelSm | sectionHeader | body | bodySm | bodyMd | caption | amount | amountLg
 */
export default function AppText({ variant = 'body', color, style, children, numberOfLines, ...props }) {
  const variantStyle = typography[variant] || typography.body;
  return (
    <RNText
      style={[variantStyle, color ? { color } : null, style]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </RNText>
  );
}
