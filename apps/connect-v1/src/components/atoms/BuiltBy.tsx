import { styled } from "@mui/material";
import { FONT_SIZE } from "../../theme/portal";
import { Link } from "./Link";

const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: FONT_SIZE.S,
  whiteSpace: "nowrap",
}));

export const BuiltBy = ({ logoWidth = 28 }: { logoWidth?: number }) => (
  <Container>
    Built by
    <Link href="https://xlabs.xyz/" target="_blank">
      <svg
        fill="none"
        height={logoWidth * 1.05263157895}
        viewBox="0 0 38 40"
        width={logoWidth}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M3.89165 37.8895C3.71172 37.6442 3.33975 37.6449 3.16086 37.8911L1.76282 39.8148C1.6784 39.9311 1.54211 40 1.39687 40H0.449704C0.20134 40 0 39.8022 0 39.558V38.9317C0 38.6875 0.201339 38.4897 0.449704 38.4897H0.625918C0.770467 38.4897 0.906203 38.4215 0.990727 38.3061L2.41493 36.3642C2.52689 36.2115 2.52824 36.006 2.41828 35.8519L0.990417 33.8513C0.906237 33.7333 0.768848 33.6632 0.62226 33.6632H0.449704C0.201339 33.6632 0 33.4652 0 33.2212V32.5947C0 32.3507 0.20134 32.1527 0.449704 32.1527H1.39687C1.54211 32.1527 1.6784 32.2217 1.76282 32.3379L3.16086 34.2617C3.33975 34.5079 3.71172 34.5087 3.89165 34.2632L5.30426 32.3364C5.38878 32.2212 5.52455 32.1527 5.66913 32.1527H6.61749C6.86584 32.1527 7.06719 32.3507 7.06719 32.5947V33.2212C7.06719 33.4652 6.86584 33.6632 6.61749 33.6632H6.44491C6.29833 33.6632 6.16095 33.7333 6.07676 33.8513L4.64888 35.8519C4.53895 36.006 4.54028 36.2115 4.65223 36.3642L6.07645 38.3061C6.16097 38.4215 6.29671 38.4897 6.44127 38.4897H6.61749C6.86584 38.4897 7.06719 38.6875 7.06719 38.9317V39.558C7.06719 39.8022 6.86584 40 6.61749 40H5.66913C5.52455 40 5.38878 39.9317 5.30426 39.8164L3.89165 37.8895ZM9.97138 40C9.82388 40 9.68575 39.9289 9.60175 39.8097L8.28834 37.9465C8.23622 37.8727 8.20827 37.7848 8.20827 37.6948V28.9503C8.20827 28.7061 8.40963 28.5083 8.65797 28.5083H9.18543C9.4338 28.5083 9.63514 28.7061 9.63514 28.9503V37.1702C9.63514 37.2597 9.66284 37.3472 9.71455 37.421L10.3069 38.2656C10.3908 38.3854 10.5292 38.4568 10.6771 38.4568H11.1998C11.4482 38.4568 11.6495 38.6548 11.6495 38.8988V39.558C11.6495 39.8022 11.4482 40 11.1998 40H9.97138ZM19.2159 39.9837C19.1342 39.9837 19.0679 39.9185 19.0679 39.8382C19.0679 39.7143 18.9203 39.6471 18.8242 39.7273L18.5801 39.9308C18.5266 39.9755 18.4586 40 18.3884 40H14.4793C14.3746 40 14.2732 39.9642 14.1925 39.8986L12.7848 38.7536C12.6816 38.6696 12.6219 38.5448 12.6219 38.4131V33.7414C12.6219 33.6086 12.6824 33.4831 12.7869 33.3991L14.1931 32.269C14.2734 32.2044 14.374 32.1693 14.4778 32.1693H18.3884C18.4586 32.1693 18.5266 32.1938 18.5801 32.2385L18.8155 32.4347C18.9151 32.5178 19.0679 32.4482 19.0679 32.3198C19.0679 32.2367 19.1366 32.1693 19.2212 32.1693H20.1458C20.3942 32.1693 20.5955 32.3671 20.5955 32.6113V39.5417C20.5955 39.7856 20.3942 39.9837 20.1458 39.9837H19.2159ZM19.0679 34.7898C19.0679 34.6778 19.0246 34.5697 18.9466 34.488L18.2948 33.8031C18.2097 33.7138 18.0908 33.6632 17.9664 33.6632H15.0335C14.9286 33.6632 14.8271 33.6992 14.7464 33.7649L14.3289 34.1052C14.2259 34.1892 14.1662 34.3138 14.1662 34.4453V37.72C14.1662 37.8537 14.2279 37.9803 14.3338 38.0641L14.7478 38.3918C14.8277 38.4553 14.9272 38.4897 15.0299 38.4897H18.068C18.182 38.4897 18.2917 38.4471 18.375 38.3706L18.9252 37.8656C19.0163 37.7819 19.0679 37.665 19.0679 37.5426V34.7898ZM28.3491 39.8968C28.2682 39.9636 28.1661 40 28.0604 40H24.3178C24.2377 40 24.1595 39.977 24.0925 39.9339L23.7194 39.6935C23.6065 39.6206 23.4566 39.7003 23.4566 39.8332C23.4566 39.9253 23.3803 40 23.2866 40H22.3618C22.1134 40 21.9121 39.8022 21.9121 39.558V28.9503C21.9121 28.7061 22.1134 28.5083 22.3618 28.5083H23.0069C23.2551 28.5083 23.4566 28.7061 23.4566 28.9503V32.0075C23.4566 32.2559 23.7543 32.3883 23.944 32.2245C23.9976 32.1784 24.0666 32.1527 24.1379 32.1527H28.0604C28.1661 32.1527 28.2682 32.1894 28.3491 32.2559L29.7583 33.4157C29.8604 33.4997 29.9193 33.6239 29.9193 33.7547V38.3982C29.9193 38.5291 29.8604 38.6531 29.7583 38.737L28.3491 39.8968ZM28.3918 34.4813C28.3918 34.3481 28.3305 34.2219 28.225 34.1379L27.7937 33.7945C27.7137 33.7308 27.6136 33.6959 27.5107 33.6959H24.5581C24.4335 33.6959 24.3146 33.7468 24.2296 33.836L23.5778 34.5207C23.4997 34.6027 23.4566 34.7105 23.4566 34.8228V37.4961C23.4566 37.6168 23.5067 37.7324 23.5958 37.8159L24.1487 38.3346C24.2323 38.4131 24.3436 38.4568 24.4592 38.4568H27.5071C27.6123 38.4568 27.7141 38.4206 27.7951 38.3545L28.23 37.9985C28.3325 37.9145 28.3918 37.7901 28.3918 37.6588V34.4813ZM36.4793 39.8995C36.3988 39.9644 36.2979 40 36.1938 40H31.4665C31.218 40 31.0168 39.8022 31.0168 39.558V38.981C31.0168 38.7368 31.218 38.539 31.4665 38.539H35.6699C35.7762 38.539 35.879 38.5019 35.9604 38.4345L36.3467 38.1132C36.4476 38.0292 36.5061 37.9056 36.5061 37.7757V37.6325C36.5061 37.5092 36.4537 37.3914 36.3615 37.3079L35.9302 36.916C35.847 36.8407 35.7382 36.7987 35.6249 36.7987H32.6328C32.5217 36.7987 32.4147 36.7585 32.3322 36.6855L31.0482 35.5514C30.9534 35.4676 30.8992 35.3481 30.8992 35.2228V33.7618C30.8992 33.6363 30.9534 33.5167 31.0482 33.4329L32.3322 32.2988C32.4147 32.2261 32.5217 32.1856 32.6328 32.1856H37.1811C37.4293 32.1856 37.6308 32.3834 37.6308 32.6276V33.2047C37.6308 33.4489 37.4293 33.6466 37.1811 33.6466H33.2023C33.0922 33.6466 32.9856 33.6866 32.9033 33.7587L32.544 34.0732C32.4482 34.1569 32.3933 34.2771 32.3933 34.4031V34.5812C32.3933 34.7074 32.4482 34.8274 32.544 34.9114L32.9033 35.2259C32.9856 35.2979 33.0922 35.3377 33.2023 35.3377H36.2127C36.3257 35.3377 36.4346 35.3795 36.5176 35.4548L37.8552 36.6674C37.9476 36.7512 38 36.869 38 36.9923V38.4614C38 38.5936 37.9397 38.7189 37.8359 38.8029L36.4793 39.8995Z"
            fill="#FFFFFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4817 0.295887C11.4817 0.132473 11.3461 0 11.1788 0H5.4746C5.30726 0 5.17163 0.132473 5.17163 0.295887V4.32625C5.17163 4.48966 5.30726 4.62214 5.4746 4.62214H8.02372C8.19103 4.62214 8.32667 4.75461 8.32667 4.91801V8.94838C8.32667 9.1118 8.46232 9.24426 8.62963 9.24426H11.1788C11.3461 9.24426 11.4817 9.37673 11.4817 9.54015V13.5705C11.4817 13.7339 11.3461 13.8664 11.1788 13.8664H8.62963C8.46232 13.8664 8.32667 13.9989 8.32667 14.1623V18.1926C8.32667 18.3561 8.19103 18.4885 8.02372 18.4885H5.4746C5.30726 18.4885 5.17163 18.621 5.17163 18.7844V22.8148C5.17163 22.9781 5.30726 23.1107 5.4746 23.1107H11.1788C11.3461 23.1107 11.4817 22.9781 11.4817 22.8148V18.7844C11.4817 18.621 11.6174 18.4885 11.7847 18.4885H14.3338C14.5011 18.4885 14.6368 18.3561 14.6368 18.1926V14.1623C14.6368 13.9989 14.7724 13.8664 14.9397 13.8664H17.4888C17.6562 13.8664 17.7918 13.7339 17.7918 13.5705V9.54015C17.7918 9.37673 17.6562 9.24426 17.4888 9.24426H14.9397C14.7724 9.24426 14.6368 9.1118 14.6368 8.94838V4.91801C14.6368 4.75461 14.5011 4.62214 14.3338 4.62214H11.7847C11.6174 4.62214 11.4817 4.48966 11.4817 4.32625V0.295887Z"
            fill="#FFFFFF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.5254 0.295887C26.5254 0.132473 26.661 0 26.8283 0H32.5325C32.6998 0 32.8354 0.132473 32.8354 0.295887V4.32625C32.8354 4.48966 32.6998 4.62214 32.5325 4.62214H29.9834C29.8161 4.62214 29.6805 4.75461 29.6805 4.91801V8.94838C29.6805 9.1118 29.5447 9.24426 29.3774 9.24426H26.8283C26.661 9.24426 26.5254 9.37673 26.5254 9.54015V13.5705C26.5254 13.7339 26.661 13.8664 26.8283 13.8664H29.3774C29.5447 13.8664 29.6805 13.9989 29.6805 14.1623V18.1926C29.6805 18.3561 29.8161 18.4885 29.9834 18.4885H32.5325C32.6998 18.4885 32.8354 18.621 32.8354 18.7844V22.8148C32.8354 22.9781 32.6998 23.1107 32.5325 23.1107H26.8283C26.661 23.1107 26.5254 22.9781 26.5254 22.8148V18.7844C26.5254 18.621 26.3898 18.4885 26.2225 18.4885H23.6734C23.5061 18.4885 23.3703 18.3561 23.3703 18.1926V14.1623C23.3703 13.9989 23.2347 13.8664 23.0674 13.8664H20.5183C20.351 13.8664 20.2153 13.7339 20.2153 13.5705V9.54015C20.2153 9.37673 20.351 9.24426 20.5183 9.24426H23.0674C23.2347 9.24426 23.3703 9.1118 23.3703 8.94838V4.91801C23.3703 4.75461 23.5061 4.62214 23.6734 4.62214H26.2225C26.3898 4.62214 26.5254 4.48966 26.5254 4.32625V0.295887Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </Link>
  </Container>
);
