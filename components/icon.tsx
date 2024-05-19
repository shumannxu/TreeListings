import React from "react";
import { ColorValue, TextProps } from "react-native";
import { SvgXml } from "react-native-svg";

const FILL_REPLACEMENT = "${FILL_REPLACEMENT}";
const WIDTH = "${width}";
const iconStrings = {
  user: `<svg width="40" height="40" viewBox="0 0 40 40" fill="${FILL_REPLACEMENT}" xmlns="http://www.w3.org/2000/svg">
    <path id="User Logo" d="M39.737 36.4798C37.1979 31.8605 33.2331 28.2612 28.4809 26.2613C30.8442 24.4241 32.5898 21.8626 33.4706 18.9398C34.3514 16.0169 34.3227 12.8809 33.3885 9.97598C32.4544 7.07101 30.6622 4.54435 28.2657 2.7539C25.8693 0.96346 22.9901 0 20.0361 0C17.0821 0 14.2029 0.96346 11.8065 2.7539C9.41002 4.54435 7.61779 7.07101 6.68364 9.97598C5.74949 12.8809 5.72078 16.0169 6.60158 18.9398C7.48238 21.8626 9.22803 24.4241 11.5913 26.2613C6.83904 28.2612 2.87427 31.8605 0.335181 36.4798C0.17785 36.742 0.0729898 37.0344 0.026834 37.3395C-0.0193219 37.6446 -0.00583119 37.9561 0.0665044 38.2557C0.13884 38.5553 0.268544 38.8367 0.447905 39.0833C0.627265 39.3299 0.852622 39.5365 1.11058 39.691C1.36853 39.8455 1.65382 39.9447 1.94948 39.9826C2.24514 40.0205 2.54513 39.9964 2.83163 39.9117C3.11812 39.8271 3.38527 39.6835 3.6172 39.4897C3.84912 39.2959 4.04107 39.0557 4.18166 38.7834C7.53737 32.771 13.4636 29.185 20.0361 29.185C26.6086 29.185 32.5348 32.7729 35.8905 38.7834C36.1952 39.2912 36.6784 39.6563 37.2381 39.8015C37.7977 39.9468 38.3899 39.8607 38.8894 39.5615C39.3889 39.2623 39.7567 38.7736 39.9148 38.1985C40.073 37.6234 40.0092 37.007 39.737 36.4798ZM10.406 14.5954C10.406 12.6211 10.9708 10.6911 12.029 9.04947C13.0871 7.40788 14.5912 6.12841 16.3508 5.37287C18.1105 4.61733 20.0468 4.41964 21.9148 4.80482C23.7829 5.18999 25.4988 6.14072 26.8456 7.53678C28.1924 8.93284 29.1096 10.7115 29.4811 12.6479C29.8527 14.5843 29.662 16.5914 28.9331 18.4155C28.2042 20.2395 26.9699 21.7985 25.3863 22.8954C23.8026 23.9923 21.9407 24.5777 20.0361 24.5777C17.4829 24.5747 15.0352 23.522 13.2298 21.6506C11.4245 19.7792 10.409 17.2419 10.406 14.5954Z" fill="#B0DCC5"/>
    </svg>
    `,
  home: `<svg width="40" height="40" viewBox="0 0 40 40" fill="${FILL_REPLACEMENT}" xmlns="http://www.w3.org/2000/svg">
    <path id="Home Logo" d="M39.5149 29.2854L33.5147 22.8567H35.557C35.9636 22.8572 36.3626 22.7619 36.7104 22.5813C37.0582 22.4007 37.3414 22.1417 37.5292 21.8326C37.717 21.5234 37.8021 21.176 37.7753 20.8282C37.7484 20.4805 37.6107 20.1457 37.3771 19.8604L21.8211 0.812303C21.4828 0.398618 20.9668 0.116918 20.3864 0.0290622C19.806 -0.0587939 19.2086 0.0543753 18.7255 0.343719C18.5344 0.466045 18.3685 0.614743 18.2343 0.783731C18.1788 0.812303 2.62283 19.8604 2.62283 19.8604C2.38991 20.146 2.25283 20.4808 2.2265 20.8285C2.20017 21.1762 2.28561 21.5234 2.47352 21.8324C2.66142 22.1414 2.9446 22.4002 3.29222 22.5808C3.63985 22.7614 4.03861 22.8568 4.4451 22.8567H6.48738L0.487224 29.2854C-0.0461227 29.8588 -0.15057 30.6417 0.218328 31.3026C0.589449 31.9598 1.36947 32.3808 2.22282 32.3808H17.7788V38.0952C17.7788 38.6004 18.0129 39.0849 18.4297 39.4421C18.8464 39.7993 19.4117 40 20.0011 40C20.5904 40 21.1557 39.7993 21.5724 39.4421C21.9892 39.0849 22.2233 38.6004 22.2233 38.0952V32.3808H37.7793C38.1977 32.3801 38.6074 32.2784 38.9613 32.0872C39.3153 31.8961 39.5992 31.6232 39.7805 31.3C39.9617 30.9768 40.0329 30.6163 39.9859 30.2599C39.939 29.9036 39.7757 29.5658 39.5149 29.2854ZM22.2233 28.5711V19.0471C22.2233 18.5419 21.9892 18.0574 21.5724 17.7002C21.1557 17.3429 20.5904 17.1423 20.0011 17.1423C19.4117 17.1423 18.8464 17.3429 18.4297 17.7002C18.0129 18.0574 17.7788 18.5419 17.7788 19.0471V28.5711H6.84739L12.8475 22.1424C13.3809 21.569 13.4853 20.7862 13.1164 20.1252C12.9339 19.8024 12.6491 19.5302 12.2947 19.3396C11.9402 19.1489 11.5304 19.0476 11.1119 19.0471H8.71188L20.0011 5.22575L31.2902 19.0471H28.8902C28.472 19.048 28.0626 19.15 27.7089 19.3413C27.3553 19.5326 27.0717 19.8055 26.8907 20.1287C26.7098 20.4518 26.6387 20.8122 26.6858 21.1683C26.7329 21.5245 26.8961 21.8621 27.1568 22.1424L33.1569 28.5711H22.2233Z" 
    fill="${FILL_REPLACEMENT}"/>
    </svg>`,
  postlogo: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Post Logo">
    <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M0 20C0 8.954 8.954 0 20 0C31.046 0 40 8.954 40 20C40 31.046 31.046 40 20 40C8.954 40 0 31.046 0 20ZM20 4C15.7565 4 11.6869 5.68571 8.68629 8.68629C5.68571 11.6869 4 15.7565 4 20C4 24.2435 5.68571 28.3131 8.68629 31.3137C11.6869 34.3143 15.7565 36 20 36C24.2435 36 28.3131 34.3143 31.3137 31.3137C34.3143 28.3131 36 24.2435 36 20C36 15.7565 34.3143 11.6869 31.3137 8.68629C28.3131 5.68571 24.2435 4 20 4Z" fill="#B0DCC5"/>
    <path id="Vector_2" fill-rule="evenodd" clip-rule="evenodd" d="M22 10C22 9.46957 21.7893 8.96086 21.4142 8.58579C21.0391 8.21071 20.5304 8 20 8C19.4696 8 18.9608 8.21071 18.5858 8.58579C18.2107 8.96086 18 9.46957 18 10V18H9.99998C9.46955 18 8.96084 18.2107 8.58577 18.5858C8.2107 18.9609 7.99998 19.4696 7.99998 20C7.99998 20.5304 8.2107 21.0391 8.58577 21.4142C8.96084 21.7893 9.46955 22 9.99998 22H18V30C18 30.5304 18.2107 31.0391 18.5858 31.4142C18.9608 31.7893 19.4696 32 20 32C20.5304 32 21.0391 31.7893 21.4142 31.4142C21.7893 31.0391 22 30.5304 22 30V22H30C30.5304 22 31.0391 21.7893 31.4142 21.4142C31.7893 21.0391 32 20.5304 32 20C32 19.4696 31.7893 18.9609 31.4142 18.5858C31.0391 18.2107 30.5304 18 30 18H22V10Z" fill="${FILL_REPLACEMENT}"/>
    </g>
    </svg>`,
  search: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="Search Logo" d="M29.3307 25.7963H27.4772L26.8203 25.1632C28.2865 23.4608 29.3582 21.4555 29.9584 19.2909C30.5587 17.1263 30.6729 14.8558 30.2927 12.6419C29.1899 6.12333 23.7468 0.917852 17.1775 0.120616C14.8679 -0.171393 12.5221 0.068495 10.3196 0.821924C8.11711 1.57535 6.11624 2.82235 4.47012 4.4675C2.82401 6.11265 1.57628 8.11235 0.822406 10.3136C0.0685351 12.5148 -0.171494 14.8592 0.120687 17.1674C0.918391 23.7329 6.12693 29.1728 12.6493 30.2749C14.8645 30.6549 17.1363 30.5408 19.3022 29.9409C21.4681 29.3409 23.4746 28.27 25.178 26.8046L25.8114 27.4611V29.3135L35.7827 39.279C36.7447 40.2403 38.3166 40.2403 39.2786 39.279C40.2405 38.3176 40.2405 36.7466 39.2786 35.7852L29.3307 25.7963ZM15.2536 25.7963C9.41159 25.7963 4.69575 21.0832 4.69575 15.2447C4.69575 9.40607 9.41159 4.693 15.2536 4.693C21.0956 4.693 25.8114 9.40607 25.8114 15.2447C25.8114 21.0832 21.0956 25.7963 15.2536 25.7963Z" fill="${FILL_REPLACEMENT}"/>
    </svg>`,
  profile: `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_37_583)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 3.75C32.8556 3.75 41.25 12.1444 41.25 22.5C41.2566 26.8273 39.7601 31.0226 37.0163 34.3687L37.0538 34.41L36.8063 34.62C35.0479 36.6998 32.8567 38.3706 30.3857 39.5158C27.9147 40.6609 25.2235 41.2528 22.5 41.25C16.9688 41.25 12 38.8556 8.56876 35.0494L8.19375 34.6181L7.94625 34.4119L7.98375 34.3669C5.24018 31.0213 3.74367 26.8267 3.75 22.5C3.75 12.1444 12.1444 3.75 22.5 3.75ZM22.5 31.875C19.0125 31.875 15.8606 32.985 13.5131 34.5112C16.1052 36.4561 19.2595 37.5051 22.5 37.5C25.7406 37.5051 28.8948 36.4561 31.4869 34.5112C28.8044 32.7924 25.6859 31.8776 22.5 31.875ZM22.5 7.5C19.6772 7.49992 16.9117 8.29634 14.5214 9.79772C12.131 11.2991 10.2128 13.4445 8.98718 15.9873C7.76159 18.5301 7.27839 21.3672 7.5931 24.1724C7.90781 26.9775 9.00767 29.637 10.7663 31.845C13.8056 29.6644 17.9531 28.125 22.5 28.125C27.0469 28.125 31.1944 29.6644 34.2338 31.845C35.9923 29.637 37.0922 26.9775 37.4069 24.1724C37.7216 21.3672 37.2384 18.5301 36.0128 15.9873C34.7872 13.4445 32.869 11.2991 30.4786 9.79772C28.0883 8.29634 25.3228 7.49992 22.5 7.5ZM22.5 11.25C24.4891 11.25 26.3968 12.0402 27.8033 13.4467C29.2098 14.8532 30 16.7609 30 18.75C30 20.7391 29.2098 22.6468 27.8033 24.0533C26.3968 25.4598 24.4891 26.25 22.5 26.25C20.5109 26.25 18.6032 25.4598 17.1967 24.0533C15.7902 22.6468 15 20.7391 15 18.75C15 16.7609 15.7902 14.8532 17.1967 13.4467C18.6032 12.0402 20.5109 11.25 22.5 11.25ZM22.5 15C21.5054 15 20.5516 15.3951 19.8484 16.0984C19.1451 16.8016 18.75 17.7554 18.75 18.75C18.75 19.7446 19.1451 20.6984 19.8484 21.4016C20.5516 22.1049 21.5054 22.5 22.5 22.5C23.4946 22.5 24.4484 22.1049 25.1517 21.4016C25.8549 20.6984 26.25 19.7446 26.25 18.75C26.25 17.7554 25.8549 16.8016 25.1517 16.0984C24.4484 15.3951 23.4946 15 22.5 15Z" fill="${FILL_REPLACEMENT}"/>
    </g>
    <defs>
    <clipPath id="clip0_37_583">
    <rect width="45" height="45" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    `,
  star: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.15583 6.86333L9.32084 2.50333C9.38386 2.37715 9.48078 2.27102 9.60074 2.19684C9.72071 2.12267 9.85896 2.08337 10 2.08337C10.141 2.08337 10.2793 2.12267 10.3993 2.19684C10.5192 2.27102 10.6161 2.37715 10.6792 2.50333L12.8442 6.86333L17.6842 7.56666C17.8238 7.58602 17.9551 7.64424 18.0632 7.73467C18.1713 7.8251 18.2518 7.94411 18.2955 8.0781C18.3392 8.21209 18.3444 8.35567 18.3104 8.49245C18.2764 8.62924 18.2047 8.75371 18.1033 8.85166L14.6017 12.2433L15.4283 17.035C15.5342 17.65 14.8842 18.1183 14.3283 17.8283L10 15.565L5.67083 17.8283C5.11583 18.1192 4.46583 17.65 4.57167 17.0342L5.39833 12.2425L1.89667 8.85083C1.79582 8.75281 1.7245 8.62846 1.6908 8.49192C1.65711 8.35538 1.66239 8.21213 1.70606 8.07845C1.74972 7.94476 1.83002 7.82601 1.93781 7.73569C2.0456 7.64536 2.17657 7.58709 2.31583 7.56749L7.15583 6.86333Z" stroke="${FILL_REPLACEMENT}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  edit: `<svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20.2414V25.3333H4.1661L16.4533 10.3156L12.2872 5.22372L0 20.2414ZM19.6751 6.37788C19.7781 6.25226 19.8598 6.10305 19.9156 5.93879C19.9713 5.77452 20 5.59844 20 5.4206C20 5.24277 19.9713 5.06668 19.9156 4.90242C19.8598 4.73816 19.7781 4.58894 19.6751 4.46332L17.0755 1.28598C16.9727 1.1601 16.8506 1.06024 16.7162 0.992097C16.5818 0.923958 16.4377 0.888885 16.2922 0.888885C16.1467 0.888885 16.0027 0.923958 15.8683 0.992097C15.7339 1.06024 15.6118 1.1601 15.509 1.28598L13.4759 3.77083L17.642 8.86273L19.6751 6.37788Z" fill="${FILL_REPLACEMENT}"/>
    </svg>
    `,
  offer: `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-width="2" d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
  </svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">

  <defs>
  </defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 86.5 48.5 h -83 C 1.567 48.5 0 46.933 0 45 s 1.567 -3.5 3.5 -3.5 h 83 c 1.933 0 3.5 1.567 3.5 3.5 S 88.433 48.5 86.5 48.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(29,29,27); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 86.5 48.5 h -83 C 1.567 48.5 0 46.933 0 45 s 1.567 -3.5 3.5 -3.5 h 83 c 1.933 0 3.5 1.567 3.5 3.5 S 88.433 48.5 86.5 48.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(29,29,27); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
  </svg>`,
  pluspost: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 12H20M12 4V20" stroke="${FILL_REPLACEMENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  coupon: `
  <svg width="300px" height="300px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="${FILL_REPLACEMENT}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_1"></g> <g id="Layer_2"> <g> <path d=" M23,26h7v-4v0c-1.7,0-3-1.4-3-3s1.3-3,3-3v0v-4h-7" fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path> <path d=" M20,12H2v4v0c1.7,0,3,1.4,3,3s-1.3,3-3,3v0v4h18" fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></path> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="23" x2="23" y1="12" y2="14"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="23" x2="23" y1="24" y2="26"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="8" x2="18" y1="16" y2="16"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="13" x2="18" y1="20" y2="20"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="22" x2="22" y1="6" y2="8"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="23" x2="23" y1="17" y2="21"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="26" x2="25" y1="8" y2="9"></line> <line fill="none" stroke="${FILL_REPLACEMENT}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="18" x2="19" y1="8" y2="9"></line> </g> </g> </g></svg>
`,
};

export interface IconProps extends TextProps {
  /**
   * The height of the icon. Default is 32, unless props.width is specified, in which case, the
   * icon's intrinsic aspect ratio is used to determine it.
   */
  height?: number | undefined;
  /**
   * The width of the icon. Default is to use the icon's intrinsic aspect ratio based on
   * `props.height`.
   */
  width?: number | undefined;
  /**
   * The color to use for the icon. Default is `useColor().TEXT`.
   */
  color?: ColorValue | undefined;
  /**
   * The name of the icon to use. Must be one of the names in `iconStrings`.
   */
  children: string;
}

/**
 * A component used to display SVG icons (using the data above in `iconStrings`). The <Icon>'s only
 * children should be a plain string indicating the (case-insensitive) name of the icon to display
 * (e.g., <Icon>Home</Icon> to display the Home icon).
 *
 * To change the icon color, specify a "color" prop on the <Icon>. To change the icon's size, you
 * can specify a "height" and/or "width" prop (using just one will automatically scale it up and
 * keep the right aspect ratio). If neither a height nor width prop is specified, a height of 32 is
 * assumed.
 */
const Icon = ({
  height: passedHeight,
  width: passedWidth,
  color,
  children,
  ...props
}: IconProps) => {
  // Make sure the <Icon>'s only children is a string of text, and that it is a valid icon name.
  if (typeof children !== "string") {
    throw new Error(
      "<Icon> must have a string as its child (e.g., <Icon>Add</Icon>)."
    );
  } else if (!(children.toLowerCase() in iconStrings)) {
    throw new Error(`No icon with name "${children}".`);
  }
  // Get the specified icon name as a lowercase string.
  const iconName = children.toLowerCase() as keyof typeof iconStrings;
  // Ensure fillColor is a string. Default to 'black' if not.
  const fillColor = typeof color === "string" ? color : "black";

  // Get the height and width specified for the icon.
  let height: number | null = null;
  let width: number | null = null;
  // If the provided "height" prop is a number, set `height` to it.
  if (typeof passedHeight === "number") height = passedHeight;
  // Same for width.
  if (typeof passedWidth === "number") width = passedWidth;

  // If neither the height nor width props were numbers (i.e., not provided), assume a height of
  // 32.
  if (typeof height !== "number" && typeof width !== "number") height = 32;

  // If only one of height or width was provided, determine the other dimension by looking at the
  // <svg>s viewBox to determine its aspect ratio.
  if (typeof height !== "number" || typeof width !== "number") {
    // Get the viewBox from the <svg> naively using a regex.
    const match = iconStrings[iconName].match(
      /viewBox=(['"])\s*\S+\s+\S+\s+(\S+)\s+(\S+)\s*\1/
    );

    if (match) {
      // Determine the aspect ratio from the parsed out viewBox.
      const aspect_ratio = +match[2] / +match[3];
      // Calculate the missing dimension.
      height = typeof height === "number" ? height : width! / aspect_ratio;
      width = typeof width === "number" ? width : height * aspect_ratio;
    } else {
      // If we didn't find a match, the best we can do is hope for a 1:1 aspect ratio.
      height = typeof height === "number" ? height : width;
      width = typeof width === "number" ? width : height;
    }
  }

  // Now we can render the <svg> using an <SvgXml> from react-native-svg.
  return (
    <SvgXml
      xml={iconStrings[iconName].replaceAll(
        FILL_REPLACEMENT,
        fillColor || "black"
      )} // Use 'black' or any default color as a fallback
      preserveAspectRatio="xMidYMid meet"
      {...props}
      height={height as number}
      width={width as number}
    />
  );
};

export default Icon;
