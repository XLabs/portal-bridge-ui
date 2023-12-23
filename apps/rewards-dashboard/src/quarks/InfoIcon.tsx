import {
  FloatingArrow,
  arrow,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useRef, useState } from "react";
import { useBreakpointQuery } from "../hooks/useBreakpoint";

const InfoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        fill="#498ADC"
        d="M6 0a6.001 6.001 0 00-4.243 10.243 6.002 6.002 0 008.486 0A6.002 6.002 0 0012 6a6.006 6.006 0 00-6-6zm0 11.2A5.201 5.201 0 1111.2 6 5.204 5.204 0 016 11.2z"
      ></path>
      <path
        fill="#498ADC"
        d="M6 4.843a.533.533 0 00-.533.533v3.347a.533.533 0 001.066 0V5.376A.533.533 0 006 4.843zM6.533 3.277c0 .71-1.066.71-1.066 0 0-.711 1.066-.711 1.066 0z"
      ></path>
    </svg>
  );
};

interface InfoHoverProps {
  children: JSX.Element;
}
export const InfoHover = (props: InfoHoverProps) => {
  const bp = useBreakpointQuery("lg");
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    middleware: [
      offset({ mainAxis: 28, crossAxis: bp ? 0 : -60 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div className="h-fit" ref={refs.setReference} {...getReferenceProps()}>
        <InfoIcon />
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="bg-[#34356d] rounded-lg p-2 max-w-48"
          {...getFloatingProps()}
        >
          <FloatingArrow fill="#34356d" ref={arrowRef} context={context} />
          {props.children}
        </div>
      )}
    </>
  );
};
