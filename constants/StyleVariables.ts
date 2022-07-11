import { layout } from './Layout';

export const styleVariables = {
  borderRadius: 8,
  statusBarHeight: 44,
  headerHeight: layout.isSmallDevice ? 89 : 109,
  bottomTabHeight: 80,
  bottomTabBottomOffset: layout.isSmallDevice ? 4 : 34,
};
