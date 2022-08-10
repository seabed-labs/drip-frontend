export enum ScreenSize {
  MobileS = '320px',
  MobileM = '375px',
  MobileL = '425px',
  Tablet = '768px',
  Laptop = '1024px',
  LaptopL = '1440px',
  Desktop = '2560px'
}

export const Device = {
  MobileS: minWidth(ScreenSize.MobileS),
  MobileM: minWidth(ScreenSize.MobileM),
  MobileL: minWidth(ScreenSize.MobileL),
  Tablet: minWidth(ScreenSize.Tablet),
  Laptop: minWidth(ScreenSize.Laptop),
  LaptopL: minWidth(ScreenSize.LaptopL),
  Desktop: minWidth(ScreenSize.Desktop)
};

function minWidth(screenSize: ScreenSize): string {
  return `(min-width: ${screenSize})`;
}
