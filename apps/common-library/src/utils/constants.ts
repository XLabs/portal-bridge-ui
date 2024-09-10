// export interface Env {
//     PUBLIC_URL: string;
//     wormholeConnectConfig: WormholeConnectConfig;
//     navBar: {
//       label: string;
//       active?: boolean;
//       href: string;
//       isBlank?: boolean;
//     }[];
//     redirects?: { source: string[]; target: string };
//   }
export interface NavBarType {
    label: string;
    active?: boolean;
    href: string;
    isBlank?: boolean;
};

export const PrivacyPolicyPath = "/privacy-policy";

export interface Message {
    background: string;
    button?: {
      href: string;
      label?: string;
      background: string;
    };
    content: JSX.Element;
    start?: Date;
    ends?: Date;
  }

  export interface Banner {
    id: string;
    background: string;
    button?: {
      href: string;
      label?: string;
      background: string;
    };
    content: {
      text: string;
      color?: string;
      size?: string;
    };
    since: Date;
    until: Date;
  }
  