import { useLocation } from 'react-router-dom';
import { useSettings } from '@/providers/settings-provider';
import { Demo1Layout } from './demo1/layout';
import { Demo10Layout } from './demo10/layout';
import { Demo2Layout } from './demo2/layout';
import { Demo3Layout } from './demo3/layout';
import { Demo4Layout } from './demo4/layout';
import { Demo5Layout } from './demo5/layout';
import { Demo6Layout } from './demo6/layout';
import { Demo7Layout } from './demo7/layout';
import { Demo8Layout } from './demo8/layout';
import { Demo9Layout } from './demo9/layout';

const LAYOUT_COMPONENTS = {
  demo1: Demo1Layout,
  demo2: Demo2Layout,
  demo3: Demo3Layout,
  demo4: Demo4Layout,
  demo5: Demo5Layout,
  demo6: Demo6Layout,
  demo7: Demo7Layout,
  demo8: Demo8Layout,
  demo9: Demo9Layout,
  demo10: Demo10Layout,
} as const;

type LayoutKey = keyof typeof LAYOUT_COMPONENTS;

function isLayoutKey(value: string | null): value is LayoutKey {
  return value !== null && value in LAYOUT_COMPONENTS;
}

export function LayoutResolver() {
  const location = useLocation();
  const { settings } = useSettings();
  const queryLayout = new URLSearchParams(location.search).get('layout');
  const selectedLayout = isLayoutKey(queryLayout)
    ? queryLayout
    : isLayoutKey(settings.layout)
      ? settings.layout
      : 'demo1';

  const SelectedLayout = LAYOUT_COMPONENTS[selectedLayout];

  return <SelectedLayout />;
}
