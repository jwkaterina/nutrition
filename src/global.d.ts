import type React from 'react';

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
